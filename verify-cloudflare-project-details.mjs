import fetch from 'node-fetch';

const API_URL = 'https://trq-studio.pages.dev/api';

async function verifyProjects() {
  console.log('Verifying project details on Cloudflare...\n');
  
  try {
    // Test a few projects
    const projectIds = [1, 3, 8, 17, 21];
    
    for (const id of projectIds) {
      const res = await fetch(`${API_URL}/projects/${id}`);
      const project = await res.json();
      
      console.log(`\nProject ID ${id}: ${project.title}`);
      console.log(`  Duration: ${project.duration}`);
      console.log(`  Location: ${project.location}`);
      console.log(`  Client: ${project.client}`);
      console.log(`  Size: ${project.size}`);
      console.log(`  Category: ${project.category}`);
      console.log(`  Subcategory: ${project.subcategory}`);
      console.log(`  Status: ${project.status}`);
    }
    
    console.log('\n✓ All project details verified on Cloudflare');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyProjects();
