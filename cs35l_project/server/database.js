
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
    const createTableQuery = `
        //users table
        CREATE TABLE IF NOT EXISTS users (
            age INTEGER NOT NULL,
            name TEXT NOT NULL,
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        //refreshtokens table
        CREATE TABLE IF NOT EXISTS refreshtokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) on DELETE CASCADE
        )
        //notes table
        CREATE TABLE IF NOT EXISTS notes (
            user_id INTEGER NOT NULL,
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) on DELETE CASCADE
        )
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error("table didnt make", err.message);
        } else {
            console.log('table ready');
        }
    });
}

// Export database connection
module.exports = db;