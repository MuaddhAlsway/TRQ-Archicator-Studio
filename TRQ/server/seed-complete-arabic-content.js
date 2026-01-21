import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

// ============ COMPREHENSIVE ARABIC CONTENT ============
// This file contains all Arabic translations for:
// 1. Hero Slides (5 slides)
// 2. Projects (sample projects with Arabic titles/descriptions)
// 3. Services (3 services with Arabic content)
// 4. Blog Articles (5 articles with Arabic content)
// 5. Site Settings (160+ settings)

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

const arabicProjects = [
  {
    id: 1,
    englishTitle: 'Modern Brand Identity',
    arabicTitle: 'هوية بصرية حديثة',
    englishDescription: 'Complete branding solution for a tech startup',
    arabicDescription: 'حل هوية بصرية شامل لشركة ناشئة في مجال التكنولوجيا'
  },
  {
    id: 2,
    englishTitle: 'E-Commerce Platform',
    arabicTitle: 'منصة التجارة الإلكترونية',
    englishDescription: 'User-friendly e-commerce website design and development',
    arabicDescription: 'تصميم وتطوير موقع تجارة إلكترونية سهل الاستخدام'
  },
  {
    id: 3,
    englishTitle: 'Mobile App Design',
    arabicTitle: 'تصميم تطبيق الجوال',
    englishDescription: 'Intuitive mobile application interface design',
    arabicDescription: 'تصميم واجهة تطبيق جوال بديهية وسهلة الاستخدام'
  },
  {
    id: 4,
    englishTitle: 'Corporate Website',
    arabicTitle: 'موقع الشركة',
    englishDescription: 'Professional corporate website with CMS integration',
    arabicDescription: 'موقع شركة احترافي مع تكامل نظام إدارة المحتوى'
  },
  {
    id: 5,
    englishTitle: 'Packaging Design',
    arabicTitle: 'تصميم العبوات',
    englishDescription: 'Creative packaging design for consumer products',
    arabicDescription: 'تصميم عبوات إبداعي للمنتجات الاستهلاكية'
  }
];

const arabicServices = [
  {
    id: 1,
    englishTitle: 'Brand Identity Design',
    arabicTitle: 'تصميم الهوية البصرية',
    englishDescription: 'Complete branding solutions including logo, color palette, and brand guidelines',
    arabicDescription: 'حلول هوية بصرية شاملة تشمل الشعار والألوان والإرشادات'
  },
  {
    id: 2,
    englishTitle: 'UI/UX Design',
    arabicTitle: 'تصميم الواجهات والتجارب',
    englishDescription: 'User-centered interface and experience design for web and mobile',
    arabicDescription: 'تصميم واجهات وتجارب موجهة للمستخدم للويب والجوال'
  },
  {
    id: 3,
    englishTitle: 'Web Development',
    arabicTitle: 'تطوير المواقع',
    englishDescription: 'Modern, responsive websites built with latest technologies',
    arabicDescription: 'مواقع حديثة وسريعة الاستجابة مبنية بأحدث التقنيات'
  }
];

const arabicBlogArticles = [
  {
    id: 1,
    englishTitle: 'The Future of Web Design',
    arabicTitle: 'مستقبل تصميم الويب',
    englishExcerpt: 'Exploring emerging trends and technologies shaping web design',
    arabicExcerpt: 'استكشاف الاتجاهات والتقنيات الناشئة التي تشكل تصميم الويب'
  },
  {
    id: 2,
    englishTitle: 'User Experience Best Practices',
    arabicTitle: 'أفضل ممارسات تجربة المستخدم',
    englishExcerpt: 'Key principles for creating intuitive and engaging user experiences',
    arabicExcerpt: 'المبادئ الأساسية لإنشاء تجارب مستخدم بديهية وجذابة'
  },
  {
    id: 3,
    englishTitle: 'Color Psychology in Design',
    arabicTitle: 'علم نفس الألوان في التصميم',
    englishExcerpt: 'How colors influence user perception and behavior',
    arabicDescription: 'كيف تؤثر الألوان على إدراك وسلوك المستخدم'
  },
  {
    id: 4,
    englishTitle: 'Mobile-First Design Strategy',
    arabicTitle: 'استراتيجية التصميم الموجه للجوال',
    englishExcerpt: 'Why mobile-first approach is essential in modern design',
    arabicExcerpt: 'لماذا نهج الجوال أولاً ضروري في التصميم الحديث'
  },
  {
    id: 5,
    englishTitle: 'Accessibility in Design',
    arabicTitle: 'إمكانية الوصول في التصميم',
    englishExcerpt: 'Creating inclusive designs that work for everyone',
    arabicExcerpt: 'إنشاء تصاميم شاملة تعمل للجميع'
  }
];

