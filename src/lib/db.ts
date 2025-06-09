import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/lib/schema';

// Get database connection string from environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/todoapp';

// Create postgres connection
const sql = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(sql, { schema });