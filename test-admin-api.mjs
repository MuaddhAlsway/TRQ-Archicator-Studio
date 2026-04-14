import fetch from 'node-fetch';

const API_URL = 'https://trq-api-prod.muaddhalsway.workers.dev/api';

async function testAPI() {
  console.log('🧪 Testing Admin API Endpoints\n');
  
  const endpoints = [
    { name: 'Slides', url: '/slides' },
    { name: 'Slides Active', url: '/slides/active' },
    { name: 'Projects', url: '/projects' },
    { name: 'Services', url: '/services' },
    { name: 'Settings', url: '/settings' },
    { name: 'About Videos', url: '/about-videos' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint.url}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = Array.isArray(data) ? data.length : Object.keys(data).length;
        console.log(`✓ ${endpoint.name}: ${count} items`);
      } else {
        console.log(`✗ ${endpoint.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`✗ ${endpoint.name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ API test complete!');
}

testAPI().catch(console.error);
