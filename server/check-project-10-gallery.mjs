import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

const project = db.prepare('SELECT id, title, gallery FROM projects WHERE id = 10').get();

console.log('Project 10 Gallery Field:');
console.log('Raw value:', project.gallery);
console.log('Type:', typeof project.gallery);
console.log('Length:', project.gallery ? project.gallery.length : 'null');

// Try to parse
try {
  const parsed = JSON.parse(project.gallery);
  console.log('Parsed:', parsed);
  console.log('Is array:', Array.isArray(parsed));
} catch (e) {
  console.log('Parse error:', e.message);
}

// Check all projects for gallery issues
console.log('\n--- Checking all projects gallery fields ---');
const allProjects = db.prepare('SELECT id, title, gallery FROM projects').all();

let validGalleries = 0;
let nullGalleries = 0;
let invalidGalleries = 0;

allProjects.forEach(p => {
  if (!p.gallery) {
    nullGalleries++;
  } else {
    try {
      const parsed = JSON.parse(p.gallery);
      if (Array.isArray(parsed)) {
        validGalleries++;
      } else {
        invalidGalleries++;
        console.log(`✗ ID ${p.id}: Gallery is not an array`);
      }
    } catch (e) {
      invalidGalleries++;
      console.log(`✗ ID ${p.id}: ${e.message}`);
    }
  }
});

console.log(`\nValid galleries: ${validGalleries}`);
console.log(`Null galleries: ${nullGalleries}`);
console.log(`Invalid galleries: ${invalidGalleries}`);

process.exit(0);
