/**
 * Test: verify every project's main image resolves correctly
 * through the same logic getImageUrl() uses on the frontend.
 */
import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Mirror of frontend getImageUrl()
function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try { return new URL(imagePath).pathname; } catch { return imagePath; }
  }
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

const rows = db.prepare('SELECT id, title, image FROM projects ORDER BY id').all();

let ok = 0, broken = 0;
const results = [];

for (const r of rows) {
  const resolved = getImageUrl(r.image);
  const fullPath = path.join(publicDir, resolved);
  const exists = resolved ? fs.existsSync(fullPath) : false;

  results.push({ id: r.id, title: r.title, raw: r.image, resolved, exists });

  if (exists) ok++;
  else broken++;
}

console.log('\n=== PROJECT IMAGE TEST RESULTS ===\n');
results.forEach(r => {
  const status = r.exists ? '✅ OK    ' : '❌ BROKEN';
  console.log(`${status} | id=${String(r.id).padStart(2)} | ${r.resolved || 'NULL'}`);
  if (!r.exists) console.log(`         └─ title: ${r.title}`);
});

console.log(`\n${'─'.repeat(50)}`);
console.log(`Total: ${rows.length} | ✅ OK: ${ok} | ❌ Broken: ${broken}`);

if (broken > 0) {
  console.log('\n⚠ Some images are missing from /public. Check paths above.');
  process.exit(1);
} else {
  console.log('\n✓ All project images resolve correctly.');
  process.exit(0);
}
