import fetch from 'node-fetch';

const API_URL = 'https://trq-studio.pages.dev/api';

async function testProjects() {
  console.log('Testing Cloudflare API...\n');
  
  // Test 1: Get all projects
  console.log('1. Fetching all projects...');
  try {
    const res = await fetch(`${API_URL}/projects`);
    const projects = await res.json();
    console.log(`✓ Got ${projects.length} projects`);
    projects.forEach(p => {
      console.log(`  - ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
    });
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
  
  console.log('\n2. Fetching published projects...');
  try {
    const res = await fetch(`${API_URL}/projects/published`);
    const projects = await res.json();
    console.log(`✓ Got ${projects.length} published projects`);
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
  
  console.log('\n3. Testing login...');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'trq2026' }),
    });
    const data = await res.json();
    if (data.success) {
      console.log('✓ Login successful, token:', data.token.substring(0, 20) + '...');
      
      // Test 4: Update a project
      console.log('\n4. Testing update project (ID: 21)...');
      try {
        const updateRes = await fetch(`${API_URL}/projects/21`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            title: 'Serenity Luxe Residence - Updated',
            category: 'residential',
            subcategory: 'Luxury Villa',
            description: 'Test update from Cloudflare',
            status: 'published',
          }),
        });
        const updateData = await updateRes.json();
        if (updateRes.ok) {
          console.log('✓ Update successful:', updateData);
        } else {
          console.error('✗ Update failed:', updateRes.status, updateData);
        }
      } catch (error) {
        console.error('✗ Error:', error.message);
      }
    } else {
      console.error('✗ Login failed:', data.error);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testProjects();
