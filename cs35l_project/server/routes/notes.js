const express = require('express');
const router = express.Router();
const db = require('../database');

//get method to get all notes
router.get('/', (req, res) => {
    const query = 'SELECT * FROM notes ORDER BY created_at DESC';
    db.all(query, (err, rows) => {
        if (err){
            res.sendStatus(500).send(err.message);
            return;
        } 
        res.json(rows);
    }); 
});

module.exports = router;