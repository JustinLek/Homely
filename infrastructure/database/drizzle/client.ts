import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

/**
 * Database path
 */
const dbPath = path.join(process.cwd(), 'data', 'transactions.db');

/**
 * SQLite database instance
 */
const sqlite = new Database(dbPath);

/**
 * Enable WAL mode for better concurrency
 */
sqlite.pragma('journal_mode = WAL');

/**
 * Drizzle ORM instance
 */
export const db = drizzle(sqlite, { schema });

/**
 * Get raw SQLite instance (for migrations or special operations)
 */
export function getRawDb() {
  return sqlite;
}

/**
 * Close database connection
 */
export function closeDb() {
  sqlite.close();
}
