import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

console.log('Adding Contemporary & Luxury project...');

try {
  // Check if project already exists
  const existing = db.prepare("SELECT * FROM projects WHERE title = ?").get('Contemporary & Luxury');
  
  if (existing) {
    console.log('Project already exists with ID:', existing.id);
    console.log('Updating gallery images...');
    
    const gallery = JSON.stringify([
      '/Contemporary & luxury/6.webp',
      '/Contemporary & luxury/6A.webp',
      '/Contemporary & luxury/6B.webp',
      '/Contemporary & luxury/6C.webp',
    ]);
    
    db.prepare(`
      UPDATE projects 
      SET gallery = ?, image = ?
      WHERE id = ?
    `).run(gallery, '/Contemporary & luxury/6.webp', existing.id);
    
    console.log('✓ Gallery updated');
  } else {
    console.log('Creating new project...');
    
    const gallery = JSON.stringify([
      '/Contemporary & luxury/6.webp',
      '/Contemporary & luxury/6A.webp',
      '/Contemporary & luxury/6B.webp',
      '/Contemporary & luxury/6C.webp',
    ]);
    
    const result = db.prepare(`
      INSERT INTO projects (
        title, category, subcategory, description, image, year, 
        location, client, size, duration, detailedDescription, 
        challenge, solution, features, materials, awards, team, 
        gallery, clientQuote, clientName, status,
        title_ar, category_ar, subcategory_ar, description_ar,
        location_ar, client_ar, size_ar, duration_ar,
        detailedDescription_ar, challenge_ar, solution_ar,
        features_ar, materials_ar, awards_ar, team_ar,
        clientQuote_ar, clientName_ar
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      'Contemporary & Luxury',
      'interior-design',
      'Living Room Design',
      'Contemporary luxury living space with sophisticated design elements and modern aesthetics.',
      '/Contemporary & luxury/6.webp',
      '2024',
      'Riyadh, Saudi Arabia',
      'Private Client',
      '150 sqm',
      '4 months',
      'A stunning contemporary luxury project showcasing sophisticated design with modern elements. This living space combines minimalist aesthetics with luxury materials and statement furniture pieces.',
      'Creating a sophisticated living space that balances contemporary design with luxury comfort',
      'Implemented minimalist design principles with premium materials, custom furniture, and strategic lighting to create an elegant and functional living environment.',
      JSON.stringify(['Open Floor Plan', 'Custom Lighting', 'Premium Materials', 'Modern Furniture']),
      JSON.stringify(['Marble', 'Walnut Wood', 'Brass Accents', 'Luxury Fabrics']),
      JSON.stringify([]),
      JSON.stringify(['Design Team', 'Project Manager', 'Craftsmen']),
      gallery,
      '',
      '',
      'published',
      'معاصر وفاخر',
      'تصميم داخلي',
      'تصميم غرفة المعيشة',
      'مساحة معيشة فاخرة معاصرة مع عناصر تصميم متطورة وجماليات حديثة.',
      'الرياض، المملكة العربية السعودية',
      'عميل خاص',
      '150 متر مربع',
      '4 أشهر',
      'مشروع فاخر معاصر مذهل يعرض تصميماً متطوراً مع عناصر حديثة. تجمع هذه المساحة المعيشة بين الجماليات البسيطة والراحة الفاخرة.',
      'إنشاء مساحة معيشة متطورة توازن بين التصميم المعاصر والراحة الفاخرة',
      'تم تطبيق مبادئ التصميم البسيط مع المواد الممتازة والأثاث المخصص والإضاءة الاستراتيجية لإنشاء بيئة معيشة أنيقة وعملية.',
      JSON.stringify(['خطة مفتوحة', 'إضاءة مخصصة', 'مواد ممتازة', 'أثاث حديث']),
      JSON.stringify(['رخام', 'خشب الجوز', 'لمسات نحاسية', 'أقمشة فاخرة']),
      JSON.stringify([]),
      JSON.stringify(['فريق التصميم', 'مدير المشروع', 'الحرفيون']),
      '',
      '',
    );
    
    console.log('✓ Project created with ID:', result.lastInsertRowid);
  }
  
  console.log('✓ Contemporary & Luxury project setup complete');
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
