import db from './server/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

console.log('Scanning all project images and fixing paths...\n');

// Get all projects
const projects = db.prepare('SELECT id, title, image, gallery FROM projects ORDER BY id').all();

let fixed = 0;
let errors = 0;

projects.forEach(project => {
  try {
    let imagePath = project.image;
    let newImagePath = imagePath;
    
    // Fix image path format
    if (imagePath) {
      // Remove leading slash if present
      let cleanPath = imagePath.replace(/^\//, '');
      
      // Check if file exists in public folder
      const fullPath = path.join(publicDir, cleanPath);
      
      if (fs.existsSync(fullPath)) {
        // File exists, keep the path but ensure it starts with /
        newImagePath = `/${cleanPath}`;
        
        // Update database if changed
        if (newImagePath !== imagePath) {
          db.prepare('UPDATE projects SET image = ? WHERE id = ?').run(newImagePath, project.id);
          console.log(`✓ Project ${project.id}: Fixed image path`);
          console.log(`  From: ${imagePath}`);
          console.log(`  To:   ${newImagePath}\n`);
          fixed++;
        }
      } else {
        console.warn(`✗ Project ${project.id}: Image file not found`);
        console.warn(`  Path: ${fullPath}\n`);
        errors++;
      }
    }
    
    // Fix gallery paths
    if (project.gallery) {
      try {
        let gallery = project.gallery;
        
        // Handle double-encoded JSON
        if (typeof gallery === 'string') {
          try {
            gallery = JSON.parse(gallery);
            if (typeof gallery === 'string') {
              gallery = JSON.parse(gallery);
            }
          } catch (e) {
            // If it's not JSON, skip
            gallery = [];
          }
        }
        
        if (Array.isArray(gallery) && gallery.length > 0) {
          let galleryChanged = false;
          
          gallery = gallery.map(imgPath => {
            if (!imgPath) return imgPath;
            let cleanPath = imgPath.replace(/^\//, '');
            const fullPath = path.join(publicDir, cleanPath);
            
            if (fs.existsSync(fullPath)) {
              const newPath = `/${cleanPath}`;
              if (newPath !== imgPath) {
                galleryChanged = true;
              }
              return newPath;
            }
            return imgPath;
          });
          
          if (galleryChanged) {
            db.prepare('UPDATE projects SET gallery = ? WHERE id = ?').run(JSON.stringify(gallery), project.id);
            console.log(`✓ Project ${project.id}: Fixed gallery paths (${gallery.length} images)`);
            fixed++;
          }
        }
      } catch (e) {
        console.warn(`✗ Project ${project.id}: Error parsing gallery:`, e.message);
        errors++;
      }
    }
  } catch (error) {
    console.error(`✗ Error processing project ${project.id}:`, error.message);
    errors++;
  }
});

console.log(`\n✓ Fixed ${fixed} paths`);
console.log(`✗ Errors: ${errors}`);
console.log('\nNote: All image paths are now in format: /FOLDER/filename.ext');
console.log('Images will be served from Cloudflare Pages dist folder or via API.');
