import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  // Check if project 32 exists
  const project32 = db.prepare('SELECT id, title, status FROM projects WHERE id = 32').get();
  
  if (project32) {
    console.log('Project 32 found:');
    console.log(JSON.stringify(project32, null, 2));
  } else {
    console.log('Project 32 NOT found');
    console.log('\nAll projects:');
    const all = db.prepare('SELECT id, title, status FROM projects ORDER BY id').all();
    all.forEach(p => {
      console.log(`  ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
    });
  }

  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
