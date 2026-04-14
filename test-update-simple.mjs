import fetch from 'node-fetch';

const API_URL = 'https://trq-studio.pages.dev/api';

async function testUpdate() {
  console.log('Testing update with detailed logging...\n');
  
  // Login first
  console.log('1. Logging in...');
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'trq2026' }),
  });
  const loginData = await loginRes.json();
  console.log('Login response:', loginData);
  
  if (!loginData.success) {
    console.error('Login failed');
    return;
  }
  
  const token = loginData.token;
  console.log('Token:', token.substring(0, 30) + '...\n');
  
  // Get project 21 first
  console.log('2. Getting project 21...');
  const getRes = await fetch(`${API_URL}/projects/21`);
  const project = await getRes.json();
  console.log('Get response status:', getRes.status);
  console.log('Project:', project);
  
  // Try to update
  console.log('\n3. Updating project 21...');
  const updateRes = await fetch(`${API_URL}/projects/21`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Serenity Luxe Residence - Test Update',
      category: 'residential',
      subcategory: 'Luxury Villa',
      description: 'Test update',
      status: 'published',
    }),
  });
  
  console.log('Update response status:', updateRes.status);
  const updateData = await updateRes.json();
  console.log('Update response:', updateData);
}

testUpdate().catch(console.error);
