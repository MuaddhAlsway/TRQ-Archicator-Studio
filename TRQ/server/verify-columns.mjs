import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

console.log('=== CHECKING PROJECTS TABLE COLUMNS ===');
const schema = db.prepare("PRAGMA table_info(projects)").all();

const arabicCols = [
  'title_ar', 'category_ar', 'subcategory_ar', 'description_ar', 'location_ar', 
  'client_ar', 'size_ar', 'duration_ar', 'detailedDescription_ar', 'challenge_ar', 
  'solution_ar', 'features_ar', 'materials_ar', 'awards_ar', 'team_ar', 
  'clientQuote_ar', 'clientName_ar'
];

console.log('\nArabic columns status:');
let allExist = true;
arabicCols.forEach(col => {
  const exists = schema.find(c => c.name === col);
  console.log(`  ${col}: ${exists ? '✓ EXISTS' : '✗ MISSING'}`);
  if (!exists) allExist = false;
});

console.log('\n=== SAMPLE PROJECT 12 ===');
const project = db.prepare("SELECT * FROM projects WHERE id = 12").get();
if (project) {
  console.log('Project found:');
  console.log('  title:', project.title);
  console.log('  title_ar:', project.title_ar);
  console.log('  category:', project.category);
  console.log('  category_ar:', project.category_ar);
} else {
  console.log('Project 12 not found');
}

db.close();
console.log('\n' + (allExist ? '✓ All columns exist!' : '✗ Some columns missing - need to run migrations'));
