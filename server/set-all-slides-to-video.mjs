import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Setting All Hero Slides to Video.mp4...\n');

  // Set all slides to use Video.mp4
  for (let i = 1; i <= 5; i++) {
    db.prepare(`UPDATE hero_slides SET video = ? WHERE id = ?`).run('/Video.mp4', i);
    console.log(`✓ Slide ${i}: /Video.mp4`);
  }

  console.log('\n✅ All Slides Updated!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides ORDER BY sortOrder').all();
  console.log('Final Configuration:');
  slides.forEach(s => {
    console.log(`  Slide ${s.id} (${s.tag}): ${s.video || 'null'}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
