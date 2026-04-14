import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

db.prepare('UPDATE projects SET sortOrder = ? WHERE id = ?').run(22, 22);
console.log('✓ Project 22 (Contemporary & Luxury) -> sortOrder: 22');
process.exit(0);
