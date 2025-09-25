import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(target?: () => HTMLElement | null) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const request = useCallback(async () => {
    const element = target?.() ?? document.documentElement;
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
  }, [target]);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handle = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handle);
    return () => document.removeEventListener('fullscreenchange', handle);
  }, []);

  return { isFullscreen, request, exit };
}
