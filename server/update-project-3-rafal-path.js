import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  console.log('Updating project 3 cover image to RAFAL APARTMENT 5.webp...');
  
  // Get project 3 first
  const project = db.prepare('SELECT id, title, image FROM projects WHERE id = 3').get();
  console.log('Current project 3:', project);
  
  // Update project 3 cover image to RAFAL APARTMENT folder 5.webp
  const result = db.prepare('UPDATE projects SET image = ? WHERE id = 3').run('/TRQ STUDIO _ PROJECTS/RAFAL APARTMENT/5.webp');
  
  console.log('Rows affected:', result.changes);
  
  // Verify update
  const updated = db.prepare('SELECT id, title, image FROM projects WHERE id = 3').get();
  console.log('Updated project 3:', updated);
  
  console.log('✅ Project 3 cover image updated to /TRQ STUDIO _ PROJECTS/RAFAL APARTMENT/5.webp');
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
