import { submitSurveyResponse } from "./api";

const DB_NAME = "mp-field-operations";
const DB_VERSION = 1;
const QUEUE = "survey-submissions";
const META = "secure-meta";

type AnswerValue = string | string[] | File;
type StoredCipher = { iv: ArrayBuffer; data: ArrayBuffer };
type StoredFile = StoredCipher & {
  questionId: string;
  name: string;
  type: string;
  lastModified: number;
};
type StoredSubmission = {
  id: string;
  surveyId: string;
  payload: StoredCipher;
  files: StoredFile[];
  createdAt: string;
};
type SubmissionPayload = {
  userId: string;
  meta: Record<string, string>;
  answers: Record<string, string | string[]>;
  collectedAt: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(QUEUE))
        database.createObjectStore(QUEUE, { keyPath: "id" });
      if (!database.objectStoreNames.contains(META))
        database.createObjectStore(META);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ?? new Error("Offline database could not be opened."),
      );
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Offline database operation failed."));
  });
}

async function encryptionKey(database: IDBDatabase): Promise<CryptoKey> {
  const existing = await requestResult(
    database.transaction(META).objectStore(META).get("survey-key"),
  );
  if (existing instanceof CryptoKey) return existing;
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  await requestResult(
    database
      .transaction(META, "readwrite")
      .objectStore(META)
      .put(key, "survey-key"),
  );
  return key;
}

async function encrypt(
  key: CryptoKey,
  source: ArrayBuffer,
): Promise<StoredCipher> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return {
    iv: iv.buffer,
    data: await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, source),
  };
}

async function decrypt(
  key: CryptoKey,
  cipher: StoredCipher,
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(cipher.iv) },
    key,
    cipher.data,
  );
}

async function allSubmissions(
  database: IDBDatabase,
): Promise<StoredSubmission[]> {
  return requestResult(database.transaction(QUEUE).objectStore(QUEUE).getAll());
}

async function decodePayload(
  key: CryptoKey,
  submission: StoredSubmission,
): Promise<SubmissionPayload> {
  const bytes = await decrypt(key, submission.payload);
  return JSON.parse(new TextDecoder().decode(bytes)) as SubmissionPayload;
}

function formData(
  submission: StoredSubmission,
  payload: SubmissionPayload,
  files: Array<{ stored: StoredFile; bytes: ArrayBuffer }>,
): FormData {
  const data = new FormData();
  data.append("client_submission_id", submission.id);
  data.append("collected_at", payload.collectedAt);
  data.append("submitted_offline", "1");
  Object.entries(payload.meta).forEach(([name, value]) => {
    if (value) data.append(name, value);
  });
  Object.entries(payload.answers).forEach(([questionId, value]) => {
    if (Array.isArray(value))
      value.forEach((item) => data.append(`answers[${questionId}][]`, item));
    else {
      try {
        const location = JSON.parse(value) as {
          latitude?: number;
          longitude?: number;
        };
        if (
          typeof location.latitude === "number" &&
          typeof location.longitude === "number"
        ) {
          data.append(
            `answers[${questionId}][latitude]`,
            String(location.latitude),
          );
          data.append(
            `answers[${questionId}][longitude]`,
            String(location.longitude),
          );
          return;
        }
      } catch {
        /* regular string answer */
      }
      data.append(`answers[${questionId}]`, value);
    }
  });
  files.forEach(({ stored, bytes }) =>
    data.append(
      `attachments[${stored.questionId}]`,
      new File([bytes], stored.name, {
        type: stored.type,
        lastModified: stored.lastModified,
      }),
    ),
  );
  return data;
}

export async function queueSurveySubmission(input: {
  id: string;
  surveyId: string;
  userId: string;
  meta: Record<string, string>;
  answers: Record<string, AnswerValue>;
  collectedAt: string;
}): Promise<void> {
  const database = await openDatabase();
  const key = await encryptionKey(database);
  const plainAnswers: Record<string, string | string[]> = {};
  const files: StoredFile[] = [];
  for (const [questionId, value] of Object.entries(input.answers)) {
    if (value instanceof File) {
      const encrypted = await encrypt(key, await value.arrayBuffer());
      files.push({
        ...encrypted,
        questionId,
        name: value.name,
        type: value.type,
        lastModified: value.lastModified,
      });
    } else plainAnswers[questionId] = value;
  }
  const payload: SubmissionPayload = {
    userId: input.userId,
    meta: input.meta,
    answers: plainAnswers,
    collectedAt: input.collectedAt,
  };
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const encryptedPayload = await encrypt(key, encoded.buffer as ArrayBuffer);
  const record: StoredSubmission = {
    id: input.id,
    surveyId: input.surveyId,
    payload: encryptedPayload,
    files,
    createdAt: new Date().toISOString(),
  };
  await requestResult(
    database.transaction(QUEUE, "readwrite").objectStore(QUEUE).put(record),
  );
  database.close();
}

export async function pendingSurveyCount(userId: string): Promise<number> {
  const database = await openDatabase();
  const key = await encryptionKey(database);
  const rows = await allSubmissions(database);
  const payloads = await Promise.all(
    rows.map((row) => decodePayload(key, row)),
  );
  database.close();
  return payloads.filter((payload) => payload.userId === userId).length;
}

export async function syncSurveySubmissions(
  userId: string,
): Promise<{ synced: number; failed: number }> {
  if (!navigator.onLine) return { synced: 0, failed: 0 };
  const database = await openDatabase();
  const key = await encryptionKey(database);
  const rows = await allSubmissions(database);
  let synced = 0;
  let failed = 0;
  for (const row of rows) {
    let payload: SubmissionPayload;
    try {
      payload = await decodePayload(key, row);
    } catch {
      failed += 1;
      continue;
    }
    if (payload.userId !== userId) continue;
    try {
      const files = await Promise.all(
        row.files.map(async (stored) => ({
          stored,
          bytes: await decrypt(key, stored),
        })),
      );
      await submitSurveyResponse(row.surveyId, formData(row, payload, files));
      await requestResult(
        database
          .transaction(QUEUE, "readwrite")
          .objectStore(QUEUE)
          .delete(row.id),
      );
      synced += 1;
    } catch {
      failed += 1;
    }
  }
  database.close();
  return { synced, failed };
}
