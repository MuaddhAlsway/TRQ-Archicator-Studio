import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

const db = new Database(dbPath);

// Arabic content for each slide
const arabicContent = [
  {
    id: 1,
    tag_ar: 'استوديو TRQ',
    title_ar: 'رفع المساحات، تحديد الفخامة',
    description_ar: 'حلول تصميم داخلي فاخرة للعملاء المميزين الذين يطالبون بالتميز.',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    video_3_text_ar: 'النتيجة النهائية',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا'
  },
  {
    id: 2,
    tag_ar: 'تصميم سكني',
    title_ar: 'مساحات معيشة فاخرة',
    description_ar: 'إنشاء ديكورات داخلية سكنية خالدة تعكس نمط حياتك الفريد وذوقك.',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    video_3_text_ar: 'النتيجة النهائية',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا'
  },
  {
    id: 3,
    tag_ar: 'تصميم تجاري',
    title_ar: 'مساحات عمل ملهمة',
    description_ar: 'تحويل البيئات التجارية إلى مساحات منتجة وجميلة من الناحية الجمالية.',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    video_3_text_ar: 'النتيجة النهائية',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا'
  },
  {
    id: 4,
    tag_ar: 'تميز داخلي',
    title_ar: 'ديكورات مصقولة',
    description_ar: 'نسعى لإنشاء تجربة داخلية تكون ذات مغزى وخالدة.',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    video_3_text_ar: 'النتيجة النهائية',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا'
  },
  {
    id: 5,
    tag_ar: 'محفظتنا',
    title_ar: 'المشاريع المميزة',
    description_ar: 'استكشف مجموعتنا من مشاريع التصميم الحائزة على جوائز في جميع أنحاء المملكة العربية السعودية.',
    video_text_ar: 'عرض المشروع',
    video_2_text_ar: 'عملية التصميم',
    video_3_text_ar: 'النتيجة النهائية',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا'
  }
];

try {
  console.log('🌍 Adding Arabic content to hero slides...\n');

  arabicContent.forEach((content, index) => {
    console.log(`📝 Updating Slide ${index + 1}: "${content.title_ar}"`);
    
    const updateStmt = db.prepare(`
      UPDATE hero_slides 
      SET 
        tag_ar = ?,
        title_ar = ?,
        description_ar = ?,
        video_text_ar = ?,
        video_2_text_ar = ?,
        video_3_text_ar = ?,
        buttonPrimaryText_ar = ?,
        buttonSecondaryText_ar = ?
      WHERE id = ?
    `);

    updateStmt.run(
      content.tag_ar,
      content.title_ar,
      content.description_ar,
      content.video_text_ar,
      content.video_2_text_ar,
      content.video_3_text_ar,
      content.buttonPrimaryText_ar,
      content.buttonSecondaryText_ar,
      content.id
    );

    console.log(`   ✅ Added Arabic content`);
    console.log(`      Tag: ${content.tag_ar}`);
    console.log(`      Title: ${content.title_ar}`);
    console.log(`      Description: ${content.description_ar.substring(0, 50)}...`);
    console.log(`      Buttons: ${content.buttonPrimaryText_ar} / ${content.buttonSecondaryText_ar}\n`);
  });

  console.log('✅ All slides updated with Arabic content!\n');
  console.log('📊 Summary:');
  console.log(`   • Slides updated: ${arabicContent.length}`);
  console.log(`   • Fields per slide: 8 (tag, title, description, 3 video texts, 2 buttons)`);
  console.log(`   • Total fields added: ${arabicContent.length * 8}`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
