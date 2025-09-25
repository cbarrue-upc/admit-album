import { describe, expect, it, vi } from 'vitest';
import { LRUCache } from '../lib/lru.js';

describe('LRUCache', () => {
  it('evicts oldest entries when over capacity', () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    const cache = new LRUCache<string>(10);
    cache.set('a', 'a', 6);
    vi.setSystemTime(new Date('2024-01-01T00:00:01Z'));
    cache.set('b', 'b', 6);
    expect(cache.keys()).toContain('b');
    expect(cache.keys()).not.toContain('a');
  });
});
