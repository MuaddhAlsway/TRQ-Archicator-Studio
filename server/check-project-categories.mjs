import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Checking project categories...\n');

const projects = db.prepare('SELECT id, title, category FROM projects ORDER BY id').all();

console.log('Projects with categories:');
projects.forEach(p => {
  const status = p.category ? '✓' : '✗';
  console.log(`${status} ID: ${p.id}, Title: ${p.title}, Category: ${p.category || 'MISSING'}`);
});

// Count by category
console.log('\nCategory Summary:');
const categories = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM projects 
  GROUP BY category 
  ORDER BY category
`).all();

categories.forEach(cat => {
  console.log(`  ${cat.category || 'NULL'}: ${cat.count} projects`);
});

process.exit(0);
