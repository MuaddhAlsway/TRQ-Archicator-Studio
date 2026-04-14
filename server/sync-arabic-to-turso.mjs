import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const localDb = new Database(dbPath);
const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

console.log('Syncing Arabic translations to Turso...\n');

try {
  const projects = localDb.prepare(`
    SELECT id, description_ar, detailedDescription_ar, challenge_ar, solution_ar,
           location_ar, client_ar, size_ar
    FROM projects 
    WHERE id >= 23 AND id <= 26
    ORDER BY id
  `).all();
  
  console.log(`Found ${projects.length} projects to sync\n`);

  for (const project of projects) {
    try {
      await turso.execute({
        sql: `
          UPDATE projects 
          SET 
            description_ar = ?,
            detailedDescription_ar = ?,
            challenge_ar = ?,
            solution_ar = ?,
            location_ar = ?,
            client_ar = ?,
            size_ar = ?
          WHERE id = ?
        `,
        args: [
          project.description_ar,
          project.detailedDescription_ar,
          project.challenge_ar,
          project.solution_ar,
          project.location_ar,
          project.client_ar,
          project.size_ar,
          project.id
        ]
      });
      
      console.log(`✓ Synced Arabic translations for Project ID: ${project.id}`);
    } catch (error) {
      console.error(`✗ Error syncing project ${project.id}:`, error.message);
    }
  }

  console.log('\n✓ Arabic translations synced to Turso!');

} catch (error) {
  console.error('Error during sync:', error.message);
} finally {
  localDb.close();
}
