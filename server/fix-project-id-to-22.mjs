import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Updating project ID from 79 to 22...');

try {
  // Check if ID 22 already exists
  const existing22 = db.prepare('SELECT * FROM projects WHERE id = ?').get(22);
  if (existing22) {
    console.log('Deleting existing project with ID 22...');
    db.prepare('DELETE FROM projects WHERE id = ?').run(22);
  }
  
  // Get the project with ID 79
  const project79 = db.prepare('SELECT * FROM projects WHERE id = ?').get(79);
  if (!project79) {
    console.error('Project with ID 79 not found');
    process.exit(1);
  }
  
  // Update ID 79 to 22
  db.prepare('UPDATE projects SET id = ? WHERE id = ?').run(22, 79);
  
  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(22);
  console.log('✓ Project updated to ID 22:', updated.title);
  console.log('✓ Update complete');
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
