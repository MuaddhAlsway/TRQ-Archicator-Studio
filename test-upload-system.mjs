#!/usr/bin/env node

/**
 * Upload System Verification Script
 * Tests the complete image/video upload flow without deploying images
 * 
 * This script verifies:
 * 1. Backend API is running and accessible
 * 2. Authentication works correctly
 * 3. Upload endpoint accepts files
 * 4. File validation works (type, size)
 * 5. Error handling is proper
 * 6. File storage is working
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = 'http://localhost:4242/api';
const TEST_ADMIN_EMAIL = 'admin@trq.com';
const TEST_ADMIN_PASSWORD = 'admin123';

let accessToken = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(title, 'cyan');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Test 1: Check if backend is running
async function testBackendConnection() {
  logSection('TEST 1: Backend Connection');
  
  try {
    const res = await fetch(`${API_URL}/health`);
    if (res.ok) {
      const data = await res.json();
      logSuccess(`Backend is running: ${data.status}`);
      return true;
    } else {
      logError(`Backend returned status ${res.status}`);
      return false;
    }
  } catch (err) {
    logError(`Cannot connect to backend at ${API_URL}`);
    logInfo('Make sure to run: cd server && node index.js');
    return false;
  }
}

// Test 2: Authentication
async function testAuthentication() {
  logSection('TEST 2: Authentication');
  
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_ADMIN_EMAIL,
        password: TEST_ADMIN_PASSWORD,
      }),
    });

    if (!res.ok) {
      logError(`Login failed with status ${res.status}`);
      const data = await res.json();
      logInfo(`Response: ${JSON.stringify(data)}`);
      return false;
    }

    const data = await res.json();
    if (data.accessToken) {
      accessToken = data.accessToken;
      logSuccess(`Authentication successful`);
      logInfo(`Token: ${accessToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('No access token in response');
      return false;
    }
  } catch (err) {
    logError(`Authentication error: ${err.message}`);
    return false;
  }
}

// Test 3: Create test files
function createTestFiles() {
  logSection('TEST 3: Creating Test Files');
  
  const testDir = path.join(__dirname, '.test-uploads');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create a small test image (1x1 PNG)
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
    0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x01, 0x5b, 0x0b, 0xfb, 0xd7, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  const testImagePath = path.join(testDir, 'test-image.png');
  fs.writeFileSync(testImagePath, pngBuffer);
  logSuccess(`Created test image: ${testImagePath}`);

  // Create a small test video (minimal MP4)
  const mp4Buffer = Buffer.from([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    0x00, 0x00, 0x00, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    0x6d, 0x70, 0x34, 0x31,
  ]);

  const testVideoPath = path.join(testDir, 'test-video.mp4');
  fs.writeFileSync(testVideoPath, mp4Buffer);
  logSuccess(`Created test video: ${testVideoPath}`);

  return { testImagePath, testVideoPath, testDir };
}

// Test 4: Upload image
async function testImageUpload(imagePath) {
  logSection('TEST 4: Image Upload');
  
  try {
    const formData = new FormData();
    const fileStream = fs.readFileSync(imagePath);
    const blob = new Blob([fileStream], { type: 'image/png' });
    formData.append('file', blob, 'test-image.png');

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      logError(`Upload failed with status ${res.status}`);
      const data = await res.json();
      logInfo(`Response: ${JSON.stringify(data)}`);
      return null;
    }

    const data = await res.json();
    if (data.success && data.url) {
      logSuccess(`Image uploaded successfully`);
      logInfo(`URL: ${data.url}`);
      logInfo(`Size: ${(data.size / 1024).toFixed(2)} KB`);
      logInfo(`MIME: ${data.mimetype}`);
      return data.filename;
    } else {
      logError('Upload response missing success or url');
      return null;
    }
  } catch (err) {
    logError(`Image upload error: ${err.message}`);
    return null;
  }
}

// Test 5: Upload video
async function testVideoUpload(videoPath) {
  logSection('TEST 5: Video Upload');
  
  try {
    const formData = new FormData();
    const fileStream = fs.readFileSync(videoPath);
    const blob = new Blob([fileStream], { type: 'video/mp4' });
    formData.append('file', blob, 'test-video.mp4');

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      logError(`Upload failed with status ${res.status}`);
      const data = await res.json();
      logInfo(`Response: ${JSON.stringify(data)}`);
      return null;
    }

    const data = await res.json();
    if (data.success && data.url) {
      logSuccess(`Video uploaded successfully`);
      logInfo(`URL: ${data.url}`);
      logInfo(`Size: ${(data.size / 1024).toFixed(2)} KB`);
      logInfo(`MIME: ${data.mimetype}`);
      return data.filename;
    } else {
      logError('Upload response missing success or url');
      return null;
    }
  } catch (err) {
    logError(`Video upload error: ${err.message}`);
    return null;
  }
}

// Test 6: Test invalid file type
async function testInvalidFileType() {
  logSection('TEST 6: Invalid File Type Validation');
  
  try {
    const formData = new FormData();
    const blob = new Blob(['invalid content'], { type: 'text/plain' });
    formData.append('file', blob, 'test.txt');

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (res.status === 400) {
      const data = await res.json();
      logSuccess(`Invalid file type correctly rejected`);
      logInfo(`Error message: ${data.message}`);
      return true;
    } else {
      logWarning(`Expected 400 status, got ${res.status}`);
      return false;
    }
  } catch (err) {
    logError(`Validation test error: ${err.message}`);
    return false;
  }
}

// Test 7: Test missing authentication
async function testMissingAuth() {
  logSection('TEST 7: Missing Authentication');
  
  try {
    const formData = new FormData();
    const blob = new Blob(['test'], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 401 || res.status === 403) {
      logSuccess(`Unauthenticated request correctly rejected`);
      logInfo(`Status: ${res.status}`);
      return true;
    } else {
      logWarning(`Expected 401/403 status, got ${res.status}`);
      return false;
    }
  } catch (err) {
    logError(`Auth test error: ${err.message}`);
    return false;
  }
}

// Test 8: Delete uploaded file
async function testFileDelete(filename) {
  logSection('TEST 8: File Deletion');
  
  if (!filename) {
    logWarning('No filename to delete (previous upload failed)');
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/upload/${filename}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      logSuccess(`File deleted successfully`);
      logInfo(`Message: ${data.message}`);
      return true;
    } else {
      logError(`Delete failed with status ${res.status}`);
      const data = await res.json();
      logInfo(`Response: ${JSON.stringify(data)}`);
      return false;
    }
  } catch (err) {
    logError(`File deletion error: ${err.message}`);
    return false;
  }
}

// Test 9: Verify uploads directory
function testUploadsDirectory() {
  logSection('TEST 9: Uploads Directory');
  
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  
  if (fs.existsSync(uploadsDir)) {
    logSuccess(`Uploads directory exists: ${uploadsDir}`);
    
    const files = fs.readdirSync(uploadsDir);
    logInfo(`Files in directory: ${files.length}`);
    
    if (files.length > 0) {
      logInfo('Recent files:');
      files.slice(-5).forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        logInfo(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
    }
    
    return true;
  } else {
    logWarning(`Uploads directory does not exist: ${uploadsDir}`);
    logInfo('It will be created on first upload');
    return false;
  }
}

// Cleanup test files
function cleanupTestFiles(testDir) {
  logSection('Cleanup');
  
  try {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
      logSuccess('Test files cleaned up');
    }
  } catch (err) {
    logWarning(`Cleanup error: ${err.message}`);
  }
}

// Main test runner
async function runTests() {
  log('\n', 'cyan');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         UPLOAD SYSTEM VERIFICATION TEST SUITE              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const results = {};

  // Run tests
  results.backend = await testBackendConnection();
  if (!results.backend) {
    logError('\nCannot proceed without backend. Exiting.');
    process.exit(1);
  }

  results.auth = await testAuthentication();
  if (!results.auth) {
    logError('\nCannot proceed without authentication. Exiting.');
    process.exit(1);
  }

  const { testImagePath, testVideoPath, testDir } = createTestFiles();

  let uploadedImageFilename = null;
  let uploadedVideoFilename = null;

  results.imageUpload = !!(uploadedImageFilename = await testImageUpload(testImagePath));
  results.videoUpload = !!(uploadedVideoFilename = await testVideoUpload(testVideoPath));
  results.invalidFile = await testInvalidFileType();
  results.missingAuth = await testMissingAuth();
  results.imageDelete = await testFileDelete(uploadedImageFilename);
  results.videoDelete = await testFileDelete(uploadedVideoFilename);
  results.uploadsDir = testUploadsDirectory();

  cleanupTestFiles(testDir);

  // Summary
  logSection('TEST SUMMARY');
  
  const tests = [
    ['Backend Connection', results.backend],
    ['Authentication', results.auth],
    ['Image Upload', results.imageUpload],
    ['Video Upload', results.videoUpload],
    ['Invalid File Rejection', results.invalidFile],
    ['Missing Auth Rejection', results.missingAuth],
    ['Image Deletion', results.imageDelete],
    ['Video Deletion', results.videoDelete],
    ['Uploads Directory', results.uploadsDir],
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(([name, result]) => {
    if (result) {
      logSuccess(name);
      passed++;
    } else {
      logError(name);
      failed++;
    }
  });

  log(`\nTotal: ${passed} passed, ${failed} failed\n`, 'cyan');

  if (failed === 0) {
    logSuccess('✓ All tests passed! Upload system is working correctly.');
    log('\nYou can now:', 'green');
    log('1. Add images manually through the admin panel', 'green');
    log('2. Deploy the website', 'green');
    log('3. Images will be stored in /public/uploads/', 'green');
  } else {
    logError('✗ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(err => {
  logError(`Fatal error: ${err.message}`);
  process.exit(1);
});
