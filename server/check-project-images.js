import db from './database.js';

try {
  const projects = db.prepare('SELECT id, title, image, gallery FROM projects LIMIT 5').all();
  
  console.log('Project Images Debug:\n');
  projects.forEach(project => {
    console.log(`Project ${project.id}: ${project.title}`);
    console.log(`  Main Image: ${project.image}`);
    if (project.gallery) {
      try {
        const gallery = JSON.parse(project.gallery);
        console.log(`  Gallery (${gallery.length} images):`);
        gallery.slice(0, 3).forEach((img, idx) => {
          console.log(`    ${idx + 1}. ${img}`);
        });
        if (gallery.length > 3) {
          console.log(`    ... and ${gallery.length - 3} more`);
        }
      } catch (e) {
        console.log(`  Gallery: ${project.gallery}`);
      }
    }
    console.log('');
  });
} catch (error) {
  console.error('Error:', error);
}
