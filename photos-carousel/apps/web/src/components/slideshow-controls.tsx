import { Button } from '@photos-carousel/ui';
import { useSlideshowStore } from '../store/slideshow.js';

export function SlideshowControls() {
  const playback = useSlideshowStore((state) => state.playback);
  const togglePlay = useSlideshowStore((state) => state.togglePlay);
  const next = useSlideshowStore((state) => state.next);
  const prev = useSlideshowStore((state) => state.prev);
  const shuffle = useSlideshowStore((state) => state.shuffle);
  const setShuffle = useSlideshowStore((state) => state.setShuffle);

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={prev} aria-label="Anterior">
        ⬅️
      </Button>
      <Button onClick={togglePlay} aria-label="Play/Pausa">
        {playback === 'PLAYING' ? '⏸️' : '▶️'}
      </Button>
      <Button variant="ghost" onClick={next} aria-label="Siguiente">
        ➡️
      </Button>
      <Button variant={shuffle ? 'primary' : 'ghost'} onClick={() => setShuffle(!shuffle)}>
        🔀
      </Button>
    </div>
  );
}
