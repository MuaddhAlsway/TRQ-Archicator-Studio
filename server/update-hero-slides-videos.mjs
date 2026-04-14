import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Update hero slides with video assignments
const updates = [
  {
    id: 1,
    video: '/Video1.mp4',
    description: 'Slide 1 - Video1'
  },
  {
    id: 2,
    video: '/Video2.mp4',
    description: 'Slide 2 - Video2'
  },
  {
    id: 3,
    video: '/Video3.mp4',
    description: 'Slide 3 - Video3'
  },
  {
    id: 4,
    video: null,
    description: 'Slide 4 - Image only'
  },
  {
    id: 5,
    video: null,
    description: 'Slide 5 - Image only'
  }
];

console.log('Updating hero slides with video assignments...\n');

updates.forEach(update => {
  try {
    const stmt = db.prepare(`
      UPDATE hero_slides 
      SET video = ?, video_2 = NULL, video_3 = NULL
      WHERE id = ?
    `);
    
    stmt.run(update.video, update.id);
    console.log(`✓ Slide ${update.id}: ${update.description}`);
  } catch (error) {
    console.error(`✗ Error updating slide ${update.id}:`, error.message);
  }
});

console.log('\n✓ Hero slides updated successfully!');
console.log('\nConfiguration:');
console.log('- Slides 1-3: Video slides (Video1.mp4, Video2.mp4, Video3.mp4)');
console.log('- Slides 4-5: Image slides only');
console.log('\nAbout component: Updated to use Video2.mp4');

db.close();
