import Database from 'better-sqlite3';

const db = new Database('trq.db');

console.log('=== CHECKING DATABASE ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in database:');
tables.forEach(t => console.log('  -', t.name));

if (tables.find(t => t.name === 'projects')) {
  console.log('\n✓ Projects table exists');
  const schema = db.prepare("PRAGMA table_info(projects)").all();
  console.log('\nProjects table columns:');
  schema.forEach(col => console.log(`  - ${col.name}: ${col.type}`));
  
  const arabicCols = ['title_ar', 'category_ar', 'description_ar'];
  console.log('\nArabic columns:');
  arabicCols.forEach(col => {
    const exists = schema.find(c => c.name === col);
    console.log(`  ${col}: ${exists ? '✓' : '✗'}`);
  });
} else {
  console.log('\n✗ Projects table does NOT exist');
}

db.close();
