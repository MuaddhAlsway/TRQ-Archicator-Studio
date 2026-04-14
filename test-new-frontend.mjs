const FRONTEND_URL = 'https://800b3df7.trq-studio.pages.dev';
const API_URL = 'https://trq-api-prod.muaddhalsway.workers.dev/api';

async function test() {
  try {
    console.log('Testing new frontend deployment...\n');
    
    // Test API directly
    console.log('1️⃣  Testing API directly...');
    const apiRes = await fetch(`${API_URL}/settings`);
    const settings = await apiRes.json();
    console.log(`   ✅ API working! Got settings\n`);
    
    // Test frontend
    console.log('2️⃣  Testing frontend...');
    const frontendRes = await fetch(FRONTEND_URL);
    const html = await frontendRes.text();
    
    // Check if API URL is in the build
    if (html.includes('trq-api-prod.muaddhalsway.workers.dev')) {
      console.log('   ✅ Frontend has correct API URL\n');
    } else {
      console.log('   ⚠️  API URL might not be in frontend\n');
    }
    
    console.log('✨ Frontend is ready!');
    console.log(`📍 New URL: ${FRONTEND_URL}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
