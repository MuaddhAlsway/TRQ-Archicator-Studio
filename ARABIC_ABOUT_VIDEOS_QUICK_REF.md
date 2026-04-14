# Arabic About Videos - Quick Reference

## Access
Admin Dashboard → 🇸🇦 About Videos (AR)

## Interface Language
✅ Full Arabic (RTL)
✅ Arabic labels and buttons
✅ Arabic error messages

## Main Actions

### Add Video
Click "إضافة فيديو" button

### Edit Video
Click edit icon (✏️)

### Delete Video
Click delete icon (🗑️)

### Toggle Visibility
Click eye icon (👁️)

## Form Fields

### English Section (المحتوى الإنجليزي)
- العنوان (Title)
- الوصف (Description)
- رابط الفيديو (Video URL)

### Arabic Section (المحتوى العربي)
- العنوان (عربي) - Arabic Title
- الوصف (عربي) - Arabic Description
- رابط الفيديو (عربي) - Arabic Video URL (optional)

### Settings
- صورة مصغرة - Thumbnail Image
- ترتيب العرض - Sort Order
- نشط - Active Status

## Buttons
- إضافة فيديو - Add Video
- حفظ الفيديو - Save Video
- إلغاء - Cancel

## Tips
1. Fill English content first (it's the fallback)
2. Add Arabic translations in Arabic panel
3. Use same sort order for both languages
4. Test both languages after saving
5. Upload high-quality thumbnail images

## Database
- Shared `about_videos` table
- English and Arabic fields stored together
- One video = bilingual content

## Frontend
- AboutVideoHero component fetches from API
- Automatically switches based on language
- Falls back to English if Arabic not set
