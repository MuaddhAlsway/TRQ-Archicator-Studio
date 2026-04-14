import db from './server/database.js';

// Update first 3 slides with video
const videoUrl = '/Video.mp4';

console.log('Updating hero slides with video...\n');

// Get all slides ordered by sortOrder
const slides = db.prepare('SELECT * FROM hero_slides ORDER BY sortOrder ASC').all();

console.log(`Found ${slides.length} slides:`);
slides.forEach((slide, idx) => {
  console.log(`  ${idx + 1}. ${slide.title} (sortOrder: ${slide.sortOrder})`);
});

// Update first 3 slides with video
for (let i = 0; i < Math.min(3, slides.length); i++) {
  const slide = slides[i];
  db.prepare('UPDATE hero_slides SET video = ? WHERE id = ?').run(videoUrl, slide.id);
  console.log(`✓ Updated slide ${i + 1} (ID: ${slide.id}) with video`);
}

console.log('\n✓ All slides updated successfully!');

// Verify the updates
console.log('\nVerifying updates:');
const updated = db.prepare('SELECT id, title, video FROM hero_slides ORDER BY sortOrder ASC').all();
updated.forEach((slide, idx) => {
  console.log(`  ${idx + 1}. ${slide.title} - Video: ${slide.video || 'None'}`);
});
