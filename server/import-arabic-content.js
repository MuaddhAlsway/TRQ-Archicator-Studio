#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🚀 Arabic Content Import Script\n');
console.log('═'.repeat(60));

// Step 1: Run the seed script
console.log('\n📝 Step 1: Running seed script...\n');

const seedProcess = spawn('node', [path.join(__dirname, 'seed-complete-arabic-content.js')]);

seedProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

seedProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

seedProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('\n❌ Seed script failed');
    process.exit(1);
  }

  // Step 2: Verify the data
  console.log('\n📊 Step 2: Verifying imported data...\n');

  try {
    const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
    console.log(`✅ Arabic Settings: ${settingsCount.count}`);

    const sampleSettings = db.prepare("SELECT key, value FROM settings WHERE key LIKE '%_ar' LIMIT 5").all();
    console.log('\n📋 Sample Settings:');
    sampleSettings.forEach((setting, index) => {
      console.log(`   ${index + 1}. ${setting.key}`);
      console.log(`      Value: "${setting.value.substring(0, 60)}${setting.value.length > 60 ? '...' : ''}"`);
    });

    console.log('\n═'.repeat(60));
    console.log('\n✅ Import Complete!\n');
    console.log('📌 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to Admin Panel');
    console.log('   3. Switch language to Arabic');
    console.log('   4. Verify all content displays correctly\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
});
