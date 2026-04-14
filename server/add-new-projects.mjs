import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

const newProjects = [
  {
    title: 'Lathama Apartment',
    title_ar: 'شقة لثامة',
    description: 'Luxury apartment design project',
    description_ar: 'مشروع تصميم شقة فاخرة',
    category: 'interior-design',
    category_ar: 'تصميم داخلي',
    image: '/Lathama/cover.jpg',
    gallery: JSON.stringify([
      '/Lathama/1.jpg',
      '/Lathama/2.jpg',
      '/Lathama/3.jpg'
    ]),
    duration: 'Multiple Days',
    duration_ar: 'عدة أيام',
    designer: 'TRQ STUDIO',
    designer_ar: 'TRQ STUDIO',
    isPublished: 1,
    sortOrder: 23
  },
  {
    title: 'Apartment A',
    title_ar: 'الشقة أ',
    description: 'Contemporary apartment design',
    description_ar: 'تصميم شقة معاصر',
    category: 'interior-design',
    category_ar: 'تصميم داخلي',
    image: '/ApartmentA/cover.jpg',
    gallery: JSON.stringify([
      '/ApartmentA/1.jpg',
      '/ApartmentA/2.jpg',
      '/ApartmentA/3.jpg'
    ]),
    duration: 'Multiple Days',
    duration_ar: 'عدة أيام',
    designer: 'TRQ STUDIO',
    designer_ar: 'TRQ STUDIO',
    isPublished: 1,
    sortOrder: 24
  },
  {
    title: 'School Refurbishment',
    title_ar: 'تجديد المدرسة',
    description: 'Playground and school refurbishment project completed in two days',
    description_ar: 'مشروع تجديد الملعب والمدرسة تم إنجازه في يومين',
    category: 'interior-design',
    category_ar: 'تصميم داخلي',
    image: '/playGround/cover.jpg',
    gallery: JSON.stringify([
      '/playGround/1.jpg',
      '/playGround/2.jpg',
      '/playGround/3.jpg'
    ]),
    duration: 'Two Days',
    duration_ar: 'يومين',
    designer: 'TRQ STUDIO',
    designer_ar: 'TRQ STUDIO',
    isPublished: 1,
    sortOrder: 25
  },
  {
    title: 'Al Bujairi Dining - Tent',
    title_ar: 'الدايني البجيري - خيمة',
    description: 'Al Bujairi dining tent design project completed in one day',
    description_ar: 'مشروع تصميم خيمة الدايني البجيري تم إنجازه في يوم واحد',
    category: 'event-design',
    category_ar: 'تصميم الفعاليات',
    image: '/011/cover.jpg',
    gallery: JSON.stringify([
      '/011/1.jpg',
      '/011/2.jpg',
      '/011/3.jpg'
    ]),
    duration: 'One Day',
    duration_ar: 'يوم واحد',
    designer: 'TRQ STUDIO',
    designer_ar: 'TRQ STUDIO',
    isPublished: 1,
    sortOrder: 26
  },
  {
    title: 'Hospitality Station',
    title_ar: 'محطة الضيافة',
    description: 'Hospitality station design by TRQ Studio',
    description_ar: 'تصميم محطة الضيافة من قبل TRQ STUDIO',
    category: 'event-design',
    category_ar: 'تصميم الفعاليات',
    image: '/Hospitality/cover.jpg',
    gallery: JSON.stringify([
      '/Hospitality/1.jpg',
      '/Hospitality/2.jpg',
      '/Hospitality/3.jpg'
    ]),
    duration: 'Multiple Days',
    duration_ar: 'عدة أيام',
    designer: 'TRQ STUDIO',
    designer_ar: 'TRQ STUDIO',
    isPublished: 1,
    sortOrder: 27
  }
];

console.log('Adding new projects to portfolio...\n');

newProjects.forEach((project, index) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO projects (
        title, title_ar, description, description_ar, category, category_ar,
        image, gallery, duration, duration_ar, designer, designer_ar,
        isPublished, sortOrder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      project.title,
      project.title_ar,
      project.description,
      project.description_ar,
      project.category,
      project.category_ar,
      project.image,
      project.gallery,
      project.duration,
      project.duration_ar,
      project.designer,
      project.designer_ar,
      project.isPublished,
      project.sortOrder
    );
    
    console.log(`✓ Added: ${project.title}`);
    console.log(`  └─ Arabic: ${project.title_ar}`);
    console.log(`  └─ Duration: ${project.duration}`);
    console.log(`  └─ Category: ${project.category}\n`);
  } catch (error) {
    console.error(`✗ Error adding ${project.title}:`, error.message);
  }
});

console.log('✓ All new projects added successfully!');
console.log('\nProjects Added:');
console.log('1. Lathama Apartment');
console.log('2. Apartment A');
console.log('3. School Refurbishment (2 days)');
console.log('4. Al Bujairi Dining - Tent (1 day)');
console.log('5. Hospitality Station');
console.log('\nAll projects designed by: TRQ STUDIO');

db.close();
