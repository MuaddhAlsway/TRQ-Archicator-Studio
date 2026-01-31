import Database from 'better-sqlite3';

const db = new Database(':memory:');

console.log('Testing db.exec...');
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);
  console.log('✓ db.exec worked');
  
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));
} catch (e) {
  console.error('✗ Error:', e.message);
}

db.close();
