import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Deleting duplicate project ID 78...');
db.prepare('DELETE FROM projects WHERE id = ?').run(78);
console.log('✓ Duplicate removed');
process.exit(0);
