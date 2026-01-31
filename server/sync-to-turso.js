import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

try {
  // Get all Arabic settings
  const arabicSettings = db.prepare("SELECT key, value FROM settings WHERE key LIKE '%_ar' ORDER BY key").all();

  if (arabicSettings.length === 0) {
    console.log('⚠️  No Arabic settings found in database');
    console.log('Run: node server/seed-arabic-settings.js first\n');
    process.exit(1);
  }

  // Generate SQL statements
  let sqlContent = `-- Arabic Settings for TRQ Design
-- Generated: ${new Date().toISOString()}
-- Total Settings: ${arabicSettings.length}

BEGIN TRANSACTION;

`;

  for (const setting of arabicSettings) {
    const escapedValue = setting.value.replace(/'/g, "''");
    sqlContent += `INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('${setting.key}', '${escapedValue}', datetime('now'));\n`;
  }

  sqlContent += `\nCOMMIT;

-- Verification
-- SELECT COUNT(*) as total_arabic_settings FROM settings WHERE key LIKE '%_ar';
`;

  // Write to file
  const outputPath = path.join(__dirname, 'arabic-settings.sql');
  fs.writeFileSync(outputPath, sqlContent);

  console.log('\n✅ SQL File Generated Successfully\n');
  console.log(`📁 File: server/arabic-settings.sql`);
  console.log(`📊 Statistics:`);
  console.log(`   Total Settings: ${arabicSettings.length}`);
  console.log(`   File Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

  // Show breakdown by page
  const pages = {
    'Home': arabicSettings.filter(s => s.key.includes('home')).length,
    'About': arabicSettings.filter(s => s.key.includes('about')).length,
    'Services': arabicSettings.filter(s => s.key.includes('services')).length,
    'Workflow': arabicSettings.filter(s => s.key.includes('workflow')).length,
    'Portfolio': arabicSettings.filter(s => s.key.includes('portfolio')).length,
    'Contact': arabicSettings.filter(s => s.key.includes('contact')).length,
    'Pricing': arabicSettings.filter(s => s.key.includes('pricing')).length,
    'Blog': arabicSettings.filter(s => s.key.includes('blog')).length,
    'Project Detail': arabicSettings.filter(s => s.key.includes('projectDetail')).length,
    'Common': arabicSettings.filter(s => s.key.includes('common')).length,
  };

  console.log('📄 Settings by Page:');
  for (const [page, count] of Object.entries(pages)) {
    if (count > 0) {
      console.log(`   ${page}: ${count} settings`);
    }
  }

  console.log('\n🚀 Next Steps:');
  console.log('   1. Ensure Turso credentials are in .env');
  console.log('   2. Run: turso db shell trq < server/arabic-settings.sql');
  console.log('   3. Or use: turso db shell <database-name> < server/arabic-settings.sql\n');

} catch (error) {
  console.error('❌ Error generating SQL file:', error.message);
  process.exit(1);
} finally {
  db.close();
}
