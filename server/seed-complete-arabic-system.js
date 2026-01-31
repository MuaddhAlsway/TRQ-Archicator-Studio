#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🚀 Complete Arabic Customization System - Seed Script\n');
console.log('═'.repeat(70));

// ============ HERO SLIDES (ARABIC) ============
const arabicHeroSlides = [
  {
    id: 1,
    englishTag: 'Featured',
    arabicTag: 'مميز',
    englishTitle: 'Exceptional Design Solutions',
    arabicTitle: 'حلول تصميم استثنائية',
    englishDescription: 'We create lasting design solutions that transform ideas into reality',
    arabicDescription: 'نحن ننشئ حلول تصميمية خالدة تحول الأفكار إلى واقع ملموس',
    englishButtonPrimaryText: 'Start Now',
    arabicButtonPrimaryText: 'ابدأ الآن',
    englishButtonSecondaryText: 'Learn More',
    arabicButtonSecondaryText: 'تعرف على المزيد'
  },
  {
    id: 2,
    englishTag: 'Innovation',
    arabicTag: 'الابتكار',
    englishTitle: 'Innovative Design Thinking',
    arabicTitle: 'تفكير تصميمي مبتكر',
    englishDescription: 'Combining creativity with technology to deliver exceptional results',
    arabicDescription: 'دمج الإبداع مع التكنولوجيا لتقديم نتائج استثنائية',
    englishButtonPrimaryText: 'Explore',
    arabicButtonPrimaryText: 'استكشف',
    englishButtonSecondaryText: 'Contact Us',
    arabicButtonSecondaryText: 'تواصل معنا'
  },
  {
    id: 3,
    englishTag: 'Experience',
    arabicTag: 'الخبرة',
    englishTitle: 'Over 10 Years of Experience',
    arabicTitle: 'أكثر من 10 سنوات من الخبرة',
    englishDescription: 'Trusted by hundreds of clients worldwide for exceptional design',
    arabicDescription: 'موثوق به من قبل مئات العملاء حول العالم للتصميم الاستثنائي',
    englishButtonPrimaryText: 'View Portfolio',
    arabicButtonPrimaryText: 'عرض المحفظة',
    englishButtonSecondaryText: 'Get Quote',
    arabicButtonSecondaryText: 'احصل على عرض سعر'
  },
  {
    id: 4,
    englishTag: 'Quality',
    arabicTag: 'الجودة',
    englishTitle: 'Premium Quality Design',
    arabicTitle: 'تصميم بجودة عالية',
    englishDescription: 'Every project is crafted with attention to detail and excellence',
    arabicDescription: 'كل مشروع يتم إنشاؤه بعناية فائقة والتزام بالتميز',
    englishButtonPrimaryText: 'See Our Work',
    arabicButtonPrimaryText: 'شاهد أعمالنا',
    englishButtonSecondaryText: 'Schedule Call',
    arabicButtonSecondaryText: 'حدد موعد اتصال'
  },
  {
    id: 5,
    englishTag: 'Partnership',
    arabicTag: 'الشراكة',
    englishTitle: 'Your Design Partner',
    arabicTitle: 'شريكك في التصميم',
    englishDescription: 'We work closely with you to bring your vision to life',
    arabicDescription: 'نعمل بشكل وثيق معك لتحقيق رؤيتك',
    englishButtonPrimaryText: 'Start Project',
    arabicButtonPrimaryText: 'ابدأ مشروع',
    englishButtonSecondaryText: 'Learn Process',
    arabicButtonSecondaryText: 'تعرف على العملية'
  }
];

