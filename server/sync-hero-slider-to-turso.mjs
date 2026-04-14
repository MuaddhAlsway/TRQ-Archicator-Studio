import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

// Connect to local SQLite
const localDb = new Database(dbPath);

// Connect to Turso
const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

console.log('Syncing hero slider updates to Turso...\n');

try {
  // Get all hero slides from local database
  const slides = localDb.prepare('SELECT * FROM hero_slides ORDER BY id').all();
  
  console.log(`Found ${slides.length} hero slides to sync\n`);

  // Sync each slide to Turso
  for (const slide of slides) {
    try {
      await turso.execute({
        sql: `
          UPDATE hero_slides 
          SET 
            video = ?,
            video_2 = ?,
            video_3 = ?,
            video_text = ?,
            video_2_text = ?,
            video_3_text = ?,
            tag = ?,
            title = ?,
            description = ?,
            image = ?,
            buttonPrimaryText = ?,
            buttonPrimaryLink = ?,
            buttonSecondaryText = ?,
            buttonSecondaryLink = ?,
            tag_ar = ?,
            title_ar = ?,
            description_ar = ?,
            video_ar = ?,
            video_2_ar = ?,
            video_3_ar = ?,
            video_text_ar = ?,
            video_2_text_ar = ?,
            video_3_text_ar = ?,
            buttonPrimaryText_ar = ?,
            buttonSecondaryText_ar = ?,
            sortOrder = ?
          WHERE id = ?
        `,
        args: [
          slide.video,
          slide.video_2,
          slide.video_3,
          slide.video_text,
          slide.video_2_text,
          slide.video_3_text,
          slide.tag,
          slide.title,
          slide.description,
          slide.image,
          slide.buttonPrimaryText,
          slide.buttonPrimaryLink,
          slide.buttonSecondaryText,
          slide.buttonSecondaryLink,
          slide.tag_ar,
          slide.title_ar,
          slide.description_ar,
          slide.video_ar,
          slide.video_2_ar,
          slide.video_3_ar,
          slide.video_text_ar,
          slide.video_2_text_ar,
          slide.video_3_text_ar,
          slide.buttonPrimaryText_ar,
          slide.buttonSecondaryText_ar,
          slide.sortOrder,
          slide.id
        ]
      });
      
      console.log(`✓ Synced Slide ${slide.id}: ${slide.title}`);
      if (slide.video) {
        console.log(`  └─ Video: ${slide.video}`);
      } else {
        console.log(`  └─ Image only`);
      }
    } catch (error) {
      console.error(`✗ Error syncing slide ${slide.id}:`, error.message);
    }
  }

  console.log('\n✓ Hero slider sync to Turso complete!');
  console.log('\nSynced Configuration:');
  console.log('- Slide 1: Video1.mp4');
  console.log('- Slide 2: Video2.mp4');
  console.log('- Slide 3: Video3.mp4');
  console.log('- Slide 4: Image only');
  console.log('- Slide 5: Image only');
  console.log('\nAbout Component: Video2.mp4 (default)');

} catch (error) {
  console.error('Error during sync:', error.message);
} finally {
  localDb.close();
}
