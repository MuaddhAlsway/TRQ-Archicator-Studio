#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔧 Creating Arabic Content Tables\n');
console.log('═'.repeat(70));

try {
  // Create hero_slides_arabic table
  console.log('\n📝 Creating hero_slides_arabic table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_slides_arabic (
      id INTEGER PRIMARY KEY,
      englishTag TEXT,
      arabicTag TEXT,
      englishTitle TEXT,
      arabicTitle TEXT,
      englishDescription TEXT,
      arabicDescription TEXT,
      englishButtonPrimaryText TEXT,
      arabicButtonPrimaryText TEXT,
      englishButtonSecondaryText TEXT,
      arabicButtonSecondaryText TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ hero_slides_arabic table created');

  // Create projects_arabic table
  console.log('\n📝 Creating projects_arabic table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects_arabic (
      id INTEGER PRIMARY KEY,
      englishTitle TEXT,
      arabicTitle TEXT,
      englishDescription TEXT,
      arabicDescription TEXT,
      englishCategory TEXT,
      arabicCategory TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ projects_arabic table created');

  // Create services_arabic table
  console.log('\n📝 Creating services_arabic table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS services_arabic (
      id INTEGER PRIMARY KEY,
      englishTitle TEXT,
      arabicTitle TEXT,
      englishDescription TEXT,
      arabicDescription TEXT,
      englishFeatures TEXT,
      arabicFeatures TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ services_arabic table created');

  // Create blog_articles_arabic table
  console.log('\n📝 Creating blog_articles_arabic table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_articles_arabic (
      id INTEGER PRIMARY KEY,
      englishTitle TEXT,
      arabicTitle TEXT,
      englishExcerpt TEXT,
      arabicExcerpt TEXT,
      englishCategory TEXT,
      arabicCategory TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ blog_articles_arabic table created');

  console.log('\n═'.repeat(70));
  console.log('\n✅ All Arabic tables created successfully!\n');

} catch (error) {
  console.error('\n❌ Error creating tables:', error.message);
  process.exit(1);
} finally {
  db.close();
}
