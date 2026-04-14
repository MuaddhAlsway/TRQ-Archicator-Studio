import db from './server/database.js';

const projects = db.prepare('SELECT id, title, status FROM projects ORDER BY id').all();
console.log('Total projects:', projects.length);
projects.forEach(p => {
  console.log(`ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
});
