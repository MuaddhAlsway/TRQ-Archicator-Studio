import Database from 'better-sqlite3';

const db = new Database('./server/trq.db');

const projects = db.prepare('SELECT id, title, category FROM projects WHERE published = 1 ORDER BY id').all();

console.log('Projects with categories:');
projects.forEach(p => {
  console.log(`ID: ${p.id}, Title: ${p.title}, Category: ${p.category || 'MISSING'}`);
});

console.log('\n\nProjects missing categories:');
const missing = projects.filter(p => !p.category);
console.log(`Total missing: ${missing.length} out of ${projects.length}`);
missing.forEach(p => {
  console.log(`ID: ${p.id}, Title: ${p.title}`);
});

db.close();
