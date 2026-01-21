import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));

try {
  // Find DIRIYAH PARADE project
  const project = db.prepare("SELECT id, title FROM projects WHERE title LIKE '%DIRIYAH PARADE%'").get();
  
  if (!project) {
    console.log('DIRIYAH PARADE project not found');
    process.exit(1);
  }

  console.log(`Found project: ID ${project.id}, Title: ${project.title}`);

  // Gallery images from the OG folder
  const galleryImages = [
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image43.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image44.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image47.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image48.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image50.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image53_000.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image54_000.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image59.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image60.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image61.jpg.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image62.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image64.png',
    '/TRQ STUDIO _ PROJECTS/3. DIRIYAH PARADE/OG/Image68.png',
  ];

  // Use first image as cover
  const coverImage = galleryImages[0];

  // Update project with cover image and gallery
  const result = db.prepare(`
    UPDATE projects 
    SET image = ?, gallery = ?
    WHERE id = ?
  `).run(coverImage, JSON.stringify(galleryImages), project.id);

  console.log(`\nUpdated project ${project.id}`);
  console.log('Rows affected:', result.changes);
  console.log('Cover image:', coverImage);
  console.log('Gallery images count:', galleryImages.length);

  // Verify the update
  const updated = db.prepare('SELECT id, title, image, gallery FROM projects WHERE id = ?').get(project.id);
  console.log('\nUpdated project details:');
  console.log(`  ID: ${updated.id}`);
  console.log(`  Title: ${updated.title}`);
  console.log(`  Cover: ${updated.image}`);
  console.log(`  Gallery: ${updated.gallery.substring(0, 100)}...`);

  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
