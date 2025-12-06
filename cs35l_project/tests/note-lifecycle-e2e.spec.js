//AI Prompt with model automatically chosen by cursor (between gemini-2.5-flash and gpt-4o-mini)
//Prompt: Create more robust end to end tests given our current tests to ensure complete functionality
//await page.getByRole('button', { name: 'Log in' }).click();
//await page.locator('#email').fill(EXISTING_USER.email);
//await page.locator('#password').fill(EXISTING_USER.password);
//await page.getByRole('button', { name: 'Log in' }).click();
//await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
//await expect(page.locator('.notes-grid')).toBeVisible();
//await page.locator('.search-input').fill('');
//await page.getByRole('link', { name: 'Home' }).click();
//await expect(page).toHaveURL(/.*home/, { timeout: 5000 });

import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:5173';
const EXISTING_USER = {
  email: 'a@yahoo.com',
  password: 'Aarnav@1234'
};

test.use({ 
  browserName: 'chromium'
});

test.describe('E2E: Complete Note Lifecycle', () => {
  test('should complete full note lifecycle across multiple pages', async ({ page }) => {
    const uniqueId = Date.now();
    const noteTitle = `E2E Test Note ${uniqueId}`;
    const noteContent = 'This is an end-to-end test note about machine learning and Python programming';
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
    await expect(page.locator('.notes-grid')).toBeVisible();
    await page.locator('.addnote').click();
    await expect(page.locator('.note-editor')).toBeVisible();
    await page.locator('.note-title').fill(noteTitle);
    await page.locator('.note-content').fill(noteContent);
    await page.locator('.save-button').click();
    await expect(page.locator('.note-editor')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText(noteTitle)).toBeVisible({ timeout: 10000 });
    await page.locator('.search-input').fill('machine learning');
    await page.waitForTimeout(500); // Wait for search to filter
    await expect(page.getByText(noteTitle)).toBeVisible();
    await page.locator('.search-input').fill('');
    await page.waitForTimeout(300);
    await page.getByRole('link', { name: 'Spaces' }).click();
    await expect(page).toHaveURL(/.*spaces/, { timeout: 5000 });
    await expect(page.locator('.spaces-title')).toBeVisible();
    await expect(page.locator('.spaces-title')).toHaveText('Spaces');
    await page.waitForTimeout(5000);
    const spacesList = page.locator('.spaces-list');
    const hasSpaces = await spacesList.isVisible().catch(() => false);
    
    if (hasSpaces) {
      const spaceItems = page.locator('.spaces-list-item');
      const spaceCount = await spaceItems.count();
      
      if (spaceCount > 0) {
        await spaceItems.first().click();
        await page.waitForTimeout(1000);
        const noteInSpace = page.locator('.spaces-note').filter({ hasText: noteTitle });
        const noteExists = await noteInSpace.isVisible().catch(() => false);
      }
    }
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 5000 });
    await expect(page.locator('.notes-grid')).toBeVisible();
    await page.waitForTimeout(1000);
    const noteCard = page.locator('.note-card').filter({ has: page.getByText(noteTitle) });
    await expect(noteCard).toBeVisible({ timeout: 10000 });
    await noteCard.locator('.remove-note-button').click();
    await expect(page.getByText(noteTitle)).not.toBeVisible({ timeout: 5000 });
    await page.locator('.search-input').fill(noteTitle);
    await page.waitForTimeout(500);
    const noteCount = await page.locator('.note-card').count();
    expect(noteCount).toBe(0);
  });
});

