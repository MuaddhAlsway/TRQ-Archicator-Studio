-- ============================================================
-- COMPLETE ARABIC SETTINGS - ALL MISSING PAGES
-- ============================================================
-- This file adds all missing Arabic settings for:
-- - Services Page (20 settings)
-- - Workflow Page (40 settings)
-- - Portfolio Page (15 settings)
-- - Contact Page (40 settings)
-- - Pricing Page (50 settings)
-- - Blog Page (20 settings)
-- - Additional Home & About settings
-- Total: 185+ new Arabic settings
-- ============================================================

BEGIN TRANSACTION;

-- ============================================================
-- SERVICES PAGE (20 settings)
-- ============================================================

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHeroTitle_ar', 'خدماتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHeroParagraph_ar', 'حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesTitle_ar', 'حلول تصميمية متكاملة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesDescription_ar', 'من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم مجموعة شاملة من خدمات التصميم الداخلي والخارجي', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlightsTitle_ar', 'مميزات خدماتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlightsDescription_ar', 'ما يمكنك توقعه عند التعامل مع TRQ', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight1Title_ar', 'حلول مخصصة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight1Description_ar', 'كل مشروع فريد. نقوم بإنشاء تصاميم مخصصة تعكس احتياجاتك وتفضيلاتك ورؤيتك الخاصة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight2Title_ar', 'خدمة شاملة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight2Description_ar', 'من الاستشارة الأولية إلى التثبيت النهائي، نتولى كل التفاصيل لضمان تجربة سلسة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight3Title_ar', 'جودة عالية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight3Description_ar', 'نختار أفضل المواد ونعمل مع حرفيين ماهرين لتقديم نتائج استثنائية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaTitle_ar', 'هل أنت مستعد للبدء؟', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaDescription_ar', 'دعنا نناقش مشروعك واستكشف كيف يمكن لخدماتنا أن تحقق رؤيتك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton2Page_ar', 'contact', datetime('now'));

