import { useEffect, useMemo, useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
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
  const toggleHud = useSlideshowStore((state) => state.toggleHud);
  const next = useSlideshowStore((state) => state.next);
  const prev = useSlideshowStore((state) => state.prev);
  const togglePlay = useSlideshowStore((state) => state.togglePlay);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [lastTap, setLastTap] = useState(0);
  const currentItem = useMemo(() => items[currentIndex], [items, currentIndex]);
  const { url, loading, error } = useMediaContent(currentItem);

  useAutoplay();

  useEffect(() => {
    setScale(1);
    setLastTap(0);
  }, [currentItem?.id]);

  useGesture(
    {
      onDrag: ({ event, last, movement: [movementX] }) => {
        event.preventDefault();
        if (!last) return;
        if (movementX < -40) {
          next();
          setHudVisible(true);
        } else if (movementX > 40) {
          prev();
          setHudVisible(true);
        }
      },
      onPinch: ({ event, offset: [distance] }) => {
        event.preventDefault();
        const clampedScale = clamp(1 + distance / 180, 1, 3);
        setScale(clampedScale);
      },
      onPinchEnd: ({ offset: [distance] }) => {
        const clampedScale = clamp(1 + distance / 180, 1, 3);
        if (clampedScale <= 1.05) {
          setScale(1);
        }
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
    },
  );

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setScale((value) => (value > 1.05 ? 1 : 1.6));
    } else {
      toggleHud();
    }
    setLastTap(now);
  };

  return (
    <div
      ref={containerRef}
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
          style={{ transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
