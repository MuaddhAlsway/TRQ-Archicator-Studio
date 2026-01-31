# Admin Panel - Quick Start Guide

## 🎯 Where to Find Admin Panel

### Folder Structure
```
your-project/
├── src/
│   ├── admin/                          ← Admin Panel Here
│   │   ├── Admin.tsx                   (Main router)
│   │   ├── AdminLayout.tsx             (Sidebar layout)
│   │   ├── AdminSettings.tsx           (English settings)
│   │   ├── AdminSettingsArabic.tsx     (Arabic settings) ← YOU ARE HERE
│   │   └── ... (other admin files)
│   ├── components/
│   ├── pages/
│   └── ...
└── ...
```

---

## 🚀 How to Access Admin Panel

### Step 1: Start Your Server
```bash
npm run dev
```

### Step 2: Go to Admin URL
```
http://localhost:5173/admin
```

### Step 3: Login
- Enter your admin credentials
- You'll see the dashboard

### Step 4: Navigate to Settings
- Click on **"Site Settings (Ar)"** in the sidebar
- This opens `AdminSettingsArabic.tsx`

---

## 📋 Current Admin Panel Tabs

The admin panel has **11 tabs** for Arabic settings:

```
┌─────────────────────────────────────────────────────────┐
│ إعدادات الموقع (عربي)                                    │
├─────────────────────────────────────────────────────────┤
│ [المقدمة] [المشاريع] [كيف نعمل] [الدعوة] [حول]          │
│ [الخدمات] [سير العمل] [المحفظة] [الاتصال] [التسعير]     │
│ [المدونة]                                               │
└─────────────────────────────────────────────────────────┘
```

### Tab Details

| Tab | Arabic Name | File Location | Status |
|-----|-------------|---------------|--------|
| 1 | المقدمة | AdminSettingsArabic.tsx | ✅ Ready |
| 2 | المشاريع المميزة | AdminSettingsArabic.tsx | ✅ Ready |
| 3 | كيف نعمل | AdminSettingsArabic.tsx | ✅ Ready |
| 4 | قسم الدعوة للعمل | AdminSettingsArabic.tsx | ✅ Ready |
| 5 | صفحة حول | AdminSettingsArabic.tsx | ✅ Ready |
| 6 | صفحة الخدمات | AdminSettingsArabic.tsx | ✅ Ready |
| 7 | صفحة سير العمل | AdminSettingsArabic.tsx | ⏳ Needs UI |
| 8 | صفحة المحفظة | AdminSettingsArabic.tsx | ⏳ Needs UI |
| 9 | صفحة الاتصال | AdminSettingsArabic.tsx | ⏳ Needs UI |
| 10 | صفحة التسعير | AdminSettingsArabic.tsx | ⏳ Needs UI |
| 11 | صفحة المدونة | AdminSettingsArabic.tsx | ⏳ Needs UI |

---

## 🔧 File: AdminSettingsArabic.tsx

### Location
```
src/admin/AdminSettingsArabic.tsx
```

### What It Does
- Manages all Arabic site settings
- Has 11 tabs for different pages
- Saves settings to database
- Loads settings from database

### Key Code Structure

```typescript
// 1. Define tab type
type TabType = 'home-intro' | 'home-featured' | 'home-workflow' | 
               'home-cta' | 'about' | 'services' | 'workflow' | 
               'portfolio' | 'contact' | 'pricing' | 'blog';

// 2. Initialize state
const [activeTab, setActiveTab] = useState<TabType>('services');
const [settings, setSettings] = useState<Record<string, any>>({
  // All Arabic settings here
  servicesHeroTitle_ar: 'خدماتنا',
  servicesHeroParagraph_ar: '...',
  // ... more settings
});

// 3. Define tabs array
const tabs = [
  { id: 'home-intro', label: 'المقدمة' },
  { id: 'services', label: 'صفحة الخدمات' },
  // ... more tabs
];

// 4. Render tabs and forms
return (
  <div>
    {/* Tab buttons */}
    {tabs.map(tab => (
      <button onClick={() => setActiveTab(tab.id)}>
        {tab.label}
      </button>
    ))}
    
    {/* Tab content */}
    {activeTab === 'services' && (
      <div>
        {/* Form fields for Services settings */}
      </div>
    )}
  </div>
);
```

---

## 📝 Services Tab Example

### Current Implementation in AdminSettingsArabic.tsx

