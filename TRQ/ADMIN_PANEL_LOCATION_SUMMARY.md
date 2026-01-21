# Admin Panel - Location & Component Summary

## 🎯 Quick Answer

### Where is the Admin Panel?
```
📁 src/admin/AdminSettingsArabic.tsx
```

### What Component Manages It?
```
Component: AdminSettingsArabic
File: src/admin/AdminSettingsArabic.tsx
Type: React Functional Component
Purpose: Manage all Arabic site settings
```

---

## 📍 Complete File Structure

```
your-project/
│
├── src/
│   │
│   ├── admin/                                    ← ADMIN PANEL HERE
│   │   │
│   │   ├── Admin.tsx                            (Main router)
│   │   ├── AdminLayout.tsx                      (Sidebar layout)
│   │   ├── AdminLogin.tsx                       (Login page)
│   │   ├── AdminContext.tsx                     (State management)
│   │   ├── AdminDashboard.tsx                   (Dashboard)
│   │   │
│   │   ├── AdminSettings.tsx                    (English settings)
│   │   ├── AdminSettingsArabic.tsx              ⭐ ARABIC SETTINGS
│   │   ├── AdminArabicSettings.tsx              (Individual editor)
│   │   ├── AdminArabicSettingsComplete.tsx      (Template)
│   │   ├── AdminArabicSettingsPage.tsx          (Wrapper)
│   │   │
│   │   ├── AdminHome.tsx                        (Home editor)
│   │   ├── AdminServices.tsx                    (Services editor)
│   │   ├── AdminProjects.tsx                    (Projects editor)
│   │   ├── AdminBlog.tsx                        (Blog editor)
│   │   ├── AdminSlides.tsx                      (Slides editor)
│   │   ├── AdminPricing.tsx                     (Pricing editor)
│   │   │
│   │   ├── AdminArabicBlog.tsx                  (Arabic blog)
│   │   ├── AdminArabicProjects.tsx              (Arabic projects)
│   │   ├── AdminArabicServices.tsx              (Arabic services)
│   │   ├── AdminArabicSlides.tsx                (Arabic slides)
│   │   ├── AdminArabicPanel.tsx                 (Arabic panel)
│   │   │
│   │   ├── ArticleEditor.tsx                    (Rich text editor)
│   │   ├── ProjectEditor.tsx                    (Project editor)
│   │   ├── BilingualEditor.tsx                  (Bilingual editor)
│   │   ├── ConfirmModal.tsx                     (Confirmation dialog)
│   │   ├── AdminAccount.tsx                     (Account settings)
│   │   └── types.ts                             (Type definitions)
│   │
│   ├── components/
│   │   ├── Services.tsx                         (Uses Arabic settings)
│   │   ├── Workflow.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Contact.tsx
│   │   ├── Pricing.tsx
│   │   └── Blog.tsx
│   │
│   ├── context/
│   │   ├── AdminContext.tsx                     (Admin context)
│   │   └── LanguageContext.tsx                  (Language context)
│   │
│   ├── api/
│   │   └── index.ts                             (API calls)
│   │
│   └── ...
│
├── server/
│   ├── index.js                                 (Backend API)
│   ├── database.js                              (Database setup)
│   ├── trq.db                                   (SQLite database)
│   └── ...
│
└── ...
```

---

## 🔍 AdminSettingsArabic.tsx Details

### File Location
```
src/admin/AdminSettingsArabic.tsx
```

### Component Name
```typescript
export function AdminSettingsArabic() { ... }
```

### What It Does
1. **Manages 364 Arabic settings** for all pages
2. **Provides 11 tabs** for different pages
3. **Loads settings** from database on mount
4. **Saves settings** to database when user clicks Save
5. **Displays form fields** for editing each setting

### Key Features
- ✅ RTL (Right-to-Left) support
- ✅ Language-specific settings
- ✅ Database persistence
- ✅ Real-time updates
- ✅ Fallback to English if Arabic missing

---

## 📋 Tab Structure

### Current Tabs in AdminSettingsArabic.tsx

```typescript
const tabs = [
  { id: 'home-intro', label: 'المقدمة' },                    // Home - Introduction
  { id: 'home-featured', label: 'المشاريع المميزة' },        // Home - Featured Projects
  { id: 'home-workflow', label: 'كيف نعمل' },               // Home - How We Work
  { id: 'home-cta', label: 'قسم الدعوة للعمل' },            // Home - CTA
  { id: 'about', label: 'صفحة حول' },                       // About Page
  { id: 'services', label: 'صفحة الخدمات' },                // Services Page ⭐
  { id: 'workflow', label: 'صفحة سير العمل' },              // Workflow Page
  { id: 'portfolio', label: 'صفحة المحفظة' },               // Portfolio Page
  { id: 'contact', label: 'صفحة الاتصال' },                 // Contact Page
  { id: 'pricing', label: 'صفحة التسعير' },                 // Pricing Page
  { id: 'blog', label: 'صفحة المدونة' },                    // Blog Page
];
```

---

## 🔗 How It Connects to Services.tsx

### Flow

```
AdminSettingsArabic.tsx (Admin Panel)
    ↓
User edits: servicesHeroTitle_ar = "خدماتنا"
    ↓
Click Save
    ↓
api.updateSettings()
    ↓
Database updated
    ↓
Services.tsx (Frontend Component)
    ↓
useEffect(() => {
  api.getSettings().then(data => {
    setSettings(data.servicesHeroTitle_ar)
  })
})
    ↓
Display: <h1>{settings.servicesHeroTitle}</h1>
    ↓
Shows: "خدماتنا"
```

