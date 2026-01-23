import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS/TRQ STUDIO _ PROJECTS');

// Project metadata
const projectsMetadata = {
  '11. REC. HEAVEN': {
    title: 'REC. HEAVEN',
    title_ar: 'جنة الترفيه',
    category: 'Interior Design',
    category_ar: 'تصميم داخلي',
    description: 'A luxurious recreation space designed with modern aesthetics and comfort in mind.',
    description_ar: 'مساحة ترفيهية فاخرة مصممة بجماليات حديثة وراحة في الاعتبار.',
    year: 2023,
    client: 'Private Client',
    client_ar: 'عميل خاص',
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    size: '500 sqm',
    size_ar: '500 متر مربع',
    duration: '4 months',
    duration_ar: '4 أشهر',
    challenge: 'Creating a space that balances luxury with functionality',
    challenge_ar: 'إنشاء مساحة توازن بين الفخامة والوظيفة',
    solution: 'Integrated modern design elements with premium materials',
    solution_ar: 'دمج عناصر التصميم الحديث مع المواد الفاخرة',
    features: ['Modern Aesthetics', 'Premium Materials', 'Functional Layout', 'Ambient Lighting'],
    features_ar: ['جماليات حديثة', 'مواد فاخرة', 'تخطيط وظيفي', 'إضاءة محيطة'],
    materials: ['Marble', 'Wood', 'Glass', 'Steel'],
    materials_ar: ['رخام', 'خشب', 'زجاج', 'فولاذ'],
  },
  '14. RSG BOOTH': {
    title: 'RSG BOOTH',
    title_ar: 'كشك RSG',
    category: 'Exhibition Design',
    category_ar: 'تصميم المعارض',
    description: 'An innovative exhibition booth design showcasing brand identity and engagement.',
    description_ar: 'تصميم كشك معرض مبتكر يعرض هوية العلامة التجارية والمشاركة.',
    year: 2023,
    client: 'RSG Company',
    client_ar: 'شركة RSG',
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    size: '200 sqm',
    size_ar: '200 متر مربع',
    duration: '2 months',
    duration_ar: 'شهرين',
    challenge: 'Designing an eye-catching booth that stands out in a crowded exhibition',
    challenge_ar: 'تصميم كشك جذاب يبرز في معرض مزدحم',
    solution: 'Bold colors, interactive elements, and strategic lighting',
    solution_ar: 'ألوان جريئة وعناصر تفاعلية وإضاءة استراتيجية',
    features: ['Interactive Display', 'Brand Integration', 'Modular Design', 'LED Lighting'],
    features_ar: ['عرض تفاعلي', 'تكامل العلامة التجارية', 'تصميم معياري', 'إضاءة LED'],
    materials: ['Aluminum', 'LED Panels', 'Fabric', 'Acrylic'],
    materials_ar: ['ألومنيوم', 'لوحات LED', 'نسيج', 'أكريليك'],
  },
  '21. RAFAL APARTMENT': {
    title: 'RAFAL APARTMENT',
    title_ar: 'شقة رفال',
    category: 'Residential Design',
    category_ar: 'تصميم سكني',
    description: 'Contemporary apartment design combining elegance with practical living spaces.',
    description_ar: 'تصميم شقة معاصر يجمع بين الأناقة والمساحات المعيشية العملية.',
    year: 2023,
    client: 'Private Resident',
    client_ar: 'ساكن خاص',
    location: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    size: '350 sqm',
    size_ar: '350 متر مربع',
    duration: '3 months',
    duration_ar: '3 أشهر',
    challenge: 'Maximizing space while maintaining luxury and comfort',
    challenge_ar: 'تعظيم المساحة مع الحفاظ على الفخامة والراحة',
    solution: 'Smart space planning with high-end finishes',
    solution_ar: 'تخطيط ذكي للمساحة مع تشطيبات عالية الجودة',
    features: ['Open Plan Living', 'Smart Storage', 'Premium Finishes', 'Natural Light'],
    features_ar: ['معيشة مفتوحة', 'تخزين ذكي', 'تشطيبات فاخرة', 'ضوء طبيعي'],
    materials: ['Marble', 'Oak Wood', 'Stainless Steel', 'Glass'],
    materials_ar: ['رخام', 'خشب البلوط', 'الفولاذ المقاوم للصدأ', 'زجاج'],
  },
  '22. ARYASH AL-DIRIYAH A': {
    title: 'ARYASH AL-DIRIYAH',
    title_ar: 'أرياش الدرعية',
    category: 'Commercial Design',
    category_ar: 'تصميم تجاري',
    description: 'Premium commercial space design reflecting modern business aesthetics.',
    description_ar: 'تصميم مساحة تجارية فاخرة يعكس جماليات الأعمال الحديثة.',
    year: 2023,
    client: 'Aryash Development',
    client_ar: 'تطوير أرياش',
    location: 'Al-Diriyah, Saudi Arabia',
    location_ar: 'الدرعية، المملكة العربية السعودية',
    size: '1000 sqm',
    size_ar: '1000 متر مربع',
    duration: '5 months',
    duration_ar: '5 أشهر',
    challenge: 'Creating a distinctive commercial identity in a heritage location',
    challenge_ar: 'إنشاء هوية تجارية مميزة في موقع تراثي',
    solution: 'Blending modern design with cultural sensitivity',
    solution_ar: 'دمج التصميم الحديث مع الحساسية الثقافية',
    features: ['Heritage Integration', 'Modern Facilities', 'Sustainable Design', 'Cultural Respect'],
    features_ar: ['تكامل التراث', 'مرافق حديثة', 'تصميم مستدام', 'احترام ثقافي'],
    materials: ['Local Stone', 'Traditional Wood', 'Modern Glass', 'Sustainable Materials'],
    materials_ar: ['حجر محلي', 'خشب تقليدي', 'زجاج حديث', 'مواد مستدامة'],
  },
  '3. DIRIYAH PARADE': {
    title: 'DIRIYAH PARADE',
    title_ar: 'عرض الدرعية',
    category: 'Concept Design',
    category_ar: 'تصميم المفهوم',
    description: 'Large-scale concept design for a cultural parade celebration.',
    description_ar: 'تصميم مفهوم واسع النطاق لاحتفال عرض ثقافي.',
    year: 2023,
    client: 'Diriyah Authority',
    client_ar: 'هيئة الدرعية',
    location: 'Al-Diriyah, Saudi Arabia',
    location_ar: 'الدرعية، المملكة العربية السعودية',
    size: '5000 sqm',
    size_ar: '5000 متر مربع',
    duration: '2 months',
    duration_ar: 'شهرين',
    challenge: 'Coordinating a large-scale cultural event with multiple stakeholders',
    challenge_ar: 'تنسيق فعالية ثقافية واسعة النطاق مع أصحاب مصلحة متعددين',
    solution: 'Comprehensive planning and execution with cultural authenticity',
    solution_ar: 'تخطيط وتنفيذ شامل مع الأصالة الثقافية',
    features: ['Cultural Authenticity', 'Large Scale', 'Community Engagement', 'Heritage Focus'],
    features_ar: ['الأصالة الثقافية', 'نطاق واسع', 'المشاركة المجتمعية', 'التركيز على التراث'],
    materials: ['Fabric Structures', 'Lighting Systems', 'Sound Equipment', 'Decorative Elements'],
    materials_ar: ['هياكل نسيجية', 'أنظمة الإضاءة', 'معدات الصوت', 'عناصر زخرفية'],
  },
  '6. DIRIYAH NATIONAL DAY EVENT': {
    title: 'DIRIYAH NATIONAL DAY EVENT',
    title_ar: 'فعالية اليوم الوطني بالدرعية',
    category: 'Concept Design',
    category_ar: 'تصميم المفهوم',
    description: 'Spectacular national day celebration concept design and execution.',
    description_ar: 'تصميم وتنفيذ مفهوم احتفال اليوم الوطني الرائع.',
    year: 2023,
    client: 'Saudi National Day Committee',
    client_ar: 'لجنة اليوم الوطني السعودي',
    location: 'Al-Diriyah, Saudi Arabia',
    location_ar: 'الدرعية، المملكة العربية السعودية',
    size: '8000 sqm',
    size_ar: '8000 متر مربع',
    duration: '3 months',
    duration_ar: '3 أشهر',
    challenge: 'Creating a memorable national celebration with high attendance',
    challenge_ar: 'إنشاء احتفال وطني لا يُنسى بحضور كبير',
    solution: 'Innovative design with patriotic themes and interactive experiences',
    solution_ar: 'تصميم مبتكر بموضوعات وطنية وتجارب تفاعلية',
    features: ['Patriotic Design', 'Interactive Zones', 'Entertainment Stages', 'Family Activities'],
    features_ar: ['تصميم وطني', 'مناطق تفاعلية', 'مراحل الترفيه', 'أنشطة عائلية'],
    materials: ['Stage Structures', 'LED Displays', 'Sound Systems', 'Decorative Installations'],
    materials_ar: ['هياكل المسرح', 'شاشات LED', 'أنظمة الصوت', 'التركيبات الزخرفية'],
  },
  '7. DIRIYAH MARKET': {
    title: 'DIRIYAH MARKET',
    title_ar: 'سوق الدرعية',
    category: 'Retail Design',
    category_ar: 'تصميم البيع بالتجزئة',
    description: 'Traditional market design with modern retail functionality.',
    description_ar: 'تصميم سوق تقليدي مع وظائف البيع بالتجزئة الحديثة.',
    year: 2023,
    client: 'Diriyah Authority',
    client_ar: 'هيئة الدرعية',
    location: 'Al-Diriyah, Saudi Arabia',
    location_ar: 'الدرعية، المملكة العربية السعودية',
    size: '3000 sqm',
    size_ar: '3000 متر مربع',
    duration: '4 months',
    duration_ar: '4 أشهر',
    challenge: 'Balancing traditional aesthetics with modern retail needs',
    challenge_ar: 'موازنة الجماليات التقليدية مع احتياجات البيع بالتجزئة الحديثة',
    solution: 'Heritage-inspired design with contemporary retail infrastructure',
    solution_ar: 'تصميم مستوحى من التراث مع البنية التحتية للبيع بالتجزئة المعاصرة',
    features: ['Traditional Architecture', 'Modern Retail', 'Cultural Ambiance', 'Vendor Spaces'],
    features_ar: ['العمارة التقليدية', 'البيع بالتجزئة الحديث', 'الأجواء الثقافية', 'مساحات البائعين'],
    materials: ['Local Stone', 'Traditional Wood', 'Modern Flooring', 'Ambient Lighting'],
    materials_ar: ['حجر محلي', 'خشب تقليدي', 'أرضيات حديثة', 'إضاءة محيطة'],
  },
};

