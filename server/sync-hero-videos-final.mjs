import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  console.log('Syncing Hero Slides to Turso Cloud Database...\n');

  // Get all slides from local database
  const slides = db.prepare('SELECT * FROM hero_slides ORDER BY sortOrder').all();

  console.log(`Found ${slides.length} slides to sync\n`);

  // Sync each slide via API
  for (const slide of slides) {
    try {
      const response = await fetch('http://localhost:4242/api/slides/' + slide.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.ADMIN_TOKEN || 'test-token')
        },
        body: JSON.stringify({
          tag: slide.tag,
          tag_ar: slide.tag_ar,
          title: slide.title,
          title_ar: slide.title_ar,
          description: slide.description,
          description_ar: slide.description_ar,
          image: slide.image,
          image_2: slide.image_2,
          image_3: slide.image_3,
          video: slide.video,
          video_2: slide.video_2,
          video_3: slide.video_3,
          video_text: slide.video_text,
          video_2_text: slide.video_2_text,
          video_3_text: slide.video_3_text,
          video_ar: slide.video_ar,
          video_2_ar: slide.video_2_ar,
          video_3_ar: slide.video_3_ar,
          video_text_ar: slide.video_text_ar,
          video_2_text_ar: slide.video_2_text_ar,
          video_3_text_ar: slide.video_3_text_ar,
          buttonPrimaryText: slide.buttonPrimaryText,
          buttonPrimaryText_ar: slide.buttonPrimaryText_ar,
          buttonPrimaryLink: slide.buttonPrimaryLink,
          buttonSecondaryText: slide.buttonSecondaryText,
          buttonSecondaryText_ar: slide.buttonSecondaryText_ar,
          buttonSecondaryLink: slide.buttonSecondaryLink,
          sortOrder: slide.sortOrder,
          isActive: slide.isActive
        })
      });

      if (response.ok) {
        const videoCount = [slide.video, slide.video_2, slide.video_3].filter(v => v).length;
        const type = videoCount > 0 ? `VIDEO (${videoCount})` : 'IMAGE';
        console.log(`✓ Slide ${slide.id}: ${type} - Synced`);
      } else {
        console.error(`✗ Slide ${slide.id}: Failed - ${response.status}`);
      }
    } catch (error) {
      console.error(`✗ Slide ${slide.id}: Error - ${error.message}`);
    }
  }

  console.log('\n✅ Sync Complete!');

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} finally {
  db.close();
}
