import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'server/trq.db'));

console.log('\n✅ ARABIC PROJECTS IMPLEMENTATION VERIFICATION\n');

// Check projects table columns
const cols = db.prepare('PRAGMA table_info(projects)').all();
console.log('📊 Projects Table Columns:');
const arabicCols = cols.filter(c => c.name.includes('_ar'));
const regularCols = cols.filter(c => !c.name.includes('_ar'));

console.log('\n  Regular Fields:');
regularCols.forEach(c => console.log(`    ✓ ${c.name}`));

console.log('\n  Arabic Fields (_ar):');
arabicCols.forEach(c => console.log(`    ✓ ${c.name}`));

// Check if any projects exist
const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
console.log(`\n📈 Total Projects: ${projectCount.count}`);

// Check if any projects have Arabic content
const arabicProjects = db.prepare(`
  SELECT COUNT(*) as count FROM projects 
  WHERE title_ar IS NOT NULL AND title_ar != ''
`).get();
console.log(`🇸🇦 Projects with Arabic Content: ${arabicProjects.count}`);

// Show sample project if exists
if (projectCount.count > 0) {
  const sample = db.prepare('SELECT id, title, title_ar, description, description_ar FROM projects LIMIT 1').get();
  console.log('\n📋 Sample Project:');
  console.log(`  ID: ${sample.id}`);
  console.log(`  English Title: ${sample.title}`);
  console.log(`  Arabic Title: ${sample.title_ar || '(empty)'}`);
  console.log(`  English Desc: ${sample.description?.substring(0, 50)}...`);
  console.log(`  Arabic Desc: ${sample.description_ar ? sample.description_ar.substring(0, 50) + '...' : '(empty)'}`);
}

console.log('\n✨ Verification Complete!\n');
db.close();
