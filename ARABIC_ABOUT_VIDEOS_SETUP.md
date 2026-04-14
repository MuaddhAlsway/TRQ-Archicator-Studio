# Arabic About Videos Admin Panel Setup

## Overview
Created a dedicated Arabic About Videos admin panel component for managing Arabic-specific video content. This allows separate management of English and Arabic videos with full bilingual support.

## What's New

### New Component
- **File**: `src/admin/AdminArabicAboutVideos.tsx`
- **Location**: Admin Dashboard → 🇸🇦 About Videos (AR)
- **Language**: Full Arabic interface (RTL)

### Features
✅ Manage videos with Arabic interface
✅ Edit English and Arabic content separately
✅ Upload thumbnail images
✅ Set sort order and visibility
✅ Bilingual form with clear sections
✅ Arabic error messages and confirmations

## Admin Panel Navigation

### English Section
- 🇬🇧 Hero Slides (EN)
- 🇬🇧 About Videos ← Manage English videos
- 🇬🇧 Projects (EN)
- 🇬🇧 Services (EN)
- 🇬🇧 Blog Articles (EN)
- 🇬🇧 Site Settings (EN)

### Arabic Section
- 🇸🇦 Hero Slides (AR)
- 🇸🇦 About Videos (AR) ← NEW: Manage Arabic videos
- 🇸🇦 Projects (AR)
- 🇸🇦 Services (AR)
- 🇸🇦 Blog Articles (AR)
- 🇸🇦 Site Settings (AR)

## How to Use

### Access Arabic About Videos
1. Go to Admin Dashboard
2. Click "🇸🇦 About Videos (AR)" in the sidebar
3. Interface displays in Arabic with RTL layout

### Create/Edit Videos
1. Click "إضافة فيديو" (Add Video)
2. Fill in English content section:
   - العنوان (Title)
   - الوصف (Description)
   - رابط الفيديو (Video URL)
3. Fill in Arabic content section:
   - العنوان (عربي) - Arabic Title
   - الوصف (عربي) - Arabic Description
   - رابط الفيديو (عربي) - Arabic Video URL (optional)
4. Upload thumbnail image
5. Set sort order and active status
6. Click "حفظ الفيديو" (Save Video)

### Manage Videos
- **Eye Icon**: Toggle visibility (نشط/غير نشط)
- **Edit Icon**: Modify video details
- **Delete Icon**: Remove video
- **Sort Number**: Display order

## Form Sections

### English Content (المحتوى الإنجليزي)
- Title (English)
- Description (English)
- Video URL (English)

### Arabic Content (المحتوى العربي)
- Title (Arabic)
- Description (Arabic)
- Video URL (Arabic) - Optional, uses English URL as fallback

### Settings
- Thumbnail Image Upload
- Sort Order
- Active Status

## Database Integration

### Shared Database
Both English and Arabic panels use the same `about_videos` table:
- `title` - English title
- `description` - English description
- `video_url` - English video URL
- `title_ar` - Arabic title
- `description_ar` - Arabic description
- `video_url_ar` - Arabic video URL
- `image` - Thumbnail image
- `sortOrder` - Display order
- `isActive` - Visibility status

### API Endpoints
All endpoints are shared:
- `GET /api/about-videos` - Get all videos
- `GET /api/about-videos/active` - Get active videos
- `POST /api/about-videos` - Create video
- `PUT /api/about-videos/{id}` - Update video
- `DELETE /api/about-videos/{id}` - Delete video

## Frontend Integration

### AboutVideoHero Component
- Fetches videos from API
- Displays first active video
- Supports bilingual content
- Automatically switches based on language
- Falls back to English if Arabic not configured

### Language Switching
When user switches to Arabic:
1. Component checks for `title_ar` and `description_ar`
2. Uses Arabic video URL if `video_url_ar` is set
3. Falls back to English content if Arabic not available

## Files Modified

### New Files
- `src/admin/AdminArabicAboutVideos.tsx` - Arabic admin panel

### Updated Files
- `src/admin/AdminLayout.tsx` - Added navigation item
- `src/admin/Admin.tsx` - Added import and routing

### Existing Files (No Changes)
- `src/components/AboutVideoHero.tsx` - Already supports bilingual
- `server/index.js` - API endpoints already support Arabic fields
- `server/database.js` - Table already has Arabic columns

## Bilingual Workflow

### Scenario 1: English Only
1. Add video in English panel
2. Video appears in both English and Arabic sections
3. Arabic section shows English content as fallback

### Scenario 2: Bilingual
1. Add video in English panel with English content
2. Edit video in Arabic panel
3. Add Arabic title, description, and optional video URL
4. Save
5. Video now displays correctly in both languages

### Scenario 3: Separate Videos
1. Add English video in English panel
2. Edit in Arabic panel and set different `video_url_ar`
3. Each language shows its own video

## Best Practices

1. **Always fill English first**: English is the fallback language
2. **Use Arabic panel for translations**: Easier to manage Arabic content
3. **Test both languages**: Verify content displays correctly
4. **Consistent sort order**: Use same sort order for both languages
5. **Thumbnail images**: Use same image for both languages

## Troubleshooting

### Arabic Panel Not Showing
- Check if navigation item appears in sidebar
- Verify `AdminArabicAboutVideos` is imported in `Admin.tsx`
- Check browser console for errors

### Arabic Content Not Saving
- Ensure you're logged in with valid token
- Check network tab for API errors
- Verify database has Arabic columns

### Language Not Switching
- Check if Arabic content is filled in
- Verify `language` context is working
- Check browser console for errors

## Next Steps

1. Access Admin Dashboard
2. Navigate to "🇸🇦 About Videos (AR)"
3. Edit existing video to add Arabic content
4. Test on About page with language switcher
5. Verify bilingual display works correctly

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are working
3. Check database for data
4. Review component code for logic
