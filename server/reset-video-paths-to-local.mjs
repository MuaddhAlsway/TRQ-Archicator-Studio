import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Resetting Hero Slide Video Paths to Local...\n');

  // Slide 1: POV 1.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 1`).run('/POV 1.mp4');
  console.log('✓ Slide 1: /POV 1.mp4');

  // Slide 2: Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 2`).run('/Video.mp4');
  console.log('✓ Slide 2: /Video.mp4');

  console.log('\n✅ Paths Reset to Local!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides WHERE video IS NOT NULL ORDER BY sortOrder').all();
  console.log('Current Video Paths:');
  slides.forEach((slide) => {
    console.log(`  Slide ${slide.id}: ${slide.video}`);
  });

  console.log('\n📝 NEXT STEPS:');
  console.log('1. Add POV 1.mp4 to public/ folder');
  console.log('2. Add Video.mp4 to public/ folder');
  console.log('3. Rebuild and deploy');

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
