import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Get all projects from database
const projects = db.prepare('SELECT id, title, image, gallery FROM projects').all();

console.log(`Found ${projects.length} projects to fix...\n`);

let fixedCount = 0;

for (const project of projects) {
  let updated = false;
  let newImage = project.image;
  let newGallery = project.gallery;
  
  // Extract project folder name from image path
  let projectFolderName = null;
  if (project.image && project.image.includes('TRQ STUDIO _ PROJECTS')) {
    const match = project.image.match(/TRQ STUDIO _ PROJECTS\/([^\/]+)/);
    if (match) {
      projectFolderName = match[1];
    }
  }
  
  if (!projectFolderName) {
    console.log(`⚠ Project ${project.id} (${project.title}): Could not extract folder name`);
    continue;
  }
  
  const projectPath = path.join(projectsDir, projectFolderName);
  
  if (!fs.existsSync(projectPath)) {
    console.log(`⚠ Project ${project.id} (${project.title}): Folder not found at ${projectPath}`);
    continue;
  }
  
  // Get all image files in the project folder (recursively)
  function getAllImages(dir) {
    const images = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        images.push(...getAllImages(filePath));
      } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
        // Get relative path from public folder
        const relativePath = filePath
          .replace(path.join(__dirname, '../public/'), '')
          .replace(/\\/g, '/');
        images.push('/' + relativePath);
      }
    }
    
    return images;
  }
  
  const allImages = getAllImages(projectPath);
  
  if (allImages.length === 0) {
    console.log(`⚠ Project ${project.id} (${project.title}): No images found`);
    continue;
  }
  
  // Update main image to first image if it doesn't exist
  if (project.image && !project.image.startsWith('http')) {
    const imageExists = allImages.some(img => img === project.image);
    if (!imageExists) {
      newImage = allImages[0];
      updated = true;
      console.log(`✓ Project ${project.id} (${project.title}): Fixed main image`);
      console.log(`  From: ${project.image}`);
      console.log(`  To:   ${newImage}`);
    }
  }
  
  // Update gallery
  if (project.gallery) {
    try {
      const gallery = JSON.parse(project.gallery);
      const validGallery = gallery.filter(img => 
        img && (img.startsWith('http') || allImages.includes(img))
      );
      
      // If gallery is empty or has invalid images, use all images
      if (validGallery.length === 0) {
        newGallery = JSON.stringify(allImages);
        updated = true;
        console.log(`✓ Project ${project.id} (${project.title}): Rebuilt gallery with ${allImages.length} images`);
      } else if (validGallery.length !== gallery.length) {
        newGallery = JSON.stringify(validGallery);
        updated = true;
        console.log(`✓ Project ${project.id} (${project.title}): Cleaned gallery (${gallery.length} → ${validGallery.length} images)`);
      }
    } catch (e) {
      // If gallery is not valid JSON, rebuild it
      newGallery = JSON.stringify(allImages);
      updated = true;
      console.log(`✓ Project ${project.id} (${project.title}): Rebuilt gallery (invalid JSON)`);
    }
  } else {
    // No gallery, create one with all images
    newGallery = JSON.stringify(allImages);
    updated = true;
    console.log(`✓ Project ${project.id} (${project.title}): Created gallery with ${allImages.length} images`);
  }
  
  // Update database
  if (updated) {
    db.prepare('UPDATE projects SET image = ?, gallery = ? WHERE id = ?')
      .run(newImage, newGallery, project.id);
    fixedCount++;
  }
}

console.log(`\n✓ Fixed ${fixedCount} projects`);
console.log('All image paths have been corrected!');
