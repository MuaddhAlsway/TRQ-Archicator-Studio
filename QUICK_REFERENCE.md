# Quick Reference - Admin Panel

## 🎯 TL;DR (Too Long; Didn't Read)

### Where is Admin Panel?
```
📁 src/admin/AdminSettingsArabic.tsx
```

### What Component?
```
AdminSettingsArabic (React Component)
```

### How to Access?
```
1. npm run dev
2. http://localhost:5173/admin
3. Click "Site Settings (Ar)"
4. Click "صفحة الخدمات" tab
```

### What's Inside?
```
11 tabs for different pages:
- المقدمة (Home - Introduction)
- المشاريع المميزة (Home - Featured Projects)
- كيف نعمل (Home - How We Work)
- قسم الدعوة للعمل (Home - CTA)
- صفحة حول (About Page)
- صفحة الخدمات (Services Page) ⭐
- صفحة سير العمل (Workflow Page)
- صفحة المحفظة (Portfolio Page)
- صفحة الاتصال (Contact Page)
- صفحة التسعير (Pricing Page)
- صفحة المدونة (Blog Page)
```

---

## 📁 File Structure

```
src/admin/
├── AdminSettingsArabic.tsx          ← MAIN FILE
├── AdminSettings.tsx                ← English version
├── AdminLayout.tsx                  ← Sidebar
├── Admin.tsx                        ← Router
└── ... (other files)
```

---

## 🔄 How It Works

```
Admin Panel (AdminSettingsArabic.tsx)
    ↓
Edit: servicesHeroTitle_ar = "خدماتنا"
    ↓
Click Save
    ↓
Database Updated
    ↓
Services.tsx Loads Settings
    ↓
Display on Page
```

---

## 📊 Database

```
Table: settings
Columns: key, value, updatedAt

Example:
key: servicesHeroTitle_ar
value: خدماتنا
```

---

## ✅ Status

| Item | Status |
|------|--------|
| Database | ✅ Ready |
| Component | ✅ Ready |
| Services.tsx | ✅ Updated |
| UI Form Fields | ⏳ Needed |

---

## 🚀 Next Step

Add form fields to AdminSettingsArabic.tsx for Services tab.

---

## 📞 Key Files

| File | Purpose |
|------|---------|
| AdminSettingsArabic.tsx | Arabic settings admin panel |
| Services.tsx | Services page component |
| server/index.js | Backend API |
| server/trq.db | Database |

---

## 🎯 Services Settings (20 total)

```
Hero Section:
- servicesHeroTitle_ar
- servicesHeroParagraph_ar

Introduction:
- servicesTitle_ar
- servicesDescription_ar

Highlights:
- servicesHighlightsTitle_ar
- servicesHighlightsDescription_ar
- servicesHighlight1Title_ar
- servicesHighlight1Description_ar
- servicesHighlight2Title_ar
- servicesHighlight2Description_ar
- servicesHighlight3Title_ar
- servicesHighlight3Description_ar

CTA:
- servicesCtaTitle_ar
- servicesCtaDescription_ar
- servicesCtaButton1Text_ar
- servicesCtaButton1Page_ar
- servicesCtaButton2Text_ar
- servicesCtaButton2Page_ar
```

---

## 💡 Example

### In Admin Panel
```
Edit: servicesHeroTitle_ar
From: "خدماتنا"
To: "خدماتنا الجديدة"
Click Save
```

### On Website
```
Services page shows:
<h1>خدماتنا الجديدة</h1>
```

---

## 🔗 Related Files

```
Frontend:
- src/components/Services.tsx

Admin:
- src/admin/AdminSettingsArabic.tsx

Backend:
- server/index.js
- server/database.js

Database:
- server/trq.db
```

---

## ✨ That's It!

Admin Panel is in `src/admin/AdminSettingsArabic.tsx`

All settings are in the database and ready to use!