// ============ PROJECTS (ARABIC) ============
const arabicProjects = [
  {
    id: 1,
    englishTitle: 'Modern Brand Identity',
    arabicTitle: 'هوية بصرية حديثة',
    englishDescription: 'Complete branding solution for a tech startup',
    arabicDescription: 'حل هوية بصرية شامل لشركة ناشئة في مجال التكنولوجيا',
    englishCategory: 'Branding',
    arabicCategory: 'الهوية البصرية'
  },
  {
    id: 2,
    englishTitle: 'E-Commerce Platform',
    arabicTitle: 'منصة التجارة الإلكترونية',
    englishDescription: 'User-friendly e-commerce website design and development',
    arabicDescription: 'تصميم وتطوير موقع تجارة إلكترونية سهل الاستخدام',
    englishCategory: 'Web Design',
    arabicCategory: 'تصميم المواقع'
  },
  {
    id: 3,
    englishTitle: 'Mobile App Design',
    arabicTitle: 'تصميم تطبيق الجوال',
    englishDescription: 'Intuitive mobile application interface design',
    arabicDescription: 'تصميم واجهة تطبيق جوال بديهية وسهلة الاستخدام',
    englishCategory: 'App Design',
    arabicCategory: 'تصميم التطبيقات'
  },
  {
    id: 4,
    englishTitle: 'Corporate Website',
    arabicTitle: 'موقع الشركة',
    englishDescription: 'Professional corporate website with CMS integration',
    arabicDescription: 'موقع شركة احترافي مع تكامل نظام إدارة المحتوى',
    englishCategory: 'Web Design',
    arabicCategory: 'تصميم المواقع'
  },
  {
    id: 5,
    englishTitle: 'Packaging Design',
    arabicTitle: 'تصميم العبوات',
    englishDescription: 'Creative packaging design for consumer products',
    arabicDescription: 'تصميم عبوات إبداعي للمنتجات الاستهلاكية',
    englishCategory: 'Packaging',
    arabicCategory: 'تصميم العبوات'
  }
];

// ============ SERVICES (ARABIC) ============
const arabicServices = [
  {
    id: 1,
    englishTitle: 'Brand Identity Design',
    arabicTitle: 'تصميم الهوية البصرية',
    englishDescription: 'Complete branding solutions including logo, color palette, and brand guidelines',
    arabicDescription: 'حلول هوية بصرية شاملة تشمل الشعار والألوان والإرشادات',
    englishFeatures: 'Logo Design, Color Palette, Brand Guidelines, Typography',
    arabicFeatures: 'تصميم الشعار، لوحة الألوان، إرشادات العلامة التجارية، الخطوط'
  },
  {
    id: 2,
    englishTitle: 'UI/UX Design',
    arabicTitle: 'تصميم الواجهات والتجارب',
    englishDescription: 'User-centered interface and experience design for web and mobile',
    arabicDescription: 'تصميم واجهات وتجارب موجهة للمستخدم للويب والجوال',
    englishFeatures: 'Wireframing, Prototyping, User Research, Usability Testing',
    arabicFeatures: 'الرسوم الأولية، النماذج الأولية، بحث المستخدم، اختبار سهولة الاستخدام'
  },
  {
    id: 3,
    englishTitle: 'Web Development',
    arabicTitle: 'تطوير المواقع',
    englishDescription: 'Modern, responsive websites built with latest technologies',
    arabicDescription: 'مواقع حديثة وسريعة الاستجابة مبنية بأحدث التقنيات',
    englishFeatures: 'Responsive Design, Performance Optimization, SEO, CMS Integration',
    arabicFeatures: 'التصميم المتجاوب، تحسين الأداء، تحسين محركات البحث، تكامل نظام إدارة المحتوى'
  }
];

