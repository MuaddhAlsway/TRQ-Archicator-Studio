import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Fixing Hero Slide Videos Configuration...\n');

  // Slide 1: POV 1.mp4 + Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ?, video_2 = ? WHERE id = 1`).run('/POV 1.mp4', '/Video.mp4');
  console.log('✓ Slide 1: Set to POV 1.mp4 + Video.mp4');

  // Slide 2: Video.mp4 + POV 1.mp4
  db.prepare(`UPDATE hero_slides SET video = ?, video_2 = ? WHERE id = 2`).run('/Video.mp4', '/POV 1.mp4');
  console.log('✓ Slide 2: Set to Video.mp4 + POV 1.mp4');

  // Slide 3: Only images (no videos)
  db.prepare(`UPDATE hero_slides SET video = NULL, video_2 = NULL, video_3 = NULL WHERE id = 3`).run();
  console.log('✓ Slide 3: Set to images only (no videos)');

  // Slide 4: Only images (no videos)
  db.prepare(`UPDATE hero_slides SET video = NULL, video_2 = NULL, video_3 = NULL WHERE id = 4`).run();
  console.log('✓ Slide 4: Set to images only (no videos)');

  // Slide 5: Only images (no videos)
  db.prepare(`UPDATE hero_slides SET video = NULL, video_2 = NULL, video_3 = NULL WHERE id = 5`).run();
  console.log('✓ Slide 5: Set to images only (no videos)');

  console.log('\n✅ Hero Slide Videos Fixed!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video, video_2, video_3 FROM hero_slides ORDER BY sortOrder').all();
  console.log('Updated Configuration:');
  slides.forEach((slide, idx) => {
    const videos = [slide.video, slide.video_2, slide.video_3].filter(v => v && v !== 'null');
    const videoList = videos.length > 0 ? videos.join(' + ') : 'Images only';
    console.log(`  Slide ${idx + 1}: ${videoList}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
