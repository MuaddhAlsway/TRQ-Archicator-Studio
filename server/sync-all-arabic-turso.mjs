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

console.log('Syncing ALL Arabic translations to Turso...\n');

try {
  const projects = localDb.prepare(`
    SELECT id, title_ar, description_ar, category_ar, detailedDescription_ar,
           challenge_ar, solution_ar, location_ar, client_ar, size_ar, duration_ar
    FROM projects 
    ORDER BY id
  `).all();
  
  console.log(`Found ${projects.length} projects to sync\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const project of projects) {
    try {
      await turso.execute({
        sql: `
          UPDATE projects 
          SET 
            title_ar = ?,
            description_ar = ?,
            category_ar = ?,
            detailedDescription_ar = ?,
            challenge_ar = ?,
            solution_ar = ?,
            location_ar = ?,
            client_ar = ?,
            size_ar = ?,
            duration_ar = ?
          WHERE id = ?
        `,
        args: [
          project.title_ar,
          project.description_ar,
          project.category_ar,
          project.detailedDescription_ar,
          project.challenge_ar,
          project.solution_ar,
          project.location_ar,
          project.client_ar,
          project.size_ar,
          project.duration_ar,
          project.id
        ]
      });
      
      console.log(`✓ Project ID ${project.id}: ${project.title_ar}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error syncing project ${project.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✓ Successfully synced ${successCount} projects to Turso`);
  if (errorCount > 0) console.log(`✗ Failed to sync ${errorCount} projects`);

} catch (error) {
  console.error('Error during sync:', error.message);
} finally {
  localDb.close();
}
