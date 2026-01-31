import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsFolder = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Image extensions to look for
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function getFirstImage(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFile = files.find(file => 
      imageExtensions.includes(path.extname(file).toLowerCase())
    );
    if (imageFile) {
      return `/TRQ STUDIO _ PROJECTS/${path.basename(folderPath)}/${imageFile}`;
    }
  } catch (err) {
    console.error(`Error reading folder ${folderPath}:`, err.message);
  }
  return null;
}

function categorizeProject(projectName) {
  const name = projectName.toLowerCase();
  
  if (name.includes('booth') || name.includes('exhibition') || name.includes('stand')) {
    return 'booths';
  }
  if (name.includes('event') || name.includes('parade') || name.includes('national day')) {
    return 'events';
  }
  if (name.includes('furniture')) {
    return 'furniture';
  }
  if (name.includes('hotel') || name.includes('restaurant') || name.includes('retail') || name.includes('commercial')) {
    return 'commercial';
  }
  if (name.includes('bedroom') || name.includes('living') || name.includes('apartment') || name.includes('villa') || name.includes('residence')) {
    return 'residential';
  }
  
  return 'commercial'; // default
}

export async function scanProjectsFromFolder() {
  try {
    if (!fs.existsSync(projectsFolder)) {
      console.log(`Projects folder not found at ${projectsFolder}`);
      return { success: false, message: 'Projects folder not found' };
    }

    const folders = fs.readdirSync(projectsFolder).filter(file => {
      const fullPath = path.join(projectsFolder, file);
      return fs.statSync(fullPath).isDirectory();
    });

    console.log(`Found ${folders.length} project folders`);

    let created = 0;
    let skipped = 0;

    for (const folder of folders) {
      const folderPath = path.join(projectsFolder, folder);
      const projectName = folder.trim();
      
      // Check if project already exists
      const existing = db.prepare('SELECT id FROM projects WHERE title = ?').get(projectName);
      
      if (existing) {
        console.log(`Skipping ${projectName} - already exists`);
        skipped++;
        continue;
      }

      const image = getFirstImage(folderPath);
      if (!image) {
        console.log(`Skipping ${projectName} - no images found`);
        skipped++;
        continue;
      }

      const category = categorizeProject(projectName);
      
      try {
        db.prepare(`
          INSERT INTO projects (
            title, category, subcategory, description, image, year, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          projectName,
          category,
          category.charAt(0).toUpperCase() + category.slice(1),
          `${projectName} - A TRQ Studio project`,
          image,
          new Date().getFullYear().toString(),
          'published'
        );
        
        console.log(`Created project: ${projectName}`);
        created++;
      } catch (err) {
        console.error(`Error creating project ${projectName}:`, err.message);
      }
    }

    return {
      success: true,
      message: `Scanned ${folders.length} folders. Created: ${created}, Skipped: ${skipped}`,
      created,
      skipped,
      total: folders.length
    };
  } catch (error) {
    console.error('Error scanning projects:', error);
    return { success: false, message: error.message };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanProjectsFromFolder();
  console.log(result);
  process.exit(result.success ? 0 : 1);
}
