import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔄 Adding Arabic fields to database tables...\n');

try {
  // Add Arabic fields to hero_slides table
  console.log('📝 Updating hero_slides table...');
  try {
    db.exec(`ALTER TABLE hero_slides ADD COLUMN tag_ar TEXT`);
    db.exec(`ALTER TABLE hero_slides ADD COLUMN title_ar TEXT`);
    db.exec(`ALTER TABLE hero_slides ADD COLUMN description_ar TEXT`);
    db.exec(`ALTER TABLE hero_slides ADD COLUMN buttonPrimaryText_ar TEXT`);
    db.exec(`ALTER TABLE hero_slides ADD COLUMN buttonSecondaryText_ar TEXT`);
    console.log('   ✅ hero_slides updated');
  } catch (e) {
    console.log('   ℹ️  hero_slides already has Arabic fields');
  }

  // Add Arabic fields to projects table
  console.log('📝 Updating projects table...');
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN title_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN description_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN detailedDescription_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN challenge_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN solution_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN features_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN materials_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN awards_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN team_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN clientQuote_ar TEXT`);
    db.exec(`ALTER TABLE projects ADD COLUMN clientName_ar TEXT`);
    console.log('   ✅ projects updated');
  } catch (e) {
    console.log('   ℹ️  projects already has Arabic fields');
  }

  // Add Arabic fields to services table
  console.log('📝 Updating services table...');
  try {
    db.exec(`ALTER TABLE services ADD COLUMN title_ar TEXT`);
    db.exec(`ALTER TABLE services ADD COLUMN description_ar TEXT`);
    db.exec(`ALTER TABLE services ADD COLUMN features_ar TEXT`);
    console.log('   ✅ services updated');
  } catch (e) {
    console.log('   ℹ️  services already has Arabic fields');
  }

  // Add Arabic fields to blog_articles table
  console.log('📝 Updating blog_articles table...');
  try {
    db.exec(`ALTER TABLE blog_articles ADD COLUMN title_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN slug_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN excerpt_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN content_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN category_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN categorySlug_ar TEXT`);
    db.exec(`ALTER TABLE blog_articles ADD COLUMN tags_ar TEXT`);
    console.log('   ✅ blog_articles updated');
  } catch (e) {
    console.log('   ℹ️  blog_articles already has Arabic fields');
  }

  // Create arabic_translations table for managing custom Arabic content
  console.log('📝 Creating arabic_translations table...');
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS arabic_translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entityType TEXT NOT NULL,
        entityId INTEGER NOT NULL,
        fieldName TEXT NOT NULL,
        arabicValue TEXT NOT NULL,
        englishValue TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entityType, entityId, fieldName)
      );
    `);
    console.log('   ✅ arabic_translations table created');
  } catch (e) {
    console.log('   ℹ️  arabic_translations table already exists');
  }

  console.log('\n✅ Database schema updated successfully!\n');
  console.log('📊 Summary:');
  console.log('   ✓ hero_slides: Added 5 Arabic fields');
  console.log('   ✓ projects: Added 11 Arabic fields');
  console.log('   ✓ services: Added 3 Arabic fields');
  console.log('   ✓ blog_articles: Added 7 Arabic fields');
  console.log('   ✓ arabic_translations: New tracking table\n');

} catch (error) {
  console.error('❌ Error updating database:', error.message);
  process.exit(1);
} finally {
  db.close();
}
