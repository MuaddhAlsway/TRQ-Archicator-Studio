import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

console.log('=== CHECKING PROJECT 12 ===');
const project = db.prepare("SELECT id, title, title_ar, category, category_ar, description, description_ar FROM projects WHERE id = 12").get();

if (project) {
  console.log('Project 12:');
  console.log('  English title:', project.title);
  console.log('  Arabic title:', project.title_ar);
  console.log('  English category:', project.category);
  console.log('  Arabic category:', project.category_ar);
  console.log('  English description:', project.description?.substring(0, 50));
  console.log('  Arabic description:', project.description_ar?.substring(0, 50));
  
  if (project.title_ar && project.category_ar && project.description_ar) {
    console.log('\n✓ ARABIC CONTENT IS SAVED IN DATABASE!');
  } else {
    console.log('\n✗ Arabic content NOT saved');
  }
} else {
  console.log('Project 12 not found');
}

db.close();
