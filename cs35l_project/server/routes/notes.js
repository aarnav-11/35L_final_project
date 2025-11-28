
const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

//get method to get all notes
router.get('/', requireAuth ,(req, res) => {
    const userid = req.user.userId;
    const query = 'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC';
    db.all(query, [userid], (err, rows) => {
        if (err){
            res.status(500).send(err.message);
            return;
        } 
        //parse tags from json string to array
        const notesWithParsedTags = rows.map(note => {
            let tagsArray = [];
            if (typeof note.tags === 'string') {
                try {
                    tagsArray = JSON.parse(note.tags);
                }
                catch (e) {
                    tagsArray = [];
                }
            }
            return { ...note, tags: tagsArray };
        });
        res.json(notesWithParsedTags);
    }); 
});

//method to post notes
const { spawn } = require('child_process');
const path = require('path');

router.post('/', requireAuth, async (req, res) => {
    const userid = req.user.userId;
    const { title, text } = req.body;
    
    if (!text || text.trim() === "") {
        res.status(400).send("Note text cannot be empty");
        return;
    }

    // Insert the note without tags first
    const insertQuery = 'INSERT INTO notes (user_id, title, text) VALUES (?, ?, ?)';
    db.run(insertQuery, [userid, title || "Untitled Thought", text], function (err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        const noteId = this.lastID;

        // Generate tags using Python script, then update the note with the tags
        (async () => {
            try {
                // Prepare Python call
                const pythonScriptPath = path.join(__dirname, '..', 'tags.py');
                const inputData = JSON.stringify({ title: title || "", text: text });
                const pythonProcess = spawn('python3', [pythonScriptPath]);

                let stdout = '';
                let stderr = '';

                pythonProcess.stdout.on('data', (data) => { 
                    stdout += data.toString(); 
                });
                pythonProcess.stderr.on('data', (data) => { 
                    stderr += data.toString(); 
                });

                pythonProcess.stdin.write(inputData);
                pythonProcess.stdin.end();

                await new Promise((resolve, reject) => {
                    pythonProcess.on('close', (code) => {
                        if (code !== 0) {
                            reject(new Error(`Python script error: ${stderr}`));
                        } else {
                            resolve();
                        }
                    });
                    pythonProcess.on('error', (err) => { 
                        reject(err); 
                    });
                });

                // Parse tags from the script output
                let tagsArray = [];
                if (stdout) {
                    try {
                        const result = JSON.parse(stdout);
                        if (result.tags && Array.isArray(result.tags)) {
                            tagsArray = result.tags;
                        } else if (result.error) {
                            console.error("Tag generation error:", result.error);
                        }
                    } catch (parseErr) {
                        console.error("Error parsing tag generation result:", parseErr);
                    }
                }

                // Stringify tags and update the note
                const tagsJson = JSON.stringify(tagsArray);
                const updateQuery = 'UPDATE notes SET tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
                db.run(updateQuery, [tagsJson, noteId], (err2) => {
                    if (err2) {
                        console.error("Error updating note with tags:", err2);
                        // Still return the note, just without tags
                        return res.status(201).json({
                            id: noteId,
                            title: title || "Untitled Thought",
                            text: text,
                            tags: [],
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    }
                    // Return note with tags as array
                    res.status(201).json({
                        id: noteId,
                        title: title || "Untitled Thought",
                        text: text,
                        tags: tagsArray,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                });
            } catch (pythonErr) {
                // On tag generation failure, return note with empty tags
                console.error("Tag generation failed:", pythonErr);
                res.status(201).json({
                    id: noteId,
                    title: title || "Untitled Thought",
                    text: text,
                    tags: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        })();
    });
});

//method to delete notes
router.delete("/:id", requireAuth, (req, res) => {
    const userid = req.user.userId;
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    db.run(query, [id, userid], function(err){
        if (err){
            res.status(500).send(err.message);
            return;
        }
        res.status(204).send();
        console.log(`Note with id ${id} deleted`);
    });
});

module.exports = router;