import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Arabic translations for all projects
const arabicTranslations = {
  1: {
    title_ar: 'جنة الترفيه',
    description_ar: 'مساحة ترفيهية فاخرة مصممة بجماليات حديثة وراحة في الذهن.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'يمثل هذا المشروع الاستثنائي قمة التصميم الداخلي الفاخر مع التركيز على الراحة والأناقة.',
    challenge_ar: 'كان التحدي الأساسي هو إنشاء مساحة توازن بين التصميم المعاصر والأناقة الخالدة.',
    solution_ar: 'طورنا استراتيجية تصميم شاملة تتضمن مواد عالية الجودة وعناصر مصممة خصيصاً.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '500 متر مربع',
    duration_ar: '6 أشهر',
  },
  2: {
    title_ar: 'البحر الأحمر الدولية | CITYSCAPE 24',
    description_ar: 'تصميم جناح مستوحى من البحر الأحمر والاستدامة والابتكار.',
    category_ar: 'أجنحة',
    detailedDescription_ar: 'مشروع تصميم جناح متقدم يجمع بين الابتكار والاستدامة والجماليات الحديثة.',
    challenge_ar: 'كان التحدي هو إنشاء جناح يعكس قيم الاستدامة والابتكار.',
    solution_ar: 'استخدمنا مواد مستدامة وتصاميم مبتكرة لتحقيق الرؤية.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'البحر الأحمر الدولية',
    size_ar: '300 متر مربع',
    duration_ar: '3 أشهر',
  },
  3: {
    title_ar: 'شقة رافال',
    description_ar: 'تصميم شقة فاخرة معاصرة مع تشطيبات متطورة',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'شقة فاخرة مصممة بأسلوب معاصر مع تركيز على الراحة والأناقة.',
    challenge_ar: 'كان التحدي هو دمج الفخامة مع الوظائف العملية.',
    solution_ar: 'استخدمنا مواد عالية الجودة وتخطيطات ذكية لتحقيق التوازن المثالي.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '400 متر مربع',
    duration_ar: '4 أشهر',
  },
  4: {
    title_ar: 'عريش الدرعية',
    description_ar: 'تصميم مستوحى من التراث السعودي مع الطين والخشب والمنحنيات والعمارة الأيقونية.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم يجمع بين التراث السعودي الأصيل والتصميم الحديث.',
    challenge_ar: 'كان التحدي هو الحفاظ على الهوية التراثية مع إضافة لمسات حديثة.',
    solution_ar: 'دمجنا العناصر التقليدية مع التصاميم المعاصرة بشكل متناسق.',
    location_ar: 'الدرعية، الرياض',
    client_ar: 'هيئة تطوير الدرعية',
    size_ar: '600 متر مربع',
    duration_ar: '5 أشهر',
  },
  5: {
    title_ar: 'موكب الدرعية',
    description_ar: 'تصميم فعالية واسعة النطاق لاحتفالية ثقافية.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع تصميم فعالية ثقافية كبرى يجمع بين الفن والتراث.',
    challenge_ar: 'كان التحدي هو تنظيم فعالية واسعة النطاق مع الحفاظ على الجودة.',
    solution_ar: 'استخدمنا تخطيطاً دقيقاً وفريقاً متخصصاً لتحقيق النجاح.',
    location_ar: 'الدرعية، الرياض',
    client_ar: 'هيئة تطوير الدرعية',
    size_ar: '5000 متر مربع',
    duration_ar: 'شهر واحد',
  },
  6: {
    title_ar: 'سوق الدرعية',
    description_ar: 'تصميم سوق تقليدي حديث يجمع بين الأصالة والابتكار.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم سوق يعكس الهوية التراثية مع الراحة الحديثة.',
    challenge_ar: 'كان التحدي هو إنشاء تجربة تسوق فريدة.',
    solution_ar: 'دمجنا العناصر التقليدية مع التسهيلات الحديثة.',
    location_ar: 'الدرعية، الرياض',
    client_ar: 'هيئة تطوير الدرعية',
    size_ar: '2000 متر مربع',
    duration_ar: '6 أشهر',
  },
  7: {
    title_ar: 'برنامج جودة الحياة - فعالية اليوم الوطني',
    description_ar: 'تصميم فعالية اليوم الوطني لبرنامج جودة الحياة.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع فعالية وطنية احتفالية تركز على جودة الحياة.',
    challenge_ar: 'كان التحدي هو إنشاء فعالية تعكس قيم البرنامج.',
    solution_ar: 'طورنا مفهوماً متكاملاً يجمع بين الفن والثقافة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'برنامج جودة الحياة',
    size_ar: '3000 متر مربع',
    duration_ar: 'شهر واحد',
  },
  8: {
    title_ar: 'يوم التأسيس السعودي 24',
    description_ar: 'تصميم فعالية يوم التأسيس السعودي.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع فعالية وطنية احتفالية لذكرى التأسيس.',
    challenge_ar: 'كان التحدي هو إنشاء فعالية تاريخية مميزة.',
    solution_ar: 'استخدمنا عناصر تاريخية وحديثة في التصميم.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'الهيئة العامة للثقافة',
    size_ar: '4000 متر مربع',
    duration_ar: 'شهر واحد',
  },
  9: {
    title_ar: 'يوم التراث الوطني السعودي',
    description_ar: 'تصميم فعالية يوم التراث الوطني السعودي.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع فعالية تراثية وطنية احتفالية.',
    challenge_ar: 'كان التحدي هو الحفاظ على الهوية التراثية الأصيلة.',
    solution_ar: 'ركزنا على العناصر التراثية الأصلية مع لمسات حديثة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'الهيئة العامة للثقافة',
    size_ar: '3500 متر مربع',
    duration_ar: 'شهر واحد',
  },
  10: {
    title_ar: 'مشروع TRQ STUDIO',
    description_ar: 'مشروع تصميم متقدم من TRQ STUDIO.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم متقدم يعكس خبرة TRQ STUDIO.',
    challenge_ar: 'كان التحدي هو تحقيق رؤية العميل بدقة.',
    solution_ar: 'استخدمنا أحدث التقنيات والمواد.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '450 متر مربع',
    duration_ar: '4 أشهر',
  },
  11: {
    title_ar: 'جناح RSG',
    description_ar: 'تصميم جناح RSG للمعارض والفعاليات.',
    category_ar: 'أجنحة',
    detailedDescription_ar: 'مشروع تصميم جناح متقدم للعروض والفعاليات.',
    challenge_ar: 'كان التحدي هو إنشاء جناح جذاب وفعال.',
    solution_ar: 'استخدمنا تصاميم مبتكرة وتقنيات حديثة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'RSG',
    size_ar: '200 متر مربع',
    duration_ar: 'شهر واحد',
  },
  12: {
    title_ar: 'أوازيس',
    description_ar: 'مشروع تصميم داخلي فاخر.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم داخلي يجمع بين الفخامة والراحة.',
    challenge_ar: 'كان التحدي هو إنشاء مساحة هادئة وفاخرة.',
    solution_ar: 'استخدمنا ألوان هادئة ومواد عالية الجودة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '350 متر مربع',
    duration_ar: '3 أشهر',
  },
  13: {
    title_ar: 'جنة الترفيه',
    description_ar: 'مشروع تصميم مساحة ترفيهية.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم مساحة ترفيهية حديثة.',
    challenge_ar: 'كان التحدي هو دمج الترفيه مع الراحة.',
    solution_ar: 'استخدمنا تصاميم مرحة وعملية.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '600 متر مربع',
    duration_ar: '5 أشهر',
  },
  14: {
    title_ar: 'معرض الفن والأناقة',
    description_ar: 'مشروع تصميم معرض فني.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم معرض يجمع بين الفن والأناقة.',
    challenge_ar: 'كان التحدي هو إنشاء مساحة معرض متميزة.',
    solution_ar: 'استخدمنا إضاءة متقدمة وتخطيطات ذكية.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'معرض فني',
    size_ar: '800 متر مربع',
    duration_ar: '6 أشهر',
  },
  15: {
    title_ar: 'شقة فاخرة حديثة',
    description_ar: 'تصميم شقة فاخرة بأسلوب حديث.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'شقة فاخرة مصممة بأحدث الأساليب الحديثة.',
    challenge_ar: 'كان التحدي هو دمج الفخامة مع الحداثة.',
    solution_ar: 'استخدمنا مواد عصرية وتصاميم مبتكرة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '500 متر مربع',
    duration_ar: '4 أشهر',
  },
  16: {
    title_ar: 'غرفة نوم كلاسيكية',
    description_ar: 'تصميم غرفة نوم بأسلوب كلاسيكي.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم غرفة نوم كلاسيكية فاخرة.',
    challenge_ar: 'كان التحدي هو إنشاء مساحة نوم هادئة وفاخرة.',
    solution_ar: 'استخدمنا ألوان دافئة ومواد فاخرة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '40 متر مربع',
    duration_ar: 'شهر واحد',
  },
  17: {
    title_ar: 'منزل فاخر حديث',
    description_ar: 'تصميم منزل فاخر بأسلوب حديث.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم منزل فاخر متكامل.',
    challenge_ar: 'كان التحدي هو تصميم منزل متكامل.',
    solution_ar: 'استخدمنا تخطيطاً ذكياً ومواد عالية الجودة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '1000 متر مربع',
    duration_ar: '8 أشهر',
  },
  18: {
    title_ar: 'يوم التراث الوطني السعودي',
    description_ar: 'تصميم فعالية يوم التراث الوطني.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع فعالية تراثية وطنية احتفالية.',
    challenge_ar: 'كان التحدي هو الحفاظ على الهوية التراثية.',
    solution_ar: 'ركزنا على العناصر التراثية الأصلية.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'الهيئة العامة للثقافة',
    size_ar: '3000 متر مربع',
    duration_ar: 'شهر واحد',
  },
  19: {
    title_ar: 'يوم التأسيس السعودي 24',
    description_ar: 'تصميم فعالية يوم التأسيس.',
    category_ar: 'تصميم الفعاليات',
    detailedDescription_ar: 'مشروع فعالية وطنية احتفالية.',
    challenge_ar: 'كان التحدي هو إنشاء فعالية تاريخية مميزة.',
    solution_ar: 'استخدمنا عناصر تاريخية وحديثة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'الهيئة العامة للثقافة',
    size_ar: '4000 متر مربع',
    duration_ar: 'شهر واحد',
  },
  20: {
    title_ar: 'هيئة تطوير الدرعية',
    description_ar: 'مشروع تصميم جناح هيئة تطوير الدرعية.',
    category_ar: 'أجنحة',
    detailedDescription_ar: 'مشروع تصميم جناح متقدم للهيئة.',
    challenge_ar: 'كان التحدي هو عكس رؤية الهيئة.',
    solution_ar: 'استخدمنا عناصر تراثية وحديثة.',
    location_ar: 'الدرعية، الرياض',
    client_ar: 'هيئة تطوير الدرعية',
    size_ar: '500 متر مربع',
    duration_ar: '3 أشهر',
  },
  21: {
    title_ar: 'إقامة سيرينيتي لاكس',
    description_ar: 'تصميم إقامة فاخرة هادئة.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم إقامة فاخرة متكاملة.',
    challenge_ar: 'كان التحدي هو إنشاء مساحة هادئة وفاخرة.',
    solution_ar: 'استخدمنا ألوان هادئة ومواد عالية الجودة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '700 متر مربع',
    duration_ar: '6 أشهر',
  },
  22: {
    title_ar: 'معاصر وفاخر',
    description_ar: 'تصميم داخلي معاصر وفاخر.',
    category_ar: 'تصميم داخلي',
    detailedDescription_ar: 'مشروع تصميم يجمع بين الأسلوب المعاصر والفخامة.',
    challenge_ar: 'كان التحدي هو دمج الأسلوبين بتناسق.',
    solution_ar: 'استخدمنا مواد عصرية وتصاميم فاخرة.',
    location_ar: 'الرياض، المملكة العربية السعودية',
    client_ar: 'عميل خاص',
    size_ar: '600 متر مربع',
    duration_ar: '5 أشهر',
  },
};

