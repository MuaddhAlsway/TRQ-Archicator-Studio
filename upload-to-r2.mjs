#!/usr/bin/env node

/**
 * Multi-part upload to Cloudflare R2
 * Uploads public folder in chunks to avoid size limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Configuration
const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks
const UPLOAD_PARTS = {
  'part1': ['uploads', 'TRQ STUDIO _ PROJECTS'],
  'part2': ['CottonSkin', 'playGround', 'Modern minimalist', '011'],
  'part3': ['DIRIYAH PARADE', 'ALULAH', 'PAWS & PARTNERS', 'daria'],
  'part4': ['DIRIYAH MARKET', '8. Coffee', 'coffeE', 'ApartmentA'],
  'part5': ['REC. HEAVEN', 'confirmed', 'DIRIYAH NATIONAL DAY', 'CLASSIC'],
  'part6': ['ARYASH', 'Half million', 'HERITAGE Day', 'Luxe Residence'],
  'part7': ['Modern LuxuryLiving', 'Modern minimalist', 'Oasis', 'QUALITY'],
  'part8': ['RAFAL APARTMENT', 'RSG BOOTH', 'TRQ STUDIO', 'Contemporary'],
  'part9': ['25. Cliff house', 'A Fusion', 'ALFUNDATIONDay', 'ALMajid'],
  'part10': ['ALULAH', 'ApartmentA', 'ARYASH', 'clientLogos', 'confirmed', 'H & P', 'Luxe', 'Oasis'],
  'fonts': ['SFMada-Bold.otf', 'SFMada-Regular.otf', 'SFMada-Regular2.otf', 'LOGO.png', 'barlogo.png'],
  'videos': ['Video1.mp4', 'Video2.mp4', 'Video3.mp4']
};

function getFilesInPart(partName) {
  const patterns = UPLOAD_PARTS[partName] || [];
  const files = [];
  
  function walkDir(dir) {
    const entries = fs.readdirSync(dir);
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Check if this directory matches any pattern
        const matches = patterns.some(pattern => 
          entry.includes(pattern) || pattern.includes(entry)
        );
        if (matches) {
          walkDir(fullPath);
        }
      } else {
        // Check if file matches any pattern
        const matches = patterns.some(pattern => 
          entry.includes(pattern) || entry === pattern
        );
        if (matches) {
          files.push(fullPath);
        }
      }
    });
  }
  
  walkDir(publicDir);
  return files;
}

function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(2) + ' MB';
}

async function uploadPart(partName) {
  console.log(`\n📦 Uploading ${partName}...`);
  
  const files = getFilesInPart(partName);
  let totalSize = 0;
  
  files.forEach(file => {
    const stat = fs.statSync(file);
    totalSize += stat.size;
  });
  
  console.log(`   Files: ${files.length}`);
  console.log(`   Size: ${formatSize(totalSize)}`);
  
  // Simulate upload
  console.log(`   ✓ Ready to upload to R2`);
  console.log(`   Command: wrangler r2 object put trq-images/${partName}/* --recursive`);
  
  return {
    part: partName,
    files: files.length,
    size: totalSize
  };
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Multi-Part Upload to Cloudflare R2                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const parts = Object.keys(UPLOAD_PARTS);
  let totalFiles = 0;
  let totalSize = 0;
  
  console.log('\n📋 Upload Plan:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const part of parts) {
    const result = await uploadPart(part);
    totalFiles += result.files;
    totalSize += result.size;
  }
  
  console.log('\n📊 Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total Parts: ${parts.length}`);
  console.log(`   Total Files: ${totalFiles}`);
  console.log(`   Total Size: ${formatSize(totalSize)}`);
  
  console.log('\n🚀 Upload Instructions:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Create R2 bucket:');
  console.log('   wrangler r2 bucket create trq-images');
  console.log('\n2. Upload each part:');
  
  for (const part of parts) {
    console.log(`   wrangler r2 object put trq-images/${part}/* --recursive`);
  }
  
  console.log('\n3. Configure Cloudflare Pages:');
  console.log('   - Add R2 bucket binding');
  console.log('   - Update image URLs to R2');
  
  console.log('\n✅ Multi-part upload plan ready!');
}

main().catch(console.error);
