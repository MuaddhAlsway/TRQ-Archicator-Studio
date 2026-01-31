import db from './database.js';

try {
  const projects = db.prepare('SELECT id, title, image FROM projects ORDER BY id').all();
  
  console.log(`Total projects: ${projects.length}\n`);
  projects.forEach(project => {
    console.log(`ID ${project.id}: ${project.title}`);
    console.log(`  Image: ${project.image}`);
  });
} catch (error) {
  console.error('Error:', error);
}