```typescript
// Services settings are already defined:
servicesHeroTitle_ar: 'خدماتنا',
servicesHeroParagraph_ar: 'حلول تصميمية شاملة...',
servicesTitle_ar: 'حلول تصميمية متكاملة',
servicesDescription_ar: '...',
servicesHighlightsTitle_ar: 'مميزات خدماتنا',
servicesHighlightsDescription_ar: '...',
servicesHighlight1Title_ar: 'حلول مخصصة',
servicesHighlight1Description_ar: '...',
servicesHighlight2Title_ar: 'خدمة شاملة',
servicesHighlight2Description_ar: '...',
servicesHighlight3Title_ar: 'جودة عالية',
servicesHighlight3Description_ar: '...',
servicesCtaTitle_ar: 'هل أنت مستعد للبدء؟',
servicesCtaDescription_ar: '...',
servicesCtaButton1Text_ar: 'اطلب عرض سعر',
servicesCtaButton1Page_ar: 'pricing',
servicesCtaButton2Text_ar: 'تواصل معنا',
servicesCtaButton2Page_ar: 'contact',
```

### What's Missing
The **UI form fields** for the Services tab are not yet implemented.

---

## 🎨 How to Add Services Tab UI

### Step 1: Find the Tab Rendering Section
In `AdminSettingsArabic.tsx`, find where tabs are rendered:

```typescript
{activeTab === 'services' && (
  <div>
    {/* Add form fields here */}
  </div>
)}
```

### Step 2: Add Form Fields
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

### Step 3: Save Changes
The `handleSave` function already handles saving to database.

---

## 🔄 How Settings Flow

```
Admin Panel (AdminSettingsArabic.tsx)
    ↓
User edits: servicesHeroTitle_ar = "خدماتنا الجديدة"
    ↓
Click Save button
    ↓
api.updateSettings(settings)
    ↓
POST /api/settings
    ↓
Server (server/index.js)
    ↓
SQLite Database (settings table)
    ↓
Services.tsx component loads settings
    ↓
useEffect(() => {
  api.getSettings().then(data => {
    setSettings(data.servicesHeroTitle_ar)
  })
})
    ↓
Display on page: <h1>{settings.servicesHeroTitle}</h1>
```

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

### Example Records
```sql
-- English
INSERT INTO settings VALUES ('servicesHeroTitle', 'OUR SERVICES', NOW());

-- Arabic
INSERT INTO settings VALUES ('servicesHeroTitle_ar', 'خدماتنا', NOW());
```

### All Arabic Settings for Services
```
servicesHeroTitle_ar
servicesHeroParagraph_ar
servicesTitle_ar
servicesDescription_ar
servicesHighlightsTitle_ar
servicesHighlightsDescription_ar
servicesHighlight1Title_ar
servicesHighlight1Description_ar
servicesHighlight2Title_ar
servicesHighlight2Description_ar
servicesHighlight3Title_ar
servicesHighlight3Description_ar
servicesCtaTitle_ar
servicesCtaDescription_ar
servicesCtaButton1Text_ar
servicesCtaButton1Page_ar
servicesCtaButton2Text_ar
servicesCtaButton2Page_ar
```

---

## ✅ Checklist

### What's Done ✅
- [x] Database has all 190 Arabic settings
- [x] AdminSettingsArabic.tsx has tab structure
- [x] Services.tsx component uses Arabic settings
- [x] Settings load/save functionality works

### What's Needed ⏳
- [ ] Add UI form fields for Services tab
- [ ] Add UI form fields for Workflow tab
- [ ] Add UI form fields for Portfolio tab
- [ ] Add UI form fields for Contact tab
- [ ] Add UI form fields for Pricing tab
- [ ] Add UI form fields for Blog tab

---

## 🎯 Next Steps

### To Complete Services Tab UI:

1. **Open:** `src/admin/AdminSettingsArabic.tsx`
2. **Find:** The section where `activeTab === 'services'`
3. **Add:** Form fields for all 20 Services settings
4. **Test:** Edit a setting and verify it appears on Services page

### Pattern to Follow
Look at existing tabs in the file (like 'about') and copy the pattern for Services.

---

## 📞 Summary

**Admin Panel Location:** `src/admin/AdminSettingsArabic.tsx`

**Current Status:**
- ✅ Database: All 190 Arabic settings added
- ✅ Component: Services.tsx uses Arabic settings
- ⏳ UI: Form fields need to be added to admin panel

**To Customize Services in Arabic:**
1. Go to Admin Panel → Site Settings (Ar)
2. Click Services tab
3. Edit the fields (once UI is added)
4. Click Save
5. Changes appear on Services page immediately

**Access:** `http://localhost:5173/admin`
