import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Category mapping based on folder names
const getCategoryFromName = (folderName) => {
  const name = folderName.toLowerCase();
  
  if (name.includes('rec') || name.includes('heaven')) return 'Interior Design';
  if (name.includes('booth') || name.includes('rsg') || name.includes('exhibition')) return 'Exhibition Design';
  if (name.includes('apartment') || name.includes('rafal') || name.includes('bedroom') || name.includes('living')) return 'Residential Design';
  if (name.includes('aryash') || name.includes('diriyah') || name.includes('market')) return 'Commercial Design';
  if (name.includes('parade') || name.includes('event') || name.includes('national day') || name.includes('quality')) return 'Event Design';
  if (name.includes('paws') || name.includes('partners')) return 'Branding';
  if (name.includes('fusion') || name.includes('luxury') || name.includes('classic')) return 'Interior Design';
  if (name.includes('alulah')) return 'Branding';
  
  return 'Design Project';
};

function getProjectImages(projectPath) {
  const images = [];
  const folderNames = ['PNG', 'WEB', 'IMAGES', 'PHOTOS', 'webp', 'OG'];

  for (const folderName of folderNames) {
    const imagePath = path.join(projectPath, folderName);
    if (fs.existsSync(imagePath)) {
      const files = fs.readdirSync(imagePath);
      files.forEach(file => {
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
          const relativePath = path.relative(
            path.join(__dirname, '../public'),
            path.join(imagePath, file)
          ).replace(/\\/g, '/');
          images.push(`/${relativePath}`);
        }
      });
    }
  }

  return images;
}

function generateProjectMetadata(folderName, images) {
  const category = getCategoryFromName(folderName);
  
  return {
    title: folderName.replace(/^\d+\.\s*/, '').trim(),
    title_ar: folderName.replace(/^\d+\.\s*/, '').trim(),
    category: category,
    category_ar: category,
    description: `A professional ${category.toLowerCase()} project showcasing innovative design and attention to detail.`,
    description_ar: `مشروع احترافي في مجال ${category} يعرض التصميم المبتكر والاهتمام بالتفاصيل.`,
    year: new Date().getFullYear(),
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client: 'TRQ Studio Client',
    client_ar: 'عميل استوديو TRQ',
    size: 'Custom',
    size_ar: 'مخصص',
    duration: 'Project Duration',
    duration_ar: 'مدة المشروع',
    challenge: 'Creating exceptional design solutions',
    challenge_ar: 'إنشاء حلول تصميم استثنائية',
    solution: 'Innovative approach with attention to detail',
    solution_ar: 'نهج مبتكر مع الاهتمام بالتفاصيل',
    features: ['Professional Design', 'Quality Execution', 'Client Focused'],
    features_ar: ['تصميم احترافي', 'تنفيذ عالي الجودة', 'التركيز على العميل'],
    materials: ['Premium Materials', 'Modern Techniques'],
    materials_ar: ['مواد فاخرة', 'تقنيات حديثة'],
  };
}

function scanAndImportProjects() {
  try {
    console.log('\n🔄 Scanning TRQ STUDIO _ PROJECTS folder...\n');

    if (!fs.existsSync(projectsDir)) {
      console.error('❌ Projects directory not found:', projectsDir);
      process.exit(1);
    }

    // Clear existing projects
    db.prepare('DELETE FROM projects').run();
    console.log('✓ Cleared existing projects\n');

    const folders = fs.readdirSync(projectsDir).filter(item => {
      const itemPath = path.join(projectsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    console.log(`Found ${folders.length} project folders\n`);

    let count = 0;
    const failedProjects = [];

    for (const folderName of folders) {
      try {
        const projectPath = path.join(projectsDir, folderName);
        const images = getProjectImages(projectPath);
        
        if (images.length === 0) {
          console.log(`⚠ Skipped: ${folderName} (no images found)`);
          failedProjects.push(`${folderName} - no images`);
          continue;
        }

        const metadata = generateProjectMetadata(folderName, images);
        const featuredImage = images[0];

        db.prepare(`
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
          JSON.stringify(images),
          'published'
        );

        count++;
        console.log(`✓ Added: ${metadata.title} (${images.length} images)`);
      } catch (error) {
        console.error(`✗ Error processing ${folderName}:`, error.message);
        failedProjects.push(`${folderName} - ${error.message}`);
      }
    }

    console.log(`\n✅ Import complete! ${count} projects loaded.\n`);
    
    if (failedProjects.length > 0) {
      console.log('⚠ Failed projects:');
      failedProjects.forEach(p => console.log(`  - ${p}`));
    }
  } catch (error) {
    console.error('❌ Error scanning projects:', error);
    process.exit(1);
  }
}

// Run scan
scanAndImportProjects();
