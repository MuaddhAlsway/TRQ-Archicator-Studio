import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Setting sortOrder from 1 to 21...\n');

try {
  // Get all projects ordered by ID
  const projects = db.prepare('SELECT id FROM projects WHERE id <= 21 ORDER BY id').all();
  
  console.log(`Found ${projects.length} projects to update\n`);
  
  // Update each project with sortOrder = id
  projects.forEach((project, index) => {
    const sortOrder = index + 1;
    db.prepare('UPDATE projects SET sortOrder = ? WHERE id = ?').run(sortOrder, project.id);
    console.log(`✓ Project ID ${project.id} -> sortOrder: ${sortOrder}`);
  });
  
  console.log('\n✓ All sortOrders updated successfully');
  
  // Verify
  console.log('\nVerification:');
  const updated = db.prepare('SELECT id, title, sortOrder FROM projects WHERE id <= 21 ORDER BY sortOrder').all();
  updated.forEach(p => {
    console.log(`  ID: ${p.id}, SortOrder: ${p.sortOrder}, Title: ${p.title}`);
  });
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
