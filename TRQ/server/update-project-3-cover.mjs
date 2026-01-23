import { createClient } from '@libsql/client';
import 'dotenv/config';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function updateProjectCover() {
  try {
    console.log('Updating project ID 3 cover image to 5.webp...');
    
    // Update project 3 cover image
    await turso.execute({
      sql: "UPDATE projects SET image = ? WHERE id = ?",
      args: ['/uploads/5.webp', 3]
    });
    
    console.log('✅ Project 3 cover image updated to /uploads/5.webp');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateProjectCover();
