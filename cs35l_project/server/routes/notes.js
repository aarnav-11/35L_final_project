
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // store PDFs temporarily
const express = require('express');
const router = express.Router();
const db = require('../database');

//get method to get all notes
router.get('/', (req, res) => {
    const query = 'SELECT * FROM notes ORDER BY created_at DESC';
    db.all(query, (err, rows) => {
        if (err){
            res.status(500).send(err.message);
            return;
        } 
        res.json(rows);
    }); 
});

//method to post notes
router.post('/', (req,res)=>{
    const {title, text} = req.body;
    if (text.trim() === ""){
        res.status(400).send("Note text cannot be empty");
        return;
    }
    //insert the note into the database
    const query = 'INSERT INTO notes (title, text) VALUES (?, ?)';
    db.run(query, [title || "Untitled Thought", text], function(err){
        if (err){
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({
            id: this.lastID,
            title: title || "Untitled Thought",
            text: text,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
    });
});
// method to upload notes
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const file = req.file;
    // insert a new note into SQLite
    const query = 'INSERT INTO notes (title, text) VALUES (?, ?)';
    const title = file.originalname;
    const text = "Uploaded PDF placeholder"; // later parse PDF???
    db.run(query, [title, text], function(err){
        if (err){
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            title,
            text,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    });
});
//method to delete notes
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ?';
    db.run(query, [id], function(err){
        if (err){
            res.status(500).send(err.message);
            return;
        }
        res.status(204).send();
        console.log(`Note with id ${id} deleted`);
    });
});

module.exports = router;