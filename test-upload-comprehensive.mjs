import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = process.env.API_URL || 'http://localhost:3000';

// Test configuration
const tests = {
  uploadImage: {
    name: 'Upload Image File',
    file: 'public/LOGO.png',
    endpoint: '/api/upload',
    expectedStatus: 200
  },
  uploadVideo: {
    name: 'Upload Video File',
    file: 'public/Video1.mp4',
    endpoint: '/api/upload',
    expectedStatus: 200
  },
  getUploadedFiles: {
    name: 'Get Uploaded Files List',
    endpoint: '/api/uploads',
    method: 'GET',
    expectedStatus: 200
  },
  deleteUploadedFile: {
    name: 'Delete Uploaded File',
    endpoint: '/api/uploads/test-file.txt',
    method: 'DELETE',
    expectedStatus: 200
  }
};

async function runTests() {
  console.log('🧪 Starting Upload System Comprehensive Tests\n');
  console.log(`📍 API Base URL: ${API_BASE}\n`);

  let passed = 0;
  let failed = 0;
  const results = [];

  // Test 1: Upload Image
  try {
    console.log(`Testing: ${tests.uploadImage.name}`);
    const filePath = path.join(__dirname, tests.uploadImage.file);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await fetch(`${API_BASE}${tests.uploadImage.endpoint}`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (response.status === tests.uploadImage.expectedStatus) {
      const data = await response.json();
      console.log(`✅ PASSED - Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...\n`);
      passed++;
      results.push({ test: tests.uploadImage.name, status: 'PASSED', data });
    } else {
      throw new Error(`Expected status ${tests.uploadImage.expectedStatus}, got ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}\n`);
    failed++;
    results.push({ test: tests.uploadImage.name, status: 'FAILED', error: error.message });
  }

  // Test 2: Upload Video
  try {
    console.log(`Testing: ${tests.uploadVideo.name}`);
    const filePath = path.join(__dirname, tests.uploadVideo.file);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await fetch(`${API_BASE}${tests.uploadVideo.endpoint}`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (response.status === tests.uploadVideo.expectedStatus) {
      const data = await response.json();
      console.log(`✅ PASSED - Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...\n`);
      passed++;
      results.push({ test: tests.uploadVideo.name, status: 'PASSED', data });
    } else {
      throw new Error(`Expected status ${tests.uploadVideo.expectedStatus}, got ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}\n`);
    failed++;
    results.push({ test: tests.uploadVideo.name, status: 'FAILED', error: error.message });
  }

  // Test 3: Get Uploaded Files
  try {
    console.log(`Testing: ${tests.getUploadedFiles.name}`);
    const response = await fetch(`${API_BASE}${tests.getUploadedFiles.endpoint}`, {
      method: tests.getUploadedFiles.method || 'GET'
    });

    if (response.status === tests.getUploadedFiles.expectedStatus) {
      const data = await response.json();
      console.log(`✅ PASSED - Status: ${response.status}`);
      console.log(`   Files count: ${Array.isArray(data) ? data.length : 'N/A'}\n`);
      passed++;
      results.push({ test: tests.getUploadedFiles.name, status: 'PASSED', data });
    } else {
      throw new Error(`Expected status ${tests.getUploadedFiles.expectedStatus}, got ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ FAILED - ${error.message}\n`);
    failed++;
    results.push({ test: tests.getUploadedFiles.name, status: 'FAILED', error: error.message });
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Upload system is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }

  return { passed, failed, results };
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