// ============ BLOG ARTICLES (ARABIC) ============
const arabicBlogArticles = [
  {
    id: 1,
    englishTitle: 'The Future of Web Design',
    arabicTitle: 'مستقبل تصميم الويب',
    englishExcerpt: 'Exploring emerging trends and technologies shaping web design',
    arabicExcerpt: 'استكشاف الاتجاهات والتقنيات الناشئة التي تشكل تصميم الويب',
    englishCategory: 'Design Trends',
    arabicCategory: 'اتجاهات التصميم'
  },
  {
    id: 2,
    englishTitle: 'User Experience Best Practices',
    arabicTitle: 'أفضل ممارسات تجربة المستخدم',
    englishExcerpt: 'Key principles for creating intuitive and engaging user experiences',
    arabicExcerpt: 'المبادئ الأساسية لإنشاء تجارب مستخدم بديهية وجذابة',
    englishCategory: 'UX Design',
    arabicCategory: 'تصميم التجارب'
  },
  {
    id: 3,
    englishTitle: 'Color Psychology in Design',
    arabicTitle: 'علم نفس الألوان في التصميم',
    englishExcerpt: 'How colors influence user perception and behavior',
    arabicExcerpt: 'كيف تؤثر الألوان على إدراك وسلوك المستخدم',
    englishCategory: 'Design Theory',
    arabicCategory: 'نظرية التصميم'
  },
  {
    id: 4,
    englishTitle: 'Mobile-First Design Strategy',
    arabicTitle: 'استراتيجية التصميم الموجه للجوال',
    englishExcerpt: 'Why mobile-first approach is essential in modern design',
    arabicExcerpt: 'لماذا نهج الجوال أولاً ضروري في التصميم الحديث',
    englishCategory: 'Mobile Design',
    arabicCategory: 'تصميم الجوال'
  },
  {
    id: 5,
    englishTitle: 'Accessibility in Design',
    arabicTitle: 'إمكانية الوصول في التصميم',
    englishExcerpt: 'Creating inclusive designs that work for everyone',
    arabicExcerpt: 'إنشاء تصاميم شاملة تعمل للجميع',
    englishCategory: 'Accessibility',
    arabicCategory: 'إمكانية الوصول'
  }
];

