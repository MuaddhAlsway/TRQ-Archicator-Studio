import Database from 'better-sqlite3';

const db = new Database('server/trq.db');

console.log('\n📊 HERO SLIDES DATA CHECK\n');
console.log('='.repeat(80));

const slides = db.prepare(`
  SELECT 
    id, tag, title, description, image,
    video, video_2, video_3,
    video_text, video_2_text, video_3_text,
    tag_ar, title_ar, description_ar,
    video_ar, video_2_ar, video_3_ar,
    video_text_ar, video_2_text_ar, video_3_text_ar,
    buttonPrimaryText, buttonSecondaryText,
    buttonPrimaryText_ar, buttonSecondaryText_ar,
    sortOrder, isActive
  FROM hero_slides
  ORDER BY id
`).all();

console.log(`\n✅ Total Slides: ${slides.length}\n`);

slides.forEach((slide, idx) => {
  console.log(`\n📌 SLIDE ${idx + 1} (ID: ${slide.id})`);
  console.log('-'.repeat(80));
  
  console.log('\n🇬🇧 ENGLISH CONTENT:');
  console.log(`  Tag: ${slide.tag || '❌ EMPTY'}`);
  console.log(`  Title: ${slide.title || '❌ EMPTY'}`);
  console.log(`  Description: ${slide.description?.substring(0, 50) || '❌ EMPTY'}...`);
  console.log(`  Image: ${slide.image ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n🎬 ENGLISH VIDEOS:');
  console.log(`  Video 1: ${slide.video ? '✅ YES' : '❌ NO'} ${slide.video_text ? `(Text: ${slide.video_text})` : ''}`);
  console.log(`  Video 2: ${slide.video_2 ? '✅ YES' : '❌ NO'} ${slide.video_2_text ? `(Text: ${slide.video_2_text})` : ''}`);
  console.log(`  Video 3: ${slide.video_3 ? '✅ YES' : '❌ NO'} ${slide.video_3_text ? `(Text: ${slide.video_3_text})` : ''}`);
  
  console.log('\n🇸🇦 ARABIC CONTENT:');
  console.log(`  Tag: ${slide.tag_ar ? '✅ YES' : '❌ EMPTY'}`);
  console.log(`  Title: ${slide.title_ar ? '✅ YES' : '❌ EMPTY'}`);
  console.log(`  Description: ${slide.description_ar ? '✅ YES' : '❌ EMPTY'}`);
  
  console.log('\n🎬 ARABIC VIDEOS:');
  console.log(`  Video 1: ${slide.video_ar ? '✅ YES' : '❌ NO'} ${slide.video_text_ar ? `(Text: ✅)` : ''}`);
  console.log(`  Video 2: ${slide.video_2_ar ? '✅ YES' : '❌ NO'} ${slide.video_2_text_ar ? `(Text: ✅)` : ''}`);
  console.log(`  Video 3: ${slide.video_3_ar ? '✅ YES' : '❌ NO'} ${slide.video_3_text_ar ? `(Text: ✅)` : ''}`);
  
  console.log('\n🔘 BUTTONS:');
  console.log(`  Primary (EN): ${slide.buttonPrimaryText || '❌ EMPTY'}`);
  console.log(`  Secondary (EN): ${slide.buttonSecondaryText || '❌ EMPTY'}`);
  console.log(`  Primary (AR): ${slide.buttonPrimaryText_ar ? '✅ YES' : '❌ EMPTY'}`);
  console.log(`  Secondary (AR): ${slide.buttonSecondaryText_ar ? '✅ YES' : '❌ EMPTY'}`);
  
  console.log('\n⚙️ SETTINGS:');
  console.log(`  Sort Order: ${slide.sortOrder}`);
  console.log(`  Active: ${slide.isActive ? '✅ YES' : '❌ NO'}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY:');
console.log(`  Total Slides: ${slides.length}`);
console.log(`  Slides with 3 Videos: ${slides.filter(s => s.video && s.video_2 && s.video_3).length}`);
console.log(`  Slides with Images: ${slides.filter(s => s.image).length}`);
console.log(`  Slides with Arabic: ${slides.filter(s => s.title_ar).length}`);
console.log(`  Active Slides: ${slides.filter(s => s.isActive).length}`);

console.log('\n✅ CHECK COMPLETE\n');

db.close();
