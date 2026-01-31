import 'dotenv/config';
import { createClient } from '@libsql/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load .env from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env') });

// Validate environment variables
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('Missing Turso credentials in .env file');
  console.error('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Missing');
  console.error('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'Set' : 'Missing');
  process.exit(1);
}

// Create Turso client
const tursoDb = createClient({
  url: process.env.TURSO_DATABASE_URL.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN.trim(),
});

// Wrapper to make Turso API similar to better-sqlite3
export const db = {
  // Execute a query and return all rows
  all: async (sql, params = []) => {
    try {
      const result = await tursoDb.execute({
        sql,
        args: params,
      });
      return result.rows || [];
    } catch (error) {
      console.error('Database error (all):', error);
      throw error;
    }
  },

  // Execute a query and return first row
  get: async (sql, params = []) => {
    try {
      const result = await tursoDb.execute({
        sql,
        args: params,
      });
      return result.rows?.[0] || null;
    } catch (error) {
      console.error('Database error (get):', error);
      throw error;
    }
  },

  // Execute an insert/update/delete and return result
  run: async (sql, params = []) => {
    try {
      const result = await tursoDb.execute({
        sql,
        args: params,
      });
      return {
        lastInsertRowid: result.lastInsertRowid,
        changes: result.rowsAffected,
      };
    } catch (error) {
      console.error('Database error (run):', error);
      throw error;
    }
  },

  // Execute multiple statements
  exec: async (sql) => {
    try {
      await tursoDb.executeMultiple(sql);
    } catch (error) {
      console.error('Database error (exec):', error);
      throw error;
    }
  },
};

export default db;