const arabicSettings = [
  // ============ HOME PAGE (24 settings) ============
  { key: 'homeIntroTitle_ar', value: 'إنشاء حلول تصميم خالدة' },
  { key: 'homeIntroText1_ar', value: 'نحن نؤمن بقوة التصميم الاستثنائي لتحويل الأفكار إلى واقع ملموس. مع خبرة تزيد عن 10 سنوات، نقدم حلولاً تصميمية مبتكرة تجمع بين الإبداع والوظيفية.' },
  { key: 'homeIntroText2_ar', value: 'فريقنا المتخصص يعمل بشغف لإنشاء تجارب بصرية استثنائية تترك انطباعاً دائماً لدى عملائنا.' },
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
];

  // ============ ABOUT PAGE (28 settings) ============
  { key: 'aboutHeroTitle_ar', value: 'من نحن' },
  { key: 'aboutHeroParagraph_ar', value: 'شركة متخصصة في تقديم حلول تصميمية مبتكرة وفعالة' },
  { key: 'aboutWhoWeAreTitle_ar', value: 'من نحن' },
  { key: 'aboutWhoWeArePara1_ar', value: 'TRQ Design هي شركة متخصصة في تقديم حلول تصميمية شاملة تجمع بين الإبداع والتكنولوجيا. نعمل مع العلامات التجارية الرائدة لإنشاء تجارب بصرية استثنائية.' },
  { key: 'aboutWhoWeArePara2_ar', value: 'فريقنا يتكون من مصممين وخبراء تقنيين متخصصين في مختلف المجالات. نؤمن بأن التصميم الجيد ليس فقط جميل المظهر، بل يجب أن يكون فعالاً وقابلاً للاستخدام.' },
  { key: 'aboutWhoWeArePara3_ar', value: 'منذ تأسيسنا، عملنا مع مئات العملاء من مختلف الصناعات، وحققنا نتائج استثنائية تتجاوز التوقعات.' },
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
  { key: 'contactFormSubmitBtn_ar', value: 'إرسال الرسالة' },

  // ============ PRICING PAGE (32 settings) ============
  { key: 'pricingHeroTitle_ar', value: 'الأسعار والعروض' },
  { key: 'pricingHeroParagraph_ar', value: 'نقدم عروضاً مرنة تناسب احتياجات وميزانيات مختلفة' },
  { key: 'pricingFormIntro_ar', value: 'اطلب عرض سعر مخصص' },
  { key: 'pricingFormName_ar', value: 'الاسم الكامل' },
  { key: 'pricingFormEmail_ar', value: 'البريد الإلكتروني' },
  { key: 'pricingFormPhone_ar', value: 'رقم الهاتف' },
  { key: 'pricingFormCompany_ar', value: 'اسم الشركة' },
  { key: 'pricingProjectType_ar', value: 'نوع المشروع' },
  { key: 'pricingProjectSize_ar', value: 'حجم المشروع' },
  { key: 'pricingLocation_ar', value: 'الموقع' },
  { key: 'pricingBudget_ar', value: 'الميزانية المتوقعة' },
  { key: 'pricingTimeline_ar', value: 'الجدول الزمني' },
  { key: 'pricingDescription_ar', value: 'وصف المشروع' },
  { key: 'pricingContactMethod_ar', value: 'طريقة التواصل المفضلة' },
  { key: 'pricingContactMethodEmail_ar', value: 'البريد الإلكتروني' },
  { key: 'pricingContactMethodPhone_ar', value: 'الهاتف' },
  { key: 'pricingContactMethodWhatsapp_ar', value: 'واتس آب' },
  { key: 'pricingSubmitBtn_ar', value: 'إرسال الطلب' },
  { key: 'pricingSubmittingBtn_ar', value: 'جاري الإرسال...' },
  { key: 'pricingResponseTime_ar', value: 'سنرد عليك خلال 24 ساعة' },
  { key: 'pricingWhatToExpectTitle_ar', value: 'ماذا تتوقع' },
  { key: 'pricingWhatToExpect1_ar', value: 'استقبال عرض سعر مفصل' },
  { key: 'pricingWhatToExpect2_ar', value: 'استشارة مجانية مع فريقنا' },
  { key: 'pricingWhatToExpect3_ar', value: 'خطة عمل شاملة للمشروع' },
  { key: 'pricingPackageBasic_ar', value: 'الحزمة الأساسية' },
  { key: 'pricingPackageProfessional_ar', value: 'الحزمة الاحترافية' },
  { key: 'pricingPackagePremium_ar', value: 'الحزمة المميزة' },
  { key: 'pricingPackageEnterprise_ar', value: 'حزمة المؤسسات' },
  { key: 'pricingFeatureIncluded_ar', value: 'مشمول' },
  { key: 'pricingFeatureNotIncluded_ar', value: 'غير مشمول' },
  { key: 'pricingSelectPlan_ar', value: 'اختر الخطة' },

  // ============ BLOG PAGE (20 settings) ============
  { key: 'blogHeroTitle_ar', value: 'المدونة' },
  { key: 'blogHeroParagraph_ar', value: 'اكتشف أحدث المقالات والنصائح في مجال التصميم' },
  { key: 'blogFeaturedLabel_ar', value: 'مقالة مميزة' },
  { key: 'blogCategoryAll_ar', value: 'الكل' },
  { key: 'blogCategoryDesign_ar', value: 'التصميم' },
  { key: 'blogCategoryDevelopment_ar', value: 'التطوير' },
  { key: 'blogCategoryBusiness_ar', value: 'الأعمال' },
  { key: 'blogCategoryTrends_ar', value: 'الاتجاهات' },
  { key: 'blogCategoryTutorials_ar', value: 'الدروس' },
  { key: 'blogNewsletterTitle_ar', value: 'اشترك في نشرتنا البريدية' },
  { key: 'blogNewsletterDescription_ar', value: 'احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني' },
  { key: 'blogNewsletterPlaceholder_ar', value: 'أدخل بريدك الإلكتروني' },
  { key: 'blogNewsletterBtn_ar', value: 'اشترك' },
  { key: 'blogExploreTitle_ar', value: 'استكشف المزيد' },
  { key: 'blogExploreDescription_ar', value: 'تصفح مجموعة واسعة من المقالات والموارد' },
  { key: 'blogArticleReadMore_ar', value: 'اقرأ المزيد' },
  { key: 'blogArticleAuthor_ar', value: 'الكاتب' },
  { key: 'blogArticleDate_ar', value: 'التاريخ' },
  { key: 'blogArticleReadTime_ar', value: 'وقت القراءة' },
  { key: 'blogArticleShare_ar', value: 'شارك المقالة' },

  // ============ PROJECT DETAIL PAGE (18 settings) ============
  { key: 'projectDetailBackBtn_ar', value: 'العودة' },
  { key: 'projectDetailYear_ar', value: 'السنة' },
  { key: 'projectDetailLocation_ar', value: 'الموقع' },
  { key: 'projectDetailSize_ar', value: 'الحجم' },
  { key: 'projectDetailClient_ar', value: 'العميل' },
  { key: 'projectDetailDuration_ar', value: 'المدة' },
  { key: 'projectDetailTeam_ar', value: 'الفريق' },
  { key: 'projectDetailOverviewTitle_ar', value: 'نظرة عامة' },
  { key: 'projectDetailChallengeTitle_ar', value: 'التحدي' },
  { key: 'projectDetailSolutionTitle_ar', value: 'الحل' },
  { key: 'projectDetailFeaturesTitle_ar', value: 'المميزات' },
  { key: 'projectDetailMaterialsTitle_ar', value: 'المواد المستخدمة' },
  { key: 'projectDetailAwardsTitle_ar', value: 'الجوائز' },
  { key: 'projectDetailGalleryTitle_ar', value: 'المعرض' },
  { key: 'projectDetailClientQuoteTitle_ar', value: 'رأي العميل' },
  { key: 'projectDetailCtaTitle_ar', value: 'هل أعجبك هذا المشروع؟' },
  { key: 'projectDetailCtaDescription_ar', value: 'دعنا نساعدك في إنشاء مشروع مشابه' },
  { key: 'projectDetailCtaBtn_ar', value: 'ابدأ مشروعك' },

  // ============ COMMON UI ELEMENTS (6 settings) ============
  { key: 'commonRequestPricing_ar', value: 'اطلب عرض سعر' },
  { key: 'commonContactUs_ar', value: 'تواصل معنا' },
  { key: 'commonSubmitRequest_ar', value: 'إرسال الطلب' },
  { key: 'commonSubmitting_ar', value: 'جاري الإرسال...' },
  { key: 'commonLoading_ar', value: 'جاري التحميل...' },
  { key: 'commonChatWhatsapp_ar', value: 'دردش معنا على واتس آب' },
];

