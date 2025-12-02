
const API_BASE_URL = "http://localhost:3000/api/notes";

// Extract 30-40 words from the page
function extractPageContent() {
    // Return just the title and link
    const title = document.title || '';
    const url = window.location.href || '';
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContent') {
        try {
            const content = extractPageContent();
            sendResponse({ content: content });
        } catch (error) {
            sendResponse({ error: error.message });
        }
    }
    return true; // Keep message channel open
});