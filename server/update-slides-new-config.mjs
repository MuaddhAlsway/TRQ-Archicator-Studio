#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

console.log('🎬 Updating Slides Configuration\n');
console.log('Configuration:');
console.log('  Slide 1 & 2: 2 Videos + Arabic translations');
console.log('  Slide 3, 4, 5: 3 Images only (no videos)\n');

const db = new Database(dbPath);
console.log('✅ Connected to local SQLite database\n');

// Configuration for each slide
const slideConfigs = [
  {
    id: 1,
    // Keep 2 videos
    video: '/POV 1.mp4',
    video_2: '/Video.mp4',
    video_3: null,
    video_text: 'POV Perspective 1',
    video_2_text: 'Final Result',
    video_3_text: null,
    // Keep 3 images
    image: '/uploads/file-1768858211350-451992102.webp',
    image_2: '/uploads/file-1768858241207-736804924.webp',
    image_3: '/uploads/file-1768858284780-218301174.webp',
    // Add Arabic translations
    tag_ar: 'استوديو تصميم TRQ',
    title_ar: 'رفع المساحات، تحديد الفخامة',
    description_ar: 'حلول تصميم داخلي فاخرة للعملاء الذين يطالبون بالتميز.',
    video_ar: 'منظور POV 1',
    video_2_ar: 'النتيجة النهائية',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
  {
    id: 2,
    // Keep 2 videos
    video: '/POV 1.mp4',
    video_2: '/Video.mp4',
    video_3: null,
    video_text: 'POV Perspective 1',
    video_2_text: 'Final Result',
    video_3_text: null,
    // Keep 3 images
    image: '/uploads/file-1768858241207-736804924.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858211350-451992102.webp',
  },
  {
    id: 3,
    // Remove videos - only images
    video: null,
    video_2: null,
    video_3: null,
    video_text: null,
    video_2_text: null,
    video_3_text: null,
    // Keep 3 images
    image: '/uploads/file-1768858284780-218301174.webp',
    image_2: '/uploads/file-1768858211350-451992102.webp',
    image_3: '/uploads/file-1768858241207-736804924.webp',
  },
  {
    id: 4,
    // Remove videos - only images
    video: null,
    video_2: null,
    video_3: null,
    video_text: null,
    video_2_text: null,
    video_3_text: null,
    // Keep 3 images
    image: '/uploads/file-1768858211350-451992102.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858241207-736804924.webp',
  },
  {
    id: 5,
    // Remove videos - only images
    video: null,
    video_2: null,
    video_3: null,
    video_text: null,
    video_2_text: null,
    video_3_text: null,
    // Keep 3 images
    image: '/uploads/file-1768858241207-736804924.webp',
    image_2: '/uploads/file-1768858284780-218301174.webp',
    image_3: '/uploads/file-1768858211350-451992102.webp',
  },
];

// Update slides
console.log('📝 Updating Slides:\n');

slideConfigs.forEach((config) => {
  try {
    const updateSql = `
      UPDATE hero_slides 
      SET 
        video = ?,
        video_2 = ?,
        video_3 = ?,
        video_text = ?,
        video_2_text = ?,
        video_3_text = ?,
        image = ?,
        image_2 = ?,
        image_3 = ?,
        tag_ar = COALESCE(?, tag_ar),
        title_ar = COALESCE(?, title_ar),
        description_ar = COALESCE(?, description_ar),
        video_ar = COALESCE(?, video_ar),
        video_2_ar = COALESCE(?, video_2_ar),
        video_text_ar = COALESCE(?, video_text_ar),
        video_2_text_ar = COALESCE(?, video_2_text_ar),
        buttonPrimaryText_ar = COALESCE(?, buttonPrimaryText_ar),
        buttonSecondaryText_ar = COALESCE(?, buttonSecondaryText_ar)
      WHERE id = ?
    `;

    db.prepare(updateSql).run(
      config.video,
      config.video_2,
      config.video_3,
      config.video_text,
      config.video_2_text,
      config.video_3_text,
      config.image,
      config.image_2,
      config.image_3,
      config.tag_ar || null,
      config.title_ar || null,
      config.description_ar || null,
      config.video_ar || null,
      config.video_2_ar || null,
      config.video_text_ar || null,
      config.video_2_text_ar || null,
      config.buttonPrimaryText_ar || null,
      config.buttonSecondaryText_ar || null,
      config.id
    );

    if (config.id <= 2) {
      console.log(`  ✅ Slide ${config.id}: 2 Videos + 3 Images`);
      if (config.id === 1) {
        console.log(`     Arabic translations added ✅`);
      }
    } else {
      console.log(`  ✅ Slide ${config.id}: 3 Images only (no videos)`);
    }
  } catch (error) {
    console.error(`  ❌ Slide ${config.id} failed:`, error.message);
  }
});

// Verify updates
console.log('\n✅ Verification:\n');

const slides = db.prepare('SELECT id, video, video_2, image, image_2, image_3, tag_ar, title_ar FROM hero_slides ORDER BY id').all();

slides.forEach((slide) => {
  const videoCount = [slide.video, slide.video_2].filter(Boolean).length;
  const imageCount = [slide.image, slide.image_2, slide.image_3].filter(Boolean).length;
  const hasArabic = slide.tag_ar || slide.title_ar ? '✅' : '❌';
  
  console.log(`  Slide ${slide.id}: ${videoCount} Videos | ${imageCount} Images | Arabic: ${hasArabic}`);
});

console.log('\n🎉 Update complete!');
console.log('\n📊 Summary:');
console.log('  ✅ Slide 1: 2 Videos + 3 Images + Arabic');
console.log('  ✅ Slide 2: 2 Videos + 3 Images');
console.log('  ✅ Slide 3: 3 Images only');
console.log('  ✅ Slide 4: 3 Images only');
console.log('  ✅ Slide 5: 3 Images only');
console.log('\n🚀 Ready for production!');

db.close();
