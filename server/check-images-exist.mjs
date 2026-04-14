import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

const rows = db.prepare('SELECT id, title, image FROM projects ORDER BY id').all();

let ok = 0, broken = 0;
rows.forEach(r => {
  if (!r.image) {
    console.log(`BROKEN | id=${r.id} | image=NULL | ${r.title.substring(0,30)}`);
    broken++;
    return;
  }
  const fullPath = path.join(publicDir, r.image);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    console.log(`OK     | id=${r.id} | ${r.image}`);
    ok++;
  } else {
    console.log(`BROKEN | id=${r.id} | ${r.image} | ${r.title.substring(0,30)}`);
    broken++;
  }
});

console.log(`\nSummary: ${ok} OK, ${broken} BROKEN out of ${rows.length} projects`);
process.exit(0);
