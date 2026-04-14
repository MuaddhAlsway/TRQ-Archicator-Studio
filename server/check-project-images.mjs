import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');
const publicPath = join(__dirname, '../public');

const db = new Database(dbPath);

console.log('Checking project images...\n');

const projects = db.prepare('SELECT id, title, image FROM projects ORDER BY id').all();

let missingCount = 0;
let validCount = 0;

projects.forEach(p => {
  if (!p.image) {
    console.log(`✗ ID ${p.id}: NO IMAGE PATH - ${p.title}`);
    missingCount++;
    return;
  }
  
  // Remove leading slash for file path check
  const imagePath = p.image.startsWith('/') ? p.image.substring(1) : p.image;
  const fullPath = join(publicPath, imagePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ID ${p.id}: ${p.image}`);
    validCount++;
  } else {
    console.log(`✗ ID ${p.id}: IMAGE NOT FOUND - ${p.image}`);
    missingCount++;
  }
});

console.log(`\n--- Summary ---`);
console.log(`Valid images: ${validCount}`);
console.log(`Missing images: ${missingCount}`);
console.log(`Total projects: ${projects.length}`);

process.exit(0);
