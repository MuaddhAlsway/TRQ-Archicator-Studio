import db from './server/database.js';

// Map old image paths to new paths (for images that are now in dist)
const imagePathMap = {
  '/TRQ STUDIO _ PROJECTS/CLASSIC BEDROOM/1.webp': '/CLASSIC BEDROOM/1.webp',
  '/TRQ STUDIO _ PROJECTS/CLASSIC BEDROOM/2.webp': '/CLASSIC BEDROOM/2.webp',
  '/TRQ STUDIO _ PROJECTS/CLASSIC BEDROOM/3.webp': '/CLASSIC BEDROOM/3.webp',
  '/TRQ STUDIO _ PROJECTS/CLASSIC BEDROOM/4.webp': '/CLASSIC BEDROOM/4.webp',
};

console.log('Updating image paths in database...\n');

let updated = 0;
for (const [oldPath, newPath] of Object.entries(imagePathMap)) {
  try {
    const result = db.prepare('UPDATE projects SET image = ? WHERE image = ?').run(newPath, oldPath);
    if (result.changes > 0) {
      console.log(`✓ Updated: ${oldPath} → ${newPath}`);
      updated += result.changes;
    }
  } catch (error) {
    console.error(`✗ Error updating ${oldPath}:`, error.message);
  }
}

console.log(`\n✓ Updated ${updated} image paths`);
console.log('\nNote: For other images, you need to:');
console.log('1. Upload images to Cloudflare R2');
console.log('2. Update database with R2 URLs');
console.log('3. Or copy more images to dist folder');
