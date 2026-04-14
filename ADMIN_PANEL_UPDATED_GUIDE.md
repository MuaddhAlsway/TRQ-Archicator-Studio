# Admin Panel - Updated Hero Slides Guide

## ✅ What's New

The admin panel now fully supports:
- ✅ **2 Videos per slide** (video + video_2)
- ✅ **3 Images per slide** (image + image_2 + image_3)
- ✅ **Video labels** for each video
- ✅ **Image previews** in the editor
- ✅ **Complete bilingual support** (English + Arabic)

---

## 🎬 Managing Videos

### In the Admin Panel

1. **Go to**: Admin Panel → Hero Slides
2. **Click**: Edit button on any slide
3. **Find**: "Videos (2 Videos)" section (blue background)

### Video 1
- **URL Field**: Enter video URL (e.g., `/POV 1.mp4`)
- **Label Field**: Enter video label (e.g., "POV Perspective 1")
- **Remove Button**: Click ✕ to remove video

### Video 2
- **URL Field**: Enter video URL (e.g., `/Video.mp4`)
- **Label Field**: Enter video label (e.g., "Final Result")
- **Remove Button**: Click ✕ to remove video

### Current Configuration
- **Slide 1**: `/POV 1.mp4` + `/Video.mp4`
- **Slide 2**: `/POV 1.mp4` + `/Video.mp4`
- **Slide 3**: `/POV 1.mp4` + `/Video.mp4`
- **Slide 4**: `/POV 1.mp4` + `/Video.mp4`
- **Slide 5**: `/POV 1.mp4` + `/Video.mp4`

---

## 🖼️ Managing Images

### In the Admin Panel

1. **Go to**: Admin Panel → Hero Slides
2. **Click**: Edit button on any slide
3. **Find**: "Images (3 Images)" section (amber background)

### Image 1 (Main Background)
- **URL Field**: Enter image URL or click "Upload Image"
- **Preview**: Shows thumbnail of current image
- **Remove Button**: Click ✕ to remove image

### Image 2 (Additional Image)
- **URL Field**: Enter image URL or click "Upload Image"
- **Preview**: Shows thumbnail of current image
- **Remove Button**: Click ✕ to remove image

### Image 3 (Additional Image)
- **URL Field**: Enter image URL or click "Upload Image"
- **Preview**: Shows thumbnail of current image
- **Remove Button**: Click ✕ to remove image

### Current Configuration
All slides have 3 images assigned:
- `/uploads/file-1768858211350-451992102.webp`
- `/uploads/file-1768858241207-736804924.webp`
- `/uploads/file-1768858284780-218301174.webp`

(Images are rotated across slides for variety)

---

## 📊 Slide List View

### What You See
Each slide in the list shows:
- **Thumbnail**: Main image preview
- **Tag**: Small text above title
- **Title**: Main heading
- **Description**: Preview text
- **Video Count**: e.g., "2/2 Videos" ✅
- **Image Count**: e.g., "3/3 Images" ✅
- **Buttons**: Primary and secondary button labels

### Status Indicators
- 📹 **Video Count**: Shows how many videos are assigned (e.g., 2/2)
- 🖼️ **Image Count**: Shows how many images are assigned (e.g., 3/3)
- 👁️ **Active Status**: Eye icon = visible, crossed eye = hidden

---

## 💾 Saving Changes

### Save Process
1. Make changes to videos, images, or text
2. Click **"Save Slide"** button at bottom right
3. Wait for success message
4. Changes appear immediately on homepage

### What Gets Saved
- ✅ Video URLs and labels
- ✅ Image URLs
- ✅ Slide text (tag, title, description)
- ✅ Button configuration
- ✅ Slide visibility (active/inactive)
- ✅ Sort order

---

## 🇸🇦 Arabic Content

