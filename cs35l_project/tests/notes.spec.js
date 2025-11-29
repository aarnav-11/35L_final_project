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

////////////////////////////////////////////////////////////
//NOTES TESTS
////////////////////////////////////////////////////////////

test.describe('Main Page - Notes', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
  });

  test('should display notes grid', async ({ page }) => {
    await expect(page.locator('.notes-grid')).toBeVisible();
  });

  test('should display navigation bar', async ({ page }) => {
    await expect(page.locator('nav.navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Spaces' })).toBeVisible();
  });

  test('should display search bar', async ({ page }) => {
    await expect(page.locator('.search-input')).toBeVisible();
    await expect(page.locator('.search-input')).toHaveAttribute('placeholder', 'Search your mind');
  });

  test('should display add note button', async ({ page }) => {
    await expect(page.locator('.addnote')).toBeVisible();
    await expect(page.locator('.addnote')).toHaveText('+');
  });

  test('should open note editor when clicking add button', async ({ page }) => {
    await page.locator('.addnote').click();
    
    // Editor should be visible
    await expect(page.locator('.note-editor')).toBeVisible();
    await expect(page.locator('.note-title')).toBeVisible();
    await expect(page.locator('.note-content')).toBeVisible();
    await expect(page.locator('.save-button')).toBeVisible();
    await expect(page.locator('.cross-button')).toBeVisible();
  });

  test('should close editor when clicking X button', async ({ page }) => {
    await page.locator('.addnote').click();
    await expect(page.locator('.note-editor')).toBeVisible();
    
    await page.locator('.cross-button').click();
    
    await expect(page.locator('.note-editor')).not.toBeVisible();
    await expect(page.locator('.addnote')).toBeVisible();
  });

  test('should show alert when saving empty note', async ({ page }) => {
    await page.locator('.addnote').click();
    
    // Listen for dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('empty');
      await dialog.accept();
    });
    
    await page.locator('.save-button').click();
  });

  test('should create a new note successfully', async ({ page }) => {
    const uniqueTitle = `Test Note ${Date.now()}`;
    const noteContent = 'This is automated test content from Playwright';
    
    await page.locator('.addnote').click();
    
    await page.locator('.note-title').fill(uniqueTitle);
    await page.locator('.note-content').fill(noteContent);
    
    await page.locator('.save-button').click();
    
    // Editor should close
    await expect(page.locator('.note-editor')).not.toBeVisible({ timeout: 5000 });
    
    // New note should appear in grid
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });

  test('should delete a note', async ({ page }) => {
    // First create a note to delete
    const uniqueTitle = `Delete Me ${Date.now()}`;
    
    await page.locator('.addnote').click();
    await page.locator('.note-title').fill(uniqueTitle);
    await page.locator('.note-content').fill('This note will be deleted');
    await page.locator('.save-button').click();
    
    // Wait for note to appear
    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
    
    // Find the note card with our title and click its remove button
    const noteCard = page.locator('.note-card', { has: page.getByText(uniqueTitle) });
    await noteCard.locator('.remove-note-button').click();
    
    // Note should be removed
    await expect(page.getByText(uniqueTitle)).not.toBeVisible({ timeout: 5000 });
  });
});

////////////////////////////////////////////////////////////
//SEARCH TESTS
////////////////////////////////////////////////////////////


test.describe('Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('button', { name: 'Log in' }).click();
      await page.locator('#email').fill(EXISTING_USER.email);
      await page.locator('#password').fill(EXISTING_USER.password);
      await page.getByRole('button', { name: 'Log in' }).click();
      await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
    });
  
    test('should filter notes when typing in search', async ({ page }) => {
      // Create a uniquely named note first
      const uniqueWord = `unique${Date.now()}`;
      
      await page.locator('.addnote').click();
      await page.locator('.note-title').fill(uniqueWord);
      await page.locator('.note-content').fill('Searchable content');
      await page.locator('.save-button').click();
      
      await expect(page.getByText(uniqueWord)).toBeVisible({ timeout: 10000 });
      
      // Get initial note count
      const initialCount = await page.locator('.note-card').count();
      
      // Search for the unique word
      await page.locator('.search-input').fill(uniqueWord);
      
      // Wait for filtering
      await page.waitForTimeout(500);
      
      // Should show only the matching note
      const filteredCount = await page.locator('.note-card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      await expect(page.getByText(uniqueWord)).toBeVisible();
    });
  
    test('should show no results for non-matching search', async ({ page }) => {
      const nonsenseQuery = 'xyznonexistent12345';
      
      await page.locator('.search-input').fill(nonsenseQuery);
      await page.waitForTimeout(500);
      
      // Should show 0 notes
      const noteCount = await page.locator('.note-card').count();
      expect(noteCount).toBe(0);
    });
  
    test('should clear search and show all notes', async ({ page }) => {
      // Type something
      await page.locator('.search-input').fill('test');
      await page.waitForTimeout(300);
      
      const filteredCount = await page.locator('.note-card').count();
      
      // Clear search
      await page.locator('.search-input').fill('');
      await page.waitForTimeout(300);
      
      const allCount = await page.locator('.note-card').count();
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });
});

////////////////////////////////////////////////////////////
//NAVIGATION TESTS
////////////////////////////////////////////////////////////


test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('button', { name: 'Log in' }).click();
      await page.locator('#email').fill(EXISTING_USER.email);
      await page.locator('#password').fill(EXISTING_USER.password);
      await page.getByRole('button', { name: 'Log in' }).click();
      await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
    });
  
    test('should navigate to Spaces page', async ({ page }) => {
      await page.getByRole('link', { name: 'Spaces' }).click();
      await expect(page).toHaveURL(/.*spaces/);
    });
  
    test('should navigate back to Home', async ({ page }) => {
      await page.getByRole('link', { name: 'Spaces' }).click();
      await expect(page).toHaveURL(/.*spaces/);
      
      await page.getByRole('link', { name: 'Home' }).click();
      await expect(page).toHaveURL(/.*home/);
    });
  
    test('should logout successfully', async ({ page }) => {
      // Find and click logout button
      await page.locator('.logout button, button:has-text("Logout"), button:has-text("Log out")').click();
      
      // Should redirect to login page
      await expect(page).toHaveURL(BASE_URL, { timeout: 5000 });
    });
  });