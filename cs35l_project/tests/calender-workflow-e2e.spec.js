//AI Prompt with model automatically chosen by cursor (between gemini-2.5-flash and gpt-4o-mini)
//Prompt: Create more robust end to end tests given our current tests to ensure complete functionality
//Given tests: await page.getByRole('button', { name: 'Log in' }).click();
//await page.locator('#email').fill(EXISTING_USER.email);
//await page.locator('#password').fill(EXISTING_USER.password);
//await page.getByRole('button', { name: 'Log in' }).click();
//await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
//await page.getByRole('link', { name: 'Calendar' }).click();
//await expect(page).toHaveURL(/.*calendar/, { timeout: 5000 });
//await expect(page.locator('.calendar-page')).toBeVisible();
//await expect(page.locator('h1.title')).toHaveText('My Calendar');

import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:5173';
const EXISTING_USER = {
  email: 'a@yahoo.com',
  password: 'Aarnav@1234'
};

test.use({ 
  browserName: 'chromium'
});

test.describe('E2E: Complete Calendar Workflow', () => {
  test('should complete full calendar reminder workflow', async ({ page }) => {
    const uniqueId = Date.now();
    const reminderText = `E2E Test Reminder ${uniqueId}`;
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
    await page.getByRole('link', { name: 'Calendar' }).click();
    await expect(page).toHaveURL(/.*calendar/, { timeout: 5000 });
    await expect(page.locator('.calendar-page')).toBeVisible();
    await expect(page.locator('h1.title')).toHaveText('My Calendar');
    await page.waitForTimeout(1000);
    const reminderInput = page.locator('.reminder-input input[type="text"]');
    await expect(reminderInput).toBeVisible();
    await expect(reminderInput).toHaveAttribute('placeholder', 'Add a reminder...');
    await reminderInput.fill(reminderText);
    await page.locator('.reminder-input button').click();
    await page.waitForTimeout(1000);
    const reminderList = page.locator('.reminder-list');
    await expect(reminderList).toBeVisible();
    const reminderItem = page.locator('.reminder-list li').filter({ hasText: reminderText });
    await expect(reminderItem).toBeVisible({ timeout: 5000 });
    const checkbox = reminderItem.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await page.waitForTimeout(500);
    await expect(checkbox).toBeChecked();
    await expect(reminderItem).toHaveClass(/done/);
    await checkbox.click();
    await page.waitForTimeout(500);
    await expect(checkbox).not.toBeChecked();
    const deleteButton = reminderItem.locator('.delete-btn');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await page.waitForTimeout(1000);
    await expect(reminderItem).not.toBeVisible({ timeout: 5000 });
    const reminderTextExists = await page.getByText(reminderText).isVisible().catch(() => false);
    expect(reminderTextExists).toBe(false);
  });
});

