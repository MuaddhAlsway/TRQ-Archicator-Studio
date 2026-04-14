import db from './server/database.js';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function fixProject20() {
  console.log('Fixing project 20 in Turso...\n');
  
  try {
    // Get project 20 from local database
    const project = db.prepare('SELECT * FROM projects WHERE id = 20').get();
    
    if (!project) {
      console.error('✗ Project 20 not found in local database');
      return;
    }
    
    console.log('Found project 20 locally:', project.title);
    
    // Update in Turso
    const result = await turso.execute({
      sql: `UPDATE projects SET 
        title = ?, category = ?, subcategory = ?, description = ?, image = ?, year = ?,
        location = ?, client = ?, size = ?, duration = ?, detailedDescription = ?,
        challenge = ?, solution = ?, features = ?, materials = ?, awards = ?, team = ?,
        gallery = ?, clientQuote = ?, clientName = ?, status = ?,
        title_ar = ?, category_ar = ?, subcategory_ar = ?, description_ar = ?,
        location_ar = ?, client_ar = ?, size_ar = ?, duration_ar = ?, detailedDescription_ar = ?,
        challenge_ar = ?, solution_ar = ?, features_ar = ?, materials_ar = ?, awards_ar = ?,
        team_ar = ?, clientQuote_ar = ?, clientName_ar = ?
        WHERE id = ?`,
      args: [
        project.title,
        project.category,
        project.subcategory,
        project.description,
        project.image,
        project.year,
        project.location,
        project.client,
        project.size,
        project.duration,
        project.detailedDescription,
        project.challenge,
        project.solution,
        project.features,
        project.materials,
        project.awards,
        project.team,
        project.gallery,
        project.clientQuote,
        project.clientName,
        project.status,
        project.title_ar,
        project.category_ar,
        project.subcategory_ar,
        project.description_ar,
        project.location_ar,
        project.client_ar,
        project.size_ar,
        project.duration_ar,
        project.detailedDescription_ar,
        project.challenge_ar,
        project.solution_ar,
        project.features_ar,
        project.materials_ar,
        project.awards_ar,
        project.team_ar,
        project.clientQuote_ar,
        project.clientName_ar,
        20,
      ],
    });
    
    console.log('✓ Project 20 updated in Turso');
    
    // Verify
    const verify = await turso.execute('SELECT id, title FROM projects WHERE id = 20');
    if (verify.rows.length > 0) {
      console.log('✓ Verified: Project 20 now has title:', verify.rows[0][1]);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

fixProject20();
