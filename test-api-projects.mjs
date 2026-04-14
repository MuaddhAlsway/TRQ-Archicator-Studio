import fetch from 'node-fetch';

async function testAPI() {
  console.log('🔍 TESTING API ENDPOINTS\n');
  
  // Test the published projects endpoint
  console.log('Testing: /api/projects/published\n');
  
  try {
    const response = await fetch('https://production.trq-studio.pages.dev/api/projects/published');
    
    if (!response.ok) {
      console.log(`❌ Status: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`Total projects returned: ${Array.isArray(data) ? data.length : 'Not an array'}\n`);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('First 3 projects:\n');
      
      data.slice(0, 3).forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.title}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Image: ${p.image}`);
        console.log(`   Image starts with https: ${p.image?.startsWith('https://') ? '✅' : '❌'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testAPI();
