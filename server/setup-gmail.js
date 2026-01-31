import { getAuthUrl, saveToken } from './gmail-service.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n=== Gmail API Setup ===\n');
  console.log('This script will help you set up Gmail API authentication.\n');

  try {
    // Step 1: Get auth URL
    console.log('Step 1: Getting authorization URL...');
    const authUrl = getAuthUrl();
    console.log('\nPlease visit this URL to authorize the application:');
    console.log(authUrl);
    console.log('\n');

    // Step 2: Get authorization code
    const code = await question('Enter the authorization code from the URL: ');

    // Step 3: Save token
    console.log('\nStep 2: Saving authorization token...');
    await saveToken(code);

    console.log('\n✓ Gmail API setup complete!');
    console.log('You can now send emails using the Gmail API.\n');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();
