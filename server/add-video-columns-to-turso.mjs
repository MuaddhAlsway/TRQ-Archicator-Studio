import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

const columnsToAdd = [
  { name: 'video', type: 'TEXT' },
  { name: 'video_2', type: 'TEXT' },
  { name: 'video_3', type: 'TEXT' },
  { name: 'video_text', type: 'TEXT' },
  { name: 'video_2_text', type: 'TEXT' },
  { name: 'video_3_text', type: 'TEXT' },
  { name: 'tag_ar', type: 'TEXT' },
  { name: 'title_ar', type: 'TEXT' },
  { name: 'description_ar', type: 'TEXT' },
  { name: 'video_ar', type: 'TEXT' },
  { name: 'video_2_ar', type: 'TEXT' },
  { name: 'video_3_ar', type: 'TEXT' },
  { name: 'video_text_ar', type: 'TEXT' },
  { name: 'video_2_text_ar', type: 'TEXT' },
  { name: 'video_3_text_ar', type: 'TEXT' },
  { name: 'buttonPrimaryText_ar', type: 'TEXT' },
  { name: 'buttonSecondaryText_ar', type: 'TEXT' }
];

try {
  console.log('🔧 Adding missing columns to Turso hero_slides table...\n');

  for (const column of columnsToAdd) {
    try {
      console.log(`Adding column: ${column.name}...`);
      await turso.execute({
        sql: `ALTER TABLE hero_slides ADD COLUMN ${column.name} ${column.type}`
      });
      console.log(`   ✅ Added ${column.name}\n`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`   ℹ️  Column ${column.name} already exists\n`);
      } else {
        console.log(`   ⚠️  Error: ${error.message}\n`);
      }
    }
  }

  console.log('✅ All columns processed!\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
