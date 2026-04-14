import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Updating Hero Slide Video Paths...\n');

  // Update paths to use CDN or external URLs instead of local files
  // For now, we'll use placeholder paths that can be updated later
  
  // Slide 1: POV 1.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 1`).run('https://trq-studio.pages.dev/videos/POV-1.mp4');
  console.log('✓ Slide 1: Updated to CDN path');

  // Slide 2: Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 2`).run('https://trq-studio.pages.dev/videos/Video.mp4');
  console.log('✓ Slide 2: Updated to CDN path');

  console.log('\n✅ Hero Slide Paths Updated!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides ORDER BY sortOrder').all();
  console.log('Updated Paths:');
  slides.forEach((slide, idx) => {
    console.log(`  Slide ${idx + 1}: ${slide.video || 'null'}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
