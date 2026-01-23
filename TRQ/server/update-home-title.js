#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔄 Updating Home Intro Title...\n');

const updates = [
  {
    key: 'homeIntroTitle',
    value: 'We Create Timeless Design Solutions'
  },
  {
    key: 'homeIntroTitle_ar',
    value: 'أناقة تصميمية متكاملة'
  }
];

try {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
  
  for (const update of updates) {
    stmt.run(update.key, update.value);
    console.log(`✓ Updated: ${update.key}`);
  }
  
  console.log('\n✅ Home intro title updated successfully!\n');
} catch (error) {
  console.error('❌ Error updating home intro title:', error.message);
  process.exit(1);
}
