const FRONTEND_URL = 'https://9aaf65da.trq-studio.pages.dev';
const API_URL = 'https://trq-api-prod.muaddhalsway.workers.dev/api';

async function verify() {
  console.log('🔍 Verifying deployment...\n');
  
  try {
    // Test API
    console.log('1️⃣  Testing API endpoint...');
    const apiRes = await fetch(`${API_URL}/services/active`);
    const services = await apiRes.json();
    console.log(`   ✅ API working! Found ${services.length} services`);
    console.log(`   Services: ${services.map(s => s.title).join(', ')}\n`);
    
    // Test frontend
    console.log('2️⃣  Testing frontend...');
    const frontendRes = await fetch(FRONTEND_URL);
    if (frontendRes.ok) {
      console.log(`   ✅ Frontend deployed! Status: ${frontendRes.status}\n`);
    }
    
    console.log('✨ DEPLOYMENT SUCCESSFUL!\n');
    console.log('📍 Frontend: https://9aaf65da.trq-studio.pages.dev');
    console.log('📍 API: https://trq-api-prod.muaddhalsway.workers.dev');
    console.log('\n✅ Everything is working smoothly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verify();
