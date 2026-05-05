import Database from 'better-sqlite3';
import fs from 'fs';

console.log('📤 Exporting data from SQLite...');

try {
  const db = new Database('server/trq.db');
  
  const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];
  let sql = '';
  
  // Add pragma statements
  sql += 'PRAGMA foreign_keys=OFF;\n';
  sql += 'BEGIN TRANSACTION;\n';
  
  for (const table of tables) {
    console.log(`  Exporting ${table}...`);
    
    // Get table schema
    const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(table);
    if (schema) {
      sql += schema.sql + ';\n';
    }
    
    // Get table data
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    
    if (rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const columnList = columns.join(', ');
      
      for (const row of rows) {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? '1' : '0';
          return val;
        });
        sql += `INSERT INTO ${table} (${columnList}) VALUES (${values.join(', ')});\n`;
      }
    }
  }
  
  sql += 'COMMIT;\n';
  
  // Write to file
  fs.writeFileSync('backup.sql', sql, 'utf-8');
  
  const fileSize = fs.statSync('backup.sql').size / 1024;
  console.log(`✅ Exported to backup.sql (${fileSize.toFixed(2)} KB)`);
  
  db.close();
} catch (err) {
  console.error('❌ Export failed:', err.message);
  process.exit(1);
}
