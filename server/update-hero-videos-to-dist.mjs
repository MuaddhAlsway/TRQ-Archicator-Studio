import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Updating Hero Slide Videos to Dist Folder Paths\n');
  console.log('Target Configuration:');
  console.log('  Slide 1: /Video.mp4 (from dist)');
  console.log('  Slide 2: /Video.mp4 (from dist)');
  console.log('  Slide 3-5: Images only (no videos)\n');

  // Slide 1: Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ?, video_2 = NULL, video_3 = NULL WHERE id = 1`).run('/Video.mp4');
  console.log('✓ Slide 1: video = /Video.mp4');

  // Slide 2: Video.mp4
  db.prepare(`UPDATE hero_slides SET video = ?, video_2 = NULL, video_3 = NULL WHERE id = 2`).run('/Video.mp4');
  console.log('✓ Slide 2: video = /Video.mp4');

  // Slide 3-5: Clear all videos
  db.prepare(`UPDATE hero_slides SET video = NULL, video_2 = NULL, video_3 = NULL WHERE id IN (3, 4, 5)`).run();
  console.log('✓ Slide 3: Images only');
  console.log('✓ Slide 4: Images only');
  console.log('✓ Slide 5: Images only');

  console.log('\n✅ Hero Slides Updated!\n');

  // Verify final state
  const slides = db.prepare('SELECT id, tag, video, video_2, video_3 FROM hero_slides ORDER BY sortOrder').all();
  console.log('Final Configuration:');
  slides.forEach((slide, idx) => {
    const videoCount = [slide.video, slide.video_2, slide.video_3].filter(v => v).length;
    const type = videoCount > 0 ? `VIDEO (${videoCount})` : 'IMAGE';
    console.log(`  Slide ${idx + 1}: ${type}`);
    if (slide.video) console.log(`    - ${slide.video}`);
    if (slide.video_2) console.log(`    - ${slide.video_2}`);
    if (slide.video_3) console.log(`    - ${slide.video_3}`);
  });

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
