import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Upload System Validation\n');
console.log('='.repeat(50));

const checks = [];

// Check 1: Verify server/index.js has upload routes
console.log('\n1️⃣  Checking server/index.js for upload routes...');
try {
  const serverIndex = fs.readFileSync(path.join(__dirname, 'server/index.js'), 'utf8');
  const hasUploadRoute = serverIndex.includes('/api/upload') || serverIndex.includes('upload-handler');
  const hasUploadHandler = fs.existsSync(path.join(__dirname, 'server/upload-handler.js'));
  
  if (hasUploadRoute && hasUploadHandler) {
    console.log('✅ Upload routes configured');
    checks.push({ check: 'Upload routes', status: 'PASS' });
  } else {
    console.log('⚠️  Upload routes may not be fully configured');
    checks.push({ check: 'Upload routes', status: 'WARN' });
  }
} catch (error) {
  console.log(`❌ Error checking server/index.js: ${error.message}`);
  checks.push({ check: 'Upload routes', status: 'FAIL', error: error.message });
}

// Check 2: Verify upload-handler.js exists and has required functions
console.log('\n2️⃣  Checking upload-handler.js...');
try {
  const uploadHandler = fs.readFileSync(path.join(__dirname, 'server/upload-handler.js'), 'utf8');
  const hasMulter = uploadHandler.includes('multer') || uploadHandler.includes('FormData');
  const hasUploadFunction = uploadHandler.includes('upload') || uploadHandler.includes('handleUpload');
  
  if (hasMulter && hasUploadFunction) {
    console.log('✅ Upload handler properly configured');
    checks.push({ check: 'Upload handler', status: 'PASS' });
  } else {
    console.log('⚠️  Upload handler may be incomplete');
    checks.push({ check: 'Upload handler', status: 'WARN' });
  }
} catch (error) {
  console.log(`❌ Error checking upload-handler.js: ${error.message}`);
  checks.push({ check: 'Upload handler', status: 'FAIL', error: error.message });
}

// Check 3: Verify public/uploads directory exists
console.log('\n3️⃣  Checking public/uploads directory...');
try {
  const uploadsDir = path.join(__dirname, 'public/uploads');
  if (fs.existsSync(uploadsDir)) {
    const stats = fs.statSync(uploadsDir);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`✅ public/uploads directory exists (${files.length} files)`);
      checks.push({ check: 'Uploads directory', status: 'PASS' });
    } else {
      console.log('❌ public/uploads is not a directory');
      checks.push({ check: 'Uploads directory', status: 'FAIL' });
    }
  } else {
    console.log('⚠️  public/uploads directory does not exist (will be created on first upload)');
    checks.push({ check: 'Uploads directory', status: 'WARN' });
  }
} catch (error) {
  console.log(`❌ Error checking uploads directory: ${error.message}`);
  checks.push({ check: 'Uploads directory', status: 'FAIL', error: error.message });
}

// Check 4: Verify environment variables
console.log('\n4️⃣  Checking environment variables...');
try {
  const envFiles = ['.env.development', '.env.production'];
  let envConfigured = false;
  
  for (const envFile of envFiles) {
    const envPath = path.join(__dirname, envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('UPLOAD') || envContent.includes('API_URL')) {
        envConfigured = true;
        console.log(`✅ Environment variables configured in ${envFile}`);
      }
    }
  }
  
  if (envConfigured) {
    checks.push({ check: 'Environment variables', status: 'PASS' });
  } else {
    console.log('⚠️  Upload-related environment variables not found');
    checks.push({ check: 'Environment variables', status: 'WARN' });
  }
} catch (error) {
  console.log(`❌ Error checking environment variables: ${error.message}`);
  checks.push({ check: 'Environment variables', status: 'FAIL', error: error.message });
}

// Check 5: Verify package.json has required dependencies
console.log('\n5️⃣  Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/package.json'), 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = ['express', 'multer', 'cors'];
  const missingDeps = requiredDeps.filter(dep => !deps[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies installed');
    checks.push({ check: 'Dependencies', status: 'PASS' });
  } else {
    console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
    checks.push({ check: 'Dependencies', status: 'WARN', missing: missingDeps });
  }
} catch (error) {
  console.log(`❌ Error checking dependencies: ${error.message}`);
  checks.push({ check: 'Dependencies', status: 'FAIL', error: error.message });
}

// Check 6: Verify test files exist
console.log('\n6️⃣  Checking test files...');
try {
  const testFiles = [
    'test-upload-system.mjs',
    'test-upload-comprehensive.mjs',
    'validate-upload-system.mjs'
  ];
  
  const existingTests = testFiles.filter(file => 
    fs.existsSync(path.join(__dirname, file))
  );
  
  console.log(`✅ Test files available: ${existingTests.length}/${testFiles.length}`);
  checks.push({ check: 'Test files', status: 'PASS', count: existingTests.length });
} catch (error) {
  console.log(`❌ Error checking test files: ${error.message}`);
  checks.push({ check: 'Test files', status: 'FAIL', error: error.message });
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary\n');

const passed = checks.filter(c => c.status === 'PASS').length;
const warned = checks.filter(c => c.status === 'WARN').length;
const failed = checks.filter(c => c.status === 'FAIL').length;

console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warned}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${checks.length}\n`);

if (failed === 0) {
  console.log('🎉 Upload system is properly configured!\n');
  console.log('Next steps:');
  console.log('1. Start the server: npm run dev (in server directory)');
  console.log('2. Run tests: node test-upload-comprehensive.mjs');
  console.log('3. Test upload via API: POST /api/upload with file');
} else {
  console.log('⚠️  Please fix the failed checks above.\n');
}

console.log('='.repeat(50));
