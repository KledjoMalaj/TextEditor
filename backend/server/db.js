import sqlite3 from "sqlite3"

const db = new sqlite3.Database('./textEditor.db')

db.run(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT UNIQUE NOT NULL ,
     password TEXT NOT NULL ,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
)

db.run(`ALTER TABLE documents ADD COLUMN user_id INTEGER`, (err)=>{
    if(err && !err.message.includes('duplicate column')) {
        console.error('Error adding user_id column:', err);
    }
})

export default db