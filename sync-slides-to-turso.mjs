import { createClient } from '@libsql/client';
import('./server/database.js').then(async (mod) => {
  const db = mod.default;
  const turso = createClient({
    url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
  });
  
  try {
    // Get local slides
    const localSlides = db.prepare('SELECT * FROM hero_slides ORDER BY sortOrder ASC').all();
    
    console.log('Converting ' + localSlides.length + ' slides to Turso...');
    console.log('');
    
    // For each local slide, insert or replace in Turso
    for (const slide of localSlides) {
      try {
        // Escape single quotes in strings
        const tag = (slide.tag || '').replace(/'/g, "''");
        const title = (slide.title || '').replace(/'/g, "''");
        const description = (slide.description || '').replace(/'/g, "''");
        const image = (slide.image || '').replace(/'/g, "''");
        const video = (slide.video || '').replace(/'/g, "''");
        const buttonPrimaryText = (slide.buttonPrimaryText || '').replace(/'/g, "''");
        const buttonPrimaryLink = (slide.buttonPrimaryLink || '').replace(/'/g, "''");
        const buttonSecondaryText = (slide.buttonSecondaryText || '').replace(/'/g, "''");
        const buttonSecondaryLink = (slide.buttonSecondaryLink || '').replace(/'/g, "''");
        const createdAt = (slide.createdAt || '').replace(/'/g, "''");
        
        const sql = `INSERT OR REPLACE INTO hero_slides (id, tag, title, description, image, video, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive, createdAt) VALUES (${slide.id}, '${tag}', '${title}', '${description}', '${image}', '${video}', '${buttonPrimaryText}', '${buttonPrimaryLink}', '${buttonSecondaryText}', '${buttonSecondaryLink}', ${slide.sortOrder}, 1, '${createdAt}')`;
        
        await turso.execute(sql);
        console.log('✓ Converted slide ' + slide.id + ': ' + slide.title);
      } catch (e) {
        console.log('! Error converting slide ' + slide.id + ': ' + e.message);
      }
    }
    
    console.log('');
    console.log('Verifying in Turso...');
    const result = await turso.execute('SELECT id, title, sortOrder, isActive FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC');
    console.log('Active slides in Turso: ' + result.rows.length);
    result.rows.forEach(row => {
      console.log('ID: ' + row.id + ' | sortOrder: ' + row.sortOrder + ' | Title: ' + row.title);
    });
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}).catch(e => { console.error(e); process.exit(1); })
