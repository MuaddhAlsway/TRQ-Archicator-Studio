-- Missing Arabic Settings - Part 3: Portfolio Page
-- Generated: 2026-01-18

BEGIN TRANSACTION;

-- Portfolio Page - Hero Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioHeroTitle_ar', 'أعمالنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioHeroParagraph_ar', 'استكشف مجموعة من أفضل مشاريعنا وتصاميمنا', datetime('now'));

-- Portfolio Page - Introduction Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioIntroTitle_ar', 'مشاريع استثنائية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioIntroParagraph_ar', 'كل مشروع يمثل التزامنا بالتميز والابتكار. من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم حلولاً تصميمية تتجاوز التوقعات', datetime('now'));

-- Portfolio Page - Stats Section
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

-- Portfolio Page - CTA Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaTitle_ar', 'دعنا ننشئ مشروعك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaDescription_ar', 'هل أنت مستعد لبدء رحلة التصميم الخاصة بك؟ تواصل مع فريقنا لمناقشة رؤيتك واستكشف كيف يمكننا تحقيقها', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('portfolioCtaButton2Page_ar', 'contact', datetime('now'));

COMMIT;
