const Database = require('better-sqlite3');
const db = new Database('./server/trq.db');
const services = db.prepare('SELECT id, title FROM services ORDER BY id').all();
console.log(JSON.stringify(services, null, 2));