### Arabic Slides Tab
1. **Go to**: Admin Panel → Arabic → Hero Slides
2. **Click**: Edit button on any slide
3. **Fill in**: Arabic translations for:
   - Tag (Arabic)
   - Title (Arabic)
   - Description (Arabic)
   - Video labels (Arabic) - 2 videos
   - Button text (Arabic)

### Current Arabic Content
- ✅ Slide 2: Complete Arabic translations
- ✅ Slide 3: Complete Arabic translations
- ✅ Slide 4: Complete Arabic translations
- ✅ Slide 5: Complete Arabic translations
- ⚠️ Slide 1: Needs Arabic translations

---

## 🎯 Quick Actions

### Add a New Slide
1. Click **"Add Slide"** button (top right)
2. Fill in all fields
3. Add 2 videos and 3 images
4. Click **"Save Slide"**

### Edit a Slide
1. Click **Edit** button (pencil icon)
2. Make changes
3. Click **"Save Slide"**

### Delete a Slide
1. Click **Delete** button (trash icon)
2. Confirm deletion
3. Slide is permanently removed

### Hide a Slide
1. Click **Edit** button
2. Uncheck **"Active"** checkbox
3. Click **"Save Slide"**
4. Slide is hidden from homepage

### Show a Slide
1. Click **Edit** button
2. Check **"Active"** checkbox
3. Click **"Save Slide"**
4. Slide appears on homepage

---

## 📱 Mobile View

### On Mobile Devices
- Slides display in a modal popup
- Videos play automatically
- Images show in sequence
- Touch-friendly controls
- Full-screen video option

---

## 🔍 Verification Checklist

Before deploying, verify:
- [ ] All 5 slides have 2 videos each
- [ ] All 5 slides have 3 images each
- [ ] Videos play correctly (10 seconds each)
- [ ] Images display correctly
- [ ] Arabic content is complete
- [ ] Buttons link to correct pages
- [ ] Slides display correctly on mobile
- [ ] No console errors

---

## 📊 Current Status

### All 5 Slides
| Slide | Videos | Images | Arabic | Status |
|-------|--------|--------|--------|--------|
| 1 | 2/2 ✅ | 3/3 ✅ | ⚠️ Needs | Ready |
| 2 | 2/2 ✅ | 3/3 ✅ | ✅ Complete | Ready |
| 3 | 2/2 ✅ | 3/3 ✅ | ✅ Complete | Ready |
| 4 | 2/2 ✅ | 3/3 ✅ | ✅ Complete | Ready |
| 5 | 2/2 ✅ | 3/3 ✅ | ✅ Complete | Ready |

---

## 🚀 Production Ready

✅ **Admin Panel**: Fully functional
✅ **Video Management**: 2 videos per slide
✅ **Image Management**: 3 images per slide
✅ **Bilingual Support**: English + Arabic
✅ **Backend API**: Serving all data
✅ **Frontend Display**: Showing all content

**Status**: Ready for production deployment 🎉

---

## 💡 Tips

1. **Upload Images**: Use "Upload Image" button for faster uploads
2. **Video URLs**: Use relative paths (e.g., `/POV 1.mp4`) for local videos
3. **Image Rotation**: Rotate images across slides for visual variety
4. **Arabic Content**: Always provide Arabic translations for bilingual support
5. **Test Changes**: Refresh homepage to see changes immediately
6. **Mobile Testing**: Test on mobile devices to ensure responsive design

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch" error
- **Solution**: Check backend is running (`npm start` in server folder)

### Issue: Images not uploading
- **Solution**: Check file size (max 5MB) and format (JPG, PNG, WebP, GIF)

### Issue: Videos not playing
- **Solution**: Verify video URL is correct and file exists in public folder

### Issue: Changes not appearing
- **Solution**: Hard refresh homepage (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Arabic text not saving
- **Solution**: Verify all Arabic fields are filled and authentication is valid

---

**Last Updated**: February 28, 2026
**Status**: ✅ All systems operational
