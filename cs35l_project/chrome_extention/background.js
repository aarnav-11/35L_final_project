
const API_BASE_URL = "http://localhost:3000/api/notes";

async function saveWebsite(){
    try{
     //get current tab info
     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
     const url = tab.url;
     const title = tab.title;

     //request content extraction from content script
     const extractedContent = await new Promise((resolve, reject) => {
         chrome.tabs.sendMessage(tab.id, { action: 'extractContent' }, (response) => {
             if (chrome.runtime.lastError) {
                 // Content script might not be available, use empty string
                 resolve('');
             } else if (response?.error) {
                 reject(new Error(response.error));
             } else {
                 resolve(response?.content || '');
             }
         });
     });

     //format text: clickable HTML link + extracted content
     const text = `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>\n\n${extractedContent}`;

     const response = await fetch(`${API_BASE_URL}`,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        credentials : "include",
        body : JSON.stringify({
            title: title,
            text : text
        }
        )
     })
     if(!response.ok){
        const errorText = await response.text();
        throw new Error(errorText);
     }
        const result = await response.json();
        return { success: true, data: result };
    }catch (error) {
        console.error(error);
        return { success: false, error: error.message };
 }
}

// Listen for messages from popup I used AI FOR THIS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveWebsite') {
        saveWebsite().then(result => {
            sendResponse(result);
        }).catch(error => {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep message channel open for async response
    }
});