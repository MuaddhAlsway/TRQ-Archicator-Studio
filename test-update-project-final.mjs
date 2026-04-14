import fetch from 'node-fetch';

const API_URL = 'https://trq-studio.pages.dev/api';

async function testUpdateProject() {
  console.log('Testing Update Project functionality...\n');
  
  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'trq2026' }),
    });
    const loginData = await loginRes.json();
    
    if (!loginData.success) {
      console.error('✗ Login failed');
      return;
    }
    
    const token = loginData.token;
    console.log('✓ Login successful\n');
    
    // Step 2: Get project 21
    console.log('2. Getting project 21...');
    const getRes = await fetch(`${API_URL}/projects/21`);
    const project = await getRes.json();
    console.log(`✓ Got project: ${project.title}`);
    console.log(`  Current duration: ${project.duration}\n`);
    
    // Step 3: Update project 21
    console.log('3. Updating project 21...');
    const updateRes = await fetch(`${API_URL}/projects/21`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: project.title,
        category: project.category,
        subcategory: project.subcategory,
        description: project.description,
        image: project.image,
        year: project.year,
        location: project.location,
        client: project.client,
        size: project.size,
        duration: '9 months (Updated)',
        detailedDescription: project.detailedDescription,
        challenge: project.challenge,
        solution: project.solution,
        features: project.features,
        materials: project.materials,
        awards: project.awards,
        team: project.team,
        gallery: project.gallery,
        clientQuote: project.clientQuote,
        clientName: project.clientName,
        status: project.status,
      }),
    });
    
    console.log(`Update response status: ${updateRes.status}`);
    const updateData = await updateRes.json();
    
    if (updateRes.ok) {
      console.log('✓ Update successful:', updateData);
      
      // Step 4: Verify update
      console.log('\n4. Verifying update...');
      const verifyRes = await fetch(`${API_URL}/projects/21`);
      const updatedProject = await verifyRes.json();
      console.log(`✓ New duration: ${updatedProject.duration}`);
      
      if (updatedProject.duration === '9 months (Updated)') {
        console.log('\n✅ UPDATE PROJECT BUTTON WORKS PERFECTLY ON CLOUDFLARE!');
      } else {
        console.log('\n⚠️ Update may not have persisted');
      }
    } else {
      console.error('✗ Update failed:', updateRes.status, updateData);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUpdateProject();
