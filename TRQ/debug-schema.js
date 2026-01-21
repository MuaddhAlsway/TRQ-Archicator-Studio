import Database from 'better-sqlite3';
const db = new Database('server/trq.db');

console.log('=== PROJECTS TABLE SCHEMA ===');
const schema = db.prepare("PRAGMA table_info(projects)").all();
schema.forEach(col => {
  console.log(`${col.name}: ${col.type}`);
});

console.log('\n=== CHECKING SPECIFIC ARABIC COLUMNS ===');
const arabicCols = ['title_ar', 'category_ar', 'description_ar', 'features_ar', 'materials_ar', 'awards_ar', 'team_ar'];
arabicCols.forEach(col => {
  const exists = schema.find(c => c.name === col);
  console.log(`${col}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

console.log('\n=== SAMPLE PROJECT DATA ===');
const project = db.prepare("SELECT * FROM projects WHERE id = 12").get();
if (project) {
  console.log('Project 12 found:');
  console.log('title:', project.title);
  console.log('title_ar:', project.title_ar);
  console.log('category:', project.category);
  console.log('category_ar:', project.category_ar);
  console.log('description:', project.description);
  console.log('description_ar:', project.description_ar);
} else {
  console.log('Project 12 not found');
}

db.close();