function getProjectImages(projectName) {
  const projectPath = path.join(projectsDir, projectName);
  const images = [];

  // Check for PNG and WEB folders
  const folderNames = ['PNG', 'WEB', 'IMAGES', 'PHOTOS'];

  for (const folderName of folderNames) {
    const imagePath = path.join(projectPath, folderName);
    if (fs.existsSync(imagePath)) {
      const files = fs.readdirSync(imagePath);
      files.forEach(file => {
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
          images.push(`/TRQ STUDIO _ PROJECTS/TRQ STUDIO _ PROJECTS/${projectName}/${folderName}/${file}`);
        }
      });
    }
  }

  return images;
}

function initializeDefaultData() {
  try {
    console.log('\n🔄 Initializing default portfolio data...\n');

    // Clear existing projects
    db.prepare('DELETE FROM projects').run();
    console.log('✓ Cleared existing projects');

    let count = 0;

    for (const [folderName, metadata] of Object.entries(projectsMetadata)) {
      const gallery = getProjectImages(folderName);
      const featuredImage = gallery.length > 0 ? gallery[0] : '/uploads/placeholder.jpg';

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
      console.log(`✓ Added: ${metadata.title} (${gallery.length} images)`);
    }

    console.log(`\n✅ Default portfolio initialized! ${count} projects loaded.\n`);
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDefaultData();
