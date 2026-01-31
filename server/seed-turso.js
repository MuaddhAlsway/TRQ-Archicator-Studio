import { createClient } from '@libsql/client';
import { defaultProjects } from './seed-projects.js';

const db = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function seedProjects() {
  try {
    console.log('Connecting to Turso...');
    
    // Check if projects already exist
    const result = await db.execute('SELECT COUNT(*) as count FROM projects');
    const count = result.rows[0]?.count || 0;
    
    console.log(`Found ${count} existing projects`);
    
    if (count === 0) {
      console.log('Seeding 15 default projects to Turso...');
      
      for (const project of defaultProjects) {
        try {
          await db.execute({
            sql: `INSERT INTO projects (title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            ],
          });
          console.log(`✓ Inserted: ${project.title}`);
        } catch (e) {
          console.error(`✗ Error inserting ${project.title}:`, e.message);
        }
      }
      
      console.log('✓ Seeding complete!');
    } else {
      console.log('Projects already exist in database, skipping seed');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedProjects();
