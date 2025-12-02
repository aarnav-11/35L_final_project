/**
 * Artillery + Playwright Test Functions
 * 
 * These functions are called by Artillery with a Playwright page object.
 * Run with: npx artillery run artillery-playwright.yml
 */

const BASE_URL = 'http://localhost:5173';
const EXISTING_USER = {
    email: 'a@yahoo.com',
    password: 'Aarnav@1234'
};

/**
 * Login and Browse Notes
 */
async function loginAndBrowse(page, vuContext, events, test) {
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
async function navigatePages(page, vuContext, events, test) {
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
async function searchFunctionality(page, vuContext, events, test) {
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

module.exports = {
    loginAndBrowse,
    navigatePages,
    searchFunctionality
};

