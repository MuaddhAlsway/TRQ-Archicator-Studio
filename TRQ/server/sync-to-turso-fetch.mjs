import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '.env') });

const dbPath = join(__dirname, 'trq.db');

// Local SQLite database
const localDb = new Database(dbPath);

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env');
  process.exit(1);
}

async function queryTurso(sql, args = []) {
  // Convert libsql:// to https://
  const httpsUrl = TURSO_URL.replace('libsql://', 'https://');
  
  // Use positional parameters (no names)
  const response = await fetch(httpsUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      statements: [{ q: sql, params: args }]
    })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso error: ${response.status} ${text}`);
  }
  
  return response.json();
}

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
    await queryTurso(`DELETE FROM ${tableName}`);
    console.log(`✓ Cleared remote ${tableName}`);
    
    // Insert rows
    let inserted = 0;
    for (const row of rows) {
      const columns = Object.keys(row);
      const values = columns.map(col => row[col]);
      const placeholders = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      
      try {
        await queryTurso(sql, values);
        inserted++;
      } catch (error) {
        console.error(`  ⚠️  Error inserting row:`, error.message);
      }
    }
    
    console.log(`✅ Synced ${inserted}/${rows.length} rows to ${tableName}`);
  } catch (error) {
    console.error(`❌ Error syncing ${tableName}:`, error.message);
  }
}

async function main() {
  console.log('🔄 Starting sync to Turso...');
  console.log(`Database: ${TURSO_URL}`);
  
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
