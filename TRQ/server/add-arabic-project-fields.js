import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

console.log('Adding Arabic fields to projects table...\n');

const arabicFields = [
  'title_ar',
  'category_ar',
  'subcategory_ar',
  'description_ar',
  'location_ar',
  'client_ar',
  'size_ar',
  'duration_ar',
  'detailedDescription_ar',
  'challenge_ar',
  'solution_ar',
  'features_ar',
  'materials_ar',
  'awards_ar',
  'team_ar',
  'clientQuote_ar',
  'clientName_ar',
];

let addedCount = 0;

for (const field of arabicFields) {
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN ${field} TEXT`);
    console.log(`✅ Added column: ${field}`);
    addedCount++;
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log(`⏭️  Column already exists: ${field}`);
    } else {
      console.error(`❌ Error adding ${field}:`, e.message);
    }
  }
}

console.log(`\n✨ Migration complete! Added ${addedCount} new columns.`);
db.close();
