import db from './server/database.js';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function compareProjects() {
  console.log('Comparing local vs Turso project data...\n');
  
  try {
    // Get all projects from local
    const localProjects = db.prepare('SELECT * FROM projects ORDER BY id').all();
    console.log(`Local projects: ${localProjects.length}`);
    
    // Get all projects from Turso
    const tursoResult = await turso.execute('SELECT id, title, duration, location, client, size, category, subcategory, description, image, year, status FROM projects ORDER BY id');
    console.log(`Turso result columns: ${tursoResult.columns.join(', ')}`);
    console.log(`Turso result rows: ${tursoResult.rows.length}`);
    
    const tursoProjects = tursoResult.rows.map((row, idx) => {
      const obj = {};
      tursoResult.columns.forEach((col, colIdx) => {
        obj[col] = row[colIdx];
      });
      return obj;
    });
    
    console.log(`\nComparing ${localProjects.length} projects...\n`);
    
    // Compare each project
    const fieldsToCheck = ['title', 'category', 'subcategory', 'description', 'image', 'year', 'location', 'client', 'size', 'duration', 'status'];
    
    let mismatches = 0;
    
    for (let i = 0; i < localProjects.length; i++) {
      const local = localProjects[i];
      const tursoProj = tursoProjects.find(p => p.id === local.id);
      
      if (!tursoProj) {
        console.log(`❌ ID ${local.id}: MISSING in Turso`);
        mismatches++;
        continue;
      }
      
      let hasMismatch = false;
      const mismatchFields = [];
      
      for (const field of fieldsToCheck) {
        const localVal = local[field];
        const tursoVal = tursoProj[field];
        
        if (String(localVal) !== String(tursoVal)) {
          hasMismatch = true;
          mismatchFields.push({
            field,
            local: String(localVal).substring(0, 60),
            turso: String(tursoVal).substring(0, 60),
          });
        }
      }
      
      if (hasMismatch) {
        console.log(`⚠️  ID ${local.id}: ${local.title}`);
        mismatchFields.forEach(m => {
          console.log(`   ${m.field}: Local="${m.local}" vs Turso="${m.turso}"`);
        });
        mismatches++;
      } else {
        console.log(`✓ ID ${local.id}: ${local.title}`);
      }
    }
    
    console.log(`\n\nSummary: ${mismatches} projects with mismatches`);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

compareProjects();
