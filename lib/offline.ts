"use client";

import { createClient } from "@/lib/supabase/client";

const DB_NAME = "jobtrack-offline";
const DB_VERSION = 1;
const OUTBOX_STORE = "outbox";

export type ApplicationMutation =
  | { kind: "insert"; payload: ApplicationMutationValues & { user_id: string } }
  | { kind: "update"; payload: { id: string; values: ApplicationMutationValues & { updated_at: string } } }
  | { kind: "delete"; payload: { id: string } };

interface ApplicationMutationValues {
  company: string;
  role: string;
  url: string | null;
  offer: string | null;
  offer_currency: "₱" | "$";
  status: "applied" | "interviewing" | "offer" | "rejected";
  applied_date: string;
  notes: string | null;
}

interface QueuedMutation {
  id?: number;
  createdAt: number;
  mutation: ApplicationMutation;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(OUTBOX_STORE, { keyPath: "id", autoIncrement: true });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueApplicationMutation(mutation: ApplicationMutation) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(OUTBOX_STORE, "readwrite");
    transaction.objectStore(OUTBOX_STORE).add({ createdAt: Date.now(), mutation } satisfies QueuedMutation);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export function isNetworkError(error: unknown) {
  if (!navigator.onLine) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes("fetch") || message.includes("network") || message.includes("offline") || message.includes("failed to fetch");
}

async function readQueuedMutations() {
  const database = await openDatabase();
  const mutations = await new Promise<QueuedMutation[]>((resolve, reject) => {
    const request = database.transaction(OUTBOX_STORE, "readonly").objectStore(OUTBOX_STORE).getAll();
    request.onsuccess = () => resolve(request.result.sort((a, b) => a.createdAt - b.createdAt));
    request.onerror = () => reject(request.error);
  });
  database.close();
  return mutations;
}

async function removeQueuedMutation(id: number) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(OUTBOX_STORE, "readwrite");
    transaction.objectStore(OUTBOX_STORE).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function replayQueuedMutations() {
  if (!navigator.onLine) return;
  const supabase = createClient();

  for (const queued of await readQueuedMutations()) {
    if (queued.id === undefined) continue;
    const { kind, payload } = queued.mutation;
    const result = kind === "insert"
      ? await supabase.from("applications").insert(payload)
      : kind === "update"
        ? await supabase.from("applications").update(payload.values).eq("id", payload.id)
        : await supabase.from("applications").delete().eq("id", payload.id);

    if (result.error) {
      if (isNetworkError(result.error)) return;
      await removeQueuedMutation(queued.id);
      continue;
    }
    await removeQueuedMutation(queued.id);
  }
}