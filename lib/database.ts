import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDatabase() {
  if (db) {
    return db;
  }

  db = new Database(path.join(process.cwd(), 'bloodbank.db'));

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      blood_group TEXT NOT NULL,
      area TEXT NOT NULL,
      city TEXT NOT NULL,
      is_donor BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_id INTEGER NOT NULL,
      donor_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (requester_id) REFERENCES users (id),
      FOREIGN KEY (donor_id) REFERENCES users (id)
    );
  `);

  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
} 