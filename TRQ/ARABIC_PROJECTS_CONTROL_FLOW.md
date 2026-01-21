# Arabic Projects - Control Flow Diagram

## Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL USERS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │  ENGLISH ADMIN       │      │  ARABIC ADMIN        │        │
│  │  (English Panel)     │      │  (Arabic Panel)      │        │
│  │                      │      │                      │        │
│  │ Edit Project:        │      │ Edit Project:        │        │
│  │ - Title              │      │ - العنوان             │        │
│  │ - Description        │      │ - الوصف              │        │
│  │ - Category           │      │ - الفئة              │        │
│  │ - etc.               │      │ - إلخ                │        │
│  └──────────────────────┘      └──────────────────────┘        │
│           │                              │                     │
│           │ Sends:                       │ Sends:              │
│           │ title, category,             │ title_ar,           │
│           │ description, ...             │ category_ar,        │
│           │                              │ description_ar, ... │
│           ↓                              ↓                     │
└─────────────────────────────────────────────────────────────────┘
            │                              │
            │ PUT /api/projects/:id        │ PUT /api/projects/:id
            │                              │
            ↓                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PUT /api/projects/:id                                          │
│  ├─ Check: Is this Arabic-only update?                          │
│  │  (title_ar provided, but title NOT provided)                 │
│  │                                                              │
│  ├─ YES (Arabic Admin):                                         │
│  │  └─ UPDATE ONLY _ar fields                                   │
│  │     UPDATE projects SET                                      │
│  │       title_ar = ?,                                          │
│  │       category_ar = ?,                                       │
│  │       description_ar = ?                                     │
│  │     WHERE id = ?                                             │
│  │     ✅ English fields NOT touched                             │
│  │                                                              │
│  └─ NO (English Admin or Full Update):                          │
│     └─ UPDATE both English and Arabic fields                    │
│        UPDATE projects SET                                      │
│          title = ?,                                             │
│          category = ?,                                          │
│          description = ?,                                       │
│          title_ar = ?,                                          │
│          category_ar = ?,                                       │
│          description_ar = ?                                     │
│        WHERE id = ?                                             │
│        ✅ Both languages updated                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
            │
            │ Returns updated project
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  projects table                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id: 1                                                      │ │
│  │ title: "Royal Residence"      (English - unchanged)        │ │
│  │ title_ar: "القصر الملكي"       (Arabic - updated)          │ │
│  │ category: "residential"       (English - unchanged)        │ │
│  │ category_ar: "سكني"           (Arabic - updated)          │ │
│  │ description: "A timeless..." (English - unchanged)         │ │
│  │ description_ar: "قصر فاخر..." (Arabic - updated)          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
            │
            │ GET /api/projects
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Portfolio.tsx                                                  │
│  ├─ Load projects from API                                      │
│  ├─ Check language context                                      │
│  │                                                              │
│  ├─ If language === 'ar':                                       │
│  │  └─ getProjectData() returns:                                │
│  │     {                                                        │
│  │       title: project.title_ar,                               │
│  │       category: project.category_ar,                         │
│  │       description: project.description_ar,                   │
│  │       ...                                                    │
│  │     }                                                        │
│  │     ✅ Shows Arabic content                                   │
│  │                                                              │
│  └─ If language === 'en':                                       │
│     └─ getProjectData() returns:                                │
│        {                                                        │
│          title: project.title,                                  │
│          category: project.category,                            │
│          description: project.description,                      │
│          ...                                                    │
│        }                                                        │
│        ✅ Shows English content                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSITE (User View)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Language: English                                              │
│  ├─ Portfolio Title: "Royal Residence"                          │
│  ├─ Category: "Residential"                                     │
│  └─ Description: "A timeless luxury villa..."                   │
│                                                                 │
│  Language: Arabic                                               │
│  ├─ Portfolio Title: "القصر الملكي"                             │
│  ├─ Category: "سكني"                                            │
│  └─ Description: "قصر فاخر جديد..."                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Update Flow

### Scenario 1: Arabic Admin Edits Project

