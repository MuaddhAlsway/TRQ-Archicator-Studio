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

console.log('Syncing new projects to Turso...\n');

try {
  // Get the 5 newest projects (IDs 23-27)
  const projects = localDb.prepare(`
    SELECT * FROM projects 
    WHERE sortOrder >= 23 
    ORDER BY sortOrder
  `).all();
  
  console.log(`Found ${projects.length} new projects to sync\n`);

  for (const project of projects) {
    try {
      await turso.execute({
        sql: `
          INSERT INTO projects (
            title, title_ar, description, description_ar, category, category_ar,
            image, gallery, duration, duration_ar, client, client_ar,
            status, sortOrder
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            title_ar = excluded.title_ar,
            description = excluded.description,
            description_ar = excluded.description_ar,
            category = excluded.category,
            category_ar = excluded.category_ar,
            image = excluded.image,
            gallery = excluded.gallery,
            duration = excluded.duration,
            duration_ar = excluded.duration_ar,
            client = excluded.client,
            client_ar = excluded.client_ar,
            status = excluded.status,
            sortOrder = excluded.sortOrder
        `,
        args: [
          project.title,
          project.title_ar,
          project.description,
          project.description_ar,
          project.category,
          project.category_ar,
          project.image,
          project.gallery,
          project.duration,
          project.duration_ar,
          project.client,
          project.client_ar,
          project.status,
          project.sortOrder
        ]
      });
      
      console.log(`✓ Synced: ${project.title}`);
      console.log(`  └─ Duration: ${project.duration}`);
    } catch (error) {
      console.error(`✗ Error syncing ${project.title}:`, error.message);
    }
  }

  console.log('\n✓ New projects synced to Turso!');

} catch (error) {
  console.error('Error during sync:', error.message);
} finally {
  localDb.close();
}
