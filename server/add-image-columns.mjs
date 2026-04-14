#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

console.log('🖼️  Adding image_2 and image_3 columns to hero_slides table\n');

const db = new Database(dbPath);

try {
  // Check if columns exist
  const tableInfo = db.prepare("PRAGMA table_info(hero_slides)").all();
  const columnNames = tableInfo.map(col => col.name);
  
  if (!columnNames.includes('image_2')) {
    console.log('Adding image_2 column...');
    db.exec('ALTER TABLE hero_slides ADD COLUMN image_2 TEXT');
    console.log('✅ image_2 column added');
  } else {
    console.log('✅ image_2 column already exists');
  }
  
  if (!columnNames.includes('image_3')) {
    console.log('Adding image_3 column...');
    db.exec('ALTER TABLE hero_slides ADD COLUMN image_3 TEXT');
    console.log('✅ image_3 column added');
  } else {
    console.log('✅ image_3 column already exists');
  }
  
  console.log('\n✅ All image columns ready!');
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
