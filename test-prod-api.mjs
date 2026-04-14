const API_URL = 'https://trq-api-prod.muaddhalsway.workers.dev/api';

async function testAPI() {
  try {
    console.log('Testing production API endpoint...\n');
    const res = await fetch(`${API_URL}/services/active`);
    const data = await res.json();
    
    console.log('API Response:');
    data.forEach(service => {
      console.log(`ID: ${service.id}, Title: ${service.title}`);
    });
    
    // Check for Event Design
    const hasEvent = data.some(s => s.title.includes('Event'));
    console.log(`\n✓ Contains "Event": ${hasEvent}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
