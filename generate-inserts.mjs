import fs from 'fs';

function generateInserts(table, data) {
  if (data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const columnList = columns.join(', ');
  
  const values = data.map(row => {
    const vals = columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      if (typeof val === 'boolean') return val ? '1' : '0';
      return val;
    });
    return `(${vals.join(', ')})`;
  }).join(',\n  ');
  
  return `INSERT INTO ${table} (${columnList}) VALUES\n  ${values};\n\n`;
}

const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];
let allInserts = '';

console.log('📝 Generating SQL insert statements...\n');

for (const table of tables) {
  try {
    const data = JSON.parse(fs.readFileSync(`${table}.json`, 'utf-8'));
    const inserts = generateInserts(table, data);
    allInserts += inserts;
    console.log(`✓ Generated inserts for ${table}: ${data.length} rows`);
  } catch (err) {
    console.log(`⚠ Skipped ${table}: ${err.message}`);
  }
}

fs.writeFileSync('migration-inserts.sql', allInserts);
console.log('\n✨ Generated migration-inserts.sql');
