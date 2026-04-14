import db from './server/database.js';

console.log('Resetting video paths to relative paths...\n');

// Update hero slides to use relative paths
db.prepare("UPDATE hero_slides SET video = '/Video1.mp4' WHERE id = 1").run();
db.prepare("UPDATE hero_slides SET video = '/Video2.mp4' WHERE id = 2").run();
db.prepare("UPDATE hero_slides SET video = '/Video3.mp4' WHERE id = 3").run();

console.log('✓ Updated hero slides to use relative paths');
console.log('✓ Videos will now load from current domain');
