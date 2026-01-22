import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Get all actual folder names
const actualFolders = fs.readdirSync(projectsDir).filter(f => 
  fs.statSync(path.join(projectsDir, f)).isDirectory()
);

console.log('Actual folders found:');
actualFolders.forEach(f => console.log(`  - ${f}`));
console.log();

// Function to find matching folder
function findMatchingFolder(dbFolderName) {
  // Exact match
  if (actualFolders.includes(dbFolderName)) {
    return dbFolderName;
  }
  
  // Try to match by removing numbers and special characters
  const normalize = (str) => str.toLowerCase().replace(/^[\d\.\s]+/, '').trim();
  const normalized = normalize(dbFolderName);
  
  for (const folder of actualFolders) {
    if (normalize(folder) === normalized) {
      return folder;
    }
  }
  
  // Try partial match
  for (const folder of actualFolders) {
    if (folder.toLowerCase().includes(normalized) || normalized.includes(folder.toLowerCase())) {
      return folder;
    }
  }
  
  return null;
}

// Get all projects
const projects = db.prepare('SELECT id, title, image, gallery FROM projects').all();

console.log(`Found ${projects.length} projects to fix...\n`);

let fixedCount = 0;

for (const project of projects) {
  let updated = false;
  let newImage = project.image;
  let newGallery = project.gallery;
  
  // Extract project folder name from image path
  let dbFolderName = null;
  if (project.image && project.image.includes('TRQ STUDIO _ PROJECTS')) {
    const match = project.image.match(/TRQ STUDIO _ PROJECTS\/([^\/]+)/);
    if (match) {
      dbFolderName = match[1];
    }
  }
  
  if (!dbFolderName) {
    console.log(`⚠ Project ${project.id} (${project.title}): Could not extract folder name`);
    continue;
  }
  
  // Find matching actual folder
  const actualFolderName = findMatchingFolder(dbFolderName);
  
  if (!actualFolderName) {
    console.log(`⚠ Project ${project.id} (${project.title}): No matching folder found for "${dbFolderName}"`);
    continue;
  }
  
  const projectPath = path.join(projectsDir, actualFolderName);
  
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
    console.log(`⚠ Project ${project.id} (${project.title}): No images found in ${actualFolderName}`);
    continue;
  }
  
  // Update main image
  if (project.image && !project.image.startsWith('http')) {
    newImage = allImages[0];
    updated = true;
  }
  
  // Update gallery
  newGallery = JSON.stringify(allImages);
  updated = true;
  
  // Update database
  if (updated) {
    db.prepare('UPDATE projects SET image = ?, gallery = ? WHERE id = ?')
      .run(newImage, newGallery, project.id);
    fixedCount++;
    console.log(`✓ Project ${project.id} (${project.title})`);
    console.log(`  Folder: ${actualFolderName}`);
    console.log(`  Images: ${allImages.length}`);
    console.log(`  Main: ${newImage}`);
  }
}

console.log(`\n✓ Fixed ${fixedCount} projects`);
console.log('All image paths have been corrected!');
