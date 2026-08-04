/**
 * offline-sync.ts
 * Handles syncing offline drafts to the server.
 * Auto-syncs on network reconnect. Provides manual trigger.
 * Covers: citizen_enrollment, grievance + linked document uploads.
 */

import {
  createCitizen,
  createGrievance,
  createFamily,
  submitAssistedSchemeApplication,
  submitCitizenSchemeApplication,
  uploadDocument,
  uploadSchemeApplicationDocument,
} from "./api";
import {
  getAllDrafts,
  updateDraft,
  deleteDraft,
  getDocumentsForDraft,
  deleteDocumentsForDraft,
  updateDocumentStatus,
  offlineDocToFile,
  type OfflineDraft,
  type OfflineDocument,
} from "./offline-store";
import { syncSurveySubmissions } from "./offline-surveys";

export interface SyncResult {
  synced: number;
  failed: number;
  skipped: number;
  documentsSynced: number;
  documentsFailed: number;
  errors: { id: string; label: string; reason: string }[];
}

function getDocumentableType(draftType: OfflineDraft["type"]): "citizen" | "grievance" | "scheme_application" {
  if (draftType === "citizen_enrollment" || draftType === "family_enrollment") return "citizen";
  if (draftType === "scheme_application") return "scheme_application";
  return "grievance";
}

async function uploadDraftDocuments(
  draft: OfflineDraft,
  recordId: string,
): Promise<{ uploaded: number; failed: number }> {
  const docs = await getDocumentsForDraft(draft.id);
  if (!docs.length) return { uploaded: 0, failed: 0 };
  const type = getDocumentableType(draft.type);

  let uploaded = 0;
  let failed = 0;

  for (const doc of docs) {
    try {
      await updateDocumentStatus(doc.id, "uploading");
      const file = offlineDocToFile(doc);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", doc.title || doc.name);
      if (type === "scheme_application") {
        if (!doc.requirementId || !doc.documentDate) {
          throw new Error(`Offline scheme document ${doc.name} is missing its requirement or document date.`);
        }
        fd.delete("file");
        fd.append("file", file);
        fd.append("requirement_id", doc.requirementId);
        fd.append("document_date", doc.documentDate);
        await uploadSchemeApplicationDocument(recordId, fd);
      } else {
        fd.append("documentable_type", type);
        fd.append("documentable_id", recordId);
        if (!doc.documentCategoryId) {
          throw new Error(`Offline document ${doc.name} is missing a document category.`);
        }
        fd.append("document_category_id", doc.documentCategoryId);
        await uploadDocument(fd);
      }
      await updateDocumentStatus(doc.id, "uploaded");
      uploaded++;
    } catch {
      await updateDocumentStatus(doc.id, "failed");
      failed++;
    }
  }

  return { uploaded, failed };
}

