import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'trq.db'));
const projectsDir = join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Image extensions to look for
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function isImageFile(filename) {
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

function getImagesFromFolder(folderPath) {
  const images = [];
  try {
    if (!fs.existsSync(folderPath)) return images;
    
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      if (isImageFile(file)) {
        images.push(file);
      }
    });
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error.message);
  }
  return images;
}

function findProjectFolder(projectName) {
  try {
    const folders = fs.readdirSync(projectsDir);
    for (const folder of folders) {
      const folderPath = join(projectsDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        // Check if folder name contains project name
        if (folder.toLowerCase().includes(projectName.toLowerCase())) {
          return folder;
        }
      }
    }
  } catch (error) {
    console.error('Error scanning projects directory:', error.message);
  }
  return null;
}

function getProjectImages(projectFolder) {
  const folderPath = join(projectsDir, projectFolder);
  const images = [];
  
  try {
    const subfolders = fs.readdirSync(folderPath);
    
    for (const subfolder of subfolders) {
      const subfolderPath = join(folderPath, subfolder);
      if (fs.statSync(subfolderPath).isDirectory()) {
        const subfolderImages = getImagesFromFolder(subfolderPath);
        subfolderImages.forEach(img => {
          const relativePath = `/TRQ STUDIO _ PROJECTS/${projectFolder}/${subfolder}/${img}`;
          images.push(relativePath);
        });
      }
    }
    
    // Also check root folder
    const rootImages = getImagesFromFolder(folderPath);
    rootImages.forEach(img => {
      const relativePath = `/TRQ STUDIO _ PROJECTS/${projectFolder}/${img}`;
      images.push(relativePath);
    });
  } catch (error) {
    console.error(`Error getting images for ${projectFolder}:`, error.message);
  }
  
  return images;
}

try {
  console.log('Scanning TRQ STUDIO _ PROJECTS folder...\n');
  
  const projects = db.prepare('SELECT id, title FROM projects ORDER BY id').all();
  
  let updated = 0;
  let skipped = 0;
  
  for (const project of projects) {
    console.log(`Processing: ${project.title} (ID: ${project.id})`);
    
    // Find matching folder
    const projectFolder = findProjectFolder(project.title);
    
    if (!projectFolder) {
      console.log(`  ⚠ No folder found for "${project.title}"`);
      skipped++;
      continue;
    }
    
    console.log(`  ✓ Found folder: ${projectFolder}`);
    
    // Get all images
    const images = getProjectImages(projectFolder);
    
    if (images.length === 0) {
      console.log(`  ⚠ No images found in folder`);
      skipped++;
      continue;
    }
    
    console.log(`  ✓ Found ${images.length} images`);
    
    // Use first image as cover
    const coverImage = images[0];
    const gallery = JSON.stringify(images);
    
    // Update project
    const result = db.prepare(`
      UPDATE projects 
      SET image = ?, gallery = ?
      WHERE id = ?
    `).run(coverImage, gallery, project.id);
    
    if (result.changes > 0) {
      console.log(`  ✓ Updated with cover: ${coverImage.split('/').pop()}`);
      updated++;
    }
    console.log('');
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${projects.length}`);
  
  db.close();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
