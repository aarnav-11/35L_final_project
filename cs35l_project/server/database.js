
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'notes.db');

// Create/connect to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database - create table if it doesn't exist
function initializeDatabase() {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            favProf TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `
    const createRefreshTokenTableQuery = `
        CREATE TABLE IF NOT EXISTS refreshtokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) on DELETE CASCADE
        )
    `
    const createNotesTableQuery = `
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            tags TEXT DEFAULT '[]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) on DELETE CASCADE
        )
    `;
    const createRemindersTableQuery = `
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            text TEXT NOT NULL,
            done INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) on DELETE CASCADE
        )
    `;

    db.run(createUsersTableQuery, (err) => {
        if (err) {
            console.error("table didnt make", err.message);
        } else {
            console.log('users table ready');
        }
    });

    db.run(createRefreshTokenTableQuery, (err) => {
        if (err) {
            console.error("table didnt make", err.message);
        } else {
            console.log('refresh tokens table ready');
        }
    });

    db.run(createNotesTableQuery, (err) => {
        if (err) {
            console.error("table didnt make", err.message);
        } else {
            console.log('notes table ready');
        }
    });

    db.run(createRemindersTableQuery, (err) => {
        if (err) {
            console.error("table didnt make", err.message);
        } else {
            console.log('reminders table ready');
        }
    });
}

// Export database connection
module.exports = db;