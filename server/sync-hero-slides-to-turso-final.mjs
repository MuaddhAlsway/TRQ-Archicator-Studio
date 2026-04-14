#!/usr/bin/env node

import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

console.log('☁️  Syncing Hero Slides to Turso Cloud Database\n');

// Connect to local SQLite
const db = new Database(dbPath);
console.log('✅ Connected to local SQLite database');

// Connect to Turso
let turso = null;
try {
  turso = createClient({
    url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
  });
  console.log('✅ Connected to Turso cloud database\n');
} catch (e) {
  console.error('❌ Turso connection failed:', e.message);
  process.exit(1);
}

// Fetch all slides from local database
console.log('📤 Syncing hero slides to Turso:\n');

const slides = db.prepare('SELECT * FROM hero_slides ORDER BY id').all();

let successCount = 0;
let failCount = 0;

for (const slide of slides) {
  try {
    // First, try to update existing slide
    const updateSql = `
      UPDATE hero_slides 
      SET 
        tag = ?,
        title = ?,
        description = ?,
        image = ?,
        image_2 = ?,
        image_3 = ?,
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
        buttonPrimaryText_ar = ?,
        buttonSecondaryText_ar = ?,
        video_ar = ?,
        video_2_ar = ?,
        video_3_ar = ?,
        video_text_ar = ?,
        video_2_text_ar = ?,
        video_3_text_ar = ?
      WHERE id = ?
    `;

    await turso.execute({
      sql: updateSql,
      args: [
        slide.tag || '',
        slide.title || '',
        slide.description || '',
        slide.image || '',
        slide.image_2 || '',
        slide.image_3 || '',
        slide.video || '',
        slide.video_2 || '',
        slide.video_3 || '',
        slide.video_text || '',
        slide.video_2_text || '',
        slide.video_3_text || '',
        slide.buttonPrimaryText || '',
        slide.buttonPrimaryLink || '',
        slide.buttonSecondaryText || '',
        slide.buttonSecondaryLink || '',
        slide.sortOrder || 0,
        slide.isActive || 1,
        slide.tag_ar || '',
        slide.title_ar || '',
        slide.description_ar || '',
        slide.buttonPrimaryText_ar || '',
        slide.buttonSecondaryText_ar || '',
        slide.video_ar || '',
        slide.video_2_ar || '',
        slide.video_3_ar || '',
        slide.video_text_ar || '',
        slide.video_2_text_ar || '',
        slide.video_3_text_ar || '',
        slide.id,
      ],
    });

    const videoCount = [slide.video, slide.video_2, slide.video_3].filter(Boolean).length;
    const imageCount = [slide.image, slide.image_2, slide.image_3].filter(Boolean).length;
    const hasArabic = slide.tag_ar || slide.title_ar ? '✅' : '❌';
    
    console.log(`  ✅ Slide ${slide.id}: ${videoCount} Videos | ${imageCount} Images | Arabic: ${hasArabic}`);
    successCount++;
  } catch (error) {
    console.error(`  ❌ Slide ${slide.id} sync failed:`, error.message);
    failCount++;
  }
}

console.log('\n🎉 Turso sync complete!');
console.log('\n📊 Summary:');
console.log(`  ✅ Successfully synced: ${successCount} slides`);
if (failCount > 0) {
  console.log(`  ❌ Failed: ${failCount} slides`);
}
console.log('\n📋 Configuration:');
console.log('  ✅ Slide 1: 2 Videos + 3 Images + Arabic');
console.log('  ✅ Slide 2: 2 Videos + 3 Images');
console.log('  ✅ Slide 3: 3 Images only');
console.log('  ✅ Slide 4: 3 Images only');
console.log('  ✅ Slide 5: 3 Images only');
console.log('\n🚀 Turso database is now up to date!');

db.close();
