# Arabic Customization System - Direct Database Management

## Overview

The translation library (react-i18next) and MyMemory API have been **completely removed**. All Arabic content is now managed directly through the admin panel with no automatic translation.

### What Changed

✅ **Removed:**
- react-i18next library
- MyMemory API integration
- Automatic translation system
- Translation cache database

✅ **Kept:**
- Direct Arabic fields in database (`_ar` suffix)
- Admin panels for customization
- Language switching (English/Arabic)
- RTL layout support
- Arabic numeral conversion

---

## How It Works Now

### 1. **Site Settings (Arabic)**

**Location:** Admin Panel → Site Settings (Arabic)

**What You Can Customize:**
- Home page intro, featured projects, workflow, CTA sections
- About page content (hero, who we are, vision, mission, values, why choose us)
- Services page content
- Workflow page content
- Portfolio page content
- Contact page content
- Pricing page content
- Blog page content

**How to Use:**
1. Go to Admin Panel
2. Click "Site Settings (Arabic)" tab
3. Select the section you want to edit (home-intro, about, services, etc.)
4. Edit the Arabic text directly
5. Click "Save Settings"

**Database Storage:**
- All settings stored in `settings` table with `_ar` suffix
- Example keys:
  - `homeIntroTitle_ar`
  - `aboutHeroTitle_ar`
  - `servicesTitle_ar`

---

### 2. **Projects (Arabic)**

**Location:** Admin Panel → Projects (Arabic)

**What You Can Customize:**
- Project title (Arabic)
- Project category (Arabic)
- Project description (Arabic)
- Project location (Arabic)
- Client name (Arabic)
- Project size (Arabic)
- Project duration (Arabic)
- Detailed description (Arabic)
- Challenge (Arabic)
- Solution (Arabic)
- Features list (Arabic)
- Materials list (Arabic)
- Awards list (Arabic)
- Team members (Arabic)
- Client quote (Arabic)

**How to Use:**
1. Go to Admin Panel
2. Click "Projects (Arabic)" tab
3. Click "Edit" on any project
4. Fill in the Arabic fields
5. Click "Save Project"

**Database Storage:**
- Arabic fields stored directly in `projects` table with `_ar` suffix
- Example columns:
  - `title_ar`
  - `description_ar`
  - `location_ar`
  - `features_ar` (JSON array)
  - `materials_ar` (JSON array)

**Important:** 
- English fields are preserved separately
- You can edit Arabic without affecting English content
- Each project can have independent Arabic and English versions

---

### 3. **Blog (Arabic)**

**Location:** Admin Panel → Blog (Arabic)

**What You Can Customize:**
- Article title (Arabic)
- Article excerpt (Arabic)
- Article content (Arabic)
- Article category (Arabic)

**How to Use:**
1. Go to Admin Panel
2. Click "Blog (Arabic)" tab
3. Click "Edit" on any article
4. Fill in the Arabic fields
5. Click "Save Article"

**Database Storage:**
- Arabic fields stored in `settings` table with keys like:
  - `article_{id}_title_ar`
  - `article_{id}_excerpt_ar`
  - `article_{id}_content_ar`
  - `article_{id}_category_ar`

**Note:** Blog articles don't have `_ar` columns in the table yet. They use the settings table for Arabic content.

---

## Frontend Display Logic

### How Content is Displayed

When a user switches to Arabic mode:

1. **Projects Page:**
   - Displays `title_ar` if available, otherwise shows `title` (English)
   - Displays `description_ar` if available, otherwise shows `description`
   - All other Arabic fields follow the same pattern

2. **Blog Page:**
   - Displays `article_{id}_title_ar` if available
   - Displays `article_{id}_excerpt_ar` if available
   - Falls back to English if Arabic not provided

3. **Site Settings:**
   - Displays `{key}_ar` values from settings table
   - Falls back to English if Arabic not provided

### Code Pattern

```typescript
// In components, use direct field access:
const { language } = useLanguage();

// For projects:
const displayTitle = language === 'ar' ? project.title_ar || project.title : project.title;

// For settings:
const displayText = language === 'ar' ? settings.homeIntroTitle_ar || settings.homeIntroTitle : settings.homeIntroTitle;
```

---

## Admin Panel Structure

### Site Settings (Arabic) Tabs

1. **home-intro** - Home page introduction section
2. **home-featured** - Featured projects section
3. **home-workflow** - How we work section
4. **home-cta** - Call-to-action section
5. **about** - About page content
6. **services** - Services page content
7. **workflow** - Workflow page content
8. **portfolio** - Portfolio page content
9. **contact** - Contact page content
10. **pricing** - Pricing page content
11. **blog** - Blog page content

### Projects (Arabic)

- List all projects with search and filter
- Edit each project's Arabic fields
- Toggle publish/draft status
- Delete projects

### Blog (Arabic)

- List all blog articles
- Edit each article's Arabic fields
- Toggle publish/draft status
- Delete articles

