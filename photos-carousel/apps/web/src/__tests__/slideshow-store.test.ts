import { describe, expect, it } from 'vitest';
import { useSlideshowStore } from '../store/slideshow.js';

describe('slideshow store', () => {
  it('handles actions correctly', () => {
    const { applyAction, playback } = useSlideshowStore.getState();
    expect(playback).toBe('PAUSED');
    applyAction('PLAY');
    expect(useSlideshowStore.getState().playback).toBe('PLAYING');
    applyAction('PAUSE');
    expect(useSlideshowStore.getState().playback).toBe('PAUSED');
  });
});
