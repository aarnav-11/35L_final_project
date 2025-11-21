
const multer = require("multer");
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);
const storage = multer.memoryStorage();
const upload = multer({ storage });
const express = require('express');
const router = express.Router();
const db = require('../database');
const fetch = require('node-fetch');

const API_BASE_URL = "http://localhost:3000/notes";

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
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const title = req.file.originalname;
    const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, "_")}`;
    const {error} = await supabase.storage
      .from("notes-files")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        //contentType: "application/pdf",
      });
    if (error) {
        console.error(error);
        return res.status(500).json({ error: "Upload failed" });
    }
    const { data: publicURL } = supabase.storage
      .from("notes-files")
      .getPublicUrl(fileName);
    const text = publicURL.publicUrl;
    const query = 'INSERT INTO notes (title, text) VALUES (?, ?)';
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

//method to open pdfs in browser
router.get('/file/:filename', async (req, res) => {
    try{
        const { filename } = req.params;
        const { data, error: signedUrlError } = await supabase
        .storage
        .from('notes-files') 
        .createSignedUrl(filename, 60);
        if (signedUrlError) {
        console.error(signedUrlError);
        return res.status(500).send('Error generating file URL');
        }
        const fileResponse = await fetch(data.signedUrl);
        if (!fileResponse.ok) {
        return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`); 
        fileResponse.body.pipe(res);
    }
    catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
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