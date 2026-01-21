-- Missing Arabic Settings - Part 1: Services Page
-- Generated: 2026-01-18

BEGIN TRANSACTION;

-- Services Page - Hero Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHeroTitle_ar', 'خدماتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHeroParagraph_ar', 'حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك', datetime('now'));

-- Services Page - Introduction Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesTitle_ar', 'حلول تصميمية متكاملة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesDescription_ar', 'من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم مجموعة شاملة من خدمات التصميم الداخلي والخارجي', datetime('now'));

-- Services Page - Highlights Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlightsTitle_ar', 'مميزات خدماتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlightsDescription_ar', 'ما يمكنك توقعه عند التعامل مع TRQ', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight1Title_ar', 'حلول مخصصة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight1Description_ar', 'كل مشروع فريد. نقوم بإنشاء تصاميم مخصصة تعكس احتياجاتك وتفضيلاتك ورؤيتك الخاصة', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight2Title_ar', 'خدمة شاملة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight2Description_ar', 'من الاستشارة الأولية إلى التثبيت النهائي، نتولى كل التفاصيل لضمان تجربة سلسة', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight3Title_ar', 'جودة عالية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesHighlight3Description_ar', 'نختار أفضل المواد ونعمل مع حرفيين ماهرين لتقديم نتائج استثنائية', datetime('now'));

-- Services Page - CTA Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaTitle_ar', 'هل أنت مستعد للبدء؟', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaDescription_ar', 'دعنا نناقش مشروعك واستكشف كيف يمكن لخدماتنا أن تحقق رؤيتك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('servicesCtaButton2Page_ar', 'contact', datetime('now'));

COMMIT;
