import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

try {
  // Insert default company profile settings
  db.prepare(`
    INSERT OR REPLACE INTO company_profile_settings (language, url, title, description)
    VALUES (?, ?, ?, ?)
  `).run('en', 'https://publuu.com/flip-book/829640/2262213', 'Company Profile', 'Explore our comprehensive company profile and capabilities');

  console.log('✓ Company profile settings seeded');
  db.close();
} catch (error) {
  console.error('Error seeding company profile:', error.message);
  db.close();
  process.exit(1);
}
