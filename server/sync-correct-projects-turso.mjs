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

console.log('Syncing corrected projects to Turso...\n');

try {
  // Get the 4 new projects (IDs 23-26)
  const projects = localDb.prepare(`
    SELECT id, title, title_ar, description, category,
           image, gallery, duration, client, status
    FROM projects 
    WHERE id >= 23 AND id <= 26
    ORDER BY id
  `).all();
  
  console.log(`Found ${projects.length} projects to sync\n`);

  for (const project of projects) {
    try {
      // First try to delete if exists
      try {
        await turso.execute({
          sql: 'DELETE FROM projects WHERE id = ?',
          args: [project.id]
        });
      } catch (e) {
        // Ignore delete errors
      }

      // Then insert
      await turso.execute({
        sql: `
          INSERT INTO projects (
            id, title, title_ar, description, category,
            image, gallery, duration, client, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          project.id,
          project.title,
          project.title_ar,
          project.description,
          project.category,
          project.image,
          project.gallery,
          project.duration,
          project.client,
          project.status
        ]
      });
      
      console.log(`✓ Synced: ${project.title} (ID: ${project.id})`);
      console.log(`  └─ Image: ${project.image}`);
    } catch (error) {
      console.error(`✗ Error syncing ${project.title}:`, error.message);
    }
  }

  console.log('\n✓ Projects synced to Turso!');

} catch (error) {
  console.error('Error during sync:', error.message);
} finally {
  localDb.close();
}
