import db from './server/database.js';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function syncAllProjects() {
  console.log('Syncing all projects from local to Turso...\n');
  
  try {
    // Get all projects from local database
    const projects = db.prepare('SELECT * FROM projects ORDER BY id').all();
    console.log(`Found ${projects.length} projects locally\n`);
    
    // Delete all projects from Turso first
    console.log('Clearing Turso projects...');
    await turso.execute('DELETE FROM projects');
    console.log('✓ Cleared\n');
    
    // Insert all projects
    for (const project of projects) {
      await turso.execute({
        sql: `INSERT INTO projects (
          id, title, category, subcategory, description, image, year, location, client, size, duration,
          detailedDescription, challenge, solution, features, materials, awards, team, gallery,
          clientQuote, clientName, status, title_ar, category_ar, subcategory_ar, description_ar,
          location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar,
          solution_ar, features_ar, materials_ar, awards_ar, team_ar, clientQuote_ar, clientName_ar
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`,
        args: [
          project.id,
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
        ],
      });
      console.log(`✓ Synced ID ${project.id}: ${project.title}`);
    }
    
    console.log('\n✓ All projects synced successfully');
    
    // Verify
    const verify = await turso.execute('SELECT COUNT(*) as count FROM projects');
    console.log(`\nVerification: Turso now has ${verify.rows[0][0]} projects`);
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

syncAllProjects();
