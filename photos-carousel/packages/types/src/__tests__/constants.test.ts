import { describe, expect, it } from 'vitest';
import {
  BASE_URL_REFRESH_THRESHOLD_MINUTES,
  BASE_URL_TTL_MINUTES,
  GOOGLE_PHOTOS_PICKER_SCOPE,
  llmCommandSchema,
} from '../index.js';

describe('constants', () => {
  it('defines the Google Photos Picker scope', () => {
    expect(GOOGLE_PHOTOS_PICKER_SCOPE).toBe(
      'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
    );
  });

  it('ensures the refresh threshold is less than the TTL', () => {
    expect(BASE_URL_REFRESH_THRESHOLD_MINUTES).toBeLessThan(BASE_URL_TTL_MINUTES);
  });

  it('validates a minimal LLM command payload', () => {
    const result = llmCommandSchema.safeParse({ action: 'PLAY' });
    expect(result.success).toBe(true);
  });
});
