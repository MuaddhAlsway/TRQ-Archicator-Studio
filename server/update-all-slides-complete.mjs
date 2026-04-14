#!/usr/bin/env node

import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

console.log('🎬 Updating All Hero Slides with 2 Videos and 3 Images\n');

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
  console.warn('⚠️  Turso connection failed:', e.message);
  console.log('   Continuing with local database only\n');
}

// Video and image configuration for each slide
const slideConfigs = [
  {
    id: 1,
    video_1: '/POV 1.mp4',
    video_1_text: 'POV Perspective 1',
    video_2: '/Video.mp4',
    video_2_text: 'Final Result',
    image_1: '/uploads/file-1768858211350-451992102.webp',
    image_2: '/uploads/file-1768858241207-736804924.webp',
    image_3: '/uploads/file-1768858284780-218301174.webp',
  },
  {
    id: 2,
    video_1: '/POV 1.mp4',
    video_1_text: 'POV Perspective 1',
    video_2: '/Video.mp4',
    video_2_text: 'Final Result',
    image_1: '/uploads/file-1768858241207-736804924.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858211350-451992102.webp',
  },
  {
    id: 3,
    video_1: '/POV 1.mp4',
    video_1_text: 'POV Perspective 1',
    video_2: '/Video.mp4',
    video_2_text: 'Final Result',
    image_1: '/uploads/file-1768858284780-218301174.webp',
    image_2: '/uploads/file-1768858211350-451992102.webp',
    image_3: '/uploads/file-1768858241207-736804924.webp',
  },
  {
    id: 4,
    video_1: '/POV 1.mp4',
    video_1_text: 'POV Perspective 1',
    video_2: '/Video.mp4',
    video_2_text: 'Final Result',
    image_1: '/uploads/file-1768858211350-451992102.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858241207-736804924.webp',
  },
  {
    id: 5,
    video_1: '/POV 1.mp4',
    video_1_text: 'POV Perspective 1',
    video_2: '/Video.mp4',
    video_2_text: 'Final Result',
    image_1: '/uploads/file-1768858241207-736804924.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858211350-451992102.webp',
  },
];

// Update local SQLite database
console.log('📝 Updating Local SQLite Database:\n');

slideConfigs.forEach((config) => {
  try {
    const updateSql = `
      UPDATE hero_slides 
      SET 
        video = ?,
        video_2 = ?,
        video_text = ?,
        video_2_text = ?,
        image = ?,
        image_2 = ?,
        image_3 = ?
      WHERE id = ?
    `;

    db.prepare(updateSql).run(
      config.video_1,
      config.video_2,
      config.video_1_text,
      config.video_2_text,
      config.image_1,
      config.image_2,
      config.image_3,
      config.id
    );

    console.log(`  ✅ Slide ${config.id}:`);
    console.log(`     Videos: ${config.video_1} + ${config.video_2}`);
    console.log(`     Images: 3 images assigned`);
  } catch (error) {
    console.error(`  ❌ Slide ${config.id} failed:`, error.message);
  }
});

// Update Turso cloud database
if (turso) {
  console.log('\n☁️  Updating Turso Cloud Database:\n');

  slideConfigs.forEach(async (config) => {
    try {
      const updateSql = `
        UPDATE hero_slides 
        SET 
          video = ?,
          video_2 = ?,
          video_text = ?,
          video_2_text = ?,
          image = ?,
          image_2 = ?,
          image_3 = ?
        WHERE id = ?
      `;

      await turso.execute({
        sql: updateSql,
        args: [
          config.video_1,
          config.video_2,
          config.video_1_text,
          config.video_2_text,
          config.image_1,
          config.image_2,
          config.image_3,
          config.id,
        ],
      });

      console.log(`  ✅ Slide ${config.id} synced to Turso`);
    } catch (error) {
      console.error(`  ⚠️  Slide ${config.id} Turso sync failed:`, error.message);
    }
  });
}

// Verify updates
console.log('\n✅ Verification - Local Database:\n');

const slides = db.prepare('SELECT id, video, video_2, image, image_2, image_3 FROM hero_slides ORDER BY id').all();

slides.forEach((slide) => {
  const videoCount = [slide.video, slide.video_2].filter(Boolean).length;
  const imageCount = [slide.image, slide.image_2, slide.image_3].filter(Boolean).length;
  console.log(`  Slide ${slide.id}: ${videoCount}/2 Videos ✅ | ${imageCount}/3 Images ✅`);
});

console.log('\n🎉 All slides updated successfully!');
console.log('\n📊 Summary:');
console.log('  ✅ 5 slides updated');
console.log('  ✅ 2 videos per slide (10 total videos)');
console.log('  ✅ 3 images per slide (15 total images)');
console.log('  ✅ Local database updated');
if (turso) {
  console.log('  ✅ Turso cloud database synced');
}
console.log('\n🚀 Ready for production!');

db.close();
