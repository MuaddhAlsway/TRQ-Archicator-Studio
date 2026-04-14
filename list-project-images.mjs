import db from './server/database.js';

const projects = db.prepare('SELECT id, title, image, gallery FROM projects ORDER BY id').all();

console.log('Project Images Summary:\n');
console.log('ID | Title | Image Path | Gallery Count');
console.log('---|-------|------------|---------------');

projects.forEach(project => {
  const gallery = project.gallery ? JSON.parse(project.gallery) : [];
  console.log(`${project.id} | ${project.title.substring(0, 20)} | ${project.image} | ${gallery.length}`);
});

console.log('\n\nTotal projects:', projects.length);
console.log('\nNote: Images need to be served from a CDN or backend.');
console.log('Current approach: Videos are in dist folder, images need separate solution.');
