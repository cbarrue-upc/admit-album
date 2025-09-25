import { openDB } from 'idb';
import {
  BASE_URL_REFRESH_THRESHOLD_MINUTES,
  BASE_URL_TTL_MINUTES,
} from '@photos-carousel/types';

const DB_NAME = 'photos-carousel-cache';
const STORE_NAME = 'media-blobs';
const MAX_CACHE_BYTES = 200 * 1024 * 1024; // 200 MB

interface CachedEntry {
  id: string;
  blob: Blob;
  size: number;
  createdAt: number;
}

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    },
  });
}

export async function putBlob(id: string, blob: Blob) {
  const db = await getDb();
  const entry: CachedEntry = {
    id,
    blob,
    size: blob.size,
    createdAt: Date.now(),
  };
  await db.put(STORE_NAME, entry);
  await enforceQuota(db);
}

export async function getBlob(id: string): Promise<Blob | null> {
  const db = await getDb();
  const entry = await db.get<CachedEntry>(STORE_NAME, id);
  if (!entry) return null;
  const ageMinutes = (Date.now() - entry.createdAt) / (1000 * 60);
  if (ageMinutes > BASE_URL_TTL_MINUTES) {
    await db.delete(STORE_NAME, id);
    return null;
  }
  if (ageMinutes > BASE_URL_REFRESH_THRESHOLD_MINUTES) {
    return null;
  }
  return entry.blob;
}

async function enforceQuota(db: Awaited<ReturnType<typeof getDb>>) {
  let total = 0;
  const entries = await db.getAll(STORE_NAME);
  entries.sort((a, b) => a.createdAt - b.createdAt);
  for (const entry of entries) {
    total += entry.size;
  }
  while (total > MAX_CACHE_BYTES && entries.length > 0) {
    const oldest = entries.shift();
    if (!oldest) break;
    total -= oldest.size;
    await db.delete(STORE_NAME, oldest.id);
  }
}

export async function clearExpired() {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.store;
  const now = Date.now();
  let cursor = await store.openCursor();
  while (cursor) {
    const ageMinutes = (now - cursor.value.createdAt) / (1000 * 60);
    if (ageMinutes > BASE_URL_TTL_MINUTES) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}
