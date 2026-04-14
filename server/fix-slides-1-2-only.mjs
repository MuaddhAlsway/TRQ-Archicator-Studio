import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Setting Only Slide 1 and 2 to Video.mp4...\n');

  // Set Slide 1 and 2 to Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 1`).run('/Video.mp4');
  console.log('✓ Slide 1: /Video.mp4');

  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 2`).run('/Video.mp4');
  console.log('✓ Slide 2: /Video.mp4');

  // Clear videos for Slide 3, 4, 5
  db.prepare(`UPDATE hero_slides SET video = NULL WHERE id IN (3, 4, 5)`).run();
  console.log('✓ Slide 3: null (images only)');
  console.log('✓ Slide 4: null (images only)');
  console.log('✓ Slide 5: null (images only)');

  console.log('\n✅ Fixed!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides ORDER BY sortOrder').all();
  console.log('Final Configuration:');
  slides.forEach(s => {
    const videoInfo = s.video ? s.video : 'null (images only)';
    console.log(`  Slide ${s.id} (${s.tag}): ${videoInfo}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