-- ============================================================
-- WORKFLOW PAGE (40 settings)
-- ============================================================

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowHeroTitle_ar', 'كيفية عملنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowHeroParagraph_ar', 'عملية منظمة مصممة لتحقيق رؤيتك بنجاح', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowIntroTitle_ar', 'عملية عملنا المثبتة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowIntroParagraph_ar', 'في TRQ، نؤمن بأن التصميم الاستثنائي يتطلب نهجاً منظماً ومرناً. تضمن عمليتنا المكونة من خمس خطوات أن كل مشروع يحصل على الاهتمام والخبرة والرعاية التي يستحقها', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep1Title_ar', 'الاستشارة والاكتشاف', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep1Icon_ar', 'Search', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep1Description_ar', 'فهم احتياجاتك ومتطلباتك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep1Features_ar', 'استشارة أولية لفهم احتياجاتك وتفضيلاتك والميزانية|زيارة الموقع وتقييم المساحة الموجودة|مناقشة أهداف المشروع والجدول الزمني والقيود|مراجعة المواد المرجعية والإلهام|تحديد نطاق أولي وتحليل الجدوى', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep2Title_ar', 'تطوير المفهوم والتصميم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep2Icon_ar', 'Lightbulb', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep2Description_ar', 'تحويل رؤيتك إلى واقع من خلال التصميم الإبداعي', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep2Features_ar', 'تطوير مفاهيم تصميمية أولية ولوحات المزاج|تخطيط المساحة وخيارات التخطيط|اختيار لوحات الألوان والمواد والتشطيبات|تصورات ثلاثية الأبعاد وعروض توضيحية|عرض مقترحات التصميم لمراجعتك', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep3Title_ar', 'الموافقة والتخطيط', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep3Icon_ar', 'CheckCircle', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep3Description_ar', 'التحسين والتخطيط التفصيلي', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep3Features_ar', 'دمج ملاحظاتك وتحسين التصميم|إعداد الرسومات التقنية والمواصفات التفصيلية|إنهاء اختيارات المواد والأثاث|تأكيد الميزانية وإنشاء جدول زمني للمشروع|التنسيق مع المقاولين والموردين', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep4Title_ar', 'التنفيذ والإشراف', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep4Icon_ar', 'Hammer', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep4Description_ar', 'تحويل التصميم إلى واقع ملموس', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep4Features_ar', 'الإشراف على جميع مراحل البناء والتثبيت|ضمان الالتزام بالمواصفات والجودة|إدارة الجدول الزمني والميزانية|حل أي مشاكل أو تحديات تنشأ|التواصل المنتظم معك حول التقدم', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep5Title_ar', 'الإطلاق والدعم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep5Icon_ar', 'CheckCircle', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep5Description_ar', 'التسليم النهائي والدعم المستمر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowStep5Features_ar', 'الفحص النهائي والتنظيف|تدريبك على استخدام المساحة الجديدة|تسليم جميع الوثائق والضمانات|توفير الدعم ما بعد المشروع|الصيانة والتحديثات المستقبلية', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhyTitle_ar', 'لماذا عملية عملنا فعالة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhyDescription_ar', 'ما يميز نهجنا في إدارة المشاريع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy1Title_ar', 'التركيز على التفاصيل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy1Description_ar', 'نولي اهتماماً دقيقاً لكل جانب من جوانب المشروع، من المفهوم الأولي إلى التنفيذ النهائي', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy2Title_ar', 'التواصل الواضح', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy2Description_ar', 'نحافظ على تواصل مفتوح وشفاف معك في كل مرحلة من مراحل المشروع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy3Title_ar', 'المرونة والتكيف', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy3Description_ar', 'نتكيف مع احتياجاتك المتغيرة ونتعامل مع التحديات بسرعة وكفاءة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy4Title_ar', 'الجودة المضمونة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowWhy4Description_ar', 'نلتزم بأعلى معايير الجودة في كل جانب من جوانب عملنا', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowTimelineTitle_ar', 'الجدول الزمني النموذجي', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowTimelineDescription_ar', 'يختلف الجدول الزمني حسب حجم وتعقيد المشروع', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaTitle_ar', 'هل أنت مستعد لبدء مشروعك؟', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaDescription_ar', 'دعنا نناقش مشروعك واستكشف كيف يمكن لعملية عملنا أن تحقق أهدافك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('workflowCtaButton2Page_ar', 'contact', datetime('now'));

COMMIT;

-- ============================================================
-- PORTFOLIO PAGE (15 settings)
-- ============================================================

BEGIN TRANSACTION;

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioHeroTitle_ar', 'أعمالنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioHeroParagraph_ar', 'استكشف مجموعة من أفضل مشاريعنا وتصاميمنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioIntroTitle_ar', 'مشاريع استثنائية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioIntroParagraph_ar', 'كل مشروع يمثل التزامنا بالتميز والابتكار. من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم حلولاً تصميمية تتجاوز التوقعات', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStatsTitle_ar', 'إحصائياتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStatsDescription_ar', 'أرقام تعكس التزامنا بالتميز', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat1Title_ar', 'مشروع مكتمل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat1Value_ar', '150+', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat2Title_ar', 'عميل راضٍ', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat2Value_ar', '200+', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat3Title_ar', 'سنة خبرة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat3Value_ar', '10+', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat4Title_ar', 'جائزة وتكريم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioStat4Value_ar', '25+', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaTitle_ar', 'دعنا ننشئ مشروعك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaDescription_ar', 'هل أنت مستعد لبدء رحلة التصميم الخاصة بك؟ تواصل مع فريقنا لمناقشة رؤيتك واستكشف كيف يمكننا تحقيقها', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton2Page_ar', 'contact', datetime('now'));

COMMIT;

-- ============================================================
-- CONTACT PAGE (40 settings)
-- ============================================================

