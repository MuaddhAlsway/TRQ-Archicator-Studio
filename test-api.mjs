const API_URL = 'http://localhost:5000'; // or your deployed URL

async function testAPI() {
  try {
    console.log('Testing /api/services/active endpoint...\n');
    const res = await fetch(`${API_URL}/api/services/active`);
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
    console.log('\nNote: Make sure your server is running on localhost:5000');
  }
}

testAPI();
