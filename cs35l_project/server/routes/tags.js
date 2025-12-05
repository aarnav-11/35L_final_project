
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post("/", async (req, res) => {
    try {
        const { title, text } = req.body;
        
        if (!title && !text) {
            return res.status(400).json({ error: "Title or text is required" });
        }
        
        // Use stub for testing (Artillery load tests) to avoid API calls
        // Set USE_TAG_STUB=true in server/.env to enable stub
        const useStub = process.env.USE_TAG_STUB === 'true';
        const scriptName = useStub ? 'tags-stub.py' : 'tags.py';
        const pythonScriptPath = path.join(__dirname, '..', scriptName);
        
        if (useStub) {
            console.log('[TEST MODE] Using tag stub - returning test double tags');
        }
        
        // Prepare input data as JSON
        const inputData = JSON.stringify({ title: title || "", text: text || "" });
        
        // Execute Python script with input from stdin
        const pythonProcess = spawn('python3', [pythonScriptPath]);
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        // Send input to Python script
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();
        
        // Wait for the process to finish
        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python script exited with code ${code}: ${stderr}`));
                } else {
                    resolve();
                }
            });
            
            pythonProcess.on('error', (err) => {
                reject(err);
            });
        });
        
        if (stderr) {
            console.error("Python script stderr:", stderr);
        }
        
        // Parse the JSON response from Python
        const result = JSON.parse(stdout);
        
        if (result.error) {
            console.error("Error from Python script:", result.error);
            return res.status(500).json({ error: result.error });
        }
        
        res.json({ tags: result.tags || [] });
        console.log("Generated tags:", result.tags);
        
    } catch (err) {
        console.error("Error generating tags:", err);
        res.status(500).json({ error: "Gemini error: " + err.message });
    }
});

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// router.post("/", async (req, res) => {
// try {
//     const { title, text } = req.body;

//     const ai = new GoogleGenerativeAI({apiKey: ""});
//     const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const response = await model.generateContent(`Generate 3-5 relevant tags for this note: ${title} ${text}. 
//     Return only a comma-separated list.`);
//     res.json({ tags: response.text });
//     console.log(response.text);

// } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Gemini error" });
// }
// });

// module.exports = router;
