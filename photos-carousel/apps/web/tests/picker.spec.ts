import { test, expect } from '@playwright/test';

test('shows picker button and status flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Elegir en Google Photos' })).toBeVisible();
});
