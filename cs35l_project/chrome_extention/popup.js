
//2. Create popup.js - Popup Script Logic
//  Handle login form submission
//  Make POST request to /api/auth/login with credentials: 'include'
//Store accessToken in chrome.storage.local (extract from response if API is modified, or handle cookie-based auth)
//Check auth state on popup load
//Handle "Save Website" button click - send message to background script
//  Display success/error messages in the popup

const API_BASE_URL = "http://localhost:3000/api/auth";

// Display message in popup
function showMessage(message, isError = true) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.style.color = isError ? 'red' : 'green';
}

async function checkAuthStatus() {
    try {
        const res = await fetch(`${API_BASE_URL}/me`, {
            credentials: "include",
        });
        if (res.ok) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

async function extensionLogin(email, password) {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });
    if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
    }
    const data = await res.json();
    return data;
}

async function saveWebsite() {
    const res = await fetch (`${API_BASE_URL}/notes`, {
        method : "POST",
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify({ url, title, description, image, video, audio, text, code, other }),
    });

    if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
        return false;
    }
    return true;
}

async function init(){
    const authStatus = await checkAuthStatus();
    if (authStatus) {  // Fixed: check authStatus directly, not authStatus.authenticated
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('save-section').style.display = 'block';
    } else {
        // Show login form, hide save section
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('save-section').style.display = 'none';
    }
}

document.getElementById('login-button').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showMessage('Please enter email and password');
        return;
    }

    try {
        await extensionLogin(email, password);  // Fixed: use extensionLogin instead of login
        showMessage('Login successful!', false);
        //show save section, hide login form
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('save-section').style.display = 'block';
    } catch (err) {
        showMessage(err.message);
    }
});

document.getElementById("save-website").addEventListener("click", async () => {
    const button = document.getElementById("save-website");
    button.disabled = true;
    button.textContent = "Saving website...";

    try {
        chrome.runtime.sendMessage({ action: 'saveWebsite' }, (response) => {
            button.disabled = false;
            button.textContent = 'Save Website';
            
            if (chrome.runtime.lastError) {
                showMessage('Error: ' + chrome.runtime.lastError.message);
            } else if (response?.error) {
                showMessage(response.error);
            } else if (response?.success) {
                showMessage('Website saved successfully!', false);
            } else {
                showMessage('Unknown error occurred');
            }
        });
    } catch (err) {
        button.disabled = false;
        button.textContent = 'Save Website';
        showMessage(err.message);
    }

});

init();