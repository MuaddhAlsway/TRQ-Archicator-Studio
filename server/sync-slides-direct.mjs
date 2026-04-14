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
    SELECT * FROM hero_slides ORDER BY id
  `).all();

  console.log(`Found ${slides.length} slides to sync\n`);

  // First, let's check what columns exist in Turso
  console.log('📋 Checking Turso schema...');
  const schemaResult = await turso.execute('PRAGMA table_info(hero_slides)');
  const tursoColumns = schemaResult.rows.map(row => row.name);
  console.log(`Turso columns: ${tursoColumns.join(', ')}\n`);

  // Sync each slide to Turso
  for (const slide of slides) {
    console.log(`📝 Syncing Slide ${slide.id}: "${slide.title}"`);

    // Build dynamic update query based on available columns
    const updateFields = [];
    const updateValues = [];

    // Add all fields that exist in Turso
    const fieldMap = {
      'tag': slide.tag,
      'title': slide.title,
      'description': slide.description,
      'image': slide.image,
      'video': slide.video,
      'video_2': slide.video_2,
      'video_3': slide.video_3,
      'video_text': slide.video_text,
      'video_2_text': slide.video_2_text,
      'video_3_text': slide.video_3_text,
      'buttonPrimaryText': slide.buttonPrimaryText,
      'buttonPrimaryLink': slide.buttonPrimaryLink,
      'buttonSecondaryText': slide.buttonSecondaryText,
      'buttonSecondaryLink': slide.buttonSecondaryLink,
      'sortOrder': slide.sortOrder,
      'isActive': slide.isActive,
      'tag_ar': slide.tag_ar,
      'title_ar': slide.title_ar,
      'description_ar': slide.description_ar,
      'video_ar': slide.video_ar,
      'video_2_ar': slide.video_2_ar,
      'video_3_ar': slide.video_3_ar,
      'video_text_ar': slide.video_text_ar,
      'video_2_text_ar': slide.video_2_text_ar,
      'video_3_text_ar': slide.video_3_text_ar,
      'buttonPrimaryText_ar': slide.buttonPrimaryText_ar,
      'buttonSecondaryText_ar': slide.buttonSecondaryText_ar
    };

    for (const [field, value] of Object.entries(fieldMap)) {
      if (tursoColumns.includes(field)) {
        updateFields.push(`${field} = ?`);
        updateValues.push(value);
      }
    }

    updateValues.push(slide.id);

    const updateQuery = `UPDATE hero_slides SET ${updateFields.join(', ')} WHERE id = ?`;

    await turso.execute({
      sql: updateQuery,
      args: updateValues
    });

    console.log(`   ✅ Synced to Turso`);
    console.log(`      Videos: ${slide.video ? '✅' : '❌'}`);
    console.log(`      Arabic: ${slide.title_ar ? '✅' : '❌'}\n`);
  }

  console.log('✅ All slides synced to Turso!\n');
  console.log('🎉 Hero slides are now available in the admin panel!');
  console.log('   Admin Panel: https://trq-studio.pages.dev/#/admin\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
  process.exit(1);
} finally {
  localDb.close();
}
