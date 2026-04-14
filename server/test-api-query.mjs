import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Testing API query for published projects...\n');

const projects = db.prepare("SELECT id, title, status, category, sortOrder FROM projects WHERE status = 'published' ORDER BY sortOrder ASC, id ASC").all();

console.log(`Total published projects: ${projects.length}\n`);

projects.forEach(p => {
  console.log(`ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, SortOrder: ${p.sortOrder}`);
});

console.log('\n--- Checking for any draft projects ---');
const drafts = db.prepare("SELECT id, title, status FROM projects WHERE status != 'published'").all();
if (drafts.length > 0) {
  console.log(`Found ${drafts.length} draft projects:`);
  drafts.forEach(d => {
    console.log(`  ID: ${d.id}, Title: ${d.title}, Status: ${d.status}`);
  });
} else {
  console.log('No draft projects found - all are published');
}

process.exit(0);
