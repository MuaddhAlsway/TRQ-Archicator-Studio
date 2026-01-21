import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

// Delete bad translations
const result = db.prepare("DELETE FROM translations WHERE translatedText LIKE '%[ترجمة%' OR translatedText LIKE '%TRANSLATED%'").run();
console.log('Deleted', result.changes, 'bad translations');

// Show remaining translations
const count = db.prepare('SELECT COUNT(*) as count FROM translations').get();
console.log('Remaining translations:', count.count);

db.close();
