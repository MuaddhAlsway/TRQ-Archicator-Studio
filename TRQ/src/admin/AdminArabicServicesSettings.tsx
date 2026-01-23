import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, X } from 'lucide-react';
import * as api from '../api';

export function AdminArabicServicesSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'intro' | 'highlights' | 'cta'>('hero');

  const [settings, setSettings] = useState({
    // Hero Section
    servicesHeroTitle_ar: 'خدماتنا',
    servicesHeroParagraph_ar: 'حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك',

    // Introduction Section
    servicesTitle_ar: 'حلول تصميمية متكاملة',
    servicesDescription_ar: 'من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى، نقدم مجموعة شاملة من خدمات التصميم الداخلي والخارجي',

    // Highlights Section
    servicesHighlightsTitle_ar: 'مميزات خدماتنا',
    servicesHighlightsDescription_ar: 'ما يمكنك توقعه عند التعامل مع TRQ',
    servicesHighlight1Title_ar: 'حلول مخصصة',
    servicesHighlight1Description_ar: 'كل مشروع فريد. نقوم بإنشاء تصاميم مخصصة تعكس احتياجاتك وتفضيلاتك ورؤيتك الخاصة',
    servicesHighlight2Title_ar: 'خدمة شاملة',
    servicesHighlight2Description_ar: 'من الاستشارة الأولية إلى التثبيت النهائي، نتولى كل التفاصيل لضمان تجربة سلسة',
    servicesHighlight3Title_ar: 'جودة عالية',
    servicesHighlight3Description_ar: 'نختار أفضل المواد ونعمل مع حرفيين ماهرين لتقديم نتائج استثنائية',

    // CTA Section
    servicesCtaTitle_ar: 'هل أنت مستعد للبدء؟',
    servicesCtaDescription_ar: 'دعنا نناقش مشروعك واستكشف كيف يمكن لخدماتنا أن تحقق رؤيتك',
    servicesCtaButton1Text_ar: 'اطلب عرض سعر',
    servicesCtaButton1Page_ar: 'pricing',
    servicesCtaButton2Text_ar: 'تواصل معنا',
    servicesCtaButton2Page_ar: 'contact',
  });

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to reset settings:', error);
    } finally {
      setLoading(false);
    }
  };

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
    { id: 'hero' as const, label: 'قسم البطل' },
    { id: 'intro' as const, label: 'قسم المقدمة' },
    { id: 'highlights' as const, label: 'قسم المميزات' },
    { id: 'cta' as const, label: 'قسم الدعوة للعمل' },
  ];

  if (loading) {
    return <div className="p-8 text-center">جاري التحميل...</div>;
  }

  return (
    <div className="w-full" dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إعدادات صفحة الخدمات</h1>
        <p className="text-gray-600">قم بتخصيص جميع محتويات صفحة الخدمات باللغة العربية</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeTab === 'hero' && (
        <div className="space-y-6 bg-white p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">قسم البطل</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">عنوان البطل</label>
            <input
              type="text"
              value={settings.servicesHeroTitle_ar}
              onChange={(e) => setSettings({ ...settings, servicesHeroTitle_ar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="أدخل عنوان البطل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">فقرة البطل</label>
            <textarea
              value={settings.servicesHeroParagraph_ar}
              onChange={(e) => setSettings({ ...settings, servicesHeroParagraph_ar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              placeholder="أدخل فقرة البطل"
            />
          </div>
        </div>
      )}

      {/* Introduction Section */}
      {activeTab === 'intro' && (
        <div className="space-y-6 bg-white p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">قسم المقدمة</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">عنوان القسم</label>
            <input
              type="text"
              value={settings.servicesTitle_ar}
              onChange={(e) => setSettings({ ...settings, servicesTitle_ar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="أدخل عنوان القسم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">وصف القسم</label>
            <textarea
              value={settings.servicesDescription_ar}
              onChange={(e) => setSettings({ ...settings, servicesDescription_ar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              rows={4}
              placeholder="أدخل وصف القسم"
            />
          </div>
        </div>
      )}

      {/* Highlights Section */}
      {activeTab === 'highlights' && (
        <div className="space-y-6 bg-white p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">قسم المميزات</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">عنوان القسم</label>
            <input
              type="text"
              value={settings.servicesHighlightsTitle_ar}
              onChange={(e) => setSetti
