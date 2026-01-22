import Database from 'better-sqlite3';
import { defaultProjects } from './seed-projects.js';

const db = new Database('./server/trq.db');

async function seedProjects() {
  try {
    console.log('Seeding projects to SQLite...');
    
    // Check if projects already exist
    const count = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    console.log(`Found ${count} existing projects`);
    
    if (count === 0) {
      console.log('Seeding 15 default projects...');
      
      for (const project of defaultProjects) {
        try {
          db.prepare(`
            INSERT INTO projects (title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
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
          );
          console.log(`✓ Inserted: ${project.title}`);
        } catch (e) {
          console.error(`✗ Error inserting ${project.title}:`, e.message);
        }
      }
      
      console.log('✓ Seeding complete!');
    } else {
      console.log('Projects already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedProjects();
