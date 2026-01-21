-- Missing Arabic Settings - Part 6: Blog Page & Additional Settings
-- Generated: 2026-01-18

BEGIN TRANSACTION;

-- Blog Page - Hero Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogHeroTitle_ar', 'المدونة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogHeroParagraph_ar', 'اكتشف أحدث المقالات والنصائح في مجال التصميم', datetime('now'));

-- Blog Page - Explore Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogExploreTitle_ar', 'استكشف المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogExploreDescription_ar', 'تصفح مجموعة واسعة من المقالات والموارد', datetime('now'));

-- Blog Page - Featured Label
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogFeaturedLabel_ar', 'مقالة مميزة', datetime('now'));

-- Blog Page - Article Labels
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleReadMore_ar', 'اقرأ المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleReadTime_ar', 'وقت القراءة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleAuthor_ar', 'الكاتب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogArticleDate_ar', 'التاريخ', datetime('now'));

-- Blog Page - Categories
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryAll_ar', 'الكل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryDesign_ar', 'التصميم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryDevelopment_ar', 'التطوير', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryBusiness_ar', 'الأعمال', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryTrends_ar', 'الاتجاهات', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogCategoryTutorials_ar', 'الدروس', datetime('now'));

-- Blog Page - Newsletter
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterTitle_ar', 'اشترك في نشرتنا البريدية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterDescription_ar', 'احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterPlaceholder_ar', 'أدخل بريدك الإلكتروني', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('blogNewsletterBtn_ar', 'اشترك', datetime('now'));

-- Home Page - Additional Settings (if missing)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeIntroLinkText_ar', 'تعرف على المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeIntroLinkPage_ar', 'about', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeIntroImage_ar', 'https://images.unsplash.com/photo-1669387448840-610c588f003d', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeFeaturedProjects_ar', '', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeWorkflowLinkText_ar', 'تعرف على المزيد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeWorkflowLinkPage_ar', 'workflow', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeCtaButton1Text_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeCtaButton1Page_ar', 'pricing', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeCtaButton2Text_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('homeCtaButton2Page_ar', 'contact', datetime('now'));

-- About Page - Additional Settings (if missing)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhoWeAreImage_ar', 'https://images.unsplash.com/photo-1669387448840-610c588f003d', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutVisionIcon_ar', 'Eye', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutMissionIcon_ar', 'Target', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutValue1Icon_ar', 'Award', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutValue2Icon_ar', 'Lightbulb', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutValue3Icon_ar', 'Users', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutValue4Icon_ar', 'Heart', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhyTitle_ar', 'لماذا تختار TRQ', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhyDescription_ar', 'ما يميزنا في عالم التصميم الداخلي الفاخر', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy1Title_ar', 'التركيز على الفخامة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy1Description_ar', 'متخصصون في المشاريع السكنية والتجارية عالية المستوى التي تتطلب أفضل الحرفية', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy2Title_ar', 'نهج شامل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy2Description_ar', 'من المفهوم إلى الإنجاز، نتولى كل جانب من جوانب مشروعك برعاية دقيقة', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy3Title_ar', 'الحساسية الثقافية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy3Description_ar', 'فهم عميق للثقافة السعودية مدمج مع وجهات نظر تصميمية عالمية', datetime('now'));

INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy4Title_ar', 'سجل حافل بالإنجازات', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutWhy4Description_ar', 'نجحنا في تسليم مشاريع فاخرة عبر القطاعات السكنية والتجارية والمعارض', datetime('now'));

-- About Page - Impact Statement
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutImpactTitle_ar', 'تأثيرنا على العملاء', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutImpactParagraph1_ar', 'لا نقتصر على تصميم المساحات فقط - نحول الطريقة التي يعيش بها عملاؤنا ويعملون بها ويختبرون بيئاتهم. من خلال التصميم المدروس والتنفيذ الدقيق والالتزام الثابت بالجودة، ننشئ مساحات تلهم وتريح وترفع من جودة الحياة اليومية', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('aboutImpactParagraph2_ar', 'كل مشروع هو فرصة لإحداث تأثير إيجابي دائم، ونأخذ هذه المسؤولية على محمل الجد. يُقاس نجاحنا ليس فقط بالمشاريع المكتملة، بل برضا وسعادة عملائنا', datetime('now'));

COMMIT;
