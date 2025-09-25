import { describe, expect, it } from 'vitest';
import { cn } from '../../src/utils.js';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('px-2', false && 'hidden', 'py-2')).toBe('px-2 py-2');
  });
});
