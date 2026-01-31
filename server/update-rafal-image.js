import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  const imageUrl = '/TRQ STUDIO _ PROJECTS/TRQ STUDIO _ PROJECTS/21. RAFAL APARTMENT/WEB/5.webp';
  
  const result = db.prepare('UPDATE projects SET image = ? WHERE id = 29').run(imageUrl);
  
  console.log('Updated RAFAL APARTMENT project');
  console.log('Rows affected:', result.changes);
  
  // Verify the update
  const project = db.prepare('SELECT id, title, image FROM projects WHERE id = 29').get();
  console.log('\nUpdated project:');
  console.log(JSON.stringify(project, null, 2));

  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
