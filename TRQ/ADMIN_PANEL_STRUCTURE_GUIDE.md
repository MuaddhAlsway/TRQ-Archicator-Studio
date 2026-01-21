# Admin Panel Structure Guide

## 📁 Folder Location
```
src/admin/
```

---

## 🏗️ Main Admin Components

### Core Admin Files

| File | Purpose |
|------|---------|
| **Admin.tsx** | Main admin router/entry point |
| **AdminLayout.tsx** | Layout wrapper with sidebar navigation |
| **AdminLogin.tsx** | Login page for admin authentication |
| **AdminContext.tsx** | Context provider for admin state management |
| **AdminDashboard.tsx** | Dashboard home page |

---

## 📄 English Site Settings (En)

### Main Settings Component
- **AdminSettings.tsx** - Main English site settings editor
  - Home page sections (Introduction, Featured Projects, How We Work, CTA)
  - About page sections (Hero, Who We Are, Vision/Mission, Values, Why Choose, Impact)
  - Services, Workflow, Portfolio, Contact, Pricing, Blog pages
  - 200+ customizable settings

---

## 🇸🇦 Arabic Site Settings (Ar)

### Arabic Settings Components
| File | Purpose |
|------|---------|
| **AdminSettingsArabic.tsx** | Main Arabic site settings editor (5 tabs) |
| **AdminArabicSettings.tsx** | Individual Arabic setting editor |
| **AdminArabicSettingsComplete.tsx** | Extended Arabic settings (template) |
| **AdminArabicSettingsPage.tsx** | Arabic settings page wrapper |

### Current Arabic Settings Coverage
- ✅ Home page (Introduction, Featured Projects, How We Work, CTA)
- ✅ About page (all sections)
- ✅ Blog page (basic settings)
- ❌ Services page (needs UI implementation)
- ❌ Workflow page (needs UI implementation)
- ❌ Portfolio page (needs UI implementation)
- ❌ Contact page (needs UI implementation)
- ❌ Pricing page (needs UI implementation)

---

## 📝 Content Management Components

### English Content
| File | Purpose |
|------|---------|
| **AdminHome.tsx** | Home page content editor |
| **AdminServices.tsx** | Services page content editor |
| **AdminProjects.tsx** | Projects/Portfolio editor |
| **AdminBlog.tsx** | Blog articles editor |
| **AdminSlides.tsx** | Hero slides editor |
| **AdminPricing.tsx** | Pricing page editor |
| **AdminNewsletter.tsx** | Newsletter management |
| **AdminContacts.tsx** | Contact messages viewer |

### Arabic Content
| File | Purpose |
|------|---------|
| **AdminArabicBlog.tsx** | Arabic blog articles editor |
| **AdminArabicProjects.tsx** | Arabic projects editor |
| **AdminArabicServices.tsx** | Arabic services editor |
| **AdminArabicServicesSettings.tsx** | Arabic services settings |
| **AdminArabicSlides.tsx** | Arabic hero slides editor |
| **AdminArabicHeroSlides.tsx** | Arabic hero slides management |
| **AdminArabicCustomize.tsx** | Arabic customization panel |
| **AdminArabicPanel.tsx** | Arabic admin panel wrapper |

---

## 🛠️ Utility Components

| File | Purpose |
|------|---------|
| **ArticleEditor.tsx** | Rich text editor for articles |
| **ProjectEditor.tsx** | Project details editor |
| **BilingualEditor.tsx** | Bilingual content editor |
| **ConfirmModal.tsx** | Confirmation dialog |
| **AdminAccount.tsx** | User account settings |
| **types.ts** | TypeScript type definitions |

---

## 🗂️ File Organization

```
src/admin/
├── Core Files
│   ├── Admin.tsx                          (Main router)
│   ├── AdminLayout.tsx                    (Sidebar layout)
│   ├── AdminLogin.tsx                     (Authentication)
│   ├── AdminContext.tsx                   (State management)
│   └── AdminDashboard.tsx                 (Home page)
│
├── English Settings
│   └── AdminSettings.tsx                  (200+ settings)
│
├── Arabic Settings
│   ├── AdminSettingsArabic.tsx            (Main - 5 tabs)
│   ├── AdminArabicSettings.tsx            (Individual editor)
│   ├── AdminArabicSettingsComplete.tsx    (Template)
│   └── AdminArabicSettingsPage.tsx        (Wrapper)
│
├── English Content Management
│   ├── AdminHome.tsx
│   ├── AdminServices.tsx
│   ├── AdminProjects.tsx
│   ├── AdminBlog.tsx
│   ├── AdminSlides.tsx
│   ├── AdminPricing.tsx
│   ├── AdminNewsletter.tsx
│   └── AdminContacts.tsx
│
├── Arabic Content Management
│   ├── AdminArabicBlog.tsx
│   ├── AdminArabicProjects.tsx
│   ├── AdminArabicServices.tsx
│   ├── AdminArabicServicesSettings.tsx
│   ├── AdminArabicSlides.tsx
│   ├── AdminArabicHeroSlides.tsx
│   ├── AdminArabicCustomize.tsx
│   └── AdminArabicPanel.tsx
│
└── Utilities
    ├── ArticleEditor.tsx
    ├── ProjectEditor.tsx
    ├── BilingualEditor.tsx
    ├── ConfirmModal.tsx
    ├── AdminAccount.tsx
    └── types.ts
```

