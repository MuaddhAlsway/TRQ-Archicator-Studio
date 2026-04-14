import Database from 'better-sqlite3';

try {
  const db = new Database('server/trq.db');
  const slides = db.prepare('SELECT id, title, image, video, isActive FROM hero_slides ORDER BY id').all();
  
  console.log('Local database slides:');
  console.log('========================\n');
  
  slides.forEach(s => {
    console.log(`ID: ${s.id}`);
    console.log(`  Title: ${s.title}`);
    console.log(`  Image: ${s.image}`);
    console.log(`  Video: ${s.video || 'NULL'}`);
    console.log(`  Active: ${s.isActive}`);
    console.log('');
  });
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
}
