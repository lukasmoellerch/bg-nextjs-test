import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/lib/schema';

// Initialize a SQLite database file in the project root directory.
// The file will automatically be created if it does not exist.
const sqlite = new Database('sqlite.db');

// Create the columns table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    position INTEGER NOT NULL
  );
`);

// Create the todos table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    column_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (column_id) REFERENCES columns (id)
  );
`);

// Insert default columns if they don't exist
const columnCount = sqlite.prepare('SELECT COUNT(*) as count FROM columns').get() as { count: number };

if (columnCount.count === 0) {
  sqlite.exec(`
    INSERT INTO columns (title, position) VALUES 
    ('To Do', 0),
    ('In Progress', 1),
    ('Done', 2);
  `);
}

export const db = drizzle(sqlite, { schema });