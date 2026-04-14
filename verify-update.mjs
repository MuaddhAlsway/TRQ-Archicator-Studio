import fetch from 'node-fetch';

async function verify() {
  try {
    const response = await fetch('https://trq-studio.pages.dev/api/settings');
    const data = await response.json();
    
    // Find the aboutExpertise2Title in the response
    let found = false;
    for (const [key, value] of Object.entries(data)) {
      if (key === 'aboutExpertise2Title') {
        console.log(`✓ Found: ${key} = ${value}`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('aboutExpertise2Title not found in response');
      console.log('Response keys:', Object.keys(data).filter(k => k.includes('xpertise')));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verify();