async function syncOneDraft(draft: OfflineDraft): Promise<{ recordId: string | null; docResult: { uploaded: number; failed: number } }> {
  const data = JSON.parse(draft.payload) as Record<string, unknown>;
  await updateDraft(draft.id, { status: "syncing" });

  let recordId: string | null = null;

  switch (draft.type) {
    case "citizen_enrollment": {
      // Strip the transient _family_* fields before creating the citizen
      const {
        _create_family_as_head,
        _family_economic_status,
        _family_house_number,
        _family_street,
        ...citizenPayload
      } = data;
      const result = await createCitizen(citizenPayload) as { id?: string; village_id?: string; ward_id?: string };
      recordId = (result?.id as string) ?? null;

      // If volunteer flagged this citizen as a new family head, create the family
      if (recordId && _create_family_as_head) {
        try {
          const address = [
            _family_house_number as string | undefined,
            _family_street as string | undefined,
          ].filter(Boolean).join(", ") || undefined;

          await createFamily({
            village_id: result.village_id || citizenPayload.village_id,
            ward_id: result.ward_id || citizenPayload.ward_id,
            head_citizen_id: recordId,
            economic_status: _family_economic_status || "middle",
            address,
          });
        } catch (familyErr) {
          // Non-fatal: citizen was created; family can be created later
          console.warn("Family auto-create failed after citizen sync:", familyErr);
        }
      }
      break;
    }
    case "family_enrollment": {
      const result = await createFamily(data) as { id?: string };
      recordId = result?.id ?? null;
      break;
    }
    case "scheme_application": {
      const payload = {
        scheme_id: String(data.scheme_id ?? ""),
        target_citizen_id: typeof data.target_citizen_id === "string" ? data.target_citizen_id : undefined,
        remarks: typeof data.remarks === "string" ? data.remarks : undefined,
      };
      const result = data.application_source === "citizen"
        ? await submitCitizenSchemeApplication(payload)
        : await submitAssistedSchemeApplication({ ...payload, target_citizen_id: payload.target_citizen_id ?? "" });
      recordId = result?.id ?? null;
      break;
    }
    case "grievance": {
      const result = await createGrievance(data) as { id?: string };
      recordId = (result?.id as string) ?? null;
      break;
    }
    default:
      throw new Error(`Unknown draft type: ${draft.type}`);
  }

  // Save the server id so a later retry can still attach docs
  if (recordId) {
    await updateDraft(draft.id, { syncedRecordId: recordId });
  }

  // Upload linked documents
  const docResult = recordId
    ? await uploadDraftDocuments(draft, recordId)
    : { uploaded: 0, failed: 0 };

  return { recordId, docResult };
}

export async function syncAllDrafts(userId: string): Promise<SyncResult> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0, skipped: 0, documentsSynced: 0, documentsFailed: 0, errors: [] };
  }

  const drafts = await getAllDrafts(userId);
  const pending = drafts.filter(
    (d) => d.status === "pending" || d.status === "failed",
  );

  let synced  = 0;
  let failed  = 0;
  let skipped = 0;
  let documentsSynced = 0;
  let documentsFailed = 0;
  const errors: SyncResult["errors"] = [];

  // Citizen enrollments and grievances (each with linked documents)
  for (const draft of pending) {
    if ((draft.retries ?? 0) >= 5) {
      skipped++;
      continue;
    }
    try {
      const { docResult } = await syncOneDraft(draft);
      // Keep the draft and failed files available for retry. A record is only
      // removed after its entire document queue has uploaded successfully.
      if (docResult.failed === 0) {
        await deleteDraft(draft.id);
        await deleteDocumentsForDraft(draft.id);
      } else {
        await updateDraft(draft.id, {
          status: "failed",
          failureReason: `${docResult.failed} attachment(s) still need synchronization.`,
        });
      }
      synced++;
      documentsSynced += docResult.uploaded;
      documentsFailed += docResult.failed;
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error";
      await updateDraft(draft.id, { status: "failed", failureReason: reason });
      failed++;
      errors.push({ id: draft.id, label: draft.label, reason });
    }
  }

  // Also sync any queued offline surveys
  try {
    const surveyResult = await syncSurveySubmissions(userId);
    synced += surveyResult.synced;
    failed += surveyResult.failed;
  } catch {
    // survey sync is best-effort
  }

  return { synced, failed, skipped, documentsSynced, documentsFailed, errors };
}

// ── Auto-sync on reconnect ────────────────────────────────────────────────────
let autoSyncRegistered = false;

export function registerAutoSync(
  userId: string,
  onSyncComplete?: (result: SyncResult) => void,
): () => void {
  if (autoSyncRegistered) return () => {};
  autoSyncRegistered = true;

  const handler = async () => {
    if (!navigator.onLine || !userId) return;
    const result = await syncAllDrafts(userId);
    if (result.synced > 0 || result.failed > 0) {
      onSyncComplete?.(result);
    }
  };

  window.addEventListener("online", handler);

  // Attempt sync immediately if already online
  if (navigator.onLine) {
    setTimeout(handler, 1500);
  }

  return () => {
    window.removeEventListener("online", handler);
    autoSyncRegistered = false;
  };
}
