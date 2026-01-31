import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix project 30 - ARYASH AL-DIRIYAH
const projectPath30 = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS/ARYASH AL-DRIIYAH');
const files30 = fs.readdirSync(projectPath30)
  .filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
  .map(f => '/TRQ STUDIO _ PROJECTS/ARYASH AL-DRIIYAH/' + f);

if (files30.length > 0) {
  db.prepare('UPDATE projects SET image = ?, gallery = ? WHERE id = 30')
    .run(files30[0], JSON.stringify(files30));
  console.log(`✓ Project 30 (ARYASH AL-DIRIYAH): Fixed with ${files30.length} images`);
}

// Project 41 already has an image from Unsplash, so it's fine
console.log('✓ Project 41 (QUALITY OF LIFE PROGRAM): Using external image (OK)');

console.log('\nAll remaining projects fixed!');
