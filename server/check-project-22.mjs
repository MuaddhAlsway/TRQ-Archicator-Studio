import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Checking project 22 - Contemporary & Luxury...\n');

const project22 = db.prepare('SELECT * FROM projects WHERE id = ?').get(22);

if (project22) {
  console.log('✓ Project 22 found:');
  console.log('  ID:', project22.id);
  console.log('  Title:', project22.title);
  console.log('  Status:', project22.status);
  console.log('  Category:', project22.category);
  console.log('  Subcategory:', project22.subcategory);
  console.log('  Cover Image:', project22.image);
  console.log('  Year:', project22.year);
  console.log('  Location:', project22.location);
  console.log('  Size:', project22.size);
  console.log('  Duration:', project22.duration);
  
  console.log('\n  Gallery Images:');
  try {
    const gallery = JSON.parse(project22.gallery);
    gallery.forEach((img, idx) => {
      console.log(`    ${idx + 1}. ${img}`);
    });
  } catch (e) {
    console.log('    Error parsing gallery:', e.message);
  }
  
  console.log('\n  Description:', project22.description);
  console.log('\n  Detailed Description:', project22.detailedDescription);
} else {
  console.log('✗ Project 22 NOT found');
}

process.exit(0);
