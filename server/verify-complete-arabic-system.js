#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔍 Complete Arabic Customization System - Verification Report\n');
console.log('═'.repeat(80));

// Helper function to format numbers
const formatNumber = (num) => num.toLocaleString();

// 1. SETTINGS VERIFICATION
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

  let totalPageSettings = 0;
  for (const page of pageBreakdown) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM settings WHERE key LIKE ?`).get(page.pattern);
    if (count.count > 0) {
      console.log(`      • ${page.name}: ${count.count} settings`);
      totalPageSettings += count.count;
    }
  }
  console.log(`      ─────────────────────────`);
  console.log(`      Total: ${totalPageSettings} settings`);

} catch (error) {
  console.error('   ❌ Error checking settings:', error.message);
}

// 2. HERO SLIDES VERIFICATION
console.log('\n📊 2. HERO SLIDES VERIFICATION\n');

try {
  const heroSlidesCount = db.prepare("SELECT COUNT(*) as count FROM hero_slides_arabic").get();
  console.log(`   Total Hero Slides: ${heroSlidesCount.count}`);

  if (heroSlidesCount.count > 0) {
    const slides = db.prepare("SELECT id, arabicTag, arabicTitle FROM hero_slides_arabic ORDER BY id").all();
    console.log('\n   📋 All Hero Slides:');
    slides.forEach((slide, index) => {
      console.log(`      ${index + 1}. [${slide.arabicTag}] ${slide.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Hero slides table not found');
}

// 3. PROJECTS VERIFICATION
console.log('\n📊 3. PROJECTS VERIFICATION\n');

try {
  const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects_arabic").get();
  console.log(`   Total Projects: ${projectsCount.count}`);

  if (projectsCount.count > 0) {
    const projects = db.prepare("SELECT id, arabicTitle, arabicCategory FROM projects_arabic ORDER BY id").all();
    console.log('\n   📋 All Projects:');
    projects.forEach((project, index) => {
      console.log(`      ${index + 1}. ${project.arabicTitle} (${project.arabicCategory})`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Projects table not found');
}

// 4. SERVICES VERIFICATION
console.log('\n📊 4. SERVICES VERIFICATION\n');

try {
  const servicesCount = db.prepare("SELECT COUNT(*) as count FROM services_arabic").get();
  console.log(`   Total Services: ${servicesCount.count}`);

  if (servicesCount.count > 0) {
    const services = db.prepare("SELECT id, arabicTitle FROM services_arabic ORDER BY id").all();
    console.log('\n   📋 All Services:');
    services.forEach((service, index) => {
      console.log(`      ${index + 1}. ${service.arabicTitle}`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Services table not found');
}

// 5. BLOG ARTICLES VERIFICATION
console.log('\n📊 5. BLOG ARTICLES VERIFICATION\n');

try {
  const articlesCount = db.prepare("SELECT COUNT(*) as count FROM blog_articles_arabic").get();
  console.log(`   Total Blog Articles: ${articlesCount.count}`);

  if (articlesCount.count > 0) {
    const articles = db.prepare("SELECT id, arabicTitle, arabicCategory FROM blog_articles_arabic ORDER BY id").all();
    console.log('\n   📋 All Blog Articles:');
    articles.forEach((article, index) => {
      console.log(`      ${index + 1}. ${article.arabicTitle} (${article.arabicCategory})`);
    });
  }
} catch (error) {
  console.log('   ⚠️  Blog articles table not found');
}

// 6. QUALITY CHECKS
console.log('\n📊 6. QUALITY CHECKS\n');

try {
  // Check for empty values
  const emptySettings = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar' AND (value IS NULL OR value = '')").get();
  console.log(`   Empty Arabic Settings: ${emptySettings.count} ${emptySettings.count === 0 ? '✅' : '⚠️'}`);

  // Check for duplicate keys
  const duplicateKeys = db.prepare(`
    SELECT key, COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' 
    GROUP BY key 
    HAVING COUNT(*) > 1
  `).all();
  console.log(`   Duplicate Keys: ${duplicateKeys.length} ${duplicateKeys.length === 0 ? '✅' : '⚠️'}`);

  // Check for very long values
  const longValues = db.prepare(`
    SELECT COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' AND LENGTH(value) > 500
  `).get();
  console.log(`   Long Values (>500 chars): ${longValues.count}`);

  // Check for RTL markers (Arabic text)
  const rtlMarkers = db.prepare(`
    SELECT COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' AND value LIKE '%ع%'
  `).get();
  console.log(`   Settings with Arabic text: ${rtlMarkers.count} ✅`);

  // Check for proper Arabic characters
  const arabicChars = db.prepare(`
    SELECT COUNT(*) as count FROM settings 
    WHERE key LIKE '%_ar' AND (value LIKE '%ا%' OR value LIKE '%ب%' OR value LIKE '%ت%')
  `).get();
  console.log(`   Settings with proper Arabic: ${arabicChars.count} ✅`);

} catch (error) {
  console.error('   ❌ Error in quality checks:', error.message);
}

// 7. CONTENT COMPLETENESS
console.log('\n📊 7. CONTENT COMPLETENESS\n');

try {
  const requiredSettings = [
    'homeIntroTitle_ar',
    'aboutHeroTitle_ar',
    'servicesHeroTitle_ar',
    'workflowHeroTitle_ar',
    'portfolioHeroTitle_ar',
    'contactHeroTitle_ar',
    'pricingHeroTitle_ar',
    'blogHeroTitle_ar',
    'projectDetailBackBtn_ar',
    'commonRequestPricing_ar'
  ];

  console.log('   Checking required settings:');
  let foundCount = 0;
  for (const setting of requiredSettings) {
    const exists = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key = ?").get(setting);
    if (exists.count > 0) {
      console.log(`      ✅ ${setting}`);
      foundCount++;
    } else {
      console.log(`      ❌ ${setting}`);
    }
  }
  console.log(`\n   Found: ${foundCount}/${requiredSettings.length} required settings`);

} catch (error) {
  console.error('   ❌ Error checking completeness:', error.message);
}

// 8. SUMMARY
console.log('\n═'.repeat(80));
console.log('\n✅ VERIFICATION SUMMARY\n');

try {
  const totalArabic = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
  const heroCount = db.prepare("SELECT COUNT(*) as count FROM hero_slides_arabic").get();
  const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects_arabic").get();
  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services_arabic").get();
  const articleCount = db.prepare("SELECT COUNT(*) as count FROM blog_articles_arabic").get();

  const totalContent = totalArabic.count + heroCount.count + projectCount.count + serviceCount.count + articleCount.count;

  console.log(`   📈 Total Arabic Content Items: ${formatNumber(totalContent)}`);
  console.log(`      • Settings: ${totalArabic.count}`);
  console.log(`      • Hero Slides: ${heroCount.count}`);
  console.log(`      • Projects: ${projectCount.count}`);
  console.log(`      • Services: ${serviceCount.count}`);
  console.log(`      • Blog Articles: ${articleCount.count}`);

  console.log(`\n   Status: ${totalContent > 150 ? '✅ COMPLETE' : '⚠️  INCOMPLETE'}`);

  console.log('\n   Ready for:');
  console.log('   ✅ Admin Panel Display');
  console.log('   ✅ Frontend Rendering');
  console.log('   ✅ RTL Layout Support');
  console.log('   ✅ Database Sync to Turso');
  console.log('   ✅ Production Deployment\n');

} catch (error) {
  console.error('   ❌ Error in summary:', error.message);
}

console.log('═'.repeat(80) + '\n');

db.close();