```
Arabic Admin Panel
    ↓
Clicks Edit on Project #1
    ↓
ProjectEditorArabic opens with:
├─ title_ar: "الإقامة الملكية"
├─ category_ar: "سكني"
└─ description_ar: "فيلا فاخرة..."
    ↓
Admin changes:
├─ title_ar: "القصر الملكي" (changed)
├─ category_ar: "سكني" (unchanged)
└─ description_ar: "قصر فاخر جديد..." (changed)
    ↓
Clicks "تحديث المشروع" (Update)
    ↓
handleSubmit() creates:
{
  title_ar: "القصر الملكي",
  category_ar: "سكني",
  description_ar: "قصر فاخر جديد...",
  // NO English fields!
}
    ↓
PUT /api/projects/1
    ↓
Server checks:
├─ title_ar provided? YES
├─ title provided? NO
├─ category provided? NO
└─ Is Arabic-only update? YES ✅
    ↓
Server executes:
UPDATE projects SET
  title_ar = "القصر الملكي",
  category_ar = "سكني",
  description_ar = "قصر فاخر جديد..."
WHERE id = 1;
    ↓
Database Result:
├─ title: "Royal Residence" (UNCHANGED ✅)
├─ title_ar: "القصر الملكي" (UPDATED ✅)
├─ category: "residential" (UNCHANGED ✅)
├─ category_ar: "سكني" (UNCHANGED ✅)
├─ description: "A timeless villa..." (UNCHANGED ✅)
└─ description_ar: "قصر فاخر جديد..." (UPDATED ✅)
    ↓
Website shows:
├─ English: "Royal Residence" (unchanged)
└─ Arabic: "القصر الملكي" (updated)
```

### Scenario 2: English Admin Edits Project

```
English Admin Panel
    ↓
Clicks Edit on Project #1
    ↓
ProjectEditor opens with:
├─ title: "Royal Residence"
├─ category: "residential"
└─ description: "A timeless villa..."
    ↓
Admin changes:
├─ title: "Luxury Palace" (changed)
├─ category: "residential" (unchanged)
└─ description: "A luxurious palace..." (changed)
    ↓
Clicks "Update Project"
    ↓
handleSubmit() creates:
{
  title: "Luxury Palace",
  category: "residential",
  description: "A luxurious palace...",
  // Also includes _ar fields for consistency
  title_ar: "Luxury Palace",
  category_ar: "residential",
  description_ar: "A luxurious palace..."
}
    ↓
PUT /api/projects/1
    ↓
Server checks:
├─ title provided? YES
├─ title_ar provided? YES
└─ Is Arabic-only update? NO ❌
    ↓
Server executes:
UPDATE projects SET
  title = "Luxury Palace",
  category = "residential",
  description = "A luxurious palace...",
  title_ar = "Luxury Palace",
  category_ar = "residential",
  description_ar = "A luxurious palace..."
WHERE id = 1;
    ↓
Database Result:
├─ title: "Luxury Palace" (UPDATED ✅)
├─ title_ar: "Luxury Palace" (UPDATED ✅)
├─ category: "residential" (UNCHANGED ✅)
├─ category_ar: "residential" (UNCHANGED ✅)
├─ description: "A luxurious palace..." (UPDATED ✅)
└─ description_ar: "A luxurious palace..." (UPDATED ✅)
    ↓
Arabic Admin can now:
├─ Edit in Arabic Panel
├─ Change title_ar to: "القصر الفاخر"
└─ Leave English unchanged
```

---

## Key Decision Points

```
Admin edits project
    ↓
Which panel?
    ├─ Arabic Panel (لوحة التحكم العربية)
    │  └─ Send ONLY _ar fields
    │     └─ Server: Arabic-only update
    │        └─ Update ONLY _ar fields
    │           └─ English fields UNCHANGED ✅
    │
    └─ English Panel
       └─ Send English + _ar fields
          └─ Server: Full update
             └─ Update both English and _ar fields
                └─ Both languages updated ✅
```

---

## Summary

✨ **The system now correctly handles separate language control:**

1. **Arabic Admin Panel** → Updates ONLY Arabic fields (`_ar`)
2. **English Admin Panel** → Updates both English and Arabic fields
3. **Website** → Shows correct language based on user selection
4. **Database** → Both languages coexist independently

**Result:** Each language is completely independent and can be managed separately!