---

## Database Schema

### Projects Table - Arabic Fields

```sql
-- Existing columns (English)
title TEXT
category TEXT
description TEXT
location TEXT
client TEXT
size TEXT
duration TEXT
detailedDescription TEXT
challenge TEXT
solution TEXT
features TEXT (JSON)
materials TEXT (JSON)
awards TEXT (JSON)
team TEXT (JSON)
clientQuote TEXT
clientName TEXT

-- Arabic fields (_ar suffix)
title_ar TEXT
category_ar TEXT
subcategory_ar TEXT
description_ar TEXT
location_ar TEXT
client_ar TEXT
size_ar TEXT
duration_ar TEXT
detailedDescription_ar TEXT
challenge_ar TEXT
solution_ar TEXT
features_ar TEXT (JSON)
materials_ar TEXT (JSON)
awards_ar TEXT (JSON)
team_ar TEXT (JSON)
clientQuote_ar TEXT
clientName_ar TEXT
```

### Settings Table - Arabic Keys

```sql
-- Format: {key}_ar
homeIntroTitle_ar
homeIntroText1_ar
homeIntroText2_ar
aboutHeroTitle_ar
aboutWhoWeAreTitle_ar
servicesTitle_ar
workflowTitle_ar
portfolioTitle_ar
contactTitle_ar
pricingTitle_ar
blogTitle_ar
-- ... and many more
```

---

## Workflow for Customizing Arabic Content

### Step 1: Add English Content First
1. Go to Admin Panel
2. Create/edit projects, articles, or settings in English
3. Save

### Step 2: Add Arabic Content
1. Go to Admin Panel
2. Navigate to the Arabic section (Projects AR, Blog AR, or Site Settings AR)
3. Edit the same item
4. Fill in the Arabic fields
5. Save

### Step 3: Test
1. Switch language to Arabic in the frontend
2. Verify the Arabic content displays correctly
3. If not showing, check that the `_ar` field is filled in the admin panel

### Step 4: Publish
1. Toggle the status to "Published" if needed
2. Content is now live in both English and Arabic

---

## Best Practices

### 1. **Always Provide Both Languages**
- Don't leave Arabic fields empty if you want Arabic users to see content
- If Arabic is empty, English will be shown as fallback

### 2. **Keep Content Consistent**
- Maintain similar structure and length between English and Arabic
- Use the same categories and tags in both languages

### 3. **Test Thoroughly**
- Switch to Arabic mode and verify all content displays
- Check RTL layout looks correct
- Test on mobile devices

### 4. **Use Admin Panels**
- Always use the admin panels to edit content
- Don't edit the database directly unless you know what you're doing

### 5. **Backup Your Data**
- Regularly backup your database
- Keep a copy of important Arabic content

---

## Troubleshooting

### Arabic Content Not Showing

**Problem:** Switched to Arabic but seeing English text

**Solution:**
1. Check the admin panel - is the Arabic field filled in?
2. Make sure you saved the changes
3. Refresh the page (Ctrl+F5 to clear cache)
4. Check browser console for errors

### Arabic Text Looks Wrong

**Problem:** Arabic text is displaying but looks garbled

**Solution:**
1. Check that your database is using UTF-8 encoding
2. Verify the text was entered correctly in the admin panel
3. Check browser language settings

### Can't Edit Arabic Content

**Problem:** Admin panel won't let you save Arabic content

**Solution:**
1. Make sure you're logged in as admin
2. Check that all required fields are filled
3. Check browser console for error messages
4. Try refreshing the page

---

## API Endpoints (For Developers)

### Get Settings
```
GET /api/settings
Returns all settings including _ar fields
```

### Update Settings
```
PUT /api/settings
Body: { key: value, key_ar: value_ar, ... }
```

### Get Projects
```
GET /api/projects
Returns all projects with _ar fields
```

### Update Project
```
PUT /api/projects/:id
Body: { title_ar, description_ar, ... }
Only updates _ar fields if all keys end with _ar
```

### Get Articles
```
GET /api/articles
Returns all articles
```

### Update Article
```
PUT /api/articles/:id
Body: { title, slug, excerpt, content, ... }
```

---

## Migration from Old System

If you had content translated by the MyMemory API:

1. The old translations are still in the database but not being used
2. You can manually copy them to the `_ar` fields if needed
3. Or re-enter the Arabic content through the admin panels
4. The old `translations` table can be deleted if you want to clean up

---

## Summary

✅ **You now have:**
- Complete control over Arabic content
- No automatic translation (no API calls)
- Direct database management
- Easy-to-use admin panels
- Fallback to English if Arabic not provided

✅ **To customize Arabic:**
1. Go to Admin Panel
2. Select the Arabic section (Projects AR, Blog AR, Site Settings AR)
3. Edit the content
4. Save
5. Switch to Arabic in frontend to verify

That's it! No library, no API, just direct customization.