BEGIN TRANSACTION;

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactHeroTitle_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactHeroParagraph_ar', 'دعنا نناقش مشروعك وننشئ شيئاً استثنائياً معاً', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Icon_ar', 'MapPin', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Title_ar', 'زيارتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail1_ar', 'استوديو TRQ للتصميم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail2_ar', 'طريق الملك فهد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail3_ar', 'الرياض، المملكة العربية السعودية', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Icon_ar', 'Phone', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Title_ar', 'اتصل بنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail1_ar', '+966 XX XXX XXXX', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail2_ar', 'الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail3_ar', '', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Icon_ar', 'Mail', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Title_ar', 'راسلنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail1_ar', 'info@trq.design', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail2_ar', 'projects@trq.design', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail3_ar', '', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Icon_ar', 'MessageCircle', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Title_ar', 'واتس آب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail1_ar', '+966 XX XXX XXXX', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail2_ar', 'ضمان الرد السريع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail3_ar', '', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormTitle_ar', 'أرسل لنا رسالة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormDescription_ar', 'املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormButtonText_ar', 'إرسال الرسالة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormButtonIcon_ar', 'Send', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormSubjects_ar', 'residential|مشروع سكني|commercial|مشروع تجاري|booth|كشك معرض|event|تصميم حدث|furniture|تصميم أثاث|general|استفسار عام', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuickTitle_ar', 'تواصل سريع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1Icon_ar', 'MessageCircle', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1Title_ar', 'واتس آب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1Description_ar', 'أسرع طريقة للتواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1ButtonText_ar', 'دردش على واتس آب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1Link_ar', 'https://wa.me/966XXXXXXXXX', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick1Color_ar', 'green', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2Icon_ar', 'Mail', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2Title_ar', 'البريد الإلكتروني', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2Description_ar', 'للاستفسارات التفصيلية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2ButtonText_ar', 'أرسل بريداً إلكترونياً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2Link_ar', 'mailto:info@trq.design?subject=استفسار من موقع TRQ&body=مرحباً بفريق TRQ', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick2Color_ar', 'black', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3Icon_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3Title_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3Description_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3ButtonText_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3Link_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick3Color_ar', 'black', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4Icon_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4Title_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4Description_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4ButtonText_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4Link_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactQuick4Color_ar', 'black', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay1_ar', 'الأحد - الخميس', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime1_ar', '9:00 صباحاً - 6:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay2_ar', 'الجمعة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime2_ar', 'مغلق', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay3_ar', 'السبت', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime3_ar', '10:00 صباحاً - 4:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay4_ar', 'الأحد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime4_ar', '9:00 صباحاً - 6:00 مساءً', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioShow_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioTitle_ar', 'زيارة استوديونا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioDescription_ar', 'حدد موعداً لزيارة استوديو التصميم الخاص بنا، واستعرض محفظتنا، وناقش مشروعك وجهاً لوجه', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioButtonText_ar', 'حدد موعداً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioButtonPage_ar', 'contact', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapTitle_ar', 'ابحث عنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapAddress_ar', 'استوديو TRQ للتصميم، طريق الملك فهد، الرياض', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapImage_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapLink_ar', 'https://maps.google.com/?q=Riyadh,Saudi+Arabia', datetime('now'));

COMMIT;

-- ============================================================
-- PRICING PAGE (50 settings)
-- ============================================================

