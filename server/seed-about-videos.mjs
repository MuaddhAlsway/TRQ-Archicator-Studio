import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Seeding About Videos...');

  // Check if videos already exist
  const existing = db.prepare('SELECT COUNT(*) as count FROM about_videos').get();
  
  if (existing.count > 0) {
    console.log(`About videos already exist (${existing.count} videos). Skipping seed.`);
    process.exit(0);
  }

  // Insert default video
  const result = db.prepare(`
    INSERT INTO about_videos (
      title, 
      description, 
      video_url, 
      image, 
      sortOrder, 
      isActive,
      title_ar,
      description_ar,
      video_url_ar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'About TRQ Studio',
    'We are a luxury interior design studio dedicated to creating timeless, sophisticated spaces that reflect our clients\' refined taste and elevated lifestyle.',
    '/Video.mp4',
    null,
    1,
    1,
    'عن استوديو TRQ',
    'نحن استوديو تصميم داخلي فاخر مكرس لإنشاء مساحات خالدة وراقية تعكس ذوق عملائنا المتطور ونمط حياتهم الرفيع.',
    '/POV 1.mp4'
  );

  console.log('✅ Default About video created successfully!');
  console.log(`Video ID: ${result.lastInsertRowid}`);
  
  // Verify
  const videos = db.prepare('SELECT * FROM about_videos').all();
  console.log(`Total videos in database: ${videos.length}`);
  console.log('Videos:', JSON.stringify(videos, null, 2));

} catch (error) {
  console.error('❌ Error seeding about videos:', error);
  process.exit(1);
} finally {
  db.close();
}
