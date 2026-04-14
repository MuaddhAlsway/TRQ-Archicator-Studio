import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Get current max ID
const maxIdResult = db.prepare('SELECT MAX(id) as maxId FROM projects').get();
let nextId = (maxIdResult.maxId || 0) + 1;

const newProjects = [
  {
    title: 'Lathama Apartment',
    title_ar: 'شقة لثامة',
    description: 'Luxury coffee and dates lounge design featuring elegant interior spaces with premium finishes and sophisticated ambiance.',
    category: 'interior-design',
    image: '/8. Coffee & Dates _ Lathama-20260227T190040Z-1-001/8. Coffee & Dates _ Lathama/3-Recovered.png',
    gallery: JSON.stringify([
      '/8. Coffee & Dates _ Lathama-20260227T190040Z-1-001/8. Coffee & Dates _ Lathama/3-Recovered.png',
      '/8. Coffee & Dates _ Lathama-20260227T190040Z-1-001/8. Coffee & Dates _ Lathama/5-Recovered.png',
      '/8. Coffee & Dates _ Lathama-20260227T190040Z-1-001/8. Coffee & Dates _ Lathama/6-Recovered.png'
    ]),
    duration: 'Multiple Days',
    client: 'TRQ STUDIO',
    status: 'published'
  },
  {
    title: 'Apartment A',
    title_ar: 'الشقة أ',
    description: 'Contemporary apartment design with modern aesthetics and functional living spaces.',
    category: 'interior-design',
    image: '/ApartmentA/27. Apartments A/1.png',
    gallery: JSON.stringify([
      '/ApartmentA/27. Apartments A/1.png',
      '/ApartmentA/27. Apartments A/2.png',
      '/ApartmentA/27. Apartments A/5.png',
      '/ApartmentA/27. Apartments A/6.png'
    ]),
    duration: 'Multiple Days',
    client: 'TRQ STUDIO',
    status: 'published'
  },
  {
    title: 'School Refurbishment',
    title_ar: 'تجديد المدرسة',
    description: 'Playground and school refurbishment project completed in two days with innovative design solutions.',
    category: 'interior-design',
    image: '/playGround/WEB/Image30.webp',
    gallery: JSON.stringify([
      '/playGround/WEB/Image30.webp',
      '/playGround/WEB/Image37.webp',
      '/playGround/WEB/Image38.webp',
      '/playGround/WEB/Image39.webp',
      '/playGround/WEB/Image40.webp'
    ]),
    duration: 'Two Days',
    client: 'TRQ STUDIO',
    status: 'published'
  },
  {
    title: 'Al Bujairi Dining - Tent',
    title_ar: 'الدايني البجيري - خيمة',
    description: 'Al Bujairi dining tent design project completed in one day with premium event design.',
    category: 'event-design',
    image: '/011/webp/Image36.webp',
    gallery: JSON.stringify([
      '/011/webp/Image36.webp',
      '/011/webp/Image37.webp',
      '/011/webp/Image38.webp',
      '/011/webp/Image391.webp',
      '/011/webp/Image40 (2).webp'
    ]),
    duration: 'One Day',
    client: 'TRQ STUDIO',
    status: 'published'
  }
];

console.log('Adding projects with correct image paths and IDs...\n');

newProjects.forEach((project) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO projects (
        id, title, title_ar, description, category,
        image, gallery, duration, client, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      nextId,
      project.title,
      project.title_ar,
      project.description,
      project.category,
      project.image,
      project.gallery,
      project.duration,
      project.client,
      project.status
    );
    
    console.log(`✓ Added: ${project.title} (ID: ${nextId})`);
    console.log(`  └─ Arabic: ${project.title_ar}`);
    console.log(`  └─ Duration: ${project.duration}`);
    console.log(`  └─ Image: ${project.image}\n`);
    
    nextId++;
  } catch (error) {
    console.error(`✗ Error adding ${project.title}:`, error.message);
  }
});

console.log('✓ All projects added successfully!');
console.log('\nProjects Summary:');
console.log('- Lathama Apartment');
console.log('- Apartment A');
console.log('- School Refurbishment (2 days)');
console.log('- Al Bujairi Dining - Tent (1 day)');
console.log('\nAll projects designed by: TRQ STUDIO');
console.log('Description: English only (no Arabic translation)');
console.log('Title: English and Arabic');

db.close();
