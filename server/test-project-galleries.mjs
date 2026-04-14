/**
 * Test: verify gallery images for all projects
 */
import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try { return new URL(imagePath).pathname; } catch { return imagePath; }
  }
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

const rows = db.prepare('SELECT id, title, gallery FROM projects ORDER BY id').all();

let totalImages = 0, okImages = 0, brokenImages = 0;
const broken = [];

for (const r of rows) {
  if (!r.gallery) continue;
  let gallery = [];
  try { gallery = JSON.parse(r.gallery); } catch { continue; }
  if (!Array.isArray(gallery) || gallery.length === 0) continue;

  for (const imgPath of gallery) {
    totalImages++;
    const resolved = getImageUrl(imgPath);
    const fullPath = path.join(publicDir, resolved);
    const exists = resolved ? fs.existsSync(fullPath) : false;
    if (exists) okImages++;
    else {
      brokenImages++;
      broken.push({ projectId: r.id, title: r.title, path: resolved });
    }
  }
}

console.log('\n=== GALLERY IMAGE TEST RESULTS ===\n');
if (broken.length > 0) {
  broken.forEach(b => console.log(`❌ BROKEN | id=${b.projectId} | ${b.path} | ${b.title.substring(0,25)}`));
} else {
  console.log('✅ All gallery images resolve correctly.');
}

console.log(`\nTotal gallery images: ${totalImages} | OK: ${okImages} | Broken: ${brokenImages}`);
process.exit(brokenImages > 0 ? 1 : 0);
