#!/usr/bin/env node

/**
 * Upload all images from public/ to Cloudflare R2
 * Usage: node upload-to-r2.mjs
 * 
 * SETUP REQUIRED:
 * 1. Enable R2 in Cloudflare Dashboard
 * 2. Create buckets: trq-studio-images, trq-studio-images-preview
 * 3. Create R2 API token with Object Read & Write permissions
 * 4. Set environment variables:
 *    - CLOUDFLARE_ACCOUNT_ID
 *    - CLOUDFLARE_R2_ACCESS_KEY_ID
 *    - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// R2 Configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = 'trq-studio-images';

console.log('\n📋 R2 Upload Configuration Check\n');

if (!R2_ACCOUNT_ID) {
  console.error('❌ Missing: CLOUDFLARE_ACCOUNT_ID');
}
if (!R2_ACCESS_KEY_ID) {
  console.error('❌ Missing: CLOUDFLARE_R2_ACCESS_KEY_ID');
}
if (!R2_SECRET_ACCESS_KEY) {
  console.error('❌ Missing: CLOUDFLARE_R2_SECRET_ACCESS_KEY');
}

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('\n⚠️  SETUP REQUIRED:\n');
  console.error('1. Go to https://dash.cloudflare.com');
  console.error('2. Enable R2 (if not already enabled)');
  console.error('3. Create two buckets:');
  console.error('   - trq-studio-images');
  console.error('   - trq-studio-images-preview');
  console.error('4. Go to R2 → Settings → Create API token');
  console.error('5. Set these environment variables:\n');
  console.error('   export CLOUDFLARE_ACCOUNT_ID="your-account-id"');
  console.error('   export CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"');
  console.error('   export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"\n');
  process.exit(1);
}

console.log('✓ CLOUDFLARE_ACCOUNT_ID:', R2_ACCOUNT_ID.substring(0, 8) + '...');
console.log('✓ CLOUDFLARE_R2_ACCESS_KEY_ID:', R2_ACCESS_KEY_ID.substring(0, 8) + '...');
console.log('✓ CLOUDFLARE_R2_SECRET_ACCESS_KEY: (set)\n');

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const publicDir = path.join(__dirname, 'public');
const excludePatterns = [
  '.DS_Store',
  'Graphik_Collection',
  'larsseit-sans-serif-font-family',
  'GretaTextArabicAR',
  'GretaArabicAR',
  'NewsFontFamily',
  'FontArabic',
  'TRQ STUDIO _ PROJECTS',
  'clientLogos', // Keep client logos in frontend
  'vite.svg',
  '_redirects',
  'Video1.mp4',
  'Video2.mp4',
  'Video3.mp4',
  'SFMada',
];

function shouldExclude(filePath) {
  const relativePath = path.relative(publicDir, filePath);
  return excludePatterns.some(pattern => relativePath.includes(pattern));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadFile(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error.message);
    return false;
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

async function main() {
  console.log('🚀 Starting R2 upload...\n');

  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const files = [];

  walkDir(publicDir, (filePath) => {
    if (shouldExclude(filePath)) {
      skippedCount++;
      return;
    }
    files.push(filePath);
  });

  // Upload files sequentially
  for (const filePath of files) {
    const relativePath = path.relative(publicDir, filePath);
    const s3Key = relativePath.replace(/\\/g, '/'); // Convert Windows paths to forward slashes

    const success = await uploadFile(filePath, s3Key);
    if (success) {
      console.log(`✓ Uploaded: ${s3Key}`);
      uploadedCount++;
    } else {
      failedCount++;
    }
  }

  console.log(`\n✓ Upload complete!`);
  console.log(`  Uploaded: ${uploadedCount} files`);
  console.log(`  Skipped: ${skippedCount} files`);
  if (failedCount > 0) {
    console.log(`  Failed: ${failedCount} files`);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
