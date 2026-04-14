import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Checking project 21...\n');

const project21 = db.prepare('SELECT * FROM projects WHERE id = ?').get(21);

if (project21) {
  console.log('✓ Project 21 found:');
  console.log('  ID:', project21.id);
  console.log('  Title:', project21.title);
  console.log('  Status:', project21.status);
  console.log('  Category:', project21.category);
  console.log('  Image:', project21.image);
} else {
  console.log('✗ Project 21 NOT found in database');
}

console.log('\n--- All Projects Summary ---');
const allProjects = db.prepare('SELECT id, title, status FROM projects ORDER BY id').all();
console.log(`Total projects: ${allProjects.length}\n`);

allProjects.forEach(p => {
  const status = p.status === 'published' ? '✓' : '✗';
  console.log(`${status} ID: ${p.id.toString().padEnd(3)} | ${p.title.padEnd(40)} | Status: ${p.status}`);
});

process.exit(0);
