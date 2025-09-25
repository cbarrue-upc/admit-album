import { useEffect, useMemo, useState } from 'react';
import type { MediaItem } from '@photos-carousel/types';
import { Button, HUD } from '@photos-carousel/ui';
import { SlideshowViewer } from '../components/slideshow-viewer.js';
import { SlideshowControls } from '../components/slideshow-controls.js';
import { FiltersPanel } from '../components/filters-panel.js';
import { CommandPanel } from '../components/command-panel.js';
import { createPickerSession, getPickerSessionState, listMediaItems } from '../lib/api.js';
import { useSlideshowStore } from '../store/slideshow.js';
import { PrivacyBanner } from '../components/privacy-banner.js';

interface SessionState {
  sessionId: string;
  pickerUri: string;
}

export function RootLayout() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [polling, setPolling] = useState(false);
  const setItems = useSlideshowStore((state) => state.setItems);
  const hudVisible = useSlideshowStore((state) => state.hudVisible);
  const toggleHud = useSlideshowStore((state) => state.toggleHud);
  const applyAction = useSlideshowStore((state) => state.applyAction);

  useEffect(() => {
    setItems(mediaItems);
  }, [mediaItems, setItems]);

  useEffect(() => {
    if (!session || !polling) return;
    let active = true;
    const interval = setInterval(async () => {
      if (!active) return;
      const state = await getPickerSessionState(session.sessionId);
      if (state.mediaItemsSet) {
        clearInterval(interval);
        setPolling(false);
        const result = await listMediaItems(session.sessionId);
        setMediaItems(result.items);
        setStatusMessage('Selección lista');
      } else {
        setStatusMessage('Esperando selección...');
      }
    }, 4000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [session, polling]);

  const currentItem = useMemo(() => mediaItems[useSlideshowStore.getState().currentIndex], [mediaItems]);

  const handleCreateSession = async () => {
    setLoadingSession(true);
    try {
      const response = await createPickerSession();
      setSession(response);
      setPolling(true);
      setStatusMessage('Abre el selector en Google Photos...');
      window.open(response.pickerUri, '_blank');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Error al crear la sesión');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleApplyFilters = async (filters: Parameters<typeof createPickerSession>[0]) => {
    if (!session) return;
    const filtered = mediaItems.filter((item) => {
      if (filters?.orientation && item.width && item.height) {
        const orientation = item.width > item.height ? 'landscape' : 'portrait';
        if (orientation !== filters.orientation) {
          return false;
        }
      }
      if (filters?.mime && !filters.mime.includes(item.mimeType)) {
        return false;
      }
      return true;
    });
    setMediaItems(filtered);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-gradient-to-br from-black via-slate-900 to-black p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Carrusel Google Photos</h1>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreateSession} disabled={loadingSession}>
            Elegir en Google Photos
          </Button>
          <Button variant="ghost" onClick={() => applyAction('PLAY')}>
            ▶️
          </Button>
          <Button variant="ghost" onClick={() => applyAction('PAUSE')}>
            ⏸️
          </Button>
        </div>
      </header>
      <main className="grid h-full flex-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10">
          <SlideshowViewer items={mediaItems} />
          <HUD visible={hudVisible}>
            <SlideshowControls />
            {currentItem && (
              <span className="text-sm text-white/70">
                {useSlideshowStore.getState().currentIndex + 1} / {mediaItems.length}
              </span>
            )}
            <Button variant="ghost" onClick={toggleHud}>
              HUD
            </Button>
          </HUD>
          {statusMessage && (
            <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-sm text-white/80">
              {statusMessage}
            </div>
          )}
        </section>
        <aside className="flex flex-col gap-4">
          <FiltersPanel onApply={handleApplyFilters} />
          <CommandPanel />
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
            <h2 className="text-lg font-semibold">Ayuda</h2>
            <p>
              Usa gestos de swipe para navegar, doble toque para zoom y mantén pulsado para mostrar
              controles.
            </p>
          </div>
        </aside>
      </main>
      <PrivacyBanner />
    </div>
  );
}
