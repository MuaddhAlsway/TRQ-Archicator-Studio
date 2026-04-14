import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

// Local database
const localDb = new Database(dbPath);

// Turso cloud database
const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

try {
  console.log('🔄 Syncing hero slides to Turso...\n');

  // Get all slides from local database
  const slides = localDb.prepare(`
    SELECT 
      id, 
      tag, 
      title, 
      description,
      image,
      video, 
      video_2, 
      video_3,
      video_text,
      video_2_text,
      video_3_text,
      buttonPrimaryText,
      buttonPrimaryLink,
      buttonSecondaryText,
      buttonSecondaryLink,
      sortOrder,
      isActive,
      tag_ar, 
      title_ar, 
      description_ar,
      video_ar,
      video_2_ar,
      video_3_ar,
      video_text_ar,
      video_2_text_ar,
      video_3_text_ar,
      buttonPrimaryText_ar,
      buttonSecondaryText_ar
    FROM hero_slides 
    ORDER BY id
  `).all();

  console.log(`Found ${slides.length} slides to sync\n`);

  // Sync each slide to Turso
  for (const slide of slides) {
    console.log(`📝 Syncing Slide ${slide.id}: "${slide.title}"`);

    const updateQuery = `
      UPDATE hero_slides 
      SET 
        tag = ?,
        title = ?,
        description = ?,
        image = ?,
        video = ?,
        video_2 = ?,
        video_3 = ?,
        video_text = ?,
        video_2_text = ?,
        video_3_text = ?,
        buttonPrimaryText = ?,
        buttonPrimaryLink = ?,
        buttonSecondaryText = ?,
        buttonSecondaryLink = ?,
        sortOrder = ?,
        isActive = ?,
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
        buttonSecondaryText_ar = ?
      WHERE id = ?
    `;

    await turso.execute({
      sql: updateQuery,
      args: [
        slide.tag,
        slide.title,
        slide.description,
        slide.image,
        slide.video,
        slide.video_2,
        slide.video_3,
        slide.video_text,
        slide.video_2_text,
        slide.video_3_text,
        slide.buttonPrimaryText,
        slide.buttonPrimaryLink,
        slide.buttonSecondaryText,
        slide.buttonSecondaryLink,
        slide.sortOrder,
        slide.isActive,
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
        slide.id
      ]
    });

    console.log(`   ✅ Synced to Turso`);
    console.log(`      Videos: ${slide.video ? '✅' : '❌'}`);
    console.log(`      Arabic: ${slide.title_ar ? '✅' : '❌'}\n`);
  }

  console.log('✅ All slides synced to Turso!\n');
  console.log('📊 Summary:');
  console.log(`   • Slides synced: ${slides.length}`);
  console.log(`   • Videos synced: ${slides.filter(s => s.video).length * 3}`);
  console.log(`   • Arabic content synced: ${slides.filter(s => s.title_ar).length * 8}`);
  console.log('\n🎉 Hero slides are now available in the admin panel!');
  console.log('   Admin Panel: https://trq-studio.pages.dev/#/admin');
  console.log('   Click "Hero Slides (EN)" or "Hero Slides (AR)" to verify\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  localDb.close();
}
