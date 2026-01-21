import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function syncArabicSettingsToTurso() {
  try {
    // Check if Turso credentials exist
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      console.log('\n⚠️  Turso credentials not found in .env file\n');
      console.log('To complete the sync, add these to server/.env:\n');
      console.log('TURSO_DATABASE_URL=libsql://your-db-name-xxxx.turso.io');
      console.log('TURSO_AUTH_TOKEN=your-auth-token-here\n');
      console.log('Then run: node server/sync-arabic-to-turso.js\n');
      process.exit(1);
    }

    console.log('\n🔄 Syncing Arabic Settings to Turso...\n');

    // Connect to Turso
    const tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Get Arabic settings from local database
    const localDb = new Database(path.join(__dirname, 'trq.db'));
    const arabicSettings = localDb.prepare("SELECT key, value FROM settings WHERE key LIKE '%_ar' ORDER BY key").all();
    localDb.close();

    if (arabicSettings.length === 0) {
      console.log('❌ No Arabic settings found in local database');
      console.log('Run: node server/seed-arabic-settings.js first\n');
      process.exit(1);
    }

    console.log(`📊 Found ${arabicSettings.length} Arabic settings to sync\n`);

    // Sync settings to Turso
    let synced = 0;
    let failed = 0;

    for (const setting of arabicSettings) {
      try {
        await tursoClient.execute({
          sql: 'INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, datetime("now"))',
          args: [setting.key, setting.value],
        });
        synced++;
        
        // Show progress every 20 settings
        if (synced % 20 === 0) {
          console.log(`   ✓ Synced ${synced}/${arabicSettings.length} settings...`);
        }
      } catch (error) {
        failed++;
        console.error(`   ✗ Failed to sync ${setting.key}: ${error.message}`);
      }
    }

    console.log(`\n✅ Sync Complete!\n`);
    console.log(`📊 Statistics:`);
    console.log(`   Total Settings: ${arabicSettings.length}`);
    console.log(`   Successfully Synced: ${synced}`);
    console.log(`   Failed: ${failed}\n`);

    // Verify sync
    const result = await tursoClient.execute(
      "SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'"
    );
    const count = result.rows[0]?.count || 0;

    console.log(`✅ Verified: ${count} Arabic settings now in Turso database\n`);

    if (synced === arabicSettings.length) {
      console.log('🎉 All Arabic settings successfully synced to Turso!\n');
    }

  } catch (error) {
    console.error('\n❌ Error syncing to Turso:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check Turso credentials in .env');
    console.error('2. Verify database URL and auth token');
    console.error('3. Ensure Turso database is accessible\n');
    process.exit(1);
  }
}

syncArabicSettingsToTurso();