console.log('Adding Arabic translations to ALL projects...\n');

let successCount = 0;
let errorCount = 0;

Object.entries(arabicTranslations).forEach(([projectId, translations]) => {
  try {
    const stmt = db.prepare(`
      UPDATE projects 
      SET 
        title_ar = ?,
        description_ar = ?,
        category_ar = ?,
        detailedDescription_ar = ?,
        challenge_ar = ?,
        solution_ar = ?,
        location_ar = ?,
        client_ar = ?,
        size_ar = ?,
        duration_ar = ?
      WHERE id = ?
    `);
    
    stmt.run(
      translations.title_ar,
      translations.description_ar,
      translations.category_ar,
      translations.detailedDescription_ar,
      translations.challenge_ar,
      translations.solution_ar,
      translations.location_ar,
      translations.client_ar,
      translations.size_ar,
      translations.duration_ar,
      parseInt(projectId)
    );
    
    console.log(`✓ Project ID ${projectId}: ${translations.title_ar}`);
    successCount++;
  } catch (error) {
    console.error(`✗ Error updating project ${projectId}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✓ Successfully updated ${successCount} projects`);
if (errorCount > 0) console.log(`✗ Failed to update ${errorCount} projects`);
console.log('\nAll projects now have complete Arabic translations!');

db.close();
