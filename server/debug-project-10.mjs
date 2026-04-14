import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');
const publicPath = join(__dirname, '../public');

const db = new Database(dbPath);

console.log('Debugging Project 10...\n');

const project = db.prepare('SELECT * FROM projects WHERE id = 10').get();

if (!project) {
  console.log('✗ Project 10 NOT FOUND');
  process.exit(1);
}

console.log('Project 10 Details:');
console.log('  ID:', project.id);
console.log('  Title:', project.title);
console.log('  Status:', project.status);
console.log('  Category:', project.category);
console.log('  SortOrder:', project.sortOrder);
console.log('  Image:', project.image);
console.log('  Year:', project.year);
console.log('  Location:', project.location);
console.log('  Client:', project.client);

// Check if image exists
if (project.image) {
  const imagePath = project.image.startsWith('/') ? project.image.substring(1) : project.image;
  const fullPath = join(publicPath, imagePath);
  const exists = fs.existsSync(fullPath);
  console.log(`  Image exists: ${exists ? '✓' : '✗'} (${fullPath})`);
}

// Check gallery
if (project.gallery) {
  console.log('  Gallery:');
  try {
    const gallery = JSON.parse(project.gallery);
    gallery.forEach((img, idx) => {
      const imagePath = img.startsWith('/') ? img.substring(1) : img;
      const fullPath = join(publicPath, imagePath);
      const exists = fs.existsSync(fullPath);
      console.log(`    ${idx + 1}. ${img} ${exists ? '✓' : '✗'}`);
    });
  } catch (e) {
    console.log('    Error parsing gallery:', e.message);
  }
}

console.log('\n--- API Response Test ---');
const allProjects = db.prepare("SELECT id, title, status FROM projects WHERE status = 'published' ORDER BY sortOrder ASC").all();
const project10InList = allProjects.find(p => p.id === 10);
console.log(`Project 10 in published list: ${project10InList ? '✓ YES' : '✗ NO'}`);
console.log(`Total published projects: ${allProjects.length}`);

process.exit(0);
