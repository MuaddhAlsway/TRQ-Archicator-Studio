import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Helper function to get all images from a project folder
function getProjectImages(projectPath) {
  const images = [];
  const folderNames = ['WEB', 'PNG', 'webp', 'OG', 'IMAGES', 'PHOTOS'];

  // Check for subfolders first
  for (const folderName of folderNames) {
    const imagePath = path.join(projectPath, folderName);
    if (fs.existsSync(imagePath) && fs.statSync(imagePath).isDirectory()) {
      const files = fs.readdirSync(imagePath);
      files.forEach(file => {
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
          images.push(`/TRQ STUDIO _ PROJECTS/${path.basename(projectPath)}/${folderName}/${file}`);
        }
      });
    }
  }

  // If no images found in subfolders, check root level
  if (images.length === 0) {
    const files = fs.readdirSync(projectPath);
    files.forEach(file => {
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
        images.push(`/TRQ STUDIO _ PROJECTS/${path.basename(projectPath)}/${file}`);
      }
    });
  }

  return images;
}

// Helper function to categorize projects
function categorizeProject(projectName) {
  const name = projectName.toLowerCase();
  
  if (name.includes('apartment') || name.includes('bedroom') || name.includes('living room') || name.includes('luxury')) {
    return 'residential';
  }
  if (name.includes('booth') || name.includes('exhibition') || name.includes('rsg')) {
    return 'booths';
  }
  if (name.includes('event') || name.includes('parade') || name.includes('national day') || name.includes('quality of life')) {
    return 'events';
  }
  if (name.includes('market') || name.includes('retail')) {
    return 'commercial';
  }
  if (name.includes('furniture') || name.includes('paws') || name.includes('alulah') || name.includes('h & p')) {
    return 'furniture';
  }
  if (name.includes('diriyah') || name.includes('aryash')) {
    return 'commercial';
  }
  
  return 'commercial';
}

// Default metadata for projects not in seed file
function getDefaultMetadata(projectName) {
  const categoryMap = {
    'PAWS & PARTNERS': {
      title: 'PAWS & PARTNERS',
      title_ar: 'الكفوف والشركاء',
      category: 'furniture',
      category_ar: 'أثاث',
      description: 'Innovative furniture and design collaboration project.',
      description_ar: 'مشروع تعاون مبتكر في الأثاث والتصميم.',
    },
    'A Fusion of Art and Elegance  Living room': {
      title: 'A Fusion of Art and Elegance',
      title_ar: 'اندماج الفن والأناقة',
      category: 'residential',
      category_ar: 'سكني',
      description: 'Elegant living room design combining art and contemporary aesthetics.',
      description_ar: 'تصميم غرفة معيشة أنيقة تجمع بين الفن والجماليات المعاصرة.',
    },
    'ALULAH': {
      title: 'ALULAH',
      title_ar: 'علولة',
      category: 'furniture',
      category_ar: 'أثاث',
      description: 'Contemporary furniture design project.',
      description_ar: 'مشروع تصميم أثاث معاصر.',
    },
    'CLASSIC BEDROOM': {
      title: 'CLASSIC BEDROOM',
      title_ar: 'غرفة نوم كلاسيكية',
      category: 'residential',
      category_ar: 'سكني',
      description: 'Timeless bedroom design with classic elegance.',
      description_ar: 'تصميم غرفة نوم خالد مع الأناقة الكلاسيكية.',
    },
    'H & P': {
      title: 'H & P',
      title_ar: 'H & P',
      category: 'furniture',
      category_ar: 'أثاث',
      description: 'Specialized furniture and design project.',
      description_ar: 'مشروع أثاث وتصميم متخصص.',
    },
    'Modern LuxuryLiving room': {
      title: 'Modern Luxury Living Room',
      title_ar: 'غرفة معيشة فاخرة حديثة',
      category: 'residential',
      category_ar: 'سكني',
      description: 'Contemporary luxury living space with modern design elements.',
      description_ar: 'مساحة معيشة فاخرة معاصرة مع عناصر تصميم حديثة.',
    },
    'QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT': {
      title: 'QUALITY OF LIFE PROGRAM - NATIONAL DAY EVENT',
      title_ar: 'برنامج جودة الحياة - فعالية اليوم الوطني',
      category: 'events',
      category_ar: 'فعاليات',
      description: 'National day event celebrating quality of life initiatives.',
      description_ar: 'فعالية اليوم الوطني تحتفي ببرامج جودة الحياة.',
    },
    'Half million': {
      title: 'Half Million',
      title_ar: 'نصف مليون',
      category: 'residential',
      category_ar: 'سكني',
      description: 'Premium residential design project.',
      description_ar: 'مشروع تصميم سكني فاخر.',
    },
  };

  return categoryMap[projectName] || {
    title: projectName,
    title_ar: projectName,
    category: categorizeProject(projectName),
    category_ar: 'تصميم',
    description: `${projectName} design project by TRQ Studio.`,
    description_ar: `مشروع تصميم ${projectName} من قبل استوديو TRQ.`,
  };
}

