import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Helper to get images from a folder and its subfolders
function getProjectImages(folderPath) {
  const images = [];
  const subfolders = ['WEB', 'PNG', 'webp', 'OG', 'IMAGES', 'PHOTOS'];
  
  // Check root folder first
  try {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
        const relativePath = path.relative(path.join(__dirname, '../public'), path.join(folderPath, file));
        images.push(`/${relativePath.replace(/\\/g, '/')}`);
      }
    });
  } catch (e) {
    // Folder doesn't exist or can't be read
  }

  // Check subfolders
  for (const subfolder of subfolders) {
    const subPath = path.join(folderPath, subfolder);
    if (fs.existsSync(subPath)) {
      try {
        const files = fs.readdirSync(subPath);
        files.forEach(file => {
          if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
            const relativePath = path.relative(path.join(__dirname, '../public'), path.join(subPath, file));
            images.push(`/${relativePath.replace(/\\/g, '/')}`);
          }
        });
      } catch (e) {
        console.log(`Could not read subfolder: ${subPath}`);
      }
    }
  }

  return images;
}

// Helper to generate metadata from folder name
function generateMetadata(folderName) {
  // Remove leading numbers and dots (e.g., "11. REC. HEAVEN" -> "REC. HEAVEN")
  const cleanName = folderName.replace(/^\d+\.\s*/, '').trim();
  
  // Determine category based on folder name
  let category = 'Other';
  const nameLower = cleanName.toLowerCase();
  
  if (nameLower.includes('apartment') || nameLower.includes('bedroom') || nameLower.includes('living room')) {
    category = 'Residential';
  } else if (nameLower.includes('booth') || nameLower.includes('exhibition')) {
    category = 'Booths & Exhibitions';
  } else if (nameLower.includes('event') || nameLower.includes('parade') || nameLower.includes('national day')) {
    category = 'Events';
  } else if (nameLower.includes('market') || nameLower.includes('retail')) {
    category = 'Commercial';
  } else if (nameLower.includes('furniture')) {
    category = 'Furniture';
  } else if (nameLower.includes('heaven') || nameLower.includes('luxury') || nameLower.includes('classic')) {
    category = 'Residential';
  }

  return {
    title: cleanName,
    title_ar: cleanName, // Will be translated if needed
    category: category,
    category_ar: category,
    description: `Exceptional ${category.toLowerCase()} design project showcasing our expertise and creativity.`,
    description_ar: `مشروع تصميم ${category} استثنائي يعرض خبرتنا وإبداعنا.`,
    year: new Date().getFullYear().toString(),
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client: 'TRQ Studio',
    client_ar: 'استوديو TRQ',
    size: 'Custom',
    size_ar: 'مخصص',
    duration: 'Project Duration',
    duration_ar: 'مدة المشروع',
    challenge: 'Creating exceptional design solutions',
    challenge_ar: 'إنشاء حلول تصميم استثنائية',
    solution: 'Innovative design approach with attention to detail',
    solution_ar: 'نهج تصميم مبتكر مع الاهتمام بالتفاصيل',
    features: ['Professional Design', 'Quality Execution', 'Attention to Detail'],
    features_ar: ['تصميم احترافي', 'تنفيذ عالي الجودة', 'الاهتمام بالتفاصيل'],
    materials: ['Premium Materials', 'Quality Finishes'],
    materials_ar: ['مواد فاخرة', 'تشطيبات عالية الجودة'],
  };
}

function scanAndSeedProjects() {
  try {
    if (!fs.existsSync(projectsDir)) {
      console.error('❌ Projects directory not found:', projectsDir);
      process.exit(1);
    }

    // Get all project folders
    const projectFolders = fs.readdirSync(projectsDir).filter(f => {
      const fullPath = path.join(projectsDir, f);
      return fs.statSync(fullPath).isDirectory() && f !== '.vscode' && !f.startsWith('.');
    });

    console.log(`Found ${projectFolders.length} project folders`);

    // Clear existing projects
    db.prepare('DELETE FROM projects').run();
    console.log('Cleared existing projects');

    let count = 0;
    const failedProjects = [];

    for (const folderName of projectFolders) {
      try {
        const folderPath = path.join(projectsDir, folderName);
        const gallery = getProjectImages(folderPath);
        const featuredImage = gallery.length > 0 ? gallery[0] : '/uploads/placeholder.jpg';
        const metadata = generateMetadata(folderName);

        const result = db.prepare(`
          INSERT INTO projects (
            title, title_ar, category, category_ar, description, description_ar,
            image, year, location, location_ar, client, client_ar, size, size_ar,
            duration, duration_ar, challenge, challenge_ar, solution, solution_ar,
            features, features_ar, materials, materials_ar, gallery, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          metadata.title,
          metadata.title_ar,
          metadata.category,
          metadata.category_ar,
          metadata.description,
          metadata.description_ar,
          featuredImage,
          metadata.year,
          metadata.location,
          metadata.location_ar,
          metadata.client,
          metadata.client_ar,
          metadata.size,
          metadata.size_ar,
          metadata.duration,
          metadata.duration_ar,
          metadata.challenge,
          metadata.challenge_ar,
          metadata.solution,
          metadata.solution_ar,
          JSON.stringify(metadata.features),
          JSON.stringify(metadata.features_ar),
          JSON.stringify(metadata.materials),
          JSON.stringify(metadata.materials_ar),
          JSON.stringify(gallery),
          'published'
        );

        count++;
        console.log(`✓ ${metadata.title} (${gallery.length} images)`);
      } catch (error) {
        console.error(`✗ Failed to add ${folderName}:`, error.message);
        failedProjects.push(folderName);
      }
    }

    console.log(`\n✅ Scan and seed complete!`);
    console.log(`   Added: ${count} projects`);
    if (failedProjects.length > 0) {
      console.log(`   Failed: ${failedProjects.length} projects`);
      failedProjects.forEach(p => console.log(`     - ${p}`));
    }
  } catch (error) {
    console.error('❌ Error during scan and seed:', error);
    process.exit(1);
  }
}

scanAndSeedProjects();
