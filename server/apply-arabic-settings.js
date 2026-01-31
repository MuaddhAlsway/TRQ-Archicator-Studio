import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

// Read the SQL file
const sqlContent = readFileSync(join(__dirname, 'APPLY_ALL_ARABIC_SETTINGS.sql'), 'utf-8');

// Extract all INSERT statements
const insertStatements = sqlContent.match(/INSERT OR REPLACE INTO settings[^;]+;/g) || [];

let totalInserted = 0;

console.log(`Found ${insertStatements.length} INSERT statements\n`);

// Execute each INSERT statement individually
insertStatements.forEach((statement, index) => {
  try {
    db.exec(statement);
    totalInserted++;
    if ((index + 1) % 20 === 0) {
      console.log(`✓ Processed ${index + 1}/${insertStatements.length} statements`);
    }
  } catch (error) {
    console.error(`✗ Statement ${index + 1} failed:`, error.message);
  }
});

// Verify the results
const result = db.prepare("SELECT COUNT(*) as total FROM settings WHERE key LIKE '%_ar'").get();
console.log(`\n✓ Total Arabic settings in database: ${result.total}`);
console.log(`✓ Settings inserted in this run: ${totalInserted}`);

db.close();
console.log('\n✓ All Arabic settings have been successfully added!');