// ============ SITE SETTINGS (ARABIC) - 160+ settings ============
const arabicSettings = [
  // ============ HOME PAGE (24 settings) ============
  { key: 'homeIntroTitle_ar', value: 'أناقة تصميمية متكاملة' },
  { key: 'homeIntroText1_ar', value: 'TRQ STUDIO هو أستديو تصميم داخلي يبدع مساحات فاخرة تجسد الأناقة من خلال نهج شامل يوازن بين الجمال, الوظيفة والتجربة الحسية.' },
  { key: 'homeIntroText2_ar', value: 'تقدم تصاميم متكاملة تراعي في السياق والهوية وتنفذ بأعلى المعايير سواء في المشاريع السكنية الراقية أو التجارية والمؤسسية الرفيعة.' },
  { key: 'homeFeaturedTitle_ar', value: 'المشاريع المميزة' },
  { key: 'homeFeaturedDescription_ar', value: 'استكشف مجموعة من أفضل مشاريعنا التي تعكس التزامنا بالتميز والابتكار' },
  { key: 'homeWorkflowStep1Title_ar', value: 'الاستشارة الأولية' },
  { key: 'homeWorkflowStep1Desc_ar', value: 'نستمع إلى احتياجاتك ونفهم رؤيتك بعمق' },
  { key: 'homeWorkflowStep2Title_ar', value: 'التخطيط والتصميم' },
  { key: 'homeWorkflowStep2Desc_ar', value: 'نطور استراتيجية تصميمية شاملة تتوافق مع أهدافك' },
  { key: 'homeWorkflowStep3Title_ar', value: 'التطوير والتنفيذ' },
  { key: 'homeWorkflowStep3Desc_ar', value: 'نحول التصاميم إلى واقع باستخدام أحدث التقنيات' },
  { key: 'homeWorkflowStep4Title_ar', value: 'الاختبار والتحسين' },
  { key: 'homeWorkflowStep4Desc_ar', value: 'نختبر كل جزء بعناية لضمان الجودة العالية' },
  { key: 'homeWorkflowStep5Title_ar', value: 'الإطلاق والدعم' },
  { key: 'homeWorkflowStep5Desc_ar', value: 'نطلق المشروع ونوفر الدعم المستمر' },
  { key: 'homeCtaTitle_ar', value: 'هل أنت مستعد لتحويل رؤيتك؟' },
  { key: 'homeCtaDescription_ar', value: 'دعنا نساعدك في إنشاء حل تصميمي استثنائي يحقق أهدافك' },
  { key: 'homeCtaPrimaryBtn_ar', value: 'ابدأ الآن' },
  { key: 'homeCtaSecondaryBtn_ar', value: 'تعرف على المزيد' },
  { key: 'homeTestimonialTitle_ar', value: 'آراء عملائنا' },
  { key: 'homeTestimonialDescription_ar', value: 'اكتشف ما يقوله عملاؤنا عن خدماتنا' },
  { key: 'homeStatsTitle_ar', value: 'إحصائياتنا' },
  { key: 'homeStatsProjects_ar', value: 'مشروع مكتمل' },
  { key: 'homeStatsClients_ar', value: 'عميل راضي' },

  // ============ ABOUT PAGE (28 settings) ============
  { key: 'aboutHeroTitle_ar', value: 'من نحن' },
  { key: 'aboutHeroParagraph_ar', value: 'شركة متخصصة في تقديم حلول تصميمية مبتكرة وفعالة' },
  { key: 'aboutWhoWeAreTitle_ar', value: 'من نحن' },
  { key: 'aboutWhoWeArePara1_ar', value: 'TRQ STUDIO هو أستديو تصميم داخلي يبدع مساحات فاخرة تجسد الأناقة من خلال نهج شامل يوازن بين الجمال, الوظيفة والتجربة الحسية.' },
  { key: 'aboutWhoWeArePara2_ar', value: 'تقدم تصاميم متكاملة تراعي في السياق والهوية وتنفذ بأعلى المعايير سواء في المشاريع السكنية الراقية أو التجارية والمؤسسية الرفيعة.' },
  { key: 'aboutWhoWeArePara3_ar', value: 'نحن نصنع حلول تصميم خالدة تعكس رؤيتك وتحسّن طريقة عيشك وعملك من خلال الجمع بين الرؤية الفنية والخبرة العملية.' },
  { key: 'aboutVisionTitle_ar', value: 'رؤيتنا' },
  { key: 'aboutVisionText_ar', value: 'أن نكون الشركة الرائدة في تقديم حلول تصميمية مبتكرة تحول الأفكار إلى واقع ملموس' },
  { key: 'aboutMissionTitle_ar', value: 'مهمتنا' },
  { key: 'aboutMissionText_ar', value: 'تقديم خدمات تصميمية عالية الجودة تساعد العملاء على تحقيق أهدافهم وتجاوز توقعاتهم' },
  { key: 'aboutValue1Title_ar', value: 'الابتكار' },
  { key: 'aboutValue1Desc_ar', value: 'نسعى دائماً للبحث عن حلول جديدة ومبتكرة' },
  { key: 'aboutValue2Title_ar', value: 'الجودة' },
  { key: 'aboutValue2Desc_ar', value: 'نلتزم بأعلى معايير الجودة في كل مشروع' },
  { key: 'aboutValue3Title_ar', value: 'التعاون' },
  { key: 'aboutValue3Desc_ar', value: 'نعمل بشكل وثيق مع عملائنا لفهم احتياجاتهم' },
  { key: 'aboutValue4Title_ar', value: 'الاستدامة' },
  { key: 'aboutValue4Desc_ar', value: 'نهتم بالتأثير البيئي والاجتماعي لعملنا' },
  { key: 'aboutWhyChooseTitle_ar', value: 'لماذا تختار TRQ' },
  { key: 'aboutWhyChoose1_ar', value: 'خبرة تزيد عن 10 سنوات في مجال التصميم' },
  { key: 'aboutWhyChoose2_ar', value: 'فريق متخصص من المصممين والمطورين' },
  { key: 'aboutWhyChoose3_ar', value: 'حلول مخصصة تناسب احتياجات عملائنا' },
  { key: 'aboutWhyChoose4_ar', value: 'دعم مستمر وخدمة عملاء ممتازة' },
  { key: 'aboutImpactTitle_ar', value: 'تأثيرنا' },
  { key: 'aboutImpactPara1_ar', value: 'لقد ساعدنا مئات العملاء على تحقيق أهدافهم من خلال حلول تصميمية مبتكرة' },
  { key: 'aboutImpactPara2_ar', value: 'نفخر بالعلاقات طويلة الأمد التي بنيناها مع عملائنا' },
  { key: 'aboutTeamTitle_ar', value: 'فريقنا' },
  { key: 'aboutTeamDescription_ar', value: 'التقابل بين المواهب والخبرات المتنوعة' },

  // ============ SERVICES PAGE (12 settings) ============
  { key: 'servicesHeroTitle_ar', value: 'خدماتنا' },
  { key: 'servicesHeroParagraph_ar', value: 'مجموعة شاملة من الخدمات التصميمية المتخصصة' },
  { key: 'servicesIntroTitle_ar', value: 'ما الذي نقدمه' },
  { key: 'servicesIntroText_ar', value: 'نقدم مجموعة واسعة من الخدمات التصميمية التي تغطي جميع احتياجات عملائنا' },
  { key: 'servicesHighlight1_ar', value: 'تصميم الهوية البصرية' },
  { key: 'servicesHighlight2_ar', value: 'تصميم الواجهات والتجارب' },
  { key: 'servicesHighlight3_ar', value: 'تطوير المواقع والتطبيقات' },
  { key: 'servicesCtaTitle_ar', value: 'هل تحتاج إلى خدمة تصميمية؟' },
  { key: 'servicesCtaDescription_ar', value: 'تواصل معنا اليوم لمناقشة احتياجاتك' },
  { key: 'servicesCtaBtn_ar', value: 'اطلب عرض سعر' },
  { key: 'servicesProcessTitle_ar', value: 'عملية الخدمة' },
  { key: 'servicesProcessDescription_ar', value: 'نتبع عملية منظمة وفعالة لضمان نجاح كل مشروع' },

  // ============ WORKFLOW PAGE (18 settings) ============
  { key: 'workflowHeroTitle_ar', value: 'عملية عملنا' },
  { key: 'workflowHeroParagraph_ar', value: 'نتبع عملية منظمة وفعالة لضمان نجاح كل مشروع' },
  { key: 'workflowIntroTitle_ar', value: 'كيف نعمل' },
  { key: 'workflowIntroText_ar', value: 'نتبع منهجية محددة وفعالة في كل مشروع لضمان تحقيق أفضل النتائج' },
  { key: 'workflowStep1Title_ar', value: 'الاستشارة والاكتشاف' },
  { key: 'workflowStep1Feature1_ar', value: 'فهم احتياجاتك وأهدافك' },
  { key: 'workflowStep1Feature2_ar', value: 'تحليل السوق والمنافسين' },
  { key: 'workflowStep2Title_ar', value: 'التخطيط والاستراتيجية' },
  { key: 'workflowStep2Feature1_ar', value: 'وضع خطة تصميمية شاملة' },
  { key: 'workflowStep2Feature2_ar', value: 'تحديد الأهداف والمؤشرات' },
  { key: 'workflowStep3Title_ar', value: 'التصميم والإبداع' },
  { key: 'workflowStep3Feature1_ar', value: 'إنشاء تصاميم مبتكرة' },
  { key: 'workflowStep3Feature2_ar', value: 'الحصول على ملاحظاتك وتحسينها' },
  { key: 'workflowStep4Title_ar', value: 'التطوير والتنفيذ' },
  { key: 'workflowStep4Feature1_ar', value: 'تطوير الحل بأحدث التقنيات' },
  { key: 'workflowStep4Feature2_ar', value: 'اختبار شامل وضمان الجودة' },
  { key: 'workflowStep5Title_ar', value: 'الإطلاق والدعم' },
  { key: 'workflowStep5Feature1_ar', value: 'إطلاق المشروع بنجاح' },
  { key: 'workflowStep5Feature2_ar', value: 'توفير الدعم المستمر' },

  // ============ PORTFOLIO PAGE (8 settings) ============
  { key: 'portfolioHeroTitle_ar', value: 'أعمالنا' },
  { key: 'portfolioHeroParagraph_ar', value: 'استكشف مجموعة من أفضل مشاريعنا' },
  { key: 'portfolioFilterAll_ar', value: 'الكل' },
  { key: 'portfolioFilterBranding_ar', value: 'الهوية البصرية' },
  { key: 'portfolioFilterWeb_ar', value: 'تصميم المواقع' },
  { key: 'portfolioFilterApp_ar', value: 'تطبيقات الجوال' },
  { key: 'portfolioFilterPackaging_ar', value: 'تصميم العبوات' },
  { key: 'portfolioViewProject_ar', value: 'عرض المشروع' },

  // ============ CONTACT PAGE (12 settings) ============
  { key: 'contactHeroTitle_ar', value: 'تواصل معنا' },
  { key: 'contactHeroParagraph_ar', value: 'نحن هنا للإجابة على أسئلتك والاستماع إلى أفكارك' },
  { key: 'contactFormName_ar', value: 'الاسم' },
  { key: 'contactFormEmail_ar', value: 'البريد الإلكتروني' },
  { key: 'contactFormPhone_ar', value: 'رقم الهاتف' },
  { key: 'contactFormSubject_ar', value: 'الموضوع' },
  { key: 'contactFormMessage_ar', value: 'الرسالة' },
  { key: 'contactInfoPhone_ar', value: 'الهاتف' },
  { key: 'contactInfoEmail_ar', value: 'البريد الإلكتروني' },
  { key: 'contactInfoAddress_ar', value: 'العنوان' },
  { key: 'contactMapSection_ar', value: 'موقعنا' },
  { key: 'contactFormSubmit_ar', value: 'إرسال الرسالة' },

  // ============ PRICING PAGE (24 settings) ============
  { key: 'pricingHeroTitle_ar', value: 'الأسعار والعروض' },
  { key: 'pricingHeroParagraph_ar', value: 'احصل على عرض سعر مخصص لمشروعك' },
  { key: 'pricingFormIntro_ar', value: 'اطلب عرض سعر مخصص' },
  { key: 'pricingFormDescription_ar', value: 'أخبرنا عن مشروعك وسنقدم لك عرض سعر مفصل' },
  { key: 'pricingFormName_ar', value: 'الاسم الكامل' },
  { key: 'pricingFormEmail_ar', value: 'البريد الإلكتروني' },
  { key: 'pricingFormPhone_ar', value: 'رقم الهاتف' },
  { key: 'pricingFormCompany_ar', value: 'اسم الشركة' },
  { key: 'pricingFormProjectType_ar', value: 'نوع المشروع' },
  { key: 'pricingFormProjectScope_ar', value: 'نطاق المشروع' },
  { key: 'pricingFormBudget_ar', value: 'الميزانية المتوقعة' },
  { key: 'pricingFormTimeline_ar', value: 'الجدول الزمني' },
  { key: 'pricingFormDetails_ar', value: 'تفاصيل إضافية' },
  { key: 'pricingSubmitBtn_ar', value: 'إرسال الطلب' },
  { key: 'pricingSubmitting_ar', value: 'جاري الإرسال...' },
  { key: 'pricingSuccess_ar', value: 'تم استقبال طلبك بنجاح' },
  { key: 'pricingError_ar', value: 'حدث خطأ أثناء إرسال الطلب' },
  { key: 'pricingResponseTime_ar', value: 'سنرد عليك خلال 24 ساعة' },
  { key: 'pricingWhatToExpect_ar', value: 'ماذا تتوقع' },
  { key: 'pricingStep1_ar', value: 'استقبال طلبك والتحقق منه' },
  { key: 'pricingStep2_ar', value: 'تحليل احتياجاتك وإعداد عرض مفصل' },
  { key: 'pricingStep3_ar', value: 'تقديم العرض والتشاور معك' },
  { key: 'pricingContactInfo_ar', value: 'معلومات التواصل' },
  { key: 'pricingDirectContact_ar', value: 'أو تواصل معنا مباشرة' },

  // ============ BLOG PAGE (19 settings) ============
  { key: 'blogHeroTitle_ar', value: 'مدونتنا' },
  { key: 'blogHeroParagraph_ar', value: 'اكتشف أحدث المقالات والنصائح في مجال التصميم' },
  { key: 'blogFeaturedLabel_ar', value: 'مقالة مميزة' },
  { key: 'blogCategoryDesignTrends_ar', value: 'اتجاهات التصميم' },
  { key: 'blogCategoryUXDesign_ar', value: 'تصميم التجارب' },
  { key: 'blogCategoryDesignTheory_ar', value: 'نظرية التصميم' },
  { key: 'blogCategoryMobileDesign_ar', value: 'تصميم الجوال' },
  { key: 'blogCategoryAccessibility_ar', value: 'إمكانية الوصول' },
  { key: 'blogNewsletterTitle_ar', value: 'اشترك في نشرتنا البريدية' },
  { key: 'blogNewsletterDescription_ar', value: 'احصل على أحدث المقالات والنصائح مباشرة في بريدك' },
  { key: 'blogNewsletterEmail_ar', value: 'بريدك الإلكتروني' },
  { key: 'blogNewsletterSubscribe_ar', value: 'اشترك الآن' },
  { key: 'blogExploreMore_ar', value: 'استكشف المزيد' },
  { key: 'blogReadMore_ar', value: 'اقرأ المزيد' },
  { key: 'blogAuthor_ar', value: 'الكاتب' },
  { key: 'blogDate_ar', value: 'التاريخ' },
  { key: 'blogCategory_ar', value: 'الفئة' },
  { key: 'blogRelatedArticles_ar', value: 'مقالات ذات صلة' },
  { key: 'blogShareArticle_ar', value: 'شارك هذه المقالة' },

  // ============ PROJECT DETAIL PAGE (18 settings) ============
  { key: 'projectDetailBackBtn_ar', value: 'العودة إلى الأعمال' },
  { key: 'projectDetailYear_ar', value: 'السنة' },
  { key: 'projectDetailLocation_ar', value: 'الموقع' },
  { key: 'projectDetailSize_ar', value: 'حجم المشروع' },
  { key: 'projectDetailClient_ar', value: 'العميل' },
  { key: 'projectDetailCategory_ar', value: 'الفئة' },
  { key: 'projectDetailOverview_ar', value: 'نظرة عامة' },
  { key: 'projectDetailChallenge_ar', value: 'التحدي' },
  { key: 'projectDetailSolution_ar', value: 'الحل' },
  { key: 'projectDetailFeatures_ar', value: 'المميزات' },
  { key: 'projectDetailResults_ar', value: 'النتائج' },
  { key: 'projectDetailGallery_ar', value: 'معرض الصور' },
  { key: 'projectDetailMaterials_ar', value: 'المواد والتقنيات' },
  { key: 'projectDetailTeam_ar', value: 'الفريق' },
  { key: 'projectDetailTimeline_ar', value: 'الجدول الزمني' },
  { key: 'projectDetailCTA_ar', value: 'هل تريد مشروع مشابه؟' },
  { key: 'projectDetailCTABtn_ar', value: 'ابدأ مشروعك الآن' },
  { key: 'projectDetailNextProject_ar', value: 'المشروع التالي' },

  // ============ COMMON UI ELEMENTS (6 settings) ============
  { key: 'commonRequestPricing_ar', value: 'اطلب عرض سعر' },
  { key: 'commonContactUs_ar', value: 'تواصل معنا' },
  { key: 'commonSubmitRequest_ar', value: 'إرسال الطلب' },
  { key: 'commonSubmitting_ar', value: 'جاري الإرسال...' },
  { key: 'commonLoading_ar', value: 'جاري التحميل...' },
  { key: 'commonChatWhatsapp_ar', value: 'دردش معنا على واتس آب' },
];