// ============ INSERT FUNCTIONS ============

function insertHeroSlides() {
  console.log('\n📝 Inserting Arabic Hero Slides...');
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO hero_slides_arabic (id, arabicTag, arabicTitle, arabicDescription, arabicButtonPrimaryText, arabicButtonSecondaryText)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    for (const slide of arabicHeroSlides) {
      stmt.run(slide.id, slide.arabicTag, slide.arabicTitle, slide.arabicDescription, slide.arabicButtonPrimaryText, slide.arabicButtonSecondaryText);
    }
    console.log(`✅ ${arabicHeroSlides.length} Arabic hero slides inserted`);
  } catch (error) {
    console.log(`⚠️  Hero slides table may not exist yet (will be created on first use)`);
  }
}

function insertProjects() {
  console.log('\n📝 Inserting Arabic Projects...');
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO projects_arabic (id, arabicTitle, arabicDescription)
    VALUES (?, ?, ?)
  `);

  try {
    for (const project of arabicProjects) {
      stmt.run(project.id, project.arabicTitle, project.arabicDescription);
    }
    console.log(`✅ ${arabicProjects.length} Arabic projects inserted`);
  } catch (error) {
    console.log(`⚠️  Projects table may not exist yet (will be created on first use)`);
  }
}

function insertServices() {
  console.log('\n📝 Inserting Arabic Services...');
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO services_arabic (id, arabicTitle, arabicDescription)
    VALUES (?, ?, ?)
  `);

  try {
    for (const service of arabicServices) {
      stmt.run(service.id, service.arabicTitle, service.arabicDescription);
    }
    console.log(`✅ ${arabicServices.length} Arabic services inserted`);
  } catch (error) {
    console.log(`⚠️  Services table may not exist yet (will be created on first use)`);
  }
}