---

## 🔑 Key Components Explained

### 1. Admin.tsx (Main Router)
```typescript
// Routes to different admin pages
- /admin/login
- /admin/dashboard
- /admin/settings (English)
- /admin/settings-ar (Arabic)
- /admin/projects
- /admin/blog
- /admin/services
- etc.
```

### 2. AdminLayout.tsx (Sidebar Navigation)
```typescript
// Sidebar menu with tabs:
- Dashboard
- Hero Slides (En)
- Projects (En)
- Services (En)
- Blog (En)
- Site Settings (En)
- Hero Slides (Ar)
- Projects (Ar)
- Services (Ar)
- Blog (Ar)
- Site Settings (Ar)
- Contact Messages
- Pricing Requests
- Newsletter
- Account
```

### 3. AdminSettings.tsx (English Settings)
```typescript
// 11 tabs for different pages:
- Home - Introduction
- Home - Featured Projects
- Home - How We Work
- Home - CTA
- About
- Services
- Workflow
- Portfolio
- Contact
- Pricing
- Blog
```

### 4. AdminSettingsArabic.tsx (Arabic Settings)
```typescript
// Currently 5 tabs (needs expansion to 11):
- Home - Introduction
- Home - Featured Projects
- Home - How We Work
- Home - CTA
- About
// Missing: Services, Workflow, Portfolio, Contact, Pricing, Blog
```

---

## 🚀 How to Access Admin Panel

### URL
```
http://localhost:5173/admin
```

### Login
1. Go to `/admin/login`
2. Enter credentials
3. Redirected to dashboard

### Navigation
- Use sidebar to navigate between sections
- English settings: "Site Settings"
- Arabic settings: "Site Settings (Ar)"

---

## 📊 Settings Database Connection

### How Settings Flow

```
Admin Panel (UI)
    ↓
AdminSettings.tsx / AdminSettingsArabic.tsx
    ↓
api.updateSettings()
    ↓
POST /api/settings
    ↓
server/index.js
    ↓
SQLite Database (settings table)
    ↓
Frontend Components (Services.tsx, etc.)
    ↓
api.getSettings()
    ↓
Display on Page
```

---

## 🎯 Where to Customize Services Settings

### Current Implementation
1. **Admin Panel** → Site Settings (Ar)
2. **Component** → AdminSettingsArabic.tsx
3. **Database** → settings table with `_ar` suffix

### To Add Services Tab to Arabic Settings

**File to Edit:** `src/admin/AdminSettingsArabic.tsx`

**Add to tabs array:**
```typescript
{ id: 'services' as TabType, label: 'صفحة الخدمات' }
```

**Add form fields for:**
- servicesHeroTitle_ar
- servicesHeroParagraph_ar
- servicesTitle_ar
- servicesDescription_ar
- servicesHighlightsTitle_ar
- servicesHighlightsDescription_ar
- servicesHighlight1Title_ar
- servicesHighlight1Description_ar
- servicesHighlight2Title_ar
- servicesHighlight2Description_ar
- servicesHighlight3Title_ar
- servicesHighlight3Description_ar
- servicesCtaTitle_ar
- servicesCtaDescription_ar
- servicesCtaButton1Text_ar
- servicesCtaButton1Page_ar
- servicesCtaButton2Text_ar
- servicesCtaButton2Page_ar

---

## 📝 Next Steps

### To Complete Arabic Settings UI:

1. **Expand AdminSettingsArabic.tsx**
   - Add 6 new tabs (Services, Workflow, Portfolio, Contact, Pricing, Blog)
   - Add form fields for each tab
   - Implement save/load functionality

2. **Pattern to Follow**
   - Look at existing tabs in AdminSettingsArabic.tsx
   - Copy the pattern for new tabs
   - Add appropriate form inputs

3. **Database**
   - ✅ All 190 Arabic settings already in database
   - ✅ Ready to be used in UI

---

## 🔗 Related Files

### Context & State
- `src/context/AdminContext.tsx` - Admin state management
- `src/admin/AdminContext.tsx` - Admin-specific context

### API Integration
- `src/api/index.ts` - API calls for settings

### Database
- `server/index.js` - Backend API routes
- `server/database.js` - Database initialization
- `server/trq.db` - SQLite database file

---

## ✅ Summary

**Admin Panel Location:** `src/admin/`

**Main Components:**
- **Admin.tsx** - Router
- **AdminLayout.tsx** - Layout
- **AdminSettings.tsx** - English settings (200+ settings)
- **AdminSettingsArabic.tsx** - Arabic settings (needs expansion)

**To Customize Services in Arabic:**
1. Edit `src/admin/AdminSettingsArabic.tsx`
2. Add Services tab with form fields
3. All database settings already exist
4. Changes will appear in Services.tsx component

**Status:** Database ready ✅ | UI needs expansion ⏳
