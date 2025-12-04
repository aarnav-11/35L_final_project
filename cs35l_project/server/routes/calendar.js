const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

// GET all reminders for the logged-in user
router.get('/', requireAuth, (req, res) => {
  const userId = req.user.userId;
  db.all(
    'SELECT * FROM reminders WHERE user_id = ?',
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST a new reminder
router.post('/', requireAuth, (req, res) => {
  const { date, text } = req.body;
  const userId = req.user.userId;

  db.run(
    'INSERT INTO reminders (user_id, date, text, done) VALUES (?, ?, ?, ?)',
    [userId, date, text, 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        'SELECT * FROM reminders WHERE id = ?',
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(row);
        }
      );
    }
  );
});

// PATCH toggle done / not-done
router.patch('/:id/toggle', requireAuth, (req, res) => {
  const reminderId = req.params.id;

  db.get(
    'SELECT * FROM reminders WHERE id = ?',
    [reminderId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Reminder not found' });

      const newDone = row.done ? 0 : 1;

      db.run(
        'UPDATE reminders SET done = ? WHERE id = ?',
        [newDone, reminderId],
        () => {
          db.get(
            'SELECT * FROM reminders WHERE id = ?',
            [reminderId],
            (err, updatedRow) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json(updatedRow);
            }
          );
        }
      );
    }
  );
});

module.exports = router;