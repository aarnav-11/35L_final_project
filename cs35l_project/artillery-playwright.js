/**
 * Artillery + Playwright Load Testing Configuration
 * 
 * This combines browser automation with load testing to measure
 * real user-perceived performance under load.
 * 
 * Run with: npx artillery run artillery-playwright.js
 * 
 * Based on: https://www.artillery.io/docs/playwright
 */

const BASE_URL = 'http://localhost:5173';

const EXISTING_USER = {
    email: 'a@yahoo.com',
    password: 'Aarnav@1234'
};

export const config = {
    target: BASE_URL,
    engines: {
        playwright: {
            // Aggregate Web Vitals metrics
            aggregateByName: true,
            // Record traces for failed virtual users (for debugging)
            trace: {
                enabled: false  // Set to true if using Artillery Cloud
            }
        }
    },
    phases: [
        {
            duration: 15,
            arrivalRate: 1,
            name: 'Warm-up (1 user/sec)'
        },
        {
            duration: 30,
            arrivalRate: 3,
            name: 'Sustained Load (3 users/sec)'
        },
        {
            duration: 15,
            arrivalRate: 5,
            name: 'Peak Load (5 users/sec)'
        },
        {
            duration: 10,
            arrivalRate: 1,
            name: 'Cool-down'
        }
    ]
};

export const scenarios = [
    {
        name: 'User Login Flow',
        engine: 'playwright',
        testFunction: 'userLoginFlow',
        weight: 3
    },
    {
        name: 'Browse Notes',
        engine: 'playwright',
        testFunction: 'browseNotes',
        weight: 5
    },
    {
        name: 'Create and Delete Note',
        engine: 'playwright',
        testFunction: 'createAndDeleteNote',
        weight: 2
    },
    {
        name: 'Search Notes',
        engine: 'playwright',
        testFunction: 'searchNotes',
        weight: 3
    },
    {
        name: 'Full User Session',
        engine: 'playwright',
        testFunction: 'fullUserSession',
        weight: 2
    }
];

// ============================================================
// TEST FUNCTIONS (Playwright Page API)
// These are called by Artillery with a Playwright `page` object
// ============================================================

/**
 * Test: User Login Flow
 * Measures login page load and authentication time
 */
export async function userLoginFlow(page) {
    // Navigate to login page
    await page.goto(BASE_URL);
    
    // Click login button
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Fill credentials
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    
    // Submit and wait for navigation
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Wait for home page to load
    await page.waitForURL(/.*home/, { timeout: 10000 });
    
    // Verify notes grid is visible (page fully loaded)
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
}

/**
 * Test: Browse Notes
 * Measures home page performance for authenticated users
 */
export async function browseNotes(page) {
    // Login first
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    
    // Wait for notes to load
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // Simulate user browsing - scroll through notes
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    });
    
    // Wait a bit (simulating reading)
    await page.waitForTimeout(1000);
    
    // Scroll back up
    await page.evaluate(() => {
        window.scrollTo(0, 0);
    });
}

/**
 * Test: Create and Delete Note
 * Measures note CRUD operations performance
 * NOTE: This triggers Gemini API - use sparingly in load tests!
 */
export async function createAndDeleteNote(page) {
    // Login
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // Create a note
    const uniqueTitle = `LoadTest-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    await page.locator('.addnote').click();
    await page.waitForSelector('.note-editor', { timeout: 3000 });
    
    await page.locator('.note-title').fill(uniqueTitle);
    await page.locator('.note-content').fill('Artillery load test content - this note will be deleted');
    
    await page.locator('.save-button').click();
    
    // Wait for note to appear (this includes Gemini API time)
    await page.waitForSelector(`.note-card:has-text("${uniqueTitle}")`, { timeout: 30000 });
    
    // Delete the note
    const noteCard = page.locator('.note-card', { hasText: uniqueTitle });
    await noteCard.locator('.remove-note-button').click();
    
    // Verify deletion
    await page.waitForSelector(`.note-card:has-text("${uniqueTitle}")`, { 
        state: 'detached', 
        timeout: 5000 
    });
}

/**
 * Test: Search Notes
 * Measures search functionality performance
 */
export async function searchNotes(page) {
    // Login
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // Perform search
    await page.locator('.search-input').fill('test');
    
    // Wait for filtering
    await page.waitForTimeout(500);
    
    // Clear search
    await page.locator('.search-input').fill('');
    
    // Wait for all notes to reappear
    await page.waitForTimeout(500);
}

/**
 * Test: Full User Session
 * Simulates a complete user journey through the app
 */
export async function fullUserSession(page) {
    // 1. Login
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // 2. Browse notes
    await page.waitForTimeout(1000);
    
    // 3. Navigate to Spaces
    await page.getByRole('link', { name: 'Spaces' }).click();
    await page.waitForURL(/.*spaces/, { timeout: 5000 });
    
    // 4. Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL(/.*home/, { timeout: 5000 });
    
    // 5. Search for something
    await page.locator('.search-input').fill('note');
    await page.waitForTimeout(500);
    await page.locator('.search-input').fill('');
    
    // 6. Logout
    await page.locator('.logout button, button:has-text("Log out")').click();
    await page.waitForURL(BASE_URL, { timeout: 5000 });
}

