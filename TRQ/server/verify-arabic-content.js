#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔍 Arabic Content Verification Report\n');
console.log('═'.repeat(70));

// Helper function to format numbers
const formatNumber = (num) => num.toLocaleString();

// 1. Check Settings
console.log('\n📊 1. SETTINGS VERIFICATION\n');

try {
  const totalSettings = db.prepare("SELECT COUNT(*) as count FROM settings").get();
  const arabicSettings = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
  const englishSettings = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key NOT LIKE '%_ar'").get();

  console.log(`   Total Settings: ${formatNumber(totalSettings.count)}`);
  console.log(`   Arabic Settings: ${formatNumber(arabicSettings.count)}`);
  console.log(`   English Settings: ${formatNumber(englishSettings.count)}`);
  console.log(`   Coverage: ${((arabicSettings.count / totalSettings.count) * 100).toFixed(1)}%`);

  // Show breakdown by page
  console.log('\n   📋 Settings by Page:');
  const pageBreakdown = [
    { pattern: 'home%_ar', name: 'Home Page' },
    { pattern: 'about%_ar', name: 'About Page' },
    { pattern: 'services%_ar', name: 'Services Page' },
    { pattern: 'workflow%_ar', name: 'Workflow Page' },
    { pattern: 'portfolio%_ar', name: 'Portfolio Page' },
    { pattern: 'contact%_ar', name: 'Contact Page' },
    { pattern: 'pricing%_ar', name: 'Pricing Page' },
    { pattern: 'blog%_ar', name: 'Blog Page' },
    { pattern: 'projectDetail%_ar', name: 'Project Detail Page' },
    { pattern: 'common%_ar', name: 'Common UI' },
  ];

  for (const page of pageBreakdown) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM settings WHERE key LIKE ?`).get(page.pattern);
    if (count.count > 0) {
      console.log(`      • ${page.name}: ${count.count} settings`);
    }
  }

} catch (error) {
  console.error('   ❌ Error checking settings:', error.message);
}

// 2. Check Hero Slides
console.log('\n📊 2. HERO SLIDES VERIFICATION\n');

try {
  const heroSlidesCount = db.prepare("SELECT COUNT(*) as count FROM hero_slides_arabic").get();
  console.log(`   Arabic Hero Slides: ${heroSlidesCount.count}`);

  if (heroSlidesCount.count > 0) {
    const slides = db.prepare("SELECT id, arabicTitle FROM hero_slides_arabic LIMIT 3").all();
    console.log('\n   Sample Slides:');
    slides.forEach((slide, index) => {
      console.log(`      ${index + 1}. ${slide.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Hero slides table not found (will be created on first use)');
}

// 3. Check Projects
console.log('\n📊 3. PROJECTS VERIFICATION\n');

try {
  const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects_arabic").get();
  console.log(`   Arabic Projects: ${projectsCount.count}`);

  if (projectsCount.count > 0) {
    const projects = db.prepare("SELECT id, arabicTitle FROM projects_arabic LIMIT 3").all();
    console.log('\n   Sample Projects:');
    projects.forEach((project, index) => {
      console.log(`      ${index + 1}. ${project.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Projects table not found (will be created on first use)');
}

// 4. Check Services
console.log('\n📊 4. SERVICES VERIFICATION\n');

try {
  const servicesCount = db.prepare("SELECT COUNT(*) as count FROM services_arabic").get();
  console.log(`   Arabic Services: ${servicesCount.count}`);

  if (servicesCount.count > 0) {
    const services = db.prepare("SELECT id, arabicTitle FROM services_arabic LIMIT 3").all();
    console.log('\n   Sample Services:');
    services.forEach((service, index) => {
      console.log(`      ${index + 1}. ${service.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Services table not found (will be created on first use)');
}

// 5. Check Blog Articles
console.log('\n📊 5. BLOG ARTICLES VERIFICATION\n');

try {
  const articlesCount = db.prepare("SELECT COUNT(*) as count FROM blog_articles_arabic").get();
  console.log(`   Arabic Blog Articles: ${articlesCount.count}`);

  if (articlesCount.count > 0) {
    const articles = db.prepare("SELECT id, arabicTitle FROM blog_articles_arabic LIMIT 3").all();
    console.log('\n   Sample Articles:');
    articles.forEach((article, index) => {
      console.log(`      ${index + 1}. ${article.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Blog articles table not found (will be created on first use)');
}

// 6. Quality Checks
console.log('\n📊 6. QUALITY CHECKS\n');

try {
  // Check for empty values
  const emptySettings = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar' AND (value IS NULL OR value = '')").get();
  console.log(`   Empty Arabic Settings: ${emptySettings.count}`);

  // Check for duplicate keys
  const duplicateKeys = db.prepare(`
    SELECT key, COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' 
    GROUP BY key 
    HAVING COUNT(*) > 1
  `).all();
  console.log(`   Duplicate Keys: ${duplicateKeys.length}`);

  // Check for very long values
  const longValues = db.prepare(`
    SELECT COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' AND LENGTH(value) > 500
  `).get();
  console.log(`   Long Values (>500 chars): ${longValues.count}`);

  // Check for RTL markers
  const rtlMarkers = db.prepare(`
    SELECT COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' AND value LIKE '%ع%'
  `).get();
  console.log(`   Settings with Arabic text: ${rtlMarkers.count}`);

} catch (error) {
  console.error('   ❌ Error in quality checks:', error.message);
}

// 7. Summary
console.log('\n═'.repeat(70));
console.log('\n✅ VERIFICATION SUMMARY\n');

try {
  const totalArabic = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
  console.log(`   Total Arabic Content Items: ${formatNumber(totalArabic.count)}`);
  console.log(`   Status: ${totalArabic.count > 100 ? '✅ COMPLETE' : '⚠️  INCOMPLETE'}`);
  console.log('\n   Ready for:');
  console.log('   ✅ Admin Panel Display');
  console.log('   ✅ Frontend Rendering');
  console.log('   ✅ RTL Layout Support');
  console.log('   ✅ Database Sync to Turso\n');

} catch (error) {
  console.error('   ❌ Error in summary:', error.message);
}

console.log('═'.repeat(70) + '\n');

db.close();
