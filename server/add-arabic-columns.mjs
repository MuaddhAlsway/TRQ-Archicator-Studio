import Database from 'better-sqlite3';

const db = new Database('trq.db');

console.log('Adding Arabic columns to projects table...');

const arabicCols = [
  'title_ar', 'category_ar', 'subcategory_ar', 'description_ar', 'location_ar', 
  'client_ar', 'size_ar', 'duration_ar', 'detailedDescription_ar', 'challenge_ar', 
  'solution_ar', 'features_ar', 'materials_ar', 'awards_ar', 'team_ar', 
  'clientQuote_ar', 'clientName_ar'
];

let added = 0;
arabicCols.forEach(col => {
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN ${col} TEXT`);
    console.log(`✓ Added ${col}`);
    added++;
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log(`- ${col} already exists`);
    } else {
      console.error(`✗ Error adding ${col}:`, e.message);
    }
  }
});

console.log(`\nAdded ${added} new columns`);

// Verify
const schema = db.prepare("PRAGMA table_info(projects)").all();
const existingArabicCols = arabicCols.filter(col => schema.find(c => c.name === col));
console.log(`\nVerification: ${existingArabicCols.length}/${arabicCols.length} Arabic columns exist`);

db.close();
console.log('Done!');
