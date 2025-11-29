// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const EXISTING_USER = {
  email: 'a@yahoo.com',
  password: 'Aarnav@1234'
};

////////////////////////////////////////////////////////////
//AUTH TESTS
////////////////////////////////////////////////////////////

test.describe('Authentication Page', () => {
  test('should display Sign Up form by default', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check title shows Sign Up
    await expect(page.locator('h1')).toHaveText('Sign Up');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#age')).toBeVisible();
    await expect(page.locator('#favProf')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should switch to Log In form', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await expect(page.locator('h1')).toHaveText('Log In');
    
    // Sign up only fields should be hidden
    await expect(page.locator('#name')).not.toBeVisible();
    await expect(page.locator('#age')).not.toBeVisible();
    await expect(page.locator('#favProf')).not.toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should reject invalid email format on signup', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.locator('#name').fill('Test User');
    await page.locator('#age').fill('25');
    await page.locator('#favProf').fill('Eggert');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#password').fill('TestPass123!');
    
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Either shows .error div OR stays on same page (doesn't redirect to /home)
    const errorVisible = await page.locator('.error').isVisible().catch(() => false);
    const stillOnAuthPage = await page.url() === BASE_URL || await page.url() === BASE_URL + '/';
    
    expect(errorVisible || stillOnAuthPage).toBe(true);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Switch to login
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Fill login form
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    
    // Submit
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Should redirect to home
    await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill('WrongPassword123!');
    
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Should show error
    await expect(page.locator('.error')).toBeVisible({ timeout: 5000 });
  });
});