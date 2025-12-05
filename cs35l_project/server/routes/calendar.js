const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

// Debug: Log when router is loaded
console.log('Calendar routes module loaded');

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

// DELETE a reminder (matches notes pattern exactly)
router.delete("/:id", requireAuth, (req, res) => {
  console.log('DELETE ROUTE HIT!', req.method, req.path, req.params);
  const userId = req.user.userId;
  const { id } = req.params;
  const query = 'DELETE FROM reminders WHERE id = ? AND user_id = ?';
  
  console.log(`DELETE request: id=${id} (type: ${typeof id}), userId=${userId} (type: ${typeof userId})`);
  
  db.run(query, [id, userId], function(err) {
    if (err) {
      console.error('Delete error:', err);
      res.status(500).send(err.message);
      return;
    }
    
    console.log(`✓ Delete executed. Rows affected: ${this.changes}`);
    
    if (this.changes === 0) {
      console.log(`No reminder found with id=${id} for user_id=${userId}`);
      res.status(404).send('Reminder not found');
      return;
    }
    
    res.status(204).send();
    console.log(`Reminder with id ${id} deleted successfully`);
  });
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