/**
 * offline-store.ts
 * Generic offline draft store for volunteer field operations.
 * Uses IndexedDB (same database as offline-surveys.ts) with AES-GCM encryption.
 * Stores citizen enrollment drafts and grievance drafts for sync later.
 * Also stores document blobs referenced by drafts via `documentIds`.
 */

/** Records that can be captured in the field app without connectivity. */
export type DraftType =
  | "citizen_enrollment"
  | "family_enrollment"
  | "grievance"
  | "scheme_application";
export type DraftStatus = "pending" | "syncing" | "synced" | "failed";

export interface OfflineDraftDocument {
  name: string;
  title: string;
  mimeType: string;
  size: number;
}

export interface OfflineDraft {
  id: string;           // client-side UUID
  type: DraftType;
  status: DraftStatus;
  payload: string;      // JSON stringified (will be encrypted in IDB)
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
  retries: number;
  userId: string;
  label: string;        // human-readable summary e.g. "Ravi Reddy — Tirupati Village"
  documentIds?: string[];   // references into offline-documents store
  syncedRecordId?: string;  // server-assigned id after first sync (so docs can attach)
}

export interface OfflineDocument {
  id: string;             // client-side UUID
  name: string;           // original file name
  title: string;          // semantic title (e.g. "Aadhaar Card")
  mimeType: string;
  size: number;
  dataBase64: string;     // base64 encoded (without data: URL prefix)
  userId: string;
  draftId: string;        // the draft this file belongs to
  documentableType: "citizen" | "grievance" | "scheme_application";
  documentCategoryId?: string;
  /** Required when documentableType is scheme_application. */
  requirementId?: string;
  documentDate?: string;
  uploadStatus: "pending" | "uploading" | "uploaded" | "failed";
  createdAt: string;
}

// ── IDB setup ────────────────────────────────────────────────────────────────
const DB_NAME = "mp-field-operations";
const DB_VERSION = 3;               // bumped for offline-documents store
const DRAFTS_STORE = "offline-drafts";
const DOCUMENTS_STORE = "offline-documents";
const META_STORE = "secure-meta";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(META_STORE))
        db.createObjectStore(META_STORE);
      if (!db.objectStoreNames.contains("survey-submissions"))
        db.createObjectStore("survey-submissions", { keyPath: "id" });
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        const store = db.createObjectStore(DRAFTS_STORE, { keyPath: "id" });
        store.createIndex("by_type",   "type",   { unique: false });
        store.createIndex("by_status", "status", { unique: false });
        store.createIndex("by_user",   "userId", { unique: false });
      }
      if (!db.objectStoreNames.contains(DOCUMENTS_STORE)) {
        const store = db.createObjectStore(DOCUMENTS_STORE, { keyPath: "id" });
        store.createIndex("by_draft",  "draftId",     { unique: false });
        store.createIndex("by_user",   "userId",      { unique: false });
        store.createIndex("by_status", "uploadStatus", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error ?? new Error("IDB open failed"));
  });
}

function idbOp<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

// ── Encryption key (per-device, non-exportable) ───────────────────────────────
async function getKey(db: IDBDatabase): Promise<CryptoKey> {
  const existing = await idbOp<CryptoKey | undefined>(
    db.transaction(META_STORE).objectStore(META_STORE).get("draft-key"),
  );
  if (existing) return existing;
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"],
  );
  await idbOp(db.transaction(META_STORE, "readwrite").objectStore(META_STORE).put(key, "draft-key"));
  return key;
}

