import Database from 'better-sqlite3';
import fs from 'fs';

console.log('📤 Exporting data from SQLite (smart column mapping)...');

try {
  const db = new Database('server/trq.db');
  
  const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];
  let sql = '';
  
  sql += 'PRAGMA foreign_keys=OFF;\n';
  
  for (const table of tables) {
    console.log(`  Exporting ${table}...`);
    
    // Get actual columns from source database
    const sourceColumns = db.prepare(`PRAGMA table_info(${table})`).all();
    const columnNames = sourceColumns.map(c => c.name);
    
    // Get table data
    const rows = db.prepare(`SELECT ${columnNames.join(', ')} FROM ${table}`).all();
    
    if (rows.length > 0) {
      const columnList = columnNames.join(', ');
      
      for (const row of rows) {
        const values = columnNames.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? '1' : '0';
          return val;
        });
        sql += `INSERT INTO ${table} (${columnList}) VALUES (${values.join(', ')});\n`;
      }
      console.log(`    ✓ ${rows.length} rows`);
    }
  }
  
  // Write to file
  fs.writeFileSync('backup-smart.sql', sql, 'utf-8');
  
  const fileSize = fs.statSync('backup-smart.sql').size / 1024;
  console.log(`✅ Exported to backup-smart.sql (${fileSize.toFixed(2)} KB)`);
  
  db.close();
} catch (err) {
  console.error('❌ Export failed:', err.message);
  process.exit(1);
}