// ============ INSERT DATA INTO DATABASE ============

console.log('\n📝 Inserting Arabic Content...\n');

try {
  // Create or update hero slides
  console.log('   • Inserting Hero Slides (5 slides)...');
  for (const slide of arabicHeroSlides) {
    db.prepare(`
      INSERT OR REPLACE INTO hero_slides_arabic 
      (id, englishTag, arabicTag, englishTitle, arabicTitle, englishDescription, arabicDescription, englishButtonPrimaryText, arabicButtonPrimaryText, englishButtonSecondaryText, arabicButtonSecondaryText)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      slide.id, slide.englishTag, slide.arabicTag, slide.englishTitle, slide.arabicTitle,
      slide.englishDescription, slide.arabicDescription, slide.englishButtonPrimaryText,
      slide.arabicButtonPrimaryText, slide.englishButtonSecondaryText, slide.arabicButtonSecondaryText
    );
  }
  console.log('      ✅ 5 Hero Slides inserted');

  // Create or update projects
  console.log('   • Inserting Projects (5 projects)...');
  for (const project of arabicProjects) {
    db.prepare(`
      INSERT OR REPLACE INTO projects_arabic 
      (id, englishTitle, arabicTitle, englishDescription, arabicDescription, englishCategory, arabicCategory)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      project.id, project.englishTitle, project.arabicTitle, project.englishDescription,
      project.arabicDescription, project.englishCategory, project.arabicCategory
    );
  }
  console.log('      ✅ 5 Projects inserted');

  // Create or update services
  console.log('   • Inserting Services (3 services)...');
  for (const service of arabicServices) {
    db.prepare(`
      INSERT OR REPLACE INTO services_arabic 
      (id, englishTitle, arabicTitle, englishDescription, arabicDescription, englishFeatures, arabicFeatures)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      service.id, service.englishTitle, service.arabicTitle, service.englishDescription,
      service.arabicDescription, service.englishFeatures, service.arabicFeatures
    );
  }
  console.log('      ✅ 3 Services inserted');

  // Create or update blog articles
  console.log('   • Inserting Blog Articles (5 articles)...');
  for (const article of arabicBlogArticles) {
    db.prepare(`
      INSERT OR REPLACE INTO blog_articles_arabic 
      (id, englishTitle, arabicTitle, englishExcerpt, arabicExcerpt, englishCategory, arabicCategory)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      article.id, article.englishTitle, article.arabicTitle, article.englishExcerpt,
      article.arabicExcerpt, article.englishCategory, article.arabicCategory
    );
  }
  console.log('      ✅ 5 Blog Articles inserted');

  // Create or update settings
  console.log('   • Inserting Settings (160+ settings)...');
  for (const setting of arabicSettings) {
    db.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `).run(setting.key, setting.value);
  }
  console.log(`      ✅ ${arabicSettings.length} Settings inserted`);

  console.log('\n═'.repeat(70));
  console.log('\n✅ All Arabic Content Inserted Successfully!\n');

  // Verification
  console.log('📊 Verification:\n');
  const heroCount = db.prepare("SELECT COUNT(*) as count FROM hero_slides_arabic").get();
  const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects_arabic").get();
  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services_arabic").get();
  const articleCount = db.prepare("SELECT COUNT(*) as count FROM blog_articles_arabic").get();
  const settingCount = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();

  console.log(`   • Hero Slides: ${heroCount.count}`);
  console.log(`   • Projects: ${projectCount.count}`);
  console.log(`   • Services: ${serviceCount.count}`);
  console.log(`   • Blog Articles: ${articleCount.count}`);
  console.log(`   • Settings: ${settingCount.count}`);

  const totalContent = heroCount.count + projectCount.count + serviceCount.count + articleCount.count + settingCount.count;
  console.log(`\n   📈 Total Arabic Content Items: ${totalContent}`);

  console.log('\n═'.repeat(70));
  console.log('\n🎉 Arabic Customization System Complete!\n');

} catch (error) {
  console.error('\n❌ Error inserting data:', error.message);
  process.exit(1);
} finally {
  db.close();
}