async function enc(key: CryptoKey, plain: string): Promise<string> {
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const buf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain),
  );
  // pack iv + ciphertext as base64
  const combined = new Uint8Array(iv.byteLength + buf.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(buf), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function dec(key: CryptoKey, b64: string): Promise<string> {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv   = bytes.slice(0, 12);
  const data = bytes.slice(12);
  const buf  = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(buf);
}

// ── Internal stored shape ─────────────────────────────────────────────────────
interface StoredDraft extends Omit<OfflineDraft, "payload"> {
  encPayload: string;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function saveDraft(draft: OfflineDraft): Promise<void> {
  const db  = await openDb();
  const key = await getKey(db);
  const enc_payload = await enc(key, draft.payload);
  const stored: StoredDraft = { ...draft, encPayload: enc_payload };
  // @ts-expect-error payload replaced by encPayload
  delete stored.payload;
  await idbOp(db.transaction(DRAFTS_STORE, "readwrite").objectStore(DRAFTS_STORE).put(stored));
  db.close();
}

export async function getDraft(id: string, userId: string): Promise<OfflineDraft | null> {
  const db  = await openDb();
  const key = await getKey(db);
  const stored = await idbOp<StoredDraft | undefined>(
    db.transaction(DRAFTS_STORE).objectStore(DRAFTS_STORE).get(id),
  );
  db.close();
  if (!stored || stored.userId !== userId) return null;
  return { ...stored, payload: await dec(key, stored.encPayload) };
}

export async function getAllDrafts(userId: string): Promise<OfflineDraft[]> {
  const db   = await openDb();
  const key  = await getKey(db);
  const all  = await idbOp<StoredDraft[]>(
    db.transaction(DRAFTS_STORE).objectStore(DRAFTS_STORE).getAll(),
  );
  db.close();
  const mine = all.filter((d) => d.userId === userId);
  return Promise.all(mine.map(async (d) => ({
    ...d,
    payload: await dec(key, d.encPayload),
  })));
}

export async function updateDraftStatus(
  id: string,
  status: DraftStatus,
  failureReason?: string,
): Promise<void> {
  const db = await openDb();
  const stored = await idbOp<StoredDraft | undefined>(
    db.transaction(DRAFTS_STORE).objectStore(DRAFTS_STORE).get(id),
  );
  if (stored) {
    stored.status        = status;
    stored.updatedAt     = new Date().toISOString();
    stored.failureReason = failureReason;
    if (status === "syncing") stored.retries = (stored.retries ?? 0) + 1;
    await idbOp(db.transaction(DRAFTS_STORE, "readwrite").objectStore(DRAFTS_STORE).put(stored));
  }
  db.close();
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDb();
  await idbOp(db.transaction(DRAFTS_STORE, "readwrite").objectStore(DRAFTS_STORE).delete(id));
  db.close();
}

export async function pendingDraftCount(userId: string): Promise<number> {
  const drafts = await getAllDrafts(userId);
  const docs = await getAllDocuments(userId);
  return (
    drafts.filter((d) => d.status === "pending" || d.status === "failed").length +
    docs.filter((d) => d.uploadStatus === "pending" || d.uploadStatus === "failed").length
  );
}

export async function updateDraft(
  id: string,
  patch: Partial<Pick<OfflineDraft, "status" | "failureReason" | "syncedRecordId">>,
): Promise<void> {
  const db = await openDb();
  const stored = await idbOp<StoredDraft | undefined>(
    db.transaction(DRAFTS_STORE, "readwrite").objectStore(DRAFTS_STORE).get(id),
  );
  if (stored) {
    if (patch.status !== undefined) {
      stored.status = patch.status;
      if (patch.status === "syncing") stored.retries = (stored.retries ?? 0) + 1;
    }
    if (patch.failureReason !== undefined) stored.failureReason = patch.failureReason;
    if (patch.syncedRecordId !== undefined) stored.syncedRecordId = patch.syncedRecordId;
    stored.updatedAt = new Date().toISOString();
    await idbOp(db.transaction(DRAFTS_STORE, "readwrite").objectStore(DRAFTS_STORE).put(stored));
  }
  db.close();
}

// ── File <-> base64 helper ───────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:<mime>;base64," prefix
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

function base64ToBlob(b64: string, mimeType: string): Blob {
  const byteChars = atob(b64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export function offlineDocToFile(doc: OfflineDocument): File {
  const blob = base64ToBlob(doc.dataBase64, doc.mimeType);
  return new File([blob], doc.name, { type: doc.mimeType, lastModified: new Date(doc.createdAt).getTime() });
}

// ── Offline documents public API ─────────────────────────────────────────────

export async function saveDocument(doc: OfflineDocument): Promise<void> {
  const db = await openDb();
  await idbOp(
    db.transaction(DOCUMENTS_STORE, "readwrite").objectStore(DOCUMENTS_STORE).put(doc),
  );
  db.close();
}

export async function getAllDocuments(userId: string): Promise<OfflineDocument[]> {
  const db = await openDb();
  const all = await idbOp<OfflineDocument[]>(
    db.transaction(DOCUMENTS_STORE).objectStore(DOCUMENTS_STORE).getAll(),
  );
  db.close();
  return all.filter((d) => d.userId === userId);
}

export async function getDocumentsForDraft(draftId: string): Promise<OfflineDocument[]> {
  const db = await openDb();
  const all = await idbOp<OfflineDocument[]>(
    db.transaction(DOCUMENTS_STORE).objectStore(DOCUMENTS_STORE).getAll(),
  );
  db.close();
  return all.filter((d) => d.draftId === draftId);
}

export async function updateDocumentStatus(
  id: string,
  uploadStatus: OfflineDocument["uploadStatus"],
): Promise<void> {
  const db = await openDb();
  const existing = await idbOp<OfflineDocument | undefined>(
    db.transaction(DOCUMENTS_STORE, "readwrite").objectStore(DOCUMENTS_STORE).get(id),
  );
  if (existing) {
    existing.uploadStatus = uploadStatus;
    await idbOp(
      db.transaction(DOCUMENTS_STORE, "readwrite").objectStore(DOCUMENTS_STORE).put(existing),
    );
  }
  db.close();
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDb();
  await idbOp(
    db.transaction(DOCUMENTS_STORE, "readwrite").objectStore(DOCUMENTS_STORE).delete(id),
  );
  db.close();
}

export async function deleteDocumentsForDraft(draftId: string): Promise<void> {
  const docs = await getDocumentsForDraft(draftId);
  for (const d of docs) await deleteDocument(d.id);
}
