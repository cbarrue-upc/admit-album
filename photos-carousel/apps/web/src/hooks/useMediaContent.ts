import { useEffect, useState } from 'react';
import { getBlob, putBlob } from '../lib/cache.js';
import type { MediaItem } from '@photos-carousel/types';

async function fetchMedia(item: MediaItem, width = 2048) {
  const params = new URLSearchParams();
  params.set('w', String(width));
  const response = await fetch(`/api/media/${item.id}/content?${params.toString()}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Unable to download media item');
  }
  return await response.blob();
}

export function useMediaContent(item: MediaItem | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    if (!item) {
      setUrl(null);
      return () => undefined;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const cached = await getBlob(item.id);
        const blob = cached ?? (await fetchMedia(item));
        if (!cached) {
          await putBlob(item.id, blob);
        }
        if (aborted) return;
        const objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (err) {
        if (!aborted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      aborted = true;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [item?.id]);

  return { url, loading, error };
}
