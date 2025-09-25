import { useMemo, useState } from 'react';
import type { MediaItem } from '@photos-carousel/types';
import { useSlideshowStore } from '../store/slideshow.js';
import { useMediaContent } from '../hooks/useMediaContent.js';
import { useAutoplay } from '../hooks/useAutoplay.js';

interface SlideshowViewerProps {
  items: MediaItem[];
}

export function SlideshowViewer({ items }: SlideshowViewerProps) {
  const currentIndex = useSlideshowStore((state) => state.currentIndex);
  const setHudVisible = useSlideshowStore((state) => state.setHudVisible);
  const next = useSlideshowStore((state) => state.next);
  const prev = useSlideshowStore((state) => state.prev);
  const togglePlay = useSlideshowStore((state) => state.togglePlay);
  const [zoomed, setZoomed] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const currentItem = useMemo(() => items[currentIndex], [items, currentIndex]);
  const { url, loading, error } = useMediaContent(currentItem);

  useAutoplay();

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setZoomed((z) => !z);
    } else {
      setHudVisible(true);
    }
    setLastTap(now);
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
      onClick={handleTap}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          next();
        }
        if (event.key === 'ArrowLeft') {
          prev();
        }
        if (event.key === ' ') {
          event.preventDefault();
          togglePlay();
        }
      }}
      tabIndex={0}
    >
      {loading && <div className="text-white/70">Cargando...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {url && (
        <img
          src={url}
          alt={currentItem?.id ?? 'Imagen'}
          className="max-h-full max-w-full rounded-xl shadow-2xl transition-transform duration-200"
          style={{ transform: zoomed ? 'scale(1.4)' : 'scale(1)' }}
        />
      )}
    </div>
  );
}