function scanAndSyncProjects() {
  try {
    console.log('🔍 Scanning TRQ STUDIO _ PROJECTS directory...\n');

    if (!fs.existsSync(projectsDir)) {
      console.error('❌ Projects directory not found:', projectsDir);
      process.exit(1);
    }

    const projectFolders = fs.readdirSync(projectsDir).filter(item => {
      const itemPath = path.join(projectsDir, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    });

    console.log(`Found ${projectFolders.length} project folders:\n`);

    // Get existing projects from database
    const existingProjects = db.prepare('SELECT title FROM projects').all();
    const existingTitles = new Set(existingProjects.map(p => p.title));

    let addedCount = 0;
    let skippedCount = 0;

    for (const folderName of projectFolders) {
      const projectPath = path.join(projectsDir, folderName);
      const images = getProjectImages(projectPath);
      const metadata = getDefaultMetadata(folderName);

      // Check if project already exists
      if (existingTitles.has(metadata.title)) {
        console.log(`⏭️  Skipped: ${metadata.title} (already in database)`);
        skippedCount++;
        continue;
      }

      const featuredImage = images.length > 0 ? images[0] : '/uploads/placeholder.jpg';

      try {
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
          new Date().getFullYear().toString(),
          'Riyadh, Saudi Arabia',
          'الرياض، المملكة العربية السعودية',
          'TRQ Studio',
          'استوديو TRQ',
          'Custom',
          'مخصص',
          'Custom Duration',
          'مدة مخصصة',
          'Creating exceptional design',
          'إنشاء تصميم استثنائي',
          'Professional design execution',
          'تنفيذ تصميم احترافي',
          JSON.stringify(['Professional Design', 'Quality Execution', 'Attention to Detail']),
          JSON.stringify(['تصميم احترافي', 'تنفيذ عالي الجودة', 'الاهتمام بالتفاصيل']),
          JSON.stringify(['Premium Materials', 'Modern Techniques']),
          JSON.stringify(['مواد فاخرة', 'تقنيات حديثة']),
          JSON.stringify(images),
          'published'
        );

        console.log(`✅ Added: ${metadata.title} (${images.length} images)`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Error adding ${metadata.title}:`, error.message);
      }
    }

    console.log(`\n📊 Sync Complete!`);
    console.log(`   ✅ Added: ${addedCount} projects`);
    console.log(`   ⏭️  Skipped: ${skippedCount} projects (already exist)`);
    console.log(`   📁 Total folders scanned: ${projectFolders.length}`);

    // Show final count
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get();
    console.log(`\n🎉 Total projects in database: ${totalProjects.count}`);

  } catch (error) {
    console.error('❌ Error during scan and sync:', error);
    process.exit(1);
  }
}

scanAndSyncProjects();
