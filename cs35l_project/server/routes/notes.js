
const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

//get method to get all notes
router.get('/', requireAuth ,(req, res) => {
    const userid = req.user.userId;
    const query = 'SELECT * FROM notes ORDER BY created_at DESC WHERE user_id = ?';
    db.all(query, [userid], (err, rows) => {
        if (err){
            res.status(500).send(err.message);
            return;
        } 
        res.json(rows);
    }); 
});

//method to post notes
router.post('/', requireAuth, (req,res)=>{
    const userid = req.user.userId;
    const {title, text} = req.body;
    if (text.trim() === ""){
        res.status(400).send("Note text cannot be empty");
        return;
    }
    //insert the note into the database
    const query = 'INSERT INTO notes (user_id, title, text) VALUES (?, ?, ?)';
    db.run(query, [userid, title || "Untitled Thought", text], function(err){
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