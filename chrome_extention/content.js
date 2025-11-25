
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