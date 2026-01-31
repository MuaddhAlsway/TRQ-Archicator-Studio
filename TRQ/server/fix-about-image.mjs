import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

try {
  const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
  updateSetting.run('aboutWhoWeAreImage', '/uploads/14.webp');
  
  const result = db.prepare('SELECT value FROM settings WHERE key = ?').get('aboutWhoWeAreImage');
  console.log('✓ Updated aboutWhoWeAreImage to:', result.value);
} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
