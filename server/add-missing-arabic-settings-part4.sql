-- Missing Arabic Settings - Part 4: Contact Page
-- Generated: 2026-01-18

BEGIN TRANSACTION;

-- Contact Page - Hero Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactHeroTitle_ar', 'تواصل معنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactHeroParagraph_ar', 'دعنا نناقش مشروعك وننشئ شيئاً استثنائياً معاً', datetime('now'));

-- Contact Page - Contact Info Section 1
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Icon_ar', 'MapPin', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Title_ar', 'زيارتنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail1_ar', 'استوديو TRQ للتصميم', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail2_ar', 'طريق الملك فهد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo1Detail3_ar', 'الرياض، المملكة العربية السعودية', datetime('now'));

-- Contact Page - Contact Info Section 2
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Icon_ar', 'Phone', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Title_ar', 'اتصل بنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail1_ar', '+966 XX XXX XXXX', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail2_ar', 'الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo2Detail3_ar', '', datetime('now'));

-- Contact Page - Contact Info Section 3
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Icon_ar', 'Mail', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Title_ar', 'راسلنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail1_ar', 'info@trq.design', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail2_ar', 'projects@trq.design', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo3Detail3_ar', '', datetime('now'));

-- Contact Page - Contact Info Section 4
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Show_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Icon_ar', 'MessageCircle', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Title_ar', 'واتس آب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail1_ar', '+966 XX XXX XXXX', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail2_ar', 'ضمان الرد السريع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactInfo4Detail3_ar', '', datetime('now'));

-- Contact Page - Form Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormTitle_ar', 'أرسل لنا رسالة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormDescription_ar', 'املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormButtonText_ar', 'إرسال الرسالة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormButtonIcon_ar', 'Send', datetime('now'));

-- Contact Page - Form Subjects
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactFormSubjects_ar', 'residential|مشروع سكني|commercial|مشروع تجاري|booth|كشك معرض|event|تصميم حدث|furniture|تصميم أثاث|general|استفسار عام', datetime('now'));

-- Contact Page - Quick Contact Section
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

-- Contact Page - Office Hours
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay1_ar', 'الأحد - الخميس', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime1_ar', '9:00 صباحاً - 6:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay2_ar', 'الجمعة', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime2_ar', 'مغلق', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay3_ar', 'السبت', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime3_ar', '10:00 صباحاً - 4:00 مساءً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursDay4_ar', 'الأحد', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactOfficeHoursTime4_ar', '9:00 صباحاً - 6:00 مساءً', datetime('now'));

-- Contact Page - Visit Studio
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioShow_ar', 'true', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioTitle_ar', 'زيارة استوديونا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioDescription_ar', 'حدد موعداً لزيارة استوديو التصميم الخاص بنا، واستعرض محفظتنا، وناقش مشروعك وجهاً لوجه', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioButtonText_ar', 'حدد موعداً', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactStudioButtonPage_ar', 'contact', datetime('now'));

-- Contact Page - Map
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapTitle_ar', 'ابحث عنا', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapAddress_ar', 'استوديو TRQ للتصميم، طريق الملك فهد، الرياض', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapImage_ar', '', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('contactMapLink_ar', 'https://maps.google.com/?q=Riyadh,Saudi+Arabia', datetime('now'));

COMMIT;
