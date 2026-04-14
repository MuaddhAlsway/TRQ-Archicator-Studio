import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Verifying and Fixing Hero Slide Video Paths...\n');

  // Check what videos exist in public folder
  const publicDir = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicDir);
  const videoFiles = files.filter(f => f.endsWith('.mp4'));
  
  console.log('Videos found in public folder:');
  videoFiles.forEach(f => console.log(`  - ${f}`));
  console.log('');

  // Get current paths in database
  const slides = db.prepare('SELECT id, tag, video, video_2 FROM hero_slides ORDER BY sortOrder').all();
  
  console.log('Current paths in database:');
  slides.forEach((slide, idx) => {
    console.log(`  Slide ${idx + 1}:`);
    console.log(`    - video: ${slide.video || 'null'}`);
    console.log(`    - video_2: ${slide.video_2 || 'null'}`);
  });
  console.log('');

  // Update paths to match actual files
  console.log('Updating paths to match public folder...\n');

  // Slide 1: POV 1.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 1`).run('/POV 1.mp4');
  console.log('✓ Slide 1: video = /POV 1.mp4');

  // Slide 2: Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 2`).run('/Video.mp4');
  console.log('✓ Slide 2: video = /Video.mp4');

  // Clear video_2 for all slides
  db.prepare(`UPDATE hero_slides SET video_2 = NULL`).run();
  console.log('✓ Cleared video_2 for all slides');

  console.log('\n✅ Paths Updated!\n');

  // Verify final state
  const updatedSlides = db.prepare('SELECT id, tag, video, video_2 FROM hero_slides ORDER BY sortOrder').all();
  console.log('Final paths in database:');
  updatedSlides.forEach((slide, idx) => {
    console.log(`  Slide ${idx + 1}:`);
    console.log(`    - video: ${slide.video || 'null'}`);
    console.log(`    - video_2: ${slide.video_2 || 'null'}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
