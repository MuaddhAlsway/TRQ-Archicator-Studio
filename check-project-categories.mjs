import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function checkCategories() {
  try {
    const response = await fetch(`${API_URL}/projects/published`);
    const projects = await response.json();
    
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
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkCategories();
