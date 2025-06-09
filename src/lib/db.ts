import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/lib/schema';

// Initialize a SQLite database file in the project root directory.
// The file will automatically be created if it does not exist.
const sqlite = new Database('sqlite.db');

// Handle migration from todos to issues table
try {
  // Check if todos table exists and migrate data if needed
  const tablesResult = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='todos'").get();
  
  if (tablesResult) {
    // Migrate existing todos to issues format
    const todos = sqlite.prepare("SELECT * FROM todos").all() as Array<{ id: number; text: string; completed: number }>;
    
    // Drop todos table
    sqlite.exec("DROP TABLE IF EXISTS todos");
    
    // Create issues table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'open',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    
    // Migrate todos data to issues
    if (todos.length > 0) {
      const now = Date.now();
      const insertStmt = sqlite.prepare(`
        INSERT INTO issues (title, description, status, priority, created_at, updated_at)
        VALUES (?, '', ?, 'medium', ?, ?)
      `);
      
      for (const todo of todos) {
        const status = todo.completed ? 'closed' : 'open';
        insertStmt.run(todo.text, status, now, now);
      }
    }
  } else {
    // Create issues table if no migration needed
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'open',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
  }
} catch (error) {
  console.error('Database migration error:', error);
  // Fallback: ensure issues table exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}

export const db = drizzle(sqlite, { schema });