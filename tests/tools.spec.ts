import { test, expect } from '@playwright/test';

test.describe('Utility Tools', () => {
  test('JSON Formatter should format valid JSON', async ({ page }) => {
    await page.goto('/tools/json');
    await page.fill('textarea[placeholder="Paste your JSON here..."]', '{"a":1}');
    await page.click('button:has-text("Format")');
    const output = await page.inputValue('textarea[placeholder="Formatted output will appear here..."]');
    expect(output).toContain('"a": 1');
  });

  test('Epoch Converter should convert epoch to date', async ({ page }) => {
    await page.goto('/tools/epoch');
    await page.fill('input[placeholder="Enter epoch (e.g. 1707833227)"]', '1707833227');
    await page.click('button:has-text("Convert")');
    const result = await page.textContent('.font-mono:has-text("UTC")');
    expect(result).toBeTruthy();
  });
});