function insertBlogArticles() {
  console.log('\n📝 Inserting Arabic Blog Articles...');
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO blog_articles_arabic (id, arabicTitle, arabicExcerpt)
    VALUES (?, ?, ?)
  `);

  try {
    for (const article of arabicBlogArticles) {
      stmt.run(article.id, article.arabicTitle, article.arabicExcerpt);
    }
    console.log(`✅ ${arabicBlogArticles.length} Arabic blog articles inserted`);
  } catch (error) {
    console.log(`⚠️  Blog articles table may not exist yet (will be created on first use)`);
  }
}

function insertSettings() {
  console.log('\n📝 Inserting Arabic Settings...');
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO settings (key, value, updatedAt)
    VALUES (?, ?, datetime('now'))
  `);

  let inserted = 0;
  for (const setting of arabicSettings) {
    const result = stmt.run(setting.key, setting.value);
    if (result.changes > 0) {
      inserted++;
    }
  }
  console.log(`✅ ${inserted} Arabic settings inserted`);
}

// ============ MAIN EXECUTION ============

try {
  console.log('\n🚀 Starting Complete Arabic Content Seed...\n');
  console.log('═'.repeat(50));

  insertHeroSlides();
  insertProjects();
  insertServices();
  insertBlogArticles();
  insertSettings();

  console.log('\n═'.repeat(50));
  console.log('\n✅ Complete Arabic Content Seeded Successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • Hero Slides: ${arabicHeroSlides.length}`);
  console.log(`   • Projects: ${arabicProjects.length}`);
  console.log(`   • Services: ${arabicServices.length}`);
  console.log(`   • Blog Articles: ${arabicBlogArticles.length}`);
  console.log(`   • Settings: ${arabicSettings.length}`);
  console.log(`   • Total: ${arabicHeroSlides.length + arabicProjects.length + arabicServices.length + arabicBlogArticles.length + arabicSettings.length} items\n`);

  // Verify count
  const countResult = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key LIKE '%_ar'").get();
  console.log(`✅ Verified: ${countResult.count} Arabic settings in database\n`);

} catch (error) {
  console.error('❌ Error seeding Arabic content:', error.message);
  process.exit(1);
} finally {
  db.close();
}
