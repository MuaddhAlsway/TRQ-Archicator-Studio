import { createClient } from '@libsql/client';
import 'dotenv/config';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function updateRafalCover() {
  try {
    console.log('Updating RAFAL APARTMENT cover image...');
    console.log('URL:', process.env.TURSO_DATABASE_URL);
    
    // Find RAFAL APARTMENT project
    const result = await turso.execute({
      sql: "SELECT id, title FROM projects WHERE title LIKE '%RAFAL%' LIMIT 1",
      args: []
    });
    
    if (result.rows.length === 0) {
      console.log('RAFAL APARTMENT project not found');
      return;
    }
    
    const projectId = result.rows[0].id;
    console.log(`Found RAFAL APARTMENT with ID: ${projectId}`);
    
    // Update cover image
    await turso.execute({
      sql: "UPDATE projects SET image = ? WHERE id = ?",
      args: ['/uploads/5.webp', projectId]
    });
    
    console.log('✅ RAFAL APARTMENT cover image updated to 5.webp');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateRafalCover();
