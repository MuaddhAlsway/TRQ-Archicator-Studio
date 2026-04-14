import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'server', 'trq.db'));

try {
  const slides = db.prepare('SELECT id, tag, video, video_2, video_3 FROM hero_slides ORDER BY sortOrder').all();
  console.log('Current Hero Slides Video Configuration:\n');
  slides.forEach((slide, idx) => {
    console.log(`Slide ${idx + 1} (ID: ${slide.id}):`);
    console.log(`  Tag: ${slide.tag}`);
    console.log(`  Video 1: ${slide.video || 'null'}`);
    console.log(`  Video 2: ${slide.video_2 || 'null'}`);
    console.log(`  Video 3: ${slide.video_3 || 'null'}`);
    console.log('');
  });
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
