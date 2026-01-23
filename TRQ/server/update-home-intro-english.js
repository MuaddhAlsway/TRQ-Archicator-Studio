#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔄 Updating English Home Intro Text...\n');

const updates = [
  {
    key: 'homeIntroTitle',
    value: 'Creating Timeless Design Solutions'
  },
  {
    key: 'homeIntroText1',
    value: 'TRQ STUDIO is an interior design studio that crafts luxurious spaces embodying elegance through a holistic approach that harmoniously balances aesthetics, functionality, and sensory experience.'
  },
  {
    key: 'homeIntroText2',
    value: 'The studio delivers fully integrated design solutions that respect context and identity, executed to the highest standards across high-end residential, commercial, and distinguished institutional projects.'
  }
];

try {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
  
  for (const update of updates) {
    stmt.run(update.key, update.value);
    console.log(`✓ Updated: ${update.key}`);
  }
  
  console.log('\n✅ English home intro text updated successfully!\n');
} catch (error) {
  console.error('❌ Error updating home intro:', error.message);
  process.exit(1);
}
