import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  // Check how many projects exist
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  console.log('Total projects in database:', projectCount.count);

  // Check how many are published
  const publishedCount = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'published'").get();
  console.log('Published projects:', publishedCount.count);

  // Check how many are draft
  const draftCount = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'draft'").get();
  console.log('Draft projects:', draftCount.count);

  // If no published projects, update all to published
  if (publishedCount.count === 0 && projectCount.count > 0) {
    console.log('No published projects found. Updating all projects to published status...');
    const result = db.prepare("UPDATE projects SET status = 'published'").run();
    console.log('Updated', result.changes, 'projects to published status');
  }

  // List first 5 projects
  const projects = db.prepare('SELECT id, title, status FROM projects LIMIT 5').all();
  console.log('\nFirst 5 projects:');
  projects.forEach(p => {
    console.log(`  ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
  });

  db.close();
  console.log('\nDatabase check complete!');
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
