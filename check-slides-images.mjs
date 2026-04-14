import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'server', 'trq.db');

const db = new Database(dbPath);

try {
  const slides = db.prepare('SELECT id, title, image, isActive, sortOrder FROM hero_slides ORDER BY sortOrder ASC').all();
  
  console.log('\n=== HERO SLIDES ===\n');
  slides.forEach(slide => {
    const status = slide.isActive ? '✓ ACTIVE' : '✗ INACTIVE';
    console.log(`Slide ${slide.id} (Sort: ${slide.sortOrder}): ${status}`);
    console.log(`  Title: ${slide.title}`);
    console.log(`  Image: ${slide.image || 'NO IMAGE'}`);
    console.log('');
  });
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
