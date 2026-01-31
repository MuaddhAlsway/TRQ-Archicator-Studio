import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  const projects = db.prepare("SELECT id, title FROM projects WHERE title LIKE '%RAFAL%' OR title LIKE '%Rafal%'").all();
  
  if (projects.length > 0) {
    console.log('Found RAFAL projects:');
    projects.forEach(p => {
      console.log(`  ID: ${p.id}, Title: ${p.title}`);
    });
  } else {
    console.log('No RAFAL projects found');
    console.log('\nAll projects:');
    const all = db.prepare('SELECT id, title FROM projects ORDER BY id').all();
    all.forEach(p => {
      console.log(`  ID: ${p.id}, Title: ${p.title}`);
    });
  }

  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
