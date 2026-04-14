import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Fixing double-encoded gallery fields...\n');

const projects = db.prepare('SELECT id, title, gallery FROM projects').all();

let fixed = 0;
let errors = 0;

projects.forEach(p => {
  if (!p.gallery) return;
  
  try {
    // Try to parse once
    let parsed = JSON.parse(p.gallery);
    
    // If it's a string (double-encoded), parse again
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    
    // Now stringify it properly (single encoding)
    const fixed_gallery = JSON.stringify(parsed);
    
    // Update the database
    db.prepare('UPDATE projects SET gallery = ? WHERE id = ?').run(fixed_gallery, p.id);
    console.log(`✓ ID ${p.id}: Fixed gallery encoding`);
    fixed++;
  } catch (e) {
    console.log(`✗ ID ${p.id}: Error - ${e.message}`);
    errors++;
  }
});

console.log(`\n✓ Fixed: ${fixed}`);
console.log(`✗ Errors: ${errors}`);

// Verify
console.log('\n--- Verification ---');
const allProjects = db.prepare('SELECT id, gallery FROM projects').all();
let validCount = 0;

allProjects.forEach(p => {
  if (!p.gallery) return;
  try {
    const parsed = JSON.parse(p.gallery);
    if (Array.isArray(parsed)) {
      validCount++;
    }
  } catch (e) {
    console.log(`Still broken: ID ${p.id}`);
  }
});

console.log(`Valid galleries now: ${validCount}/${allProjects.length}`);

process.exit(0);
