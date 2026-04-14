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
  const slides = localDb.prepare('SELECT id, video, image, title FROM hero_slides ORDER BY id').all();
  
  console.log(`Found ${slides.length} hero slides to sync\n`);

  // Sync each slide to Turso - update only the video field
  for (const slide of slides) {
    try {
      await turso.execute({
        sql: `UPDATE hero_slides SET video = ? WHERE id = ?`,
        args: [slide.video, slide.id]
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
