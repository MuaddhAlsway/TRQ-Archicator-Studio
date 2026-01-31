import db from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Function to find the actual image file
function findImageFile(imagePath) {
  // Remove leading slash
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(__dirname, '../public', cleanPath);
  
  // If file exists, return as is
  if (fs.existsSync(fullPath)) {
    return cleanPath;
  }
  
  // Try to find the file by removing subdirectories
  const parts = cleanPath.split('/');
  
  // Try removing the last subdirectory (PNG, WEB, OG, OPTION A, etc.)
  if (parts.length > 3) {
    const withoutSubdir = parts.slice(0, -2).concat(parts[parts.length - 1]).join('/');
    const withoutSubdirPath = path.join(__dirname, '../public', withoutSubdir);
    if (fs.existsSync(withoutSubdirPath)) {
      return withoutSubdir;
    }
  }
  
  // Try to find the file in the project directory
  const projectName = parts[1]; // e.g., "11. REC. HEAVEN"
  const fileName = parts[parts.length - 1]; // e.g., "13.jpg"
  
  const projectPath = path.join(projectsDir, projectName);
  if (fs.existsSync(projectPath)) {
    // Search recursively for the file
    function searchFile(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          const found = searchFile(filePath);
          if (found) return found;
        } else if (file === fileName) {
          return filePath;
        }
      }
      return null;
    }
    
    const foundPath = searchFile(projectPath);
    if (foundPath) {
      // Return relative path from public
      return foundPath.replace(path.join(__dirname, '../public/'), '').replace(/\\/g, '/');
    }
  }
  
  return null;
}

// Get all projects
const projects = db.prepare('SELECT id, image, gallery FROM projects').all();

console.log(`Found ${projects.length} projects to check...`);

let updated = 0;
let galleryUpdated = 0;

for (const project of projects) {
  let needsUpdate = false;
  let newImage = project.image;
  let newGallery = project.gallery;
  
  // Fix main image
  if (project.image && !project.image.startsWith('http')) {
    const correctedPath = findImageFile(project.image);
    if (correctedPath && correctedPath !== project.image) {
      newImage = '/' + correctedPath;
      needsUpdate = true;
      console.log(`Project ${project.id}: Image path updated`);
      console.log(`  From: ${project.image}`);
      console.log(`  To:   ${newImage}`);
    }
  }
  
  // Fix gallery images
  if (project.gallery) {
    try {
      const gallery = JSON.parse(project.gallery);
      let galleryChanged = false;
      
      const correctedGallery = gallery.map(img => {
        if (img && !img.startsWith('http')) {
          const correctedPath = findImageFile(img);
          if (correctedPath && correctedPath !== img.replace(/^\//, '')) {
            galleryChanged = true;
            console.log(`Project ${project.id}: Gallery image updated`);
            console.log(`  From: ${img}`);
            console.log(`  To:   /${correctedPath}`);
            return '/' + correctedPath;
          }
        }
        return img;
      });
      
      if (galleryChanged) {
        newGallery = JSON.stringify(correctedGallery);
        needsUpdate = true;
        galleryUpdated++;
      }
    } catch (e) {
      console.error(`Error parsing gallery for project ${project.id}:`, e.message);
    }
  }
  
  // Update database if needed
  if (needsUpdate) {
    db.prepare('UPDATE projects SET image = ?, gallery = ? WHERE id = ?')
      .run(newImage, newGallery, project.id);
    updated++;
  }
}

console.log(`\n✓ Updated ${updated} projects`);
console.log(`✓ Updated ${galleryUpdated} gallery entries`);
console.log('\nImage paths have been corrected!');
