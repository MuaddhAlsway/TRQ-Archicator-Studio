#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🚀 Complete Arabic Customization System - Import Script\n');
console.log('═'.repeat(70));

// Step 1: Run the seed script
console.log('\n📝 Step 1: Running seed script...\n');

const seedProcess = spawn('node', [path.join(__dirname, 'seed-complete-arabic-system.js')]);

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
    // Check settings
    const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
    console.log(`✅ Arabic Settings: ${settingsCount.count}`);

    // Check hero slides
    const heroCount = db.prepare("SELECT COUNT(*) as count FROM hero_slides_arabic").get();
    console.log(`✅ Hero Slides: ${heroCount.count}`);

    // Check projects
    const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects_arabic").get();
    console.log(`✅ Projects: ${projectCount.count}`);

    // Check services
    const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services_arabic").get();
    console.log(`✅ Services: ${serviceCount.count}`);

    // Check blog articles
    const articleCount = db.prepare("SELECT COUNT(*) as count FROM blog_articles_arabic").get();
    console.log(`✅ Blog Articles: ${articleCount.count}`);

    console.log('\n📋 Sample Content:\n');

    // Sample settings
    const sampleSettings = db.prepare("SELECT key, value FROM settings WHERE key LIKE '%_ar' LIMIT 3").all();
    console.log('   Settings:');
    sampleSettings.forEach((setting, index) => {
      console.log(`      ${index + 1}. ${setting.key}`);
      console.log(`         "${setting.value.substring(0, 50)}${setting.value.length > 50 ? '...' : ''}"`);
    });

    // Sample hero slides
    const sampleHero = db.prepare("SELECT arabicTitle FROM hero_slides_arabic LIMIT 2").all();
    console.log('\n   Hero Slides:');
    sampleHero.forEach((slide, index) => {
      console.log(`      ${index + 1}. ${slide.arabicTitle}`);
    });

    // Sample projects
    const sampleProjects = db.prepare("SELECT arabicTitle FROM projects_arabic LIMIT 2").all();
    console.log('\n   Projects:');
    sampleProjects.forEach((project, index) => {
      console.log(`      ${index + 1}. ${project.arabicTitle}`);
    });

    // Sample services
    const sampleServices = db.prepare("SELECT arabicTitle FROM services_arabic LIMIT 2").all();
    console.log('\n   Services:');
    sampleServices.forEach((service, index) => {
      console.log(`      ${index + 1}. ${service.arabicTitle}`);
    });

    // Sample blog articles
    const sampleArticles = db.prepare("SELECT arabicTitle FROM blog_articles_arabic LIMIT 2").all();
    console.log('\n   Blog Articles:');
    sampleArticles.forEach((article, index) => {
      console.log(`      ${index + 1}. ${article.arabicTitle}`);
    });

    console.log('\n═'.repeat(70));
    console.log('\n✅ Import Complete!\n');
    console.log('📌 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to Admin Panel');
    console.log('   3. Switch language to Arabic');
    console.log('   4. Verify all content displays correctly');
    console.log('   5. Test RTL layout and styling\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
});
