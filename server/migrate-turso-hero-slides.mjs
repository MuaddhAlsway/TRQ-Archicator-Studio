import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

const columnsToAdd = [
  'video_2',
  'video_3',
  'video_text',
  'video_2_text',
  'video_3_text',
  'tag_ar',
  'title_ar',
  'description_ar',
  'video_ar',
  'video_2_ar',
  'video_3_ar',
  'video_text_ar',
  'video_2_text_ar',
  'video_3_text_ar',
  'buttonPrimaryText_ar',
  'buttonSecondaryText_ar'
];

console.log('Migrating Turso hero_slides table...\n');

for (const column of columnsToAdd) {
  try {
    await turso.execute({
      sql: `ALTER TABLE hero_slides ADD COLUMN ${column} TEXT`
    });
    console.log(`✓ Added column: ${column}`);
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log(`✓ Column already exists: ${column}`);
    } else {
      console.error(`✗ Error adding ${column}:`, error.message);
    }
  }
}

console.log('\n✓ Turso migration complete!');