---

## 🚀 How to Access Admin Panel

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Navigate to Admin
```
http://localhost:5173/admin
```

### Step 3: Login
- Enter admin credentials
- You'll see the dashboard

### Step 4: Go to Arabic Settings
- Click **"Site Settings (Ar)"** in sidebar
- This opens **AdminSettingsArabic.tsx**

### Step 5: Select Services Tab
- Click **"صفحة الخدمات"** tab
- See form fields for Services settings (once UI is added)

---

## 📊 Database Connection

### Settings Table
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updatedAt DATETIME
);
```

### How AdminSettingsArabic.tsx Uses It

```typescript
// Load settings from database
useEffect(() => {
  api.getSettings().then((data) => {
    setSettings(prev => ({ ...prev, ...data }));
  });
}, []);

// Save settings to database
const handleSave = async () => {
  await api.updateSettings(settings);
};
```

### API Endpoints

```typescript
// GET all settings
GET /api/settings
Response: { servicesHeroTitle_ar: "خدماتنا", ... }

// UPDATE settings
PUT /api/settings
Body: { servicesHeroTitle_ar: "خدماتنا الجديدة" }
```

---

## 🎯 Services Settings in Database

### All 20 Services Settings

```
1. servicesHeroTitle_ar
2. servicesHeroParagraph_ar
3. servicesTitle_ar
4. servicesDescription_ar
5. servicesHighlightsTitle_ar
6. servicesHighlightsDescription_ar
7. servicesHighlight1Title_ar
8. servicesHighlight1Description_ar
9. servicesHighlight2Title_ar
10. servicesHighlight2Description_ar
11. servicesHighlight3Title_ar
12. servicesHighlight3Description_ar
13. servicesCtaTitle_ar
14. servicesCtaDescription_ar
15. servicesCtaButton1Text_ar
16. servicesCtaButton1Page_ar
17. servicesCtaButton2Text_ar
18. servicesCtaButton2Page_ar
```

### Current Values in Database

```sql
servicesHeroTitle_ar = 'خدماتنا'
servicesHeroParagraph_ar = 'حلول تصميمية شاملة مصممة خصيصاً لاحتياجاتك'
servicesTitle_ar = 'حلول تصميمية متكاملة'
servicesDescription_ar = 'من المساحات السكنية الفاخرة إلى المشاريع التجارية الكبرى...'
servicesHighlightsTitle_ar = 'مميزات خدماتنا'
servicesHighlightsDescription_ar = 'ما يمكنك توقعه عند التعامل مع TRQ'
servicesHighlight1Title_ar = 'حلول مخصصة'
servicesHighlight1Description_ar = 'كل مشروع فريد. نقوم بإنشاء تصاميم مخصصة'
servicesHighlight2Title_ar = 'خدمة شاملة'
servicesHighlight2Description_ar = 'من الاستشارة الأولية إلى التثبيت النهائي'
servicesHighlight3Title_ar = 'جودة عالية'
servicesHighlight3Description_ar = 'نختار أفضل المواد ونعمل مع حرفيين ماهرين'
servicesCtaTitle_ar = 'هل أنت مستعد للبدء؟'
servicesCtaDescription_ar = 'دعنا نناقش مشروعك واستكشف كيف يمكن لخدماتنا أن تحقق رؤيتك'
servicesCtaButton1Text_ar = 'اطلب عرض سعر'
servicesCtaButton1Page_ar = 'pricing'
servicesCtaButton2Text_ar = 'تواصل معنا'
servicesCtaButton2Page_ar = 'contact'
```

---

## ✅ Implementation Status

### What's Done ✅
- [x] Database: All 190 Arabic settings added
- [x] AdminSettingsArabic.tsx: Tab structure ready
- [x] Services.tsx: Updated to use Arabic settings
- [x] API: Settings load/save working
- [x] Database: All 20 Services settings in database

### What's Needed ⏳
- [ ] AdminSettingsArabic.tsx: Add form fields for Services tab
- [ ] AdminSettingsArabic.tsx: Add form fields for other tabs

---

## 🎨 Form Field Example

### How to Add Form Fields to Services Tab

```typescript
{activeTab === 'services' && (
  <div className="space-y-6">
    {/* Hero Section */}
    <div>
      <label className="block text-sm font-medium mb-2">عنوان البطل</label>
      <input
        type="text"
        value={settings.servicesHeroTitle_ar}
        onChange={(e) => handleSettingChange('servicesHeroTitle_ar', e.target.value)}
        className="w-full px-4 py-2 border rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">فقرة البطل</label>
      <textarea
        value={settings.servicesHeroParagraph_ar}
        onChange={(e) => handleSettingChange('servicesHeroParagraph_ar', e.target.value)}
        className="w-full px-4 py-2 border rounded"
        rows={3}
      />
    </div>

    {/* Add more fields for other settings */}
  </div>
)}
```

---

## 📞 Summary

### Admin Panel Location
```
📁 src/admin/AdminSettingsArabic.tsx
```

### Component
```
Component: AdminSettingsArabic
Type: React Functional Component
Purpose: Manage 364 Arabic site settings
```

### Access
```
URL: http://localhost:5173/admin
Path: Admin → Site Settings (Ar) → Services Tab
```

### Status
```
Database: ✅ Ready (364 settings)
Component: ✅ Ready (Services.tsx uses settings)
UI: ⏳ Needs form fields
```

### Next Step
Add form fields to AdminSettingsArabic.tsx for Services tab to complete the implementation.
