import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Checking projects table schema...\n');

// Check table schema
const tableInfo = db.prepare('PRAGMA table_info(projects)').all();
console.log('Projects table columns:');
tableInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Check if sortOrder column exists
const hasSortOrder = tableInfo.some(col => col.name === 'sortOrder');

if (!hasSortOrder) {
  console.log('\n⚠ sortOrder column NOT found - adding it now...');
  try {
    db.exec('ALTER TABLE projects ADD COLUMN sortOrder INTEGER DEFAULT 0');
    console.log('✓ sortOrder column added');
  } catch (e) {
    console.log('Error adding column:', e.message);
  }
} else {
  console.log('\n✓ sortOrder column exists');
}

// Show current projects with sortOrder
console.log('\nProjects with sortOrder:');
const projects = db.prepare('SELECT id, title, sortOrder FROM projects ORDER BY sortOrder, id').all();
projects.forEach(p => {
  console.log(`  ID: ${p.id}, Title: ${p.title}, SortOrder: ${p.sortOrder}`);
});

process.exit(0);
