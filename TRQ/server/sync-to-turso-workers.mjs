import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

// Local SQLite database
const localDb = new Database(dbPath);

// Turso cloud database
const turso = createClient({
  url: `${process.env.TURSO_DATABASE_URL}?authToken=${process.env.TURSO_AUTH_TOKEN}`,
});

async function syncTable(tableName) {
  try {
    console.log(`\n📤 Syncing ${tableName}...`);
    
    // Get all rows from local database
    const rows = localDb.prepare(`SELECT * FROM ${tableName}`).all();
    console.log(`Found ${rows.length} rows in local ${tableName}`);
    
    if (rows.length === 0) {
      console.log(`⚠️  No data in ${tableName}`);
      return;
    }
    
    // Clear remote table
    await turso.execute(`DELETE FROM ${tableName}`);
    console.log(`✓ Cleared remote ${tableName}`);
    
    // Insert rows
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = columns.map(col => row[col]);
      const placeholders = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      
      await turso.execute({
        sql,
        args: values
      });
    }
    
    console.log(`✅ Synced ${rows.length} rows to ${tableName}`);
  } catch (error) {
    console.error(`❌ Error syncing ${tableName}:`, error.message);
  }
}

async function main() {
  console.log('🔄 Starting sync to Turso...');
  
  const tables = [
    'hero_slides',
    'services',
    'projects',
    'blog_articles',
    'settings',
    'contacts',
    'pricing_requests',
    'newsletter_subscribers'
  ];
  
  for (const table of tables) {
    await syncTable(table);
  }
  
  console.log('\n✅ Sync complete!');
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
