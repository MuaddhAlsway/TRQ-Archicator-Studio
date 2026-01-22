import fs from 'fs';
import path from 'path';
import db from './database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Map of project names to database project IDs
const projectMapping = {
  ' PAWS & PARTNERS': 1,
  'A Fusion of Art and Elegance  Living room': 2,
  'ALULAH': 3,
  'ARYASH AL-DRIIYAH': 4,
  'CLASSIC BEDROOM': 5,
  'DIRIYAH MARKET': 6,
  'DIRIYAH NATIONAL DAY EVENT': 7,
  'DIRIYAH PARADE': 8,
  'H & P': 9,
  'Half million': 10,
  'Modern LuxuryLiving room': 11,
  'QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT': 12,
  'RAFAL APARTMENT': 13,
  'REC. HEAVEN': 14,
  'RSG BOOTH': 15,
};

function getImageUrl(projectName, imageName) {
  // Create proper URL path - spaces should be %20 in URLs
  const encodedProjectName = encodeURIComponent(projectName);
  const encodedImageName = encodeURIComponent(imageName);
  return `/TRQ STUDIO _ PROJECTS/${projectName}/${imageName}`;
}

function updateProjectImages() {
  try {
    console.log('Starting project image update...\n');

    // Get all project folders
    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${projectFolders.length} project folders\n`);

    let updatedCount = 0;

    for (const folderName of projectFolders) {
      const projectId = projectMapping[folderName];
      
      if (!projectId) {
        console.log(`⚠️  No mapping found for: ${folderName}`);
        continue;
      }

      const folderPath = path.join(projectsDir, folderName);
      const images = fs.readdirSync(folderPath)
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .sort();

      if (images.length === 0) {
        console.log(`⚠️  No images found for: ${folderName}`);
        continue;
      }

      // Get first image as main image
      const mainImage = getImageUrl(folderName, images[0]);
      
      // Get all images as gallery
      const gallery = images.map(img => getImageUrl(folderName, img));

      // Update database
      try {
        db.prepare(`
          UPDATE projects 
          SET image = ?, gallery = ?
          WHERE id = ?
        `).run(mainImage, JSON.stringify(gallery), projectId);

        console.log(`✅ Updated Project ${projectId}: ${folderName}`);
        console.log(`   Main image: ${images[0]}`);
        console.log(`   Gallery: ${images.length} images`);
        console.log('');

        updatedCount++;
      } catch (error) {
        console.error(`❌ Error updating project ${projectId}:`, error.message);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} projects`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateProjectImages();
