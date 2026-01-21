import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'trq.db'));

const arabicSettings = {
  // Home Page - Introduction
  homeIntroTitle_ar: 'إنشاء حلول تصميم خالدة',
  homeIntroText1_ar: 'TRQ هي استوديو تصميم داخلي فاخر وإبداعي مقره الرياض، المملكة العربية السعودية. نتخصص في تقديم حلول عالية الجودة والإبداعية والمكررة للعملاء السكنيين والتجاريين.',
  homeIntroText2_ar: 'يجمع نهجنا بين الرؤية الفنية والخبرة العملية لإنشاء مساحات لا تبدو استثنائية فحسب، بل تعزز أيضا الطريقة التي تعيش وتعمل بها.',
  homeIntroImage_ar: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  homeIntroLinkText_ar: 'تعرف على المزيد عن TRQ',
  homeIntroLinkPage_ar: 'about',
  
  // Home Page - Featured Projects
  homeFeaturedTitle_ar: 'المشاريع المميزة',
  homeFeaturedDescription_ar: 'لمحة عن أعمالنا الأخيرة وتميز التصميم',
  
  // Home Page - How We Work
  homeWorkflowTitle_ar: 'كيف نعمل',
  homeWorkflowDescription_ar: 'عملية سلسة مصممة لتحقيق رؤيتك',
  homeWorkflowStep1Title_ar: 'الاكتشاف',
  homeWorkflowStep1Desc_ar: 'فهم رؤيتك',
  homeWorkflowStep2Title_ar: 'المفهوم',
  homeWorkflowStep2Desc_ar: 'تطوير التصميم',
  homeWorkflowStep3Title_ar: 'الموافقة',
  homeWorkflowStep3Desc_ar: 'التحسين والتخطيط',
  homeWorkflowStep4Title_ar: 'التنفيذ',
  homeWorkflowStep4Desc_ar: 'تحقيق الواقع',
  homeWorkflowStep5Title_ar: 'التسليم',
  homeWorkflowStep5Desc_ar: 'التسليم النهائي',
  homeWorkflowLinkText_ar: 'تعرف على المزيد',
  homeWorkflowLinkPage_ar: 'workflow',
  
  // Home Page - CTA
  homeCtaTitle_ar: 'هل أنت مستعد لتحويل مساحتك؟',
  homeCtaDescription_ar: 'دعنا نناقش مشروعك وننشئ شيئا استثنائيا معا. تواصل مع فريقنا اليوم.',
  homeCtaButton1Text_ar: 'طلب التسعير',
  homeCtaButton1Page_ar: 'pricing',
  homeCtaButton2Text_ar: 'اتصل بنا',
  homeCtaButton2Page_ar: 'contact',
};

const stmt = db.prepare(`
  INSERT OR REPLACE INTO settings (key, value)
  VALUES (?, ?)
`);

Object.entries(arabicSettings).forEach(([key, value]) => {
  stmt.run(key, value);
});

console.log('✅ Arabic site settings seeded successfully');
db.close();
