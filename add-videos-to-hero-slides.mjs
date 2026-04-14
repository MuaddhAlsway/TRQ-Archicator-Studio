import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'server', 'trq.db');

console.log('Database path:', dbPath);
const db = new Database(dbPath);

// Video URLs - using the Video.mp4 from public folder
const VIDEO_URL = '/Video.mp4';

// Video texts for each video
const videoTexts = {
  1: 'Project Showcase',
  2: 'Design Process',
  3: 'Final Result'
};

const videoTexts_ar = {
  1: 'عرض المشروع',
  2: 'عملية التصميم',
  3: 'النتيجة النهائية'
};

try {
  console.log('🎬 Adding videos to hero slides...\n');

  // Get all slides
  const slides = db.prepare('SELECT id, title FROM hero_slides ORDER BY id').all();
  
  if (slides.length === 0) {
    console.log('❌ No slides found in database');
    process.exit(1);
  }

  console.log(`Found ${slides.length} slides\n`);

  // Update each slide with 3 videos
  slides.forEach((slide, index) => {
    console.log(`📝 Updating Slide ${index + 1}: "${slide.title}"`);
    
    const updateStmt = db.prepare(`
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
      VIDEO_URL,           // video
      VIDEO_URL,           // video_2
      VIDEO_URL,           // video_3
      videoTexts[1],       // video_text
      videoTexts[2],       // video_2_text
      videoTexts[3],       // video_3_text
      slide.id
    );

    console.log(`   ✅ Added 3 videos (English)`);
    console.log(`      Video 1: ${VIDEO_URL} - "${videoTexts[1]}"`);
    console.log(`      Video 2: ${VIDEO_URL} - "${videoTexts[2]}"`);
    console.log(`      Video 3: ${VIDEO_URL} - "${videoTexts[3]}"\n`);
  });

  console.log('✅ All slides updated with videos!\n');
  console.log('📊 Summary:');
  console.log(`   • Slides updated: ${slides.length}`);
  console.log(`   • Videos per slide: 3`);
  console.log(`   • Total videos added: ${slides.length * 3}`);
  console.log(`   • Video URL: ${VIDEO_URL}`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
