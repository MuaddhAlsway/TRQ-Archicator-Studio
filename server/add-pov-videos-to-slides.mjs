import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

const localDb = new Database(dbPath);

// Video URLs - using POV 1.mp4 from public folder
const POV_VIDEO_URL = '/POV 1.mp4';
const REGULAR_VIDEO_URL = '/Video.mp4';

try {
  console.log('🎬 Adding POV videos to hero slides...\n');

  // Get all slides
  const slides = localDb.prepare('SELECT id, title FROM hero_slides ORDER BY id').all();
  
  if (slides.length === 0) {
    console.log('❌ No slides found in database');
    process.exit(1);
  }

  console.log(`Found ${slides.length} slides\n`);

  // Update each slide with POV videos
  slides.forEach((slide, index) => {
    console.log(`📝 Updating Slide ${index + 1}: "${slide.title}"`);
    
    const updateStmt = localDb.prepare(`
      UPDATE hero_slides 
      SET 
        video = ?,
        video_2 = ?,
        video_3 = ?,
        video_text = ?,
        video_2_text = ?,
        video_3_text = ?
      WHERE id = ?
    `);

    updateStmt.run(
      POV_VIDEO_URL,           // video - POV 1
      POV_VIDEO_URL,           // video_2 - POV 1 (second instance)
      REGULAR_VIDEO_URL,       // video_3 - Regular Video.mp4
      'POV Perspective 1',      // video_text
      'POV Perspective 2',      // video_2_text
      'Final Result',           // video_3_text
      slide.id
    );

    console.log(`   ✅ Updated with POV videos`);
    console.log(`      Video 1: ${POV_VIDEO_URL} - "POV Perspective 1"`);
    console.log(`      Video 2: ${POV_VIDEO_URL} - "POV Perspective 2"`);
    console.log(`      Video 3: ${REGULAR_VIDEO_URL} - "Final Result"\n`);
  });

  console.log('✅ All slides updated with POV videos locally!\n');
  console.log('📊 Summary:');
  console.log(`   • Slides updated: ${slides.length}`);
  console.log(`   • Videos per slide: 3`);
  console.log(`   • POV videos: 2 per slide`);
  console.log(`   • Regular videos: 1 per slide`);
  console.log(`   • Total videos added: ${slides.length * 3}`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  localDb.close();
}
