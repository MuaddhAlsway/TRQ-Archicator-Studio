import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Get all published projects
const projects = db.prepare('SELECT id, title, category FROM projects WHERE published = 1 ORDER BY id').all();

console.log('Checking projects for missing categories...\n');

const missing = projects.filter(p => !p.category);
console.log(`Found ${missing.length} projects missing categories out of ${projects.length} total\n`);

if (missing.length > 0) {
  console.log('Projects missing categories:');
  missing.forEach(p => {
    console.log(`  ID: ${p.id}, Title: ${p.title}`);
  });

  // Assign default category "interior-design" to all missing
  console.log('\nAssigning "interior-design" category to all missing projects...');
  
  const stmt = db.prepare('UPDATE projects SET category = ? WHERE id = ?');
  
  missing.forEach(p => {
    stmt.run('interior-design', p.id);
    console.log(`  ✓ Updated ID ${p.id}`);
  });

  console.log('\n✓ All projects now have categories assigned!');
} else {
  console.log('✓ All projects already have categories assigned!');
}

// Show final status
console.log('\nFinal status:');
const updated = db.prepare('SELECT id, title, category FROM projects WHERE published = 1 ORDER BY id').all();
updated.forEach(p => {
  console.log(`  ID: ${p.id}, Category: ${p.category}`);
});

db.close();
