import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Get schema
const schema = db.prepare("PRAGMA table_info(projects)").all();
console.log('Projects table schema:');
schema.forEach(col => {
  console.log(`  ${col.name}: ${col.type}`);
});

// Get all projects
const projects = db.prepare('SELECT id, title, category FROM projects ORDER BY id').all();

console.log('\nAll projects:');
projects.forEach(p => {
  console.log(`  ID: ${p.id}, Title: ${p.title}, Category: ${p.category || 'MISSING'}`);
});

db.close();
