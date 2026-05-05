import Database from 'better-sqlite3';
import fs from 'fs';

console.log('📤 Exporting data from SQLite (filtered for D1)...');

try {
  const db = new Database('server/trq.db');
  
  // Define which columns to export for each table
  const tableColumns = {
    projects: ['id', 'title', 'title_ar', 'category', 'category_ar', 'subcategory', 'subcategory_ar', 
               'description', 'description_ar', 'image', 'year', 'location', 'location_ar', 'client', 
               'client_ar', 'size', 'size_ar', 'duration', 'duration_ar', 'detailedDescription', 
               'detailedDescription_ar', 'challenge', 'challenge_ar', 'solution', 'solution_ar', 
               'features', 'features_ar', 'materials', 'materials_ar', 'awards', 'awards_ar', 
               'team', 'team_ar', 'gallery', 'clientQuote', 'clientQuote_ar', 'clientName', 
               'clientName_ar', 'status', 'sortOrder', 'createdAt', 'updatedAt'],
    hero_slides: ['id', 'tag', 'tag_ar', 'title', 'title_ar', 'description', 'description_ar', 
                 'image', 'video', 'video_ar', 'video_2', 'video_2_ar', 'video_3', 'video_3_ar', 
                 'video_text', 'video_text_ar', 'video_2_text', 'video_2_text_ar', 'video_3_text', 
                 'video_3_text_ar', 'buttonPrimaryText', 'buttonPrimaryText_ar', 'buttonPrimaryLink', 
                 'buttonSecondaryText', 'buttonSecondaryText_ar', 'buttonSecondaryLink', 'sortOrder', 
                 'isActive', 'createdAt', 'updatedAt'],
    services: ['id', 'title', 'title_ar', 'description', 'description_ar', 'icon', 'sortOrder', 
              'isActive', 'createdAt', 'updatedAt'],
    settings: ['key', 'value', 'updatedAt'],
    blog_articles: ['id', 'title', 'slug', 'excerpt', 'content', 'image', 'author', 'date', 
                   'readTime', 'category', 'categorySlug', 'tags', 'status', 'createdAt', 'updatedAt']
  };
  
  let sql = '';
  sql += 'PRAGMA foreign_keys=OFF;\n';
  
  for (const [table, columns] of Object.entries(tableColumns)) {
    console.log(`  Exporting ${table}...`);
    
    try {
      // Get table data with only specified columns
      const columnList = columns.join(', ');
      const rows = db.prepare(`SELECT ${columnList} FROM ${table}`).all();
      
      if (rows.length > 0) {
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
        console.log(`    ✓ ${rows.length} rows`);
      }
    } catch (err) {
      console.warn(`    ⚠️  Error exporting ${table}: ${err.message}`);
    }
  }
  
  // Write to file
  fs.writeFileSync('backup-filtered.sql', sql, 'utf-8');
  
  const fileSize = fs.statSync('backup-filtered.sql').size / 1024;
  console.log(`✅ Exported to backup-filtered.sql (${fileSize.toFixed(2)} KB)`);
  
  db.close();
} catch (err) {
  console.error('❌ Export failed:', err.message);
  process.exit(1);
}
