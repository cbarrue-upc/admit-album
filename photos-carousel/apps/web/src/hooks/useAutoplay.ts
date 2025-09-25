import { useEffect, useRef } from 'react';
import { useSlideshowStore } from '../store/slideshow.js';

export function useAutoplay() {
  const playback = useSlideshowStore((state) => state.playback);
  const interval = useSlideshowStore((state) => state.autoplayInterval);
  const next = useSlideshowStore((state) => state.next);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (playback !== 'PLAYING') {
      if (timer.current) {
        clearInterval(timer.current);
      }
      return;
    }
    timer.current = setInterval(() => {
      next();
    }, interval);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [interval, next, playback]);
}
