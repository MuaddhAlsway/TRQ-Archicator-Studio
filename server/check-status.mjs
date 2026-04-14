import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Get all projects with status
const projects = db.prepare('SELECT id, title, status, category FROM projects ORDER BY id').all();

console.log('All projects with status:');
projects.forEach(p => {
  console.log(`  ID: ${p.id}, Title: ${p.title}, Status: ${p.status || 'NULL'}, Category: ${p.category}`);
});

// Count by status
const statusCounts = db.prepare("SELECT status, COUNT(*) as count FROM projects GROUP BY status").all();
console.log('\nStatus distribution:');
statusCounts.forEach(s => {
  console.log(`  ${s.status || 'NULL'}: ${s.count}`);
});

db.close();
