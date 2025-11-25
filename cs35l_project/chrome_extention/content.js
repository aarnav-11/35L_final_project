
const API_BASE_URL = "http://localhost:3000/api/notes";
async function saveWebsite(endpoint){
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true});
    const url = currentTab[0].url;
    const title = currentTab[0].title;
    const description = currentTab[0].description;
    const image = currentTab[0].image;
    const video = currentTab[0].video;
    const audio = currentTab[0].audio;
    const text = currentTab[0].text;
    const code = currentTab[0].code;
    const other = currentTab[0].other;

    const data = {
        url: url,
        title: title,
        description: description,
        image: image,
        video: video,
        audio: audio,
        text: text,
        code: code,
        other: other
    };

    try {
        const response = await fetch(`${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok){
            throw new Error("Failed to save website");
        }
    } catch (error) {
        console.error("Error saving website:", error);
    }
    const result = await response.json();
    return result;
}

// Extract 30-40 words from the page
function extractPageContent() {
    // Get all text content from the page
    const body = document.body;
    if (!body) return '';

    // Clone body to avoid modifying the original
    const clone = body.cloneNode(true);
    
    // Remove script and style elements
    const scripts = clone.querySelectorAll('script, style, noscript, iframe, nav, header, footer');
    scripts.forEach(el => el.remove());

    // Get text content
    let text = clone.textContent || clone.innerText || '';
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Extract first 30-40 words
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const extractedWords = words.slice(0, 40).join(' ');
    
    return extractedWords;
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