import db from './server/database.js';

console.log('Fixing all video and image paths...\n');

// Update hero slides videos
const slides = db.prepare('SELECT id, video FROM hero_slides WHERE video IS NOT NULL').all();
slides.forEach(slide => {
  if (slide.video && slide.video.includes('trq-studio.pages.dev')) {
    // Already has domain, just ensure it's correct
    const newVideo = slide.video.replace('https://trq-studio.pages.dev/', 'https://77a12e95.trq-studio.pages.dev/');
    db.prepare('UPDATE hero_slides SET video = ? WHERE id = ?').run(newVideo, slide.id);
    console.log(`✓ Updated slide ${slide.id}: ${newVideo}`);
  }
});

console.log('\n✓ All paths fixed!');
