import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

const arabicUpdates = [
  {
    id: 23,
    description_ar: 'تصميم صالة قهوة وتمر فاخرة تتميز بمساحات داخلية أنيقة مع تشطيبات عالية الجودة وأجواء متطورة.',
    detailedDescription_ar: 'يمثل هذا المشروع الاستثنائي قمة التصميم الداخلي الفاخر مع التركيز على الراحة والأناقة.',
    challenge_ar: 'كان التحدي الأساسي هو إنشاء مساحة توازن بين التصميم المعاصر والأناقة الخالدة.',
    solution_ar: 'طورنا استراتيجية تصميم شاملة تتضمن مواد عالية الجودة وعناصر مصممة خصيصاً.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'TRQ STUDIO',
    size_ar: '500 متر مربع',
  },
  {
    id: 24,
    description_ar: 'تصميم شقة معاصر مع جماليات حديثة ومساحات معيشية وظيفية.',
    detailedDescription_ar: 'يجمع هذا المشروع بين التصميم الحديث والوظائف العملية لخلق مساحة معيشية مثالية.',
    challenge_ar: 'كان التحدي هو تحقيق التوازن بين الأسلوب المعاصر والراحة العملية.',
    solution_ar: 'استخدمنا مواد عصرية وتخطيطات ذكية لتحسين استخدام المساحة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'TRQ STUDIO',
    size_ar: '350 متر مربع',
  },
  {
    id: 25,
    description_ar: 'مشروع تجديد الملعب والمدرسة تم إنجازه في يومين مع حلول تصميم مبتكرة.',
    detailedDescription_ar: 'تم إنجاز هذا المشروع الاستثنائي في وقت قياسي مع الحفاظ على أعلى معايير الجودة والتصميم.',
    challenge_ar: 'كان التحدي الرئيسي هو إنجاز المشروع في يومين فقط مع ضمان الجودة العالية.',
    solution_ar: 'استخدمنا فريقاً متخصصاً وتخطيطاً دقيقاً لتحقيق النتائج المطلوبة في الوقت المحدد.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'TRQ STUDIO',
    size_ar: '2000 متر مربع',
  },
  {
    id: 26,
    description_ar: 'مشروع تصميم خيمة الدايني البجيري تم إنجازه في يوم واحد مع تصميم فعاليات عالي الجودة.',
    detailedDescription_ar: 'يمثل هذا المشروع مثالاً على قدرتنا على تسليم تصاميم فعاليات عالية الجودة في أوقات قياسية.',
    challenge_ar: 'كان التحدي هو إنجاز تصميم فعالية متكامل في يوم واحد فقط.',
    solution_ar: 'استخدمنا خبرتنا الواسعة وفريقاً متخصصاً لتحقيق النتائج المتميزة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'TRQ STUDIO',
    size_ar: '1500 متر مربع',
  }
];

console.log('Adding Arabic translations to new projects...\n');

arabicUpdates.forEach((update) => {
  try {
    const stmt = db.prepare(`
      UPDATE projects 
      SET 
        description_ar = ?,
        detailedDescription_ar = ?,
        challenge_ar = ?,
        solution_ar = ?,
        location_ar = ?,
        client_ar = ?,
        size_ar = ?
      WHERE id = ?
    `);
    
    stmt.run(
      update.description_ar,
      update.detailedDescription_ar,
      update.challenge_ar,
      update.solution_ar,
      update.location_ar,
      update.client_ar,
      update.size_ar,
      update.id
    );
    
    console.log(`✓ Added Arabic translations for Project ID: ${update.id}`);
  } catch (error) {
    console.error(`✗ Error updating project ${update.id}:`, error.message);
  }
});

console.log('\n✓ All Arabic translations added successfully!');
console.log('\nProjects now support:');
console.log('- English descriptions');
console.log('- Arabic descriptions');
console.log('- English titles');
console.log('- Arabic titles');
console.log('- All fields bilingual');

db.close();
