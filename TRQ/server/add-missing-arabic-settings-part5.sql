-- Missing Arabic Settings - Part 5: Pricing Page
-- Generated: 2026-01-18

BEGIN TRANSACTION;

-- Pricing Page - Hero Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingHeroTitle_ar', 'اطلب عرض سعر', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingHeroParagraph_ar', 'احصل على عرض سعر مخصص يناسب مشروعك', datetime('now'));

-- Pricing Page - Introduction Section
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingIntroTitle_ar', 'أخبرنا عن مشروعك', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingIntroParagraph_ar', 'يرجى تقديم أكبر قدر ممكن من التفاصيل حول مشروعك. كلما عرفنا أكثر، كان عرضنا أكثر دقة وملاءمة. جميع المعلومات سرية وستُستخدم فقط لإعداد عرض السعر المخصص لك', datetime('now'));

-- Pricing Page - Form Section Titles
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormContactTitle_ar', 'معلومات التواصل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormProjectTitle_ar', 'تفاصيل المشروع', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingFormMethodTitle_ar', 'كيف يجب أن نتواصل معك؟', datetime('now'));

-- Pricing Page - Project Types (JSON array)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingProjectTypes_ar', '[{"value":"residential-villa","label":"سكني - فيلا"},{"value":"residential-apartment","label":"سكني - شقة"},{"value":"commercial-office","label":"تجاري - مكتب"},{"value":"commercial-retail","label":"تجاري - متجر"},{"value":"commercial-hotel","label":"تجاري - فندق"},{"value":"commercial-restaurant","label":"تجاري - مطعم"},{"value":"exhibition-booth","label":"كشك معرض"},{"value":"event-design","label":"تصميم حدث"},{"value":"furniture-design","label":"تصميم أثاث"},{"value":"other","label":"أخرى"}]', datetime('now'));

-- Pricing Page - Project Sizes (JSON array)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingProjectSizes_ar', '[{"value":"small","label":"صغير (أقل من 100 متر مربع)"},{"value":"medium","label":"متوسط (100-300 متر مربع)"},{"value":"large","label":"كبير (300-1000 متر مربع)"},{"value":"xlarge","label":"كبير جداً (1000+ متر مربع)"}]', datetime('now'));

-- Pricing Page - Timeline Options (JSON array)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingTimelines_ar', '[{"value":"urgent","label":"عاجل (خلال شهر واحد)"},{"value":"1-3months","label":"1-3 أشهر"},{"value":"3-6months","label":"3-6 أشهر"},{"value":"6-12months","label":"6-12 شهر"},{"value":"flexible","label":"مرن"}]', datetime('now'));

-- Pricing Page - Budget Ranges (JSON array)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingBudgets_ar', '[{"value":"under-100k","label":"أقل من 100,000 ريال"},{"value":"100k-300k","label":"100,000 - 300,000 ريال"},{"value":"300k-500k","label":"300,000 - 500,000 ريال"},{"value":"500k-1m","label":"500,000 - 1,000,000 ريال"},{"value":"1m-plus","label":"1,000,000+ ريال"},{"value":"not-sure","label":"لست متأكداً بعد"}]', datetime('now'));

-- Pricing Page - Contact Form Fields (JSON array)
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingContactFields_ar', '[{"id":"name","label":"الاسم الكامل","type":"text","placeholder":"اسمك","required":true,"halfWidth":false},{"id":"company","label":"اسم الشركة (اختياري)","type":"text","placeholder":"شركتك","required":false,"halfWidth":false},{"id":"email","label":"عنوان البريد الإلكتروني","type":"email","placeholder":"your@email.com","required":true,"halfWidth":true},{"id":"phone","label":"رقم الهاتف","type":"tel","placeholder":"+966 XX XXX XXXX","required":true,"halfWidth":true}]', datetime('now'));

-- Pricing Page - Contact Method Descriptions
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingMethodEmailDesc_ar', 'تواصل مكتوب مفصل', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingMethodWhatsappDesc_ar', 'رد سريع وتواصل سهل', datetime('now'));

-- Pricing Page - Submit Button
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSubmitText_ar', 'إرسال الطلب', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSubmitNote_ar', 'عادة ما نرد خلال 24 ساعة', datetime('now'));

-- Pricing Page - Success Message
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSuccessTitle_ar', 'تم استقبال طلبك!', datetime('now'));
INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES ('pricingSuccessParagraph_ar', 'شكراً لاهتمامك بخدمات استوديو TRQ للتصميم. لقد استقبلنا طلب عرض السعر الخاص بك وسنقوم بمراجعته بعناية', datetime('now'));

COMMIT;
