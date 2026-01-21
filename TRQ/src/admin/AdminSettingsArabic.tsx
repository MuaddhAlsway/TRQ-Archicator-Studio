import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, X, GripVertical } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as api from '../api';
import { useAdmin } from './AdminContext';

const availableIcons = [
  'Eye', 'Target', 'Heart', 'Award', 'Users', 'Lightbulb', 'Star', 'Crown',
  'Diamond', 'Gem', 'Compass', 'Flag', 'Globe', 'Rocket', 'Zap', 'Shield',
  'CheckCircle', 'TrendingUp', 'Layers', 'Layout', 'Home', 'Building2',
  'Search', 'Hammer', 'Briefcase', 'Calendar', 'Settings', 'Tool',
  'MapPin', 'Phone', 'Mail', 'MessageCircle', 'Clock', 'Send'
];

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Star;
};

type TabType = 'home-intro' | 'home-featured' | 'home-workflow' | 'home-cta' | 'about' | 'services' | 'workflow' | 'portfolio' | 'contact' | 'pricing' | 'blog';

export function AdminSettingsArabic() {
  const { projects } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('home-intro');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  const [settings, setSettings] = useState<Record<string, any>>({
    // Home page - Introduction section
    homeIntroTitle_ar: 'إنشاء حلول تصميمية خالدة',
    homeIntroText1_ar: 'TRQ هي استوديو تصميم داخلي فاخر وإبداعي يقع في الرياض، المملكة العربية السعودية. نتخصص في تقديم حلول عالية الجودة وإبداعية ومحررة للعملاء السكنيين والتجاريين.',
    homeIntroText2_ar: 'يجمع نهجنا بين الرؤية الفنية والخبرة العملية لإنشاء مساحات لا تبدو استثنائية فحسب، بل تعزز أيضاً طريقة حياتك وعملك.',
    homeIntroImage_ar: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    homeIntroLinkText_ar: 'تعرف على المزيد عن TRQ',
    homeIntroLinkPage_ar: 'about',
    // Home page - Featured Projects section
    homeFeaturedTitle_ar: 'المشاريع المميزة',
    homeFeaturedDescription_ar: 'لمحة عن أعمالنا الأخيرة وتميز التصميم',
    homeFeaturedProjects_ar: '',
    // Home page - How We Work section
    homeWorkflowTitle_ar: 'كيف نعمل',
    homeWorkflowDescription_ar: 'عملية سلسة مصممة لتحقيق رؤيتك',
    homeWorkflowStep1Title_ar: 'الاكتشاف',
    homeWorkflowStep1Desc_ar: 'فهم رؤيتك',
    homeWorkflowStep2Title_ar: 'المفهوم',
    homeWorkflowStep2Desc_ar: 'تطوير التصميم',
    homeWorkflowStep3Title_ar: 'الموافقة',
    homeWorkflowStep3Desc_ar: 'التحسين والتخطيط',
    homeWorkflowStep4Title_ar: 'التنفيذ',
    homeWorkflowStep4Desc_ar: 'تحقيق الرؤية',
    homeWorkflowStep5Title_ar: 'التسليم',
    homeWorkflowStep5Desc_ar: 'التسليم النهائي',
    homeWorkflowLinkText_ar: 'تعرف على المزيد',
    homeWorkflowLinkPage_ar: 'workflow',
    // Home page - CTA section
    homeCtaTitle_ar: 'هل أنت مستعد لتحويل مساحتك؟',
    homeCtaDescription_ar: 'دعنا نناقش مشروعك وننشئ شيئاً استثنائياً معاً. تواصل مع فريقنا اليوم.',
    homeCtaButton1Text_ar: 'اطلب عرض سعر',
    homeCtaButton1Page_ar: 'pricing',
    homeCtaButton2Text_ar: 'تواصل معنا',
    homeCtaButton2Page_ar: 'contact',
    // About page - Hero
    aboutHeroTitle_ar: 'حول TRQ',
    aboutHeroParagraph_ar: 'صياغة مساحات استثنائية من خلال الرؤية والخبرة والتفاني',
    // About page - Who We Are
    aboutWhoWeAreTitle_ar: 'من نحن',
    aboutWhoWeAreParagraph1_ar: 'TRQ هي استوديو تصميم داخلي فاخر وإبداعي يقع في الرياض، المملكة العربية السعودية. تأسست على مبادئ التميز والابتكار والخدمة الموجهة للعميل، وقد أثبتنا أنفسنا كشريك تصميم رائد للعملاء الذين يطالبون بالأفضل.',
    aboutWhoWeAreParagraph2_ar: 'يجمع فريقنا متعدد التخصصات بين الخبرة في التصميم الداخلي والعمارة وتصميم الأثاث وإدارة المشاريع لتقديم حلول شاملة تتجاوز التوقعات.',
    aboutWhoWeAreParagraph3_ar: 'سواء كنا ننشئ مساحات سكنية حميمية أو بيئات تجارية كبرى، فإننا نتعامل مع كل مشروع بنفس مستوى التفاني والإبداع والاهتمام بالتفاصيل الذي أصبح علامتنا المميزة.',
    aboutWhoWeAreImage_ar: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    // About page - Vision
    aboutVisionTitle_ar: 'رؤيتنا',
    aboutVisionIcon_ar: 'Eye',
    aboutVisionParagraph_ar: 'أن نكون معترفاً بنا كاستوديو التصميم الفاخر الرائد في المملكة العربية السعودية وما وراءها، وتحديد معايير جديدة للتميز الإبداعي وتحويل المساحات إلى أعمال فنية خالدة تلهم وترفع من تجربة الإنسان.',
    // About page - Mission
    aboutMissionTitle_ar: 'مهمتنا',
    aboutMissionIcon_ar: 'Target',
    aboutMissionParagraph_ar: 'تقديم حلول تصميمية استثنائية ومخصصة تعكس رؤية عملائنا الفريدة مع تجاوز توقعاتهم. نحن ملتزمون بدمج الابتكار الفني مع الخبرة العملية، وإنشاء مساحات جميلة وعملية في نفس الوقت.',
    // About page - Values
    aboutValuesTitle_ar: 'قيمنا',
    aboutValuesDescription_ar: 'المبادئ التي توجه عملنا وتحدد نهجنا في التصميم',
    aboutValue1Title_ar: 'التميز',
    aboutValue1Icon_ar: 'Award',
    aboutValue1Description_ar: 'نسعى إلى أعلى المعايير في كل مشروع، مما يضمن جودة استثنائية والاهتمام بالتفاصيل.',
    aboutValue2Title_ar: 'الابتكار',
    aboutValue2Icon_ar: 'Lightbulb',
    aboutValue2Description_ar: 'نحتضن الإبداع ونتجاوز الحدود لتقديم حلول تصميمية فريدة وتطلعية.',
    aboutValue3Title_ar: 'التعاون',
    aboutValue3Icon_ar: 'Users',
    aboutValue3Description_ar: 'نعمل بشكل وثيق مع عملائنا، ونقدر مساهماتهم وننشئ شراكات دائمة.',
    aboutValue4Title_ar: 'الشغف',
    aboutValue4Icon_ar: 'Heart',
    aboutValue4Description_ar: 'حبنا للتصميم يدفعنا لإنشاء مساحات تلهم وتسعد.',
    // About page - Why Choose TRQ
    aboutWhyTitle_ar: 'لماذا اختر TRQ',
    aboutWhyDescription_ar: 'ما يميزنا في عالم التصميم الداخلي الفاخر',
    aboutWhy1Title_ar: 'التركيز على الفخامة',
    aboutWhy1Description_ar: 'متخصصون في المشاريع السكنية والتجارية عالية المستوى التي تتطلب أفضل الحرفية.',
    aboutWhy2Title_ar: 'النهج الشامل',
    aboutWhy2Description_ar: 'من المفهوم إلى الإنجاز، نتولى كل جوانب مشروعك برعاية دقيقة.',
    aboutWhy3Title_ar: 'الحساسية الثقافية',
    aboutWhy3Description_ar: 'فهم عميق للثقافة السعودية مدمج مع وجهات نظر تصميمية عالمية.',
    aboutWhy4Title_ar: 'السجل الحافل',
    aboutWhy4Description_ar: 'تسليم ناجح لمشاريع فاخرة عبر القطاعات السكنية والتجارية والمعارض.',
    // About page - Impact Statement
    aboutImpactTitle_ar: 'تأثيرنا على العملاء',
    aboutImpactParagraph1_ar: 'لا نقتصر على تصميم المساحات فقط - نحن نحول طريقة حياة عملائنا وعملهم وتجربتهم لبيئاتهم. من خلال التصميم المدروس والتنفيذ الدقيق والالتزام الثابت بالجودة، ننشئ مساحات تلهم وتريح وترفع من جودة الحياة اليومية.',
    aboutImpactParagraph2_ar: 'كل مشروع هو فرصة لإحداث تأثير إيجابي دائم، ونأخذ هذه المسؤولية على محمل الجد. يُقاس نجاحنا ليس فقط بالمشاريع المنجزة، بل برضا وسعادة عملائنا.',
    // Services page - Hero
    servicesHeroTitle_ar: 'خدماتنا',
    servicesHeroParagraph_ar: 'حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك',
    // Services page - Introduction
    servicesTitle_ar: 'حلول تصميمية متكاملة',
    servicesDescription_ar: 'من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم مجموعة شاملة من خدمات التصميم الداخلي والخارجي',
    // Services page - Highlights
    servicesHighlightsTitle_ar: 'مميزات خدماتنا',
    servicesHighlightsDescription_ar: 'ما يمكنك توقعه عند التعامل مع TRQ',
    servicesHighlight1Title_ar: 'حلول مخصصة',
    servicesHighlight1Description_ar: 'كل مشروع فريد. نقوم بإنشاء تصاميم مخصصة تعكس احتياجاتك وتفضيلاتك ورؤيتك الخاصة',
    servicesHighlight2Title_ar: 'خدمة شاملة',
    servicesHighlight2Description_ar: 'من الاستشارة الأولية إلى التثبيت النهائي، نتولى كل التفاصيل لضمان تجربة سلسة',
    servicesHighlight3Title_ar: 'جودة عالية',
    servicesHighlight3Description_ar: 'نختار أفضل المواد ونعمل مع حرفيين ماهرين لتقديم نتائج استثنائية',
    // Services page - CTA
    servicesCtaTitle_ar: 'هل أنت مستعد للبدء؟',
    servicesCtaDescription_ar: 'دعنا نناقش مشروعك واستكشف كيف يمكن لخدماتنا أن تحقق رؤيتك',
    servicesCtaButton1Text_ar: 'اطلب عرض سعر',
    servicesCtaButton1Page_ar: 'pricing',
    servicesCtaButton2Text_ar: 'تواصل معنا',
    servicesCtaButton2Page_ar: 'contact',
    // Workflow page - Hero
    workflowHeroTitle_ar: 'كيفية عملنا',
    workflowHeroParagraph_ar: 'عملية منظمة مصممة لتحقيق رؤيتك بنجاح',
    // Workflow page - Introduction
    workflowIntroTitle_ar: 'عملية عملنا المثبتة',
    workflowIntroParagraph_ar: 'في TRQ، نؤمن بأن التصميم الاستثنائي يتطلب نهجاً منظماً ومرناً. تضمن عمليتنا المكونة من خمس خطوات أن كل مشروع يحصل على الاهتمام والخبرة والرعاية التي يستحقها',
    // Workflow page - Steps
    workflowStep1Title_ar: 'الاستشارة والاكتشاف',
    workflowStep1Icon_ar: 'Search',
    workflowStep1Description_ar: 'فهم احتياجاتك ومتطلباتك',
    workflowStep1Features_ar: 'استشارة أولية لفهم احتياجاتك وتفضيلاتك والميزانية|زيارة الموقع وتقييم المساحة الموجودة|مناقشة أهداف المشروع والجدول الزمني والقيود|مراجعة المواد المرجعية والإلهام|تحديد النطاق الأولي وتحليل الجدوى',
    workflowStep2Title_ar: 'تطوير المفهوم والتصميم',
    workflowStep2Icon_ar: 'Lightbulb',
    workflowStep2Description_ar: 'تحقيق رؤيتك من خلال التصميم الإبداعي',
    workflowStep2Features_ar: 'تطوير مفاهيم التصميم الأولية ولوحات المزاج|تخطيط المساحة وخيارات التخطيط|اختيار لوحات الألوان والمواد والتشطيبات|تصورات ثلاثية الأبعاد وعروض توضيحية|عرض مقترحات التصميم لمراجعتك',
    workflowStep3Title_ar: 'الموافقة والتخطيط',
    workflowStep3Icon_ar: 'CheckCircle',
    workflowStep3Description_ar: 'التحسين والتخطيط التفصيلي',
    workflowStep3Features_ar: 'دمج ملاحظاتك وتحسين التصميم|إعداد الرسومات التقنية التفصيلية والمواصفات|إنهاء اختيارات المواد والأثاث|تأكيد الميزانية وإنشاء الجدول الزمني للمشروع|التنسيق مع المقاولين والموردين',
    workflowStep4Title_ar: 'التنفيذ والإشراف',
    workflowStep4Icon_ar: 'Hammer',
    workflowStep4Description_ar: 'تحقيق التصميم على أرض الواقع',
    workflowStep4Features_ar: 'الحصول على المواد والأثاث والتركيبات|التنسيق والإشراف على أعمال البناء|مراقبة الجودة والفحوصات المنتظمة للموقع|حل المشاكل والتعديلات على التصميم في الموقع|تحديثات منتظمة والتواصل',
    workflowStep5Title_ar: 'التسليم والتسليم النهائي',
    workflowStep5Icon_ar: 'Home',
    workflowStep5Description_ar: 'إكمال مساحتك المثالية',
    workflowStep5Features_ar: 'التثبيت النهائي للأثاث والديكور|التصميم والتفاصيل النهائية|جولة شاملة والفحص|توثيق المشروع المكتمل|الدعم بعد الانتهاء وإرشادات الصيانة',
    // Workflow page - Why Our Process Works
    workflowWhyTitle_ar: 'لماذا تعمل عمليتنا',
    workflowWhyDescription_ar: 'مبنية على سنوات من الخبرة وتحسينها من خلال عدد لا يحصى من المشاريع الناجحة',
    workflowWhy1Title_ar: 'تعاوني',
    workflowWhy1Description_ar: 'نعمل بشكل وثيق معك في كل مرحلة، مما يضمن أن رؤيتك توجه العملية بأكملها والنتيجة النهائية تتجاوز توقعاتك',
    workflowWhy2Title_ar: 'شفاف',
    workflowWhy2Description_ar: 'التواصل الواضح والتحديثات المنتظمة والشفافية الكاملة في الجداول الزمنية والميزانيات واتخاذ القرارات طوال المشروع',
    workflowWhy3Title_ar: 'فعال',
    workflowWhy3Description_ar: 'سير عمل مبسط وإدارة مشاريع ذات خبرة والاهتمام بالتفاصيل يضمن إكمال المشاريع في الوقت المحدد وبأعلى المعايير',
    // Workflow page - Project Timeline
    workflowTimelineTitle_ar: 'جدول المشروع الزمني',
    workflowTimelineParagraph1_ar: 'بينما كل مشروع فريد، تتبع معظم المشاريع جدولاً زمنياً مماثلاً. عادة ما تستغرق المشاريع السكنية 3-6 أشهر من المفهوم إلى الإنجاز، بينما قد تتطلب المشاريع التجارية الأكبر 6-12 شهراً أو أكثر. عادة ما يكون لتصاميم أكشاك المعارض أوقات تسليم أسرع من 2-6 أسابيع حسب التعقيد',
    workflowTimelineParagraph2_ar: 'خلال استشارتنا الأولية، سنزودك بجدول زمني مفصل خاص بنطاق مشروعك ومتطلباته',
    // Workflow page - CTA
    workflowCtaTitle_ar: 'هل أنت مستعد لبدء رحلتك؟',
    workflowCtaDescription_ar: 'دعنا نبدأ باستشارة لمناقشة مشروعك واستكشاف كيف يمكننا تحقيق رؤيتك',
    workflowCtaButton1Text_ar: 'اطلب عرض سعر',
    workflowCtaButton1Page_ar: 'pricing',
    workflowCtaButton2Text_ar: 'جدول استشارة',
    workflowCtaButton2Page_ar: 'contact',
    // Portfolio page - Hero
    portfolioHeroTitle_ar: 'محفظتنا',
    portfolioHeroParagraph_ar: 'استكشف مجموعتنا من مشاريع التصميم الاستثنائية',
    // Portfolio page - Introduction
    portfolioIntroParagraph_ar: 'كل مشروع يمثل التزامنا بالتميز والإبداع والاهتمام بالتفاصيل. من المساحات السكنية الحميمية إلى البيئات التجارية الكبرى، تعرض محفظتنا عمق وشمول خبرتنا في التصميم',
    // Portfolio page - Categories (JSON array)
    portfolioCategories_ar: JSON.stringify([
      { id: 'all', label: 'جميع المشاريع' },
      { id: 'residential', label: 'سكني' },
      { id: 'commercial', label: 'تجاري' },
      { id: 'booths', label: 'أكشاك ومعارض' },
      { id: 'events', label: 'الأحداث' },
      { id: 'furniture', label: 'الأثاث' },
    ]),
    // Portfolio page - Stats
    portfolioStat1Value_ar: '150+',
    portfolioStat1Label_ar: 'المشاريع المنجزة',
    portfolioStat2Value_ar: '100+',
    portfolioStat2Label_ar: 'العملاء السعداء',
    portfolioStat3Value_ar: '15+',
    portfolioStat3Label_ar: 'الجوائز المكتسبة',
    portfolioStat4Value_ar: '8+',
    portfolioStat4Label_ar: 'سنوات الخبرة',
    // Portfolio page - CTA
    portfolioCtaTitle_ar: 'دعنا ننشئ مشروعك',
    portfolioCtaDescription_ar: 'هل أنت مستعد لبدء رحلتك الخاصة في التصميم؟ تواصل مع فريقنا لمناقشة رؤيتك واستكشف كيف يمكننا تحقيقها',
    portfolioCtaButton1Text_ar: 'اطلب عرض سعر',
    portfolioCtaButton1Page_ar: 'pricing',
    portfolioCtaButton2Text_ar: 'تواصل معنا',
    portfolioCtaButton2Page_ar: 'contact',
    // Contact page - Hero
    contactHeroTitle_ar: 'تواصل معنا',
    contactHeroParagraph_ar: 'دعنا نناقش مشروعك وننشئ شيئاً استثنائياً معاً',
    // Contact page - Contact Info
    contactInfo1Show_ar: 'true',
    contactInfo1Icon_ar: 'MapPin',
    contactInfo1Title_ar: 'زيارتنا',
    contactInfo1Detail1_ar: 'استوديو TRQ للتصميم',
    contactInfo1Detail2_ar: 'طريق الملك فهد',
    contactInfo1Detail3_ar: 'الرياض، المملكة العربية السعودية',
    contactInfo2Show_ar: 'true',
    contactInfo2Icon_ar: 'Phone',
    contactInfo2Title_ar: 'اتصل بنا',
    contactInfo2Detail1_ar: '+966 XX XXX XXXX',
    contactInfo2Detail2_ar: 'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
    contactInfo2Detail3_ar: '',
    contactInfo3Show_ar: 'true',
    contactInfo3Icon_ar: 'Mail',
    contactInfo3Title_ar: 'راسلنا',
    contactInfo3Detail1_ar: 'info@trq.design',
    contactInfo3Detail2_ar: 'projects@trq.design',
    contactInfo3Detail3_ar: '',
    contactInfo4Show_ar: 'true',
    contactInfo4Icon_ar: 'MessageCircle',
    contactInfo4Title_ar: 'واتس آب',
    contactInfo4Detail1_ar: '+966 XX XXX XXXX',
    contactInfo4Detail2_ar: 'ضمان الرد السريع',
    contactInfo4Detail3_ar: '',
    // Contact page - Form Section
    contactFormTitle_ar: 'أرسل لنا رسالة',
    contactFormDescription_ar: 'املأ النموذج أدناه وسيرد عليك فريقنا في غضون 24 ساعة.',
    // Contact page - Quick Contact
    contactQuickTitle_ar: 'تواصل سريع',
    contactQuick1Icon_ar: 'MessageCircle',
    contactQuick1Title_ar: 'واتس آب',
    contactQuick1Description_ar: 'أسرع طريقة للتواصل معنا',
    contactQuick1ButtonText_ar: 'دردش على واتس آب',
    contactQuick1Link_ar: 'https://wa.me/966XXXXXXXXX',
    contactQuick1Color_ar: 'green',
    contactQuick2Icon_ar: 'Mail',
    contactQuick2Title_ar: 'البريد الإلكتروني',
    contactQuick2Description_ar: 'للاستفسارات التفصيلية',
    contactQuick2ButtonText_ar: 'أرسل بريداً إلكترونياً',
    contactQuick2Link_ar: 'mailto:info@trq.design?subject=استفسار%20من%20موقع%20TRQ&body=مرحباً%20بفريق%20TRQ%20للتصميم',
    contactQuick2Color_ar: 'black',
    contactQuick3Icon_ar: '',
    contactQuick3Title_ar: '',
    contactQuick3Description_ar: '',
    contactQuick3ButtonText_ar: '',
    contactQuick3Link_ar: '',
    contactQuick3Color_ar: 'black',
    contactQuick4Icon_ar: '',
    contactQuick4Title_ar: '',
    contactQuick4Description_ar: '',
    contactQuick4ButtonText_ar: '',
    contactQuick4Link_ar: '',
    contactQuick4Color_ar: 'black',
    // Contact page - Office Hours
    contactOfficeHoursDay1_ar: 'الاثنين - الخميس',
    contactOfficeHoursTime1_ar: '9:00 صباحاً - 6:00 مساءً',
    contactOfficeHoursDay2_ar: 'الجمعة',
    contactOfficeHoursTime2_ar: 'مغلق',
    contactOfficeHoursDay3_ar: 'السبت',
    contactOfficeHoursTime3_ar: '10:00 صباحاً - 4:00 مساءً',
    contactOfficeHoursDay4_ar: 'الأحد',
    contactOfficeHoursTime4_ar: '9:00 صباحاً - 6:00 مساءً',
    // Contact page - Visit Studio
    contactStudioShow_ar: 'true',
    contactStudioTitle_ar: 'زيارة استوديونا',
    contactStudioDescription_ar: 'حدد موعداً لزيارة استوديو التصميم الخاص بنا، واعرض محفظتنا، وناقش مشروعك شخصياً.',
    contactStudioButtonText_ar: 'حدد موعداً للزيارة',
    // Contact page - Map
    contactMapTitle_ar: 'ابحث عننا',
    contactMapAddress_ar: 'استوديو TRQ للتصميم، طريق الملك فهد، الرياض',
    contactMapImage_ar: '',
    contactMapLink_ar: 'https://maps.google.com/?q=Riyadh,Saudi+Arabia',
    // Blog page - Hero
    blogHeroTitle_ar: 'رؤى التصميم',
    blogHeroParagraph_ar: 'وجهات نظر الخبراء حول التصميم الداخلي الفاخر والاتجاهات والإلهام',
    // Blog page - Featured Section
    blogFeaturedLabel_ar: 'مقالة مميزة',
    blogReadArticleText_ar: 'اقرأ المقالة',
    // Blog page - Categories
    blogCategoryAll_ar: 'جميع المقالات',
    blogCategoryDesignTips_ar: 'نصائح التصميم',
    blogCategoryTrends_ar: 'الاتجاهات',
    blogCategoryProjects_ar: 'المشاريع',
    blogCategoryInsights_ar: 'الرؤى',
    // Blog page - Newsletter
    blogNewsletterTitle_ar: 'ابقَ مستوحى',
    blogNewsletterParagraph_ar: 'اشترك لتلقي أحدث مقالاتنا ورؤى التصميم وتحديثات المشاريع مباشرة في صندوق بريدك الإلكتروني.',
    blogNewsletterPlaceholder_ar: 'عنوان بريدك الإلكتروني',
    blogNewsletterButton_ar: 'اشترك',
    blogNewsletterDisclaimer_ar: 'نحن نحترم خصوصيتك. ألغِ الاشتراك في أي وقت.',
    // Blog page - Explore Section
    blogExploreTitle_ar: 'استكشف حسب الفئة',
    // Blog Article page
    blogArticleBackText_ar: 'العودة إلى المدونة',
    blogArticleShareText_ar: 'شارك هذه المقالة',
    blogArticleTagsLabel_ar: 'الوسوم',
    blogArticleRelatedTitle_ar: 'مقالات ذات صلة',
    blogArticleAuthorRole_ar: 'كاتب تصميم أول',
    blogArticleAuthorBio_ar: 'كاتب شغوف يستكشف تقاطع التصميم والعمارة وأسلوب الحياة. مع أكثر من 10 سنوات من الخبرة في صناعة التصميم الداخلي، يقدم رؤى وإلهام لعشاق التصميم في جميع أنحاء العالم.',
  });

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
      if (data.homeFeaturedProjects_ar) {
        const ids = data.homeFeaturedProjects_ar.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        setSelectedProjectIds(ids);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = {
        ...settings,
        homeFeaturedProjects_ar: selectedProjectIds.join(','),
      };
      await api.updateSettings(settingsToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const addFeaturedProject = (projectId: number) => {
    if (!selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  const removeFeaturedProject = (projectId: number) => {
    setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
  };

  const publishedProjects = projects.filter(p => p.status === 'published');
  const availableProjects = publishedProjects.filter(p => !selectedProjectIds.includes(p.id));
  const selectedProjects = selectedProjectIds.map(id => projects.find(p => p.id === id)).filter(Boolean);

  const linkOptions = [
    { value: 'home', label: 'الرئيسية' },
    { value: 'about', label: 'حول' },
    { value: 'services', label: 'الخدمات' },
    { value: 'workflow', label: 'سير العمل' },
    { value: 'portfolio', label: 'المحفظة' },
    { value: 'contact', label: 'الاتصال' },
    { value: 'pricing', label: 'التسعير' },
  ];

  const tabs = [
    { id: 'home-intro' as TabType, label: 'المقدمة' },
    { id: 'home-featured' as TabType, label: 'المشاريع المميزة' },
    { id: 'home-workflow' as TabType, label: 'كيف نعمل' },
    { id: 'home-cta' as TabType, label: 'قسم الدعوة للعمل' },
    { id: 'about' as TabType, label: 'صفحة حول' },
    { id: 'services' as TabType, label: 'صفحة الخدمات' },
    { id: 'workflow' as TabType, label: 'صفحة سير العمل' },
    { id: 'portfolio' as TabType, label: 'صفحة المحفظة' },
    { id: 'contact' as TabType, label: 'صفحة الاتصال' },
    { id: 'pricing' as TabType, label: 'صفحة التسعير' },
    { id: 'blog' as TabType, label: 'صفحة المدونة' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">إعدادات الموقع (عربي)</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{saved ? 'تم الحفظ!' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-black/5 p-4">
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="w-full px-4 py-3 border border-black/10 rounded text-sm"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>
          <div className="hidden lg:flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black hover:bg-black/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Home Page - Introduction Section */}
          {activeTab === 'home-intro' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">قسم المقدمة</h2>
                <p className="text-sm text-black/60 mt-1">المحتوى المعروض في منطقة المقدمة على الصفحة الرئيسية</p>
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                <input
                  type="text"
                  value={settings.homeIntroTitle_ar}
                  onChange={(e) => setSettings({ ...settings, homeIntroTitle_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="إنشاء حلول تصميمية خالدة"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">الفقرة 1</label>
                <textarea
                  value={settings.homeIntroText1_ar}
                  onChange={(e) => setSettings({ ...settings, homeIntroText1_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="TRQ هي استوديو تصميم داخلي فاخر..."
                />
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">الفقرة 2</label>
                <textarea
                  value={settings.homeIntroText2_ar}
                  onChange={(e) => setSettings({ ...settings, homeIntroText2_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="يجمع نهجنا بين الرؤية الفنية..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">نص الرابط</label>
                  <input
                    type="text"
                    value={settings.homeIntroLinkText_ar}
                    onChange={(e) => setSettings({ ...settings, homeIntroLinkText_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="تعرف على المزيد عن TRQ"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">صفحة الرابط</label>
                  <select
                    value={settings.homeIntroLinkPage_ar}
                    onChange={(e) => setSettings({ ...settings, homeIntroLinkPage_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    {linkOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">عنوان URL للصورة</label>
                <input
                  type="url"
                  value={settings.homeIntroImage_ar}
                  onChange={(e) => setSettings({ ...settings, homeIntroImage_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="https://..."
                />
                {settings.homeIntroImage_ar && (
                  <div className="mt-3 w-64 h-40 bg-neutral-100 overflow-hidden rounded">
                    <img src={settings.homeIntroImage_ar} alt="معاينة" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Home Page - Featured Projects Section */}
          {activeTab === 'home-featured' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">قسم المشاريع المميزة</h2>
                <p className="text-sm text-black/60 mt-1">اختر المشاريع التي تريد عرضها على الصفحة الرئيسية</p>
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                <input
                  type="text"
                  value={settings.homeFeaturedTitle_ar}
                  onChange={(e) => setSettings({ ...settings, homeFeaturedTitle_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="المشاريع المميزة"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                <textarea
                  value={settings.homeFeaturedDescription_ar}
                  onChange={(e) => setSettings({ ...settings, homeFeaturedDescription_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={2}
                  placeholder="لمحة عن أعمالنا الأخيرة..."
                />
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">المشاريع المختارة ({selectedProjectIds.length})</label>
                {selectedProjects.length === 0 ? (
                  <div className="border-2 border-dashed border-black/20 rounded p-8 text-center text-black/40">
                    لم يتم اختيار أي مشاريع. أضف مشاريع من القائمة أدناه.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProjects.map((project) => project && (
                      <div key={project.id} className="flex items-center gap-3 bg-neutral-50 p-3 rounded">
                        <GripVertical size={18} className="text-black/30" />
                        <img src={project.image} alt={project.title} className="w-16 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-sm text-black/60 capitalize">{project.category}</p>
                        </div>
                        <button
                          onClick={() => removeFeaturedProject(project.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">إضافة مشاريع</label>
                {availableProjects.length === 0 ? (
                  <p className="text-sm text-black/40">تم اختيار جميع المشاريع المنشورة بالفعل.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                    {availableProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => addFeaturedProject(project.id)}
                        className="flex items-center gap-3 p-3 border border-black/10 hover:border-black/30 rounded transition-colors text-left"
                      >
                        <img src={project.image} alt={project.title} className="w-16 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-sm text-black/60 capitalize">{project.category}</p>
                        </div>
                        <Plus size={18} className="text-black/40" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Home Page - How We Work Section */}
          {activeTab === 'home-workflow' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">قسم كيف نعمل</h2>
                <p className="text-sm text-black/60 mt-1">قم بتكوين خطوات سير العمل المعروضة على الصفحة الرئيسية</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowTitle_ar}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowTitle_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="كيف نعمل"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowDescription_ar}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowDescription_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="عملية سلسة مصممة لتحقيق رؤيتك"
                  />
                </div>
              </div>
              <div className="border-t pt-6">
                <label className="block mb-4 text-sm tracking-wider">خطوات سير العمل</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="bg-neutral-50 p-4 rounded">
                      <div className="text-2xl font-light text-black/20 mb-2">0{step}</div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={(settings as any)[`homeWorkflowStep${step}Title_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`homeWorkflowStep${step}Title_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                          placeholder="عنوان الخطوة"
                        />
                        <input
                          type="text"
                          value={(settings as any)[`homeWorkflowStep${step}Desc_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`homeWorkflowStep${step}Desc_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                          placeholder="وصف الخطوة"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">نص الزر</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowLinkText_ar}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowLinkText_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="تعرف على المزيد"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">رابط الزر</label>
                  <select
                    value={settings.homeWorkflowLinkPage_ar}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowLinkPage_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    {linkOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Home Page - CTA Section */}
          {activeTab === 'home-cta' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">قسم الدعوة للعمل</h2>
                <p className="text-sm text-black/60 mt-1">قم بتكوين قسم الدعوة للعمل في أسفل الصفحة الرئيسية</p>
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                <input
                  type="text"
                  value={settings.homeCtaTitle_ar}
                  onChange={(e) => setSettings({ ...settings, homeCtaTitle_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="هل أنت مستعد لتحويل مساحتك؟"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                <textarea
                  value={settings.homeCtaDescription_ar}
                  onChange={(e) => setSettings({ ...settings, homeCtaDescription_ar: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={3}
                  placeholder="دعنا نناقش مشروعك وننشئ شيئاً استثنائياً معاً."
                />
              </div>
              <div className="border-t pt-6">
                <label className="block mb-4 text-sm tracking-wider">الأزرار</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الأساسي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.homeCtaButton1Text_ar}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton1Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="اطلب عرض سعر"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.homeCtaButton1Page_ar}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton1Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الثانوي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.homeCtaButton2Text_ar}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton2Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="تواصل معنا"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.homeCtaButton2Page_ar}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton2Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Page Settings */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار في أعلى صفحة حول</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.aboutHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, aboutHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="حول TRQ"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.aboutHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, aboutHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="صياغة مساحات استثنائية من خلال الرؤية والخبرة والتفاني"
                    />
                  </div>
                </div>
              </div>

              {/* Who We Are Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم من نحن</h2>
                  <p className="text-sm text-black/60 mt-1">قسم المقدمة الرئيسي على صفحة حول</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.aboutWhoWeAreTitle_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="من نحن"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 1</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph1_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph1_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="TRQ هي استوديو تصميم داخلي فاخر..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 2</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph2_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph2_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="يجمع فريقنا متعدد التخصصات..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 3</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph3_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph3_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="سواء كنا ننشئ مساحات سكنية..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان URL للصورة</label>
                    <input
                      type="url"
                      value={settings.aboutWhoWeAreImage_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreImage_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://..."
                    />
                    {settings.aboutWhoWeAreImage_ar && (
                      <div className="mt-3 w-48 h-32 bg-neutral-100 overflow-hidden rounded">
                        <img src={settings.aboutWhoWeAreImage_ar} alt="معاينة" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vision & Mission Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">الرؤية والمهمة</h2>
                  <p className="text-sm text-black/60 mt-1">قم بتكوين بطاقات الرؤية والمهمة</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vision */}
                  <div className="bg-neutral-50 p-6 rounded space-y-4">
                    <h3 className="font-medium">الرؤية</h3>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">العنوان</label>
                      <input
                        type="text"
                        value={settings.aboutVisionTitle_ar}
                        onChange={(e) => setSettings({ ...settings, aboutVisionTitle_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="رؤيتنا"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">الأيقونة</label>
                      <div className="grid grid-cols-6 gap-2 p-3 border bg-white max-h-32 overflow-y-auto rounded">
                        {availableIcons.map((iconName) => {
                          const Icon = getIconComponent(iconName);
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setSettings({ ...settings, aboutVisionIcon_ar: iconName })}
                              className={`p-2 flex items-center justify-center rounded transition-colors ${
                                settings.aboutVisionIcon_ar === iconName
                                  ? 'bg-black text-white'
                                  : 'hover:bg-black/10'
                              }`}
                              title={iconName}
                            >
                              <Icon size={20} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">الفقرة</label>
                      <textarea
                        value={settings.aboutVisionParagraph_ar}
                        onChange={(e) => setSettings({ ...settings, aboutVisionParagraph_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={4}
                        placeholder="أن نكون معترفاً بنا كاستوديو التصميم الفاخر الرائد..."
                      />
                    </div>
                  </div>

                  {/* Mission */}
                  <div className="bg-neutral-50 p-6 rounded space-y-4">
                    <h3 className="font-medium">المهمة</h3>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">العنوان</label>
                      <input
                        type="text"
                        value={settings.aboutMissionTitle_ar}
                        onChange={(e) => setSettings({ ...settings, aboutMissionTitle_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="مهمتنا"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">الأيقونة</label>
                      <div className="grid grid-cols-6 gap-2 p-3 border bg-white max-h-32 overflow-y-auto rounded">
                        {availableIcons.map((iconName) => {
                          const Icon = getIconComponent(iconName);
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setSettings({ ...settings, aboutMissionIcon_ar: iconName })}
                              className={`p-2 flex items-center justify-center rounded transition-colors ${
                                settings.aboutMissionIcon_ar === iconName
                                  ? 'bg-black text-white'
                                  : 'hover:bg-black/10'
                              }`}
                              title={iconName}
                            >
                              <Icon size={20} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">الفقرة</label>
                      <textarea
                        value={settings.aboutMissionParagraph_ar}
                        onChange={(e) => setSettings({ ...settings, aboutMissionParagraph_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={4}
                        placeholder="تقديم حلول تصميمية استثنائية..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Values Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم قيمنا</h2>
                  <p className="text-sm text-black/60 mt-1">قم بتكوين بطاقات القيم الأربع على صفحة حول</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.aboutValuesTitle_ar}
                      onChange={(e) => setSettings({ ...settings, aboutValuesTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="قيمنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                    <input
                      type="text"
                      value={settings.aboutValuesDescription_ar}
                      onChange={(e) => setSettings({ ...settings, aboutValuesDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="المبادئ التي توجه عملنا..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`aboutValue${num}Icon_ar`]);
                    return (
                      <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
                            <IconPreview className="text-white" size={20} />
                          </div>
                          <span className="font-medium">القيمة {num}</span>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">العنوان</label>
                          <input
                            type="text"
                            value={(settings as any)[`aboutValue${num}Title_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`aboutValue${num}Title_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="عنوان القيمة"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">الأيقونة</label>
                          <div className="grid grid-cols-6 gap-1 p-2 border bg-white max-h-24 overflow-y-auto rounded">
                            {availableIcons.map((iconName) => {
                              const Icon = getIconComponent(iconName);
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => setSettings({ ...settings, [`aboutValue${num}Icon_ar`]: iconName })}
                                  className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                    (settings as any)[`aboutValue${num}Icon_ar`] === iconName
                                      ? 'bg-black text-white'
                                      : 'hover:bg-black/10'
                                  }`}
                                  title={iconName}
                                >
                                  <Icon size={16} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">الوصف</label>
                          <textarea
                            value={(settings as any)[`aboutValue${num}Description_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`aboutValue${num}Description_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                            rows={3}
                            placeholder="وصف القيمة..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why Choose TRQ Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم لماذا اختر TRQ</h2>
                  <p className="text-sm text-black/60 mt-1">قم بتكوين عناصر التمييز الأربعة على صفحة حول</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.aboutWhyTitle_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhyTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="لماذا اختر TRQ"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                    <input
                      type="text"
                      value={settings.aboutWhyDescription_ar}
                      onChange={(e) => setSettings({ ...settings, aboutWhyDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="ما يميزنا في عالم التصميم الداخلي الفاخر"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">المميز {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">العنوان</label>
                        <input
                          type="text"
                          value={(settings as any)[`aboutWhy${num}Title_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`aboutWhy${num}Title_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="عنوان المميز"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">الوصف</label>
                        <textarea
                          value={(settings as any)[`aboutWhy${num}Description_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`aboutWhy${num}Description_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="وصف المميز..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Statement Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم بيان التأثير</h2>
                  <p className="text-sm text-black/60 mt-1">قم بتكوين بيان التأثير في أسفل صفحة حول</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.aboutImpactTitle_ar}
                      onChange={(e) => setSettings({ ...settings, aboutImpactTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="تأثيرنا على العملاء"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 1</label>
                    <textarea
                      value={settings.aboutImpactParagraph1_ar}
                      onChange={(e) => setSettings({ ...settings, aboutImpactParagraph1_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="لا نقتصر على تصميم المساحات فقط..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 2</label>
                    <textarea
                      value={settings.aboutImpactParagraph2_ar}
                      onChange={(e) => setSettings({ ...settings, aboutImpactParagraph2_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="كل مشروع هو فرصة لإحداث تأثير إيجابي دائم..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Page Settings */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار في أعلى صفحة الخدمات</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.servicesHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, servicesHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="خدماتنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.servicesHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, servicesHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم المقدمة</h2>
                  <p className="text-sm text-black/60 mt-1">المحتوى المعروض أسفل البطل</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.servicesTitle_ar}
                      onChange={(e) => setSettings({ ...settings, servicesTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="حلول تصميمية متكاملة"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                    <textarea
                      value={settings.servicesDescription_ar}
                      onChange={(e) => setSettings({ ...settings, servicesDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى..."
                    />
                  </div>
                </div>
              </div>

              {/* Service Highlights Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم مميزات الخدمات</h2>
                  <p className="text-sm text-black/60 mt-1">المميزات الثلاث المعروضة على صفحة الخدمات</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.servicesHighlightsTitle_ar}
                      onChange={(e) => setSettings({ ...settings, servicesHighlightsTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="مميزات خدماتنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                    <input
                      type="text"
                      value={settings.servicesHighlightsDescription_ar}
                      onChange={(e) => setSettings({ ...settings, servicesHighlightsDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="ما يمكنك توقعه عند التعامل مع TRQ"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">المميز {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">العنوان</label>
                        <input
                          type="text"
                          value={(settings as any)[`servicesHighlight${num}Title_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`servicesHighlight${num}Title_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="عنوان المميز"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">الوصف</label>
                        <textarea
                          value={(settings as any)[`servicesHighlight${num}Description_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`servicesHighlight${num}Description_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="وصف المميز..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم الدعوة للعمل</h2>
                  <p className="text-sm text-black/60 mt-1">قسم الدعوة للعمل في أسفل صفحة الخدمات</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.servicesCtaTitle_ar}
                      onChange={(e) => setSettings({ ...settings, servicesCtaTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="هل أنت مستعد للبدء؟"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                    <textarea
                      value={settings.servicesCtaDescription_ar}
                      onChange={(e) => setSettings({ ...settings, servicesCtaDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="دعنا نناقش مشروعك..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الأساسي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.servicesCtaButton1Text_ar}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton1Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="اطلب عرض سعر"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.servicesCtaButton1Page_ar}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton1Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الثانوي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.servicesCtaButton2Text_ar}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton2Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="تواصل معنا"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.servicesCtaButton2Page_ar}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton2Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Page Settings */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار في أعلى صفحة المحفظة</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.portfolioHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, portfolioHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="محفظتنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.portfolioHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, portfolioHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="استكشف مجموعتنا من مشاريع التصميم الاستثنائية"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم المقدمة</h2>
                  <p className="text-sm text-black/60 mt-1">النص المعروض أسفل البطل</p>
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الفقرة</label>
                  <textarea
                    value={settings.portfolioIntroParagraph_ar}
                    onChange={(e) => setSettings({ ...settings, portfolioIntroParagraph_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                    rows={4}
                    placeholder="كل مشروع يمثل التزامنا بالتميز والإبداع..."
                  />
                </div>
              </div>

              {/* Categories Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">فئات التصفية</h2>
                  <p className="text-sm text-black/60 mt-1">إدارة أزرار التصفية للمحفظة. اسحب لإعادة الترتيب. يجب أن يطابق المعرف فئات المشروع.</p>
                </div>
                {(() => {
                  let categories: { id: string; label: string }[] = [];
                  try {
                    categories = JSON.parse(settings.portfolioCategories_ar || '[]');
                  } catch {
                    categories = [];
                  }
                  const updateCategories = (newCategories: { id: string; label: string }[]) => {
                    setSettings({ ...settings, portfolioCategories_ar: JSON.stringify(newCategories) });
                  };
                  const addCategory = () => {
                    updateCategories([...categories, { id: '', label: '' }]);
                  };
                  const removeCategory = (index: number) => {
                    const newCategories = categories.filter((_, i) => i !== index);
                    updateCategories(newCategories);
                  };
                  const updateCategory = (index: number, field: 'id' | 'label', value: string) => {
                    const newCategories = [...categories];
                    newCategories[index] = { ...newCategories[index], [field]: value };
                    updateCategories(newCategories);
                  };
                  const moveCategory = (index: number, direction: 'up' | 'down') => {
                    if (direction === 'up' && index === 0) return;
                    if (direction === 'down' && index === categories.length - 1) return;
                    const newCategories = [...categories];
                    const newIndex = direction === 'up' ? index - 1 : index + 1;
                    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
                    updateCategories(newCategories);
                  };
                  return (
                    <div className="space-y-3">
                      {categories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2 bg-neutral-50 p-4 rounded">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveCategory(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded transition-colors ${index === 0 ? 'text-black/20 cursor-not-allowed' : 'text-black/40 hover:text-black hover:bg-black/10'}`}
                              title="تحريك لأعلى"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCategory(index, 'down')}
                              disabled={index === categories.length - 1}
                              className={`p-1 rounded transition-colors ${index === categories.length - 1 ? 'text-black/20 cursor-not-allowed' : 'text-black/40 hover:text-black hover:bg-black/10'}`}
                              title="تحريك لأسفل"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                          </div>
                          <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium text-black/60">{index + 1}</div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-1 text-xs text-black/60">المعرف (للتصفية)</label>
                              <input
                                type="text"
                                value={cat.id}
                                onChange={(e) => updateCategory(index, 'id', e.target.value)}
                                className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                                placeholder="مثال: سكني"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-xs text-black/60">تسمية العرض</label>
                              <input
                                type="text"
                                value={cat.label}
                                onChange={(e) => updateCategory(index, 'label', e.target.value)}
                                className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                                placeholder="مثال: سكني"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="إزالة الفئة"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCategory}
                        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-black/20 hover:border-black/40 rounded w-full justify-center text-black/60 hover:text-black transition-colors"
                      >
                        <Plus size={20} />
                        <span>إضافة فئة</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Stats Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم الإحصائيات</h2>
                  <p className="text-sm text-black/60 mt-1">الإحصائيات الأربع المعروضة على صفحة المحفظة</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <span className="font-medium">الإحصائية {num}</span>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">القيمة</label>
                        <input
                          type="text"
                          value={(settings as any)[`portfolioStat${num}Value_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`portfolioStat${num}Value_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="150+"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">التسمية</label>
                        <input
                          type="text"
                          value={(settings as any)[`portfolioStat${num}Label_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`portfolioStat${num}Label_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="المشاريع المنجزة"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم الدعوة للعمل</h2>
                  <p className="text-sm text-black/60 mt-1">قسم الدعوة للعمل في أسفل صفحة المحفظة</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.portfolioCtaTitle_ar}
                      onChange={(e) => setSettings({ ...settings, portfolioCtaTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="دعنا ننشئ مشروعك"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                    <textarea
                      value={settings.portfolioCtaDescription_ar}
                      onChange={(e) => setSettings({ ...settings, portfolioCtaDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="هل أنت مستعد لبدء رحلة التصميم الخاصة بك؟"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الأساسي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.portfolioCtaButton1Text_ar}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton1Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="اطلب عرض سعر"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.portfolioCtaButton1Page_ar}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton1Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الثانوي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.portfolioCtaButton2Text_ar}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton2Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="تواصل معنا"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.portfolioCtaButton2Page_ar}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton2Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Page Settings */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار في أعلى صفحة الاتصال</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.contactHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, contactHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="تواصل معنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.contactHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, contactHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="دعنا نناقش مشروعك..."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Cards */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">بطاقات معلومات الاتصال</h2>
                  <p className="text-sm text-black/60 mt-1">البطاقات الأربع لمعلومات الاتصال المعروضة على صفحة الاتصال</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`contactInfo${num}Icon_ar`]);
                    const isVisible = (settings as any)[`contactInfo${num}Show_ar`] !== 'false';
                    return (
                      <div key={num} className={`bg-neutral-50 p-4 rounded space-y-3 ${!isVisible ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
                              <IconPreview className="text-white" size={20} />
                            </div>
                            <span className="font-medium">بطاقة الاتصال {num}</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-black/60">عرض</span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Show_ar`]: e.target.checked ? 'true' : 'false' })}
                                className="sr-only"
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${isVisible ? 'bg-black' : 'bg-black/20'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-0.5 ${isVisible ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                              </div>
                            </div>
                          </label>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">الأيقونة</label>
                          <div className="grid grid-cols-8 gap-1 p-2 border bg-white max-h-20 overflow-y-auto rounded">
                            {availableIcons.map((iconName) => {
                              const Icon = getIconComponent(iconName);
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => setSettings({ ...settings, [`contactInfo${num}Icon_ar`]: iconName })}
                                  className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                    (settings as any)[`contactInfo${num}Icon_ar`] === iconName
                                      ? 'bg-black text-white'
                                      : 'hover:bg-black/10'
                                  }`}
                                  title={iconName}
                                >
                                  <Icon size={14} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">العنوان</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Title_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Title_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="عنوان البطاقة"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">السطر 1</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail1_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail1_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="مثال: استوديو TRQ"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">السطر 2</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail2_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail2_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="مثال: طريق الملك فهد"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">السطر 3 (اختياري)</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail3_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail3_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="مثال: الرياض، المملكة العربية السعودية"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم نموذج الاتصال</h2>
                  <p className="text-sm text-black/60 mt-1">عنوان ووصف النموذج</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان النموذج</label>
                    <input
                      type="text"
                      value={settings.contactFormTitle_ar}
                      onChange={(e) => setSettings({ ...settings, contactFormTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="أرسل لنا رسالة"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">وصف النموذج</label>
                    <textarea
                      value={settings.contactFormDescription_ar}
                      onChange={(e) => setSettings({ ...settings, contactFormDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="املأ النموذج أدناه..."
                    />
                  </div>
                </div>
              </div>

              {/* Quick Contact Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم التواصل السريع</h2>
                  <p className="text-sm text-black/60 mt-1">أضف ما يصل إلى 4 خيارات تواصل سريعة (اترك فارغاً للإخفاء)</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.contactQuickTitle_ar}
                      onChange={(e) => setSettings({ ...settings, contactQuickTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="تواصل سريع"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`contactQuick${num}Icon_ar`] || 'Circle');
                    return (
                      <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center rounded ${(settings as any)[`contactQuick${num}Color_ar`] === 'green' ? 'bg-green-500' : 'bg-black'}`}>
                            <IconPreview className="text-white" size={20} />
                          </div>
                          <span className="font-medium">تواصل سريع {num}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-xs text-black/60">الأيقونة</label>
                            <div className="grid grid-cols-6 gap-1 p-2 border bg-white max-h-20 overflow-y-auto rounded">
                              {availableIcons.map((iconName) => {
                                const Icon = getIconComponent(iconName);
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSettings({ ...settings, [`contactQuick${num}Icon_ar`]: iconName })}
                                    className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                      (settings as any)[`contactQuick${num}Icon_ar`] === iconName
                                        ? 'bg-black text-white'
                                        : 'hover:bg-black/10'
                                    }`}
                                    title={iconName}
                                  >
                                    <Icon size={14} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-xs text-black/60">لون الزر</label>
                            <select
                              value={(settings as any)[`contactQuick${num}Color_ar`]}
                              onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Color_ar`]: e.target.value })}
                              className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                            >
                              <option value="black">أسود</option>
                              <option value="green">أخضر (واتس آب)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">العنوان</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Title_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Title_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="مثال: واتس آب، البريد الإلكتروني"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">الوصف</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Description_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Description_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="مثال: أسرع طريقة للتواصل معنا"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}ButtonText_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}ButtonText_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="مثال: دردش على واتس آب"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">رابط URL</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Link_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Link_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="مثال: https://wa.me/966... أو mailto:..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Office Hours Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم ساعات العمل</h2>
                  <p className="text-sm text-black/60 mt-1">حدد ساعات عملك لكل يوم</p>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded">
                      <div>
                        <label className="block mb-1 text-xs text-black/60">اليوم (الأيام)</label>
                        <input
                          type="text"
                          value={(settings as any)[`contactOfficeHoursDay${num}_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`contactOfficeHoursDay${num}_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="مثال: الاثنين - الخميس"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">الساعات</label>
                        <input
                          type="text"
                          value={(settings as any)[`contactOfficeHoursTime${num}_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`contactOfficeHoursTime${num}_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="مثال: 9:00 صباحاً - 6:00 مساءً أو مغلق"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visit Studio Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium">قسم زيارة الاستوديو</h2>
                      <p className="text-sm text-black/60 mt-1">معلومات زيارة الاستوديو</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-sm text-black/60">عرض القسم</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.contactStudioShow_ar === 'true'}
                          onChange={(e) => setSettings({ ...settings, contactStudioShow_ar: e.target.checked ? 'true' : 'false' })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${settings.contactStudioShow_ar === 'true' ? 'bg-black' : 'bg-black/20'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.contactStudioShow_ar === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.contactStudioTitle_ar}
                      onChange={(e) => setSettings({ ...settings, contactStudioTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="زيارة استوديونا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                    <textarea
                      value={settings.contactStudioDescription_ar}
                      onChange={(e) => setSettings({ ...settings, contactStudioDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="حدد موعداً لزيارة استوديونا..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">نص الزر</label>
                    <input
                      type="text"
                      value={settings.contactStudioButtonText_ar}
                      onChange={(e) => setSettings({ ...settings, contactStudioButtonText_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="حدد موعداً للزيارة"
                    />
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم الخريطة</h2>
                  <p className="text-sm text-black/60 mt-1">عنوان الخريطة والصورة ورابط خرائط جوجل</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.contactMapTitle_ar}
                      onChange={(e) => setSettings({ ...settings, contactMapTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="ابحث عننا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">نص العنوان</label>
                    <input
                      type="text"
                      value={settings.contactMapAddress_ar}
                      onChange={(e) => setSettings({ ...settings, contactMapAddress_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="استوديو TRQ للتصميم، طريق الملك فهد، الرياض"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">رابط صورة الخريطة (اختياري)</label>
                    <input
                      type="url"
                      value={settings.contactMapImage_ar}
                      onChange={(e) => setSettings({ ...settings, contactMapImage_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://... (اترك فارغاً للعنصر النائب الافتراضي)"
                    />
                    {settings.contactMapImage_ar && (
                      <div className="mt-3 w-64 h-40 bg-neutral-100 overflow-hidden rounded">
                        <img src={settings.contactMapImage_ar} alt="معاينة الخريطة" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">رابط خرائط جوجل</label>
                    <input
                      type="url"
                      value={settings.contactMapLink_ar}
                      onChange={(e) => setSettings({ ...settings, contactMapLink_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://maps.google.com/?q=Your+Address"
                    />
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
                      <p className="font-medium text-blue-800 mb-2">كيفية الحصول على رابط خرائط جوجل:</p>
                      <ol className="list-decimal list-inside text-blue-700 space-y-1">
                        <li>انتقل إلى <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">maps.google.com</a></li>
                        <li>ابحث عن موقعك</li>
                        <li>انقر على زر "مشاركة"</li>
                        <li>انقر على "نسخ الرابط"</li>
                        <li>الصق الرابط هنا</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Page Settings */}
          {activeTab === 'blog' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار الرئيسي في أعلى صفحة المدونة</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.blogHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, blogHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="رؤى التصميم"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.blogHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, blogHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="وجهات نظر الخبراء حول التصميم الداخلي الفاخر..."
                    />
                  </div>
                </div>
              </div>

              {/* Featured Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم المقالة المميزة</h2>
                  <p className="text-sm text-black/60 mt-1">التسميات لمنطقة المقالة المميزة</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">تسمية المميزة</label>
                    <input
                      type="text"
                      value={settings.blogFeaturedLabel_ar}
                      onChange={(e) => setSettings({ ...settings, blogFeaturedLabel_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="مقالة مميزة"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">نص اقرأ المقالة</label>
                    <input
                      type="text"
                      value={settings.blogReadArticleText_ar}
                      onChange={(e) => setSettings({ ...settings, blogReadArticleText_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="اقرأ المقالة"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">تسميات الفئات</h2>
                  <p className="text-sm text-black/60 mt-1">أسماء أزرار تصفية الفئات</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">جميع المقالات</label>
                    <input
                      type="text"
                      value={settings.blogCategoryAll_ar}
                      onChange={(e) => setSettings({ ...settings, blogCategoryAll_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="جميع المقالات"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">نصائح التصميم</label>
                    <input
                      type="text"
                      value={settings.blogCategoryDesignTips_ar}
                      onChange={(e) => setSettings({ ...settings, blogCategoryDesignTips_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="نصائح التصميم"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الاتجاهات</label>
                    <input
                      type="text"
                      value={settings.blogCategoryTrends_ar}
                      onChange={(e) => setSettings({ ...settings, blogCategoryTrends_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="الاتجاهات"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">المشاريع</label>
                    <input
                      type="text"
                      value={settings.blogCategoryProjects_ar}
                      onChange={(e) => setSettings({ ...settings, blogCategoryProjects_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="المشاريع"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الرؤى</label>
                    <input
                      type="text"
                      value={settings.blogCategoryInsights_ar}
                      onChange={(e) => setSettings({ ...settings, blogCategoryInsights_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="الرؤى"
                    />
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم النشرة الإخبارية</h2>
                  <p className="text-sm text-black/60 mt-1">محتوى منطقة الاشتراك في البريد الإلكتروني</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان النشرة الإخبارية</label>
                    <input
                      type="text"
                      value={settings.blogNewsletterTitle_ar}
                      onChange={(e) => setSettings({ ...settings, blogNewsletterTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="ابقَ مستوحى"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة النشرة الإخبارية</label>
                    <textarea
                      value={settings.blogNewsletterParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, blogNewsletterParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="اشترك لتلقي أحدث مقالاتنا..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">نص العنصر النائب للإدخال</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterPlaceholder_ar}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterPlaceholder_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="عنوان بريدك الإلكتروني"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">نص الزر</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterButton_ar}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterButton_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="اشترك"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">نص إخلاء المسؤولية</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterDisclaimer_ar}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterDisclaimer_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="نحن نحترم خصوصيتك..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم استكشف حسب الفئة</h2>
                  <p className="text-sm text-black/60 mt-1">القسم السفلي ببطاقات الفئات</p>
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                  <input
                    type="text"
                    value={settings.blogExploreTitle_ar}
                    onChange={(e) => setSettings({ ...settings, blogExploreTitle_ar: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="استكشف حسب الفئة"
                  />
                </div>
              </div>

              {/* Article Page Settings */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">إعدادات صفحة المقالة</h2>
                  <p className="text-sm text-black/60 mt-1">التسميات والمحتوى لصفحات المقالات الفردية</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">نص زر العودة</label>
                      <input
                        type="text"
                        value={settings.blogArticleBackText_ar}
                        onChange={(e) => setSettings({ ...settings, blogArticleBackText_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="العودة إلى المدونة"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">نص المشاركة</label>
                      <input
                        type="text"
                        value={settings.blogArticleShareText_ar}
                        onChange={(e) => setSettings({ ...settings, blogArticleShareText_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="شارك هذه المقالة"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">تسمية الوسوم</label>
                      <input
                        type="text"
                        value={settings.blogArticleTagsLabel_ar}
                        onChange={(e) => setSettings({ ...settings, blogArticleTagsLabel_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="الوسوم"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">عنوان المقالات ذات الصلة</label>
                      <input
                        type="text"
                        value={settings.blogArticleRelatedTitle_ar}
                        onChange={(e) => setSettings({ ...settings, blogArticleRelatedTitle_ar: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="مقالات ذات صلة"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">دور المؤلف الافتراضي</label>
                    <input
                      type="text"
                      value={settings.blogArticleAuthorRole_ar}
                      onChange={(e) => setSettings({ ...settings, blogArticleAuthorRole_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="كاتب تصميم أول"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">السيرة الذاتية للمؤلف الافتراضية</label>
                    <textarea
                      value={settings.blogArticleAuthorBio_ar}
                      onChange={(e) => setSettings({ ...settings, blogArticleAuthorBio_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="كاتب شغوف يستكشف تقاطع التصميم والعمارة..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Page Settings */}
          {activeTab === 'workflow' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم البطل</h2>
                  <p className="text-sm text-black/60 mt-1">الشعار في أعلى صفحة سير العمل</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان البطل</label>
                    <input
                      type="text"
                      value={settings.workflowHeroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, workflowHeroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="كيفية عملنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">فقرة البطل</label>
                    <textarea
                      value={settings.workflowHeroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, workflowHeroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="عملية منظمة مصممة لتحقيق رؤيتك بنجاح"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم المقدمة</h2>
                  <p className="text-sm text-black/60 mt-1">المحتوى المعروض أسفل البطل</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.workflowIntroTitle_ar}
                      onChange={(e) => setSettings({ ...settings, workflowIntroTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="عملية عملنا المثبتة"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة</label>
                    <textarea
                      value={settings.workflowIntroParagraph_ar}
                      onChange={(e) => setSettings({ ...settings, workflowIntroParagraph_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="في TRQ، نؤمن بأن التصميم الاستثنائي..."
                    />
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">خطوات العملية</h2>
                  <p className="text-sm text-black/60 mt-1">قم بتكوين خطوات سير العمل الخمس (افصل المميزات بـ | )</p>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`workflowStep${num}Icon_ar`]);
                    return (
                      <div key={num} className="bg-neutral-50 p-6 rounded space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-black flex items-center justify-center rounded">
                            <IconPreview className="text-white" size={24} />
                          </div>
                          <span className="text-lg font-medium">الخطوة {num}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 text-xs text-black/60">العنوان</label>
                            <input
                              type="text"
                              value={(settings as any)[`workflowStep${num}Title_ar`]}
                              onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Title_ar`]: e.target.value })}
                              className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                              placeholder="عنوان الخطوة"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-xs text-black/60">الأيقونة</label>
                            <div className="grid grid-cols-8 gap-1 p-2 border bg-white max-h-24 overflow-y-auto rounded">
                              {availableIcons.map((iconName) => {
                                const Icon = getIconComponent(iconName);
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSettings({ ...settings, [`workflowStep${num}Icon_ar`]: iconName })}
                                    className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                      (settings as any)[`workflowStep${num}Icon_ar`] === iconName
                                        ? 'bg-black text-white'
                                        : 'hover:bg-black/10'
                                    }`}
                                    title={iconName}
                                  >
                                    <Icon size={16} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">الوصف</label>
                          <input
                            type="text"
                            value={(settings as any)[`workflowStep${num}Description_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Description_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="وصف الخطوة"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">المميزات (افصل بـ | )</label>
                          <textarea
                            value={(settings as any)[`workflowStep${num}Features_ar`]}
                            onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Features_ar`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                            rows={4}
                            placeholder="المميزة 1|المميزة 2|المميزة 3..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why Our Process Works Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم لماذا تعمل عمليتنا</h2>
                  <p className="text-sm text-black/60 mt-1">المميزات الثلاث المعروضة على صفحة سير العمل</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.workflowWhyTitle_ar}
                      onChange={(e) => setSettings({ ...settings, workflowWhyTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="لماذا تعمل عمليتنا"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">وصف القسم</label>
                    <input
                      type="text"
                      value={settings.workflowWhyDescription_ar}
                      onChange={(e) => setSettings({ ...settings, workflowWhyDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="مبنية على سنوات من الخبرة..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">المميز {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">العنوان</label>
                        <input
                          type="text"
                          value={(settings as any)[`workflowWhy${num}Title_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`workflowWhy${num}Title_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="عنوان المميز"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">الوصف</label>
                        <textarea
                          value={(settings as any)[`workflowWhy${num}Description_ar`]}
                          onChange={(e) => setSettings({ ...settings, [`workflowWhy${num}Description_ar`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="وصف المميز..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم جدول المشروع الزمني</h2>
                  <p className="text-sm text-black/60 mt-1">معلومات حول الجداول الزمنية للمشاريع</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.workflowTimelineTitle_ar}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="جدول المشروع الزمني"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 1</label>
                    <textarea
                      value={settings.workflowTimelineParagraph1_ar}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineParagraph1_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="بينما كل مشروع فريد..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الفقرة 2</label>
                    <textarea
                      value={settings.workflowTimelineParagraph2_ar}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineParagraph2_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="خلال استشارتنا الأولية..."
                    />
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">قسم الدعوة للعمل</h2>
                  <p className="text-sm text-black/60 mt-1">قسم الدعوة للعمل في أسفل صفحة سير العمل</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">عنوان القسم</label>
                    <input
                      type="text"
                      value={settings.workflowCtaTitle_ar}
                      onChange={(e) => setSettings({ ...settings, workflowCtaTitle_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="هل أنت مستعد لبدء رحلتك؟"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">الوصف</label>
                    <textarea
                      value={settings.workflowCtaDescription_ar}
                      onChange={(e) => setSettings({ ...settings, workflowCtaDescription_ar: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="دعنا نبدأ باستشارة..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الأساسي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.workflowCtaButton1Text_ar}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton1Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="اطلب عرض سعر"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.workflowCtaButton1Page_ar}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton1Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">الزر الثانوي</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">نص الزر</label>
                      <input
                        type="text"
                        value={settings.workflowCtaButton2Text_ar}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton2Text_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="جدول استشارة"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">الرابط</label>
                      <select
                        value={settings.workflowCtaButton2Page_ar}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton2Page_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
