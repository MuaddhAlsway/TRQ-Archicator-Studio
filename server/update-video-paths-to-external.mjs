import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Updating Hero Slide Video Paths to External URLs...\n');

  // Update to use external CDN or storage URLs
  // Using a placeholder domain - update these with actual CDN URLs
  
  // Slide 1: POV 1.mp4
  const pov1Url = 'https://cdn.example.com/videos/POV-1.mp4';
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 1`).run(pov1Url);
  console.log(`✓ Slide 1: ${pov1Url}`);

  // Slide 2: Video.mp4
  const videoUrl = 'https://cdn.example.com/videos/Video.mp4';
  db.prepare(`UPDATE hero_slides SET video = ? WHERE id = 2`).run(videoUrl);
  console.log(`✓ Slide 2: ${videoUrl}`);

  console.log('\n✅ Paths Updated to External URLs!\n');

  // Verify
  const slides = db.prepare('SELECT id, tag, video FROM hero_slides WHERE video IS NOT NULL ORDER BY sortOrder').all();
  console.log('Updated Video Paths:');
  slides.forEach((slide, idx) => {
    console.log(`  Slide ${slide.id}: ${slide.video}`);
  });

  console.log('\n📝 NOTE: Replace the CDN URLs with actual video hosting URLs:');
  console.log('  - Cloudflare Stream');
  console.log('  - AWS S3');
  console.log('  - Google Cloud Storage');
  console.log('  - Bunny CDN');
  console.log('  - Or any other video hosting service');

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
