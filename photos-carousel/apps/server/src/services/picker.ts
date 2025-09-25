import { randomUUID } from 'crypto';
import type { MediaItem } from '@photos-carousel/types';
import { BASE_URL_TTL_MINUTES } from '@photos-carousel/types';

type SessionStatus = 'PENDING' | 'READY';

interface Session {
  id: string;
  pickerUri: string;
  status: SessionStatus;
  createdAt: number;
  items: MediaItem[];
}

const sessions = new Map<string, Session>();

function createMockItems(): MediaItem[] {
  return Array.from({ length: 6 }).map((_, index) => ({
    id: `mock-${index}`,
    mimeType: 'image/jpeg',
    baseUrl: `https://images.example.com/${index}`,
    width: 1920,
    height: 1080,
    creationTime: new Date().toISOString(),
  }));
}

export function createPickerSession() {
  const id = randomUUID();
  const pickerUri = `https://photos.google.com/picker?session=${id}`;
  const session: Session = {
    id,
    pickerUri,
    status: 'PENDING',
    createdAt: Date.now(),
    items: [],
  };
  sessions.set(id, session);
  setTimeout(() => {
    const readySession = sessions.get(id);
    if (readySession) {
      readySession.status = 'READY';
      readySession.items = createMockItems();
      sessions.set(id, readySession);
    }
  }, 3000);
  return { sessionId: id, pickerUri };
}

export function getSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  const expired = Date.now() - session.createdAt > BASE_URL_TTL_MINUTES * 60 * 1000;
  if (expired) {
    sessions.delete(sessionId);
    return null;
  }
  return session;
}

export function listSessionMedia(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return { items: [], nextCursor: undefined };
  return { items: session.items, nextCursor: undefined };
}

export function generateMediaContentUrl(mediaItemId: string, width?: number, height?: number) {
  return `https://images.example.com/${mediaItemId}=w${width ?? 2048}-h${height ?? 0}`;
}
