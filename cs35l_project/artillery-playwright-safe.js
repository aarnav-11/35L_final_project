/**
 * Artillery + Playwright Load Testing - SAFE VERSION
 * 
 * This version EXCLUDES note creation to avoid Gemini API rate limits
 * and the cascading failure issue discovered in earlier load tests.
 * 
 * Run with: npx artillery run artillery-playwright-safe.js
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
            aggregateByName: true,
            // Headless Chrome options
            launchOptions: {
                headless: true
            }
        }
    },
    phases: [
        {
            duration: 30,
            arrivalRate: 2,
            name: 'Warm-up'
        },
        {
            duration: 60,
            arrivalRate: 5,
            name: 'Sustained Load'
        },
        {
            duration: 30,
            arrivalRate: 10,
            name: 'Peak Load'
        },
        {
            duration: 30,
            arrivalRate: 2,
            name: 'Cool-down'
        }
    ]
};

export const scenarios = [
    {
        name: 'Login and Browse',
        engine: 'playwright',
        testFunction: 'loginAndBrowse',
        weight: 5
    },
    {
        name: 'Navigate Between Pages',
        engine: 'playwright',
        testFunction: 'navigatePages',
        weight: 3
    },
    {
        name: 'Search Functionality',
        engine: 'playwright',
        testFunction: 'searchFunctionality',
        weight: 4
    }
];

// ============================================================
// SAFE TEST FUNCTIONS (No Gemini API calls)
// ============================================================

/**
 * Login and Browse Notes
 */
export async function loginAndBrowse(page) {
    await page.goto(BASE_URL);
    
    // Login
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    
    // Wait for home page
    await page.waitForURL(/.*home/, { timeout: 10000 });
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // Browse - scroll down and up
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Navigate Between Pages
 */
export async function navigatePages(page) {
    await page.goto(BASE_URL);
    
    // Login
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    
    // Go to Spaces
    await page.getByRole('link', { name: 'Spaces' }).click();
    await page.waitForURL(/.*spaces/, { timeout: 5000 });
    
    // Go back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL(/.*home/, { timeout: 5000 });
    
    // Logout
    await page.locator('.logout button, button:has-text("Log out")').click();
    await page.waitForURL(BASE_URL, { timeout: 5000 });
}

/**
 * Search Functionality
 */
export async function searchFunctionality(page) {
    await page.goto(BASE_URL);
    
    // Login
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.locator('#email').fill(EXISTING_USER.email);
    await page.locator('#password').fill(EXISTING_USER.password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/.*home/, { timeout: 10000 });
    await page.waitForSelector('.notes-grid', { timeout: 5000 });
    
    // Multiple searches
    const searchTerms = ['test', 'note', 'hello', ''];
    
    for (const term of searchTerms) {
        await page.locator('.search-input').fill(term);
        await page.waitForTimeout(300);
    }
}

