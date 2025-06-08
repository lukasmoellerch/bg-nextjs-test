import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/lib/schema';

// Initialize a SQLite database file in the project root directory.
// The file will automatically be created if it does not exist.
const sqlite = new Database('sqlite.db');

// Ensure the table exists (drizzle migrations are not set up in this quick demo)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  );
`);

export const db = drizzle(sqlite, { schema });