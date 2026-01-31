import db from './database.js';

// Get all current projects
const projects = db.prepare('SELECT * FROM projects ORDER BY id').all();

console.log('// Current TRQ Projects - Replace the defaultProjects array with this:');
console.log('const defaultProjects = [');

projects.forEach((project, index) => {
  // Parse JSON fields
  const features = typeof project.features === 'string' ? project.features : JSON.stringify(project.features || []);
  const materials = typeof project.materials === 'string' ? project.materials : JSON.stringify(project.materials || []);
  const awards = typeof project.awards === 'string' ? project.awards : JSON.stringify(project.awards || []);
  const team = typeof project.team === 'string' ? project.team : JSON.stringify(project.team || []);
  const gallery = typeof project.gallery === 'string' ? project.gallery : JSON.stringify(project.gallery || []);

  console.log(`  {
    title: '${project.title.replace(/'/g, "\\'")}',
    category: '${project.category}',
    subcategory: '${project.subcategory}',
    description: '${project.description.replace(/'/g, "\\'")}',
    image: '${project.image}',
    year: '${project.year}',
    location: '${project.location}',
    client: '${project.client}',
    size: '${project.size}',
    duration: '${project.duration}',
    detailedDescription: '${(project.detailedDescription || '').replace(/'/g, "\\'")}',
    challenge: '${(project.challenge || '').replace(/'/g, "\\'")}',
    solution: '${(project.solution || '').replace(/'/g, "\\'")}',
    features: ${features},
    materials: ${materials},
    awards: ${awards},
    team: ${team},
    gallery: ${gallery},
    clientQuote: '${(project.clientQuote || '').replace(/'/g, "\\'")}',
    clientName: '${(project.clientName || '').replace(/'/g, "\\'")}',
    status: '${project.status}',
  },`);
});

console.log('];');
