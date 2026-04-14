import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides WHERE video IS NOT NULL ORDER BY sortOrder').all();
  console.log('✅ Hero Slider Videos Configuration:\n');
  slides.forEach(s => {
    console.log(`  Slide ${s.id} (${s.tag}): ${s.video}`);
  });
} finally {
  db.close();
}
