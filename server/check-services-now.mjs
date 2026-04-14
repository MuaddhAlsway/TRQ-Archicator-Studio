import Database from 'better-sqlite3';

const db = new Database('./trq.db');
const services = db.prepare('SELECT id, title FROM services ORDER BY id').all();
console.log(JSON.stringify(services, null, 2));
