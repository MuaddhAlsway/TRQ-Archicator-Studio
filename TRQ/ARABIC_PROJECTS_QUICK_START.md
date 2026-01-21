# Arabic Projects - Quick Start Guide

## What Changed?

✅ **Projects now have Arabic-specific content** that's completely separate from English content.

When you edit a project in the **Arabic Admin Panel**, it saves Arabic content to the database. When visitors switch to Arabic on the website, they see the Arabic project content.

## How to Use

### Step 1: Go to Arabic Admin Panel
1. Open Admin Panel
2. Click on "Arabic Panel" (لوحة التحكم العربية)
3. Click on "المشاريع" (Projects)

### Step 2: Add or Edit a Project
- **Add New:** Click "إضافة مشروع" (Add Project)
- **Edit Existing:** Click the edit icon (✏️)

### Step 3: Fill in Arabic Content
Fill in all the fields in Arabic:
- العنوان (Title)
- الفئة (Category)
- الفئة الفرعية (Subcategory)
- الوصف (Description)
- الموقع (Location)
- العميل (Client)
- And all other fields...

### Step 4: Save
Click "إنشاء المشروع" (Create) or "تحديث المشروع" (Update)

### Step 5: View on Website
1. Go to website
2. Switch language to Arabic (العربية)
3. Go to Portfolio
4. See your Arabic projects!

## What Gets Saved?

When you save a project in Arabic Admin Panel, these fields are saved with `_ar` suffix:
- title_ar
- category_ar
- subcategory_ar
- description_ar
- location_ar
- client_ar
- size_ar
- duration_ar
- detailedDescription_ar
- challenge_ar
- solution_ar
- features_ar
- materials_ar
- awards_ar
- team_ar
- clientQuote_ar
- clientName_ar

## How It Works on Website

**When language = Arabic:**
- Portfolio shows Arabic project titles, descriptions, etc.
- Project detail page shows all Arabic content
- All text is right-to-left (RTL)

**When language = English:**
- Portfolio shows English project titles, descriptions, etc.
- Project detail page shows all English content
- All text is left-to-right (LTR)

## Important Notes

⚠️ **English and Arabic are separate**
- Editing Arabic content does NOT change English content
- Editing English content does NOT change Arabic content
- Each language has its own complete project information

✅ **Fallback to English**
- If an Arabic field is empty, it will show English content instead
- This is intentional - ensures content always displays

✅ **Real-time Updates**
- Changes in admin panel appear immediately on website
- No need to refresh or rebuild

## Example

**English Project:**
- Title: "Royal Residence"
- Description: "A timeless luxury villa..."

**Arabic Project (Same ID):**
- Title: "الإقامة الملكية"
- Description: "فيلا فاخرة خالدة..."

Both exist in database for the same project. Website shows the right one based on language selection.

## Need Help?

- Check that you're in the Arabic Admin Panel (لوحة التحكم العربية)
- Make sure language is set to Arabic on website
- Verify all Arabic fields are filled in
- Check browser console for any errors
