import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Updating project categories to new system...\n');

// Mapping old categories to new ones
const categoryMap = {
  'residential': 'interior-design',
  'commercial': 'interior-design',
  'furniture': 'custom-design',
  'custom': 'custom-design',
  'booths': 'booths',
  'events': 'event-design',
  'interior-design': 'interior-design',
  'event-design': 'event-design',
};

try {
  const projects = db.prepare('SELECT id, title, category FROM projects').all();
  
  projects.forEach(project => {
    const newCategory = categoryMap[project.category] || 'interior-design';
    if (project.category !== newCategory) {
      db.prepare('UPDATE projects SET category = ? WHERE id = ?').run(newCategory, project.id);
      console.log(`✓ ID ${project.id}: ${project.category} → ${newCategory}`);
    }
  });
  
  console.log('\n✓ All categories updated');
  
  // Show summary
  console.log('\nNew Category Summary:');
  const categories = db.prepare(`
    SELECT category, COUNT(*) as count 
    FROM projects 
    GROUP BY category 
    ORDER BY category
  `).all();
  
  categories.forEach(cat => {
    console.log(`  ${cat.category}: ${cat.count} projects`);
  });
  
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
