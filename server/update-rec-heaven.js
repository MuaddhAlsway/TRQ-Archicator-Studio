import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  // Find REC. HEAVEN project
  const project = db.prepare("SELECT id, title FROM projects WHERE title LIKE '%REC%HEAVEN%'").get();
  
  if (!project) {
    console.log('REC. HEAVEN project not found');
    process.exit(1);
  }

  console.log(`Found project: ID ${project.id}, Title: ${project.title}`);

  // Set cover image to 7a.webp from RSG BOOTH folder
  const coverImage = '/TRQ STUDIO _ PROJECTS/14. RSG BOOTH/WEB/7a.webp';

  // Update project with cover image
  const result = db.prepare(`
    UPDATE projects 
    SET image = ?
    WHERE id = ?
  `).run(coverImage, project.id);

  console.log(`\nUpdated project ${project.id}`);
  console.log('Rows affected:', result.changes);
  console.log('New cover image:', coverImage);

  // Verify the update
  const updated = db.prepare('SELECT id, title, image FROM projects WHERE id = ?').get(project.id);
  console.log('\nUpdated project details:');
  console.log(`  ID: ${updated.id}`);
  console.log(`  Title: ${updated.title}`);
  console.log(`  Cover: ${updated.image}`);

  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
