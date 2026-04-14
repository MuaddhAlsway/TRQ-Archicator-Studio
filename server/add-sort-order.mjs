import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Adding sortOrder column to projects table...');

try {
  const tableInfo = db.prepare('PRAGMA table_info(projects)').all();
  const columnNames = tableInfo.map(col => col.name);
  
  if (!columnNames.includes('sortOrder')) {
    console.log('Adding sortOrder column...');
    db.exec('ALTER TABLE projects ADD COLUMN sortOrder INTEGER DEFAULT 0');
    console.log('✓ sortOrder column added');
  } else {
    console.log('✓ sortOrder column already exists');
  }
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