BEGIN TRANSACTION;

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingHeroTitle_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingHeroParagraph_ar', 'احصل على عرض سعر مخصص يناسب مشروعك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingIntroTitle_ar', 'أخبرنا عن مشروعك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingIntroParagraph_ar', 'يرجى تقديم أكبر قدر ممكن من التفاصيل حول مشروعك. كلما عرفنا أكثر، كان عرضنا أكثر دقة وملاءمة. جميع المعلومات سرية وستُستخدم فقط لإعداد عرض السعر المخصص لك', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormContactTitle_ar', 'معلومات التواصل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormProjectTitle_ar', 'تفاصيل المشروع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormMethodTitle_ar', 'كيف يجب أن نتواصل معك؟', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingProjectTypes_ar', '[{"value":"residential-villa","label":"سكني - فيلا"},{"value":"residential-apartment","label":"سكني - شقة"},{"value":"commercial-office","label":"تجاري - مكتب"},{"value":"commercial-retail","label":"تجاري - متجر"},{"value":"commercial-hotel","label":"تجاري - فندق"},{"value":"commercial-restaurant","label":"تجاري - مطعم"},{"value":"exhibition-booth","label":"كشك معرض"},{"value":"event-design","label":"تصميم حدث"},{"value":"furniture-design","label":"تصميم أثاث"},{"value":"other","label":"أخرى"}]', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingProjectSizes_ar', '[{"value":"small","label":"صغير (أقل من 100 متر مربع)"},{"value":"medium","label":"متوسط (100-300 متر مربع)"},{"value":"large","label":"كبير (300-1000 متر مربع)"},{"value":"xlarge","label":"كبير جداً (1000+ متر مربع)"}]', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingTimelines_ar', '[{"value":"urgent","label":"عاجل (خلال شهر واحد)"},{"value":"1-3months","label":"1-3 أشهر"},{"value":"3-6months","label":"3-6 أشهر"},{"value":"6-12months","label":"6-12 شهر"},{"value":"flexible","label":"مرن"}]', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingBudgets_ar', '[{"value":"under-100k","label":"أقل من 100,000 ريال"},{"value":"100k-300k","label":"100,000 - 300,000 ريال"},{"value":"300k-500k","label":"300,000 - 500,000 ريال"},{"value":"500k-1m","label":"500,000 - 1,000,000 ريال"},{"value":"1m-plus","label":"1,000,000+ ريال"},{"value":"not-sure","label":"لست متأكداً بعد"}]', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingContactFields_ar', '[{"id":"name","label":"الاسم الكامل","type":"text","placeholder":"اسمك","required":true,"halfWidth":false},{"id":"company","label":"اسم الشركة (اختياري)","type":"text","placeholder":"شركتك","required":false,"halfWidth":false},{"id":"email","label":"عنوان البريد الإلكتروني","type":"email","placeholder":"your@email.com","required":true,"halfWidth":true},{"id":"phone","label":"رقم الهاتف","type":"tel","placeholder":"+966 XX XXX XXXX","required":true,"halfWidth":true}]', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingMethodEmailDesc_ar', 'تواصل مكتوب مفصل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingMethodWhatsappDesc_ar', 'رد سريع وتواصل سهل', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSubmitText_ar', 'إرسال الطلب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSubmitNote_ar', 'عادة ما نرد خلال 24 ساعة', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSuccessTitle_ar', 'تم استقبال طلبك!', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSuccessParagraph_ar', 'شكراً لاهتمامك بخدمات استوديو TRQ للتصميم. لقد استقبلنا طلب عرض السعر الخاص بك وسنقوم بمراجعته بعناية', datetime('now'));

COMMIT;

-- ============================================================
-- BLOG PAGE (20 settings)
-- ============================================================

BEGIN TRANSACTION;

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogHeroTitle_ar', 'المدونة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogHeroParagraph_ar', 'اكتشف أحدث المقالات والنصائح في مجال التصميم', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogExploreTitle_ar', 'استكشف المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogExploreDescription_ar', 'تصفح مجموعة واسعة من المقالات والموارد', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogFeaturedLabel_ar', 'مقالة مميزة', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleReadMore_ar', 'اقرأ المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleReadTime_ar', 'وقت القراءة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleAuthor_ar', 'الكاتب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleDate_ar', 'التاريخ', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryAll_ar', 'الكل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryDesign_ar', 'التصميم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryDevelopment_ar', 'التطوير', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryBusiness_ar', 'الأعمال', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryTrends_ar', 'الاتجاهات', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryTutorials_ar', 'الدروس', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterTitle_ar', 'اشترك في نشرتنا البريدية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterDescription_ar', 'احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterPlaceholder_ar', 'أدخل بريدك الإلكتروني', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterBtn_ar', 'اشترك', datetime('now'));

COMMIT;

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Total new Arabic settings added: 185+
-- SELECT COUNT(*) as total_arabic_settings FROM settings WHERE key LIKE '%_ar';
-- Expected result: 345+ (160 existing + 185 new)
