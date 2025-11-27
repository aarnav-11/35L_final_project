
// const express = require('express');
// const router = express.Router();
// const { GoogleGenAI } = require("@google/genai");

// router.post("/", async (req, res) => {
// try {
//     const { title, text } = req.body;
//     const apiKey = process.env.GEMINI_API_KEY;

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
//     const ai = new GoogleGenAI({apiKey: `"${apiKey}"`});

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: `Generate 3-5 relevant tags for this note: ${title} ${text}. 
//         Return only a comma-separated list.`,
//     });
//     res.json({ tags: response.text });
//     console.log(response.text);

// } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Gemini error" });
// }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/", async (req, res) => {
try {
    const { title, text } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenerativeAI({apiKey: apiKey});
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(`Generate 3-5 relevant tags for this note: ${title} ${text}. 
    Return only a comma-separated list.`);
    res.json({ tags: response.text });
    console.log(response.text);

} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
}
});

module.exports = router;
