import { create } from 'zustand';
import type { MediaItem, SlideshowAction } from '@photos-carousel/types';

type PlaybackMode = 'PLAYING' | 'PAUSED';

interface SlideshowState {
  items: MediaItem[];
  currentIndex: number;
  playback: PlaybackMode;
  shuffle: boolean;
  hudVisible: boolean;
  autoplayInterval: number;
  setItems: (items: MediaItem[]) => void;
  setCurrentIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  setShuffle: (value: boolean) => void;
  toggleHud: () => void;
  setHudVisible: (visible: boolean) => void;
  setAutoplayInterval: (ms: number) => void;
  applyAction: (action: SlideshowAction) => void;
}

const clampIndex = (index: number, length: number) => {
  if (length === 0) {
    return 0;
  }
  return (index + length) % length;
};

export const useSlideshowStore = create<SlideshowState>((set, get) => ({
  items: [],
  currentIndex: 0,
  playback: 'PAUSED',
  shuffle: false,
  hudVisible: true,
  autoplayInterval: 12000,
  setItems: (items) => set({ items, currentIndex: 0 }),
  setCurrentIndex: (index) => {
    const { items } = get();
    set({ currentIndex: clampIndex(index, items.length) });
  },
  next: () => {
    const { items, shuffle, currentIndex } = get();
    if (items.length === 0) return;
    const nextIndex = shuffle ? Math.floor(Math.random() * items.length) : currentIndex + 1;
    set({ currentIndex: clampIndex(nextIndex, items.length) });
  },
  prev: () => {
    const { items, currentIndex } = get();
    if (items.length === 0) return;
    set({ currentIndex: clampIndex(currentIndex - 1, items.length) });
  },
  togglePlay: () => {
    set((state) => ({ playback: state.playback === 'PLAYING' ? 'PAUSED' : 'PLAYING' }));
  },
  setShuffle: (value) => set({ shuffle: value }),
  toggleHud: () => set((state) => ({ hudVisible: !state.hudVisible })),
  setHudVisible: (visible) => set({ hudVisible: visible }),
  setAutoplayInterval: (ms) => set({ autoplayInterval: ms }),
  applyAction: (action) => {
    const { togglePlay, next, prev, setShuffle } = get();
    switch (action) {
      case 'PLAY':
        set({ playback: 'PLAYING' });
        break;
      case 'PAUSE':
        set({ playback: 'PAUSED' });
        break;
      case 'NEXT':
        next();
        break;
      case 'PREV':
        prev();
        break;
      case 'SHUFFLE':
        setShuffle(true);
        break;
      default:
        togglePlay();
        break;
    }
  },
}));
