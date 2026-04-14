# Admin Panel - Hero Slides Complete Guide

## 🎯 Quick Start

### 1. Access Admin Panel
- **URL**: `http://localhost:5173/admin` (development) or your production URL
- **Username**: `admin`
- **Password**: `trq2026`

### 2. Navigate to Hero Slides
- Click on **"Hero Slides"** tab in the left sidebar
- You'll see all 5 hero slides listed

### 3. Edit a Slide
- Click the **Edit** button (pencil icon) on any slide
- Make your changes
- Click **"Save Slide"** button

---

## 📋 Hero Slides Tab - Features

### View All Slides
The main list shows:
- **Slide thumbnail** (left side)
- **Tag** (small text above title)
- **Title** (main heading)
- **Description** (preview text)
- **Video count** (e.g., "2/2 Videos")
- **Image count** (e.g., "3/3 Images")
- **Button labels** (primary and secondary)
- **Status icons** (eye icon = active/inactive)

### Slide Actions
| Icon | Action | Description |
|------|--------|-------------|
| 👁️ | Toggle Active | Show/hide slide on homepage |
| ✏️ | Edit | Open slide editor |
| 🗑️ | Delete | Remove slide permanently |

---

## ✏️ Edit Slide - Complete Walkthrough

### Step 1: Image Preview
At the top of the editor, you'll see a live preview of how the slide looks on the homepage with:
- Background image
- Tag (small text)
- Title (large text)
- Description
- Buttons

### Step 2: Basic Information
Fill in these fields:

**Tag**
- Small text above the title
- Example: "TRQ Design Studio"
- Appears in small caps on the slide

**Title**
- Main heading on the slide
- Example: "Elevating Spaces, Defining Luxury"
- Large, prominent text

**Description**
- Subtitle/description text
- Example: "Premium interior design solutions for discerning clients who demand excellence."
- Appears below the title

**Sort Order**
- Number determining slide position
- 1 = first slide, 2 = second, etc.
- Slides display in ascending order

### Step 3: Image Management
**Main Image (Image 1)**
- Background image for the slide
- Click "Upload Image" to upload from your computer
- Or paste image URL directly
- Supported formats: JPG, PNG, WebP, GIF
- Max file size: 5MB

**Additional Images (Image 2 & 3)**
- Extra images for the slide
- Can be used for gallery or additional content
- Same upload/URL options as main image

### Step 4: Video Management (2 Videos)

#### Video 1
**Video URL**
- Link to video file (e.g., `/POV 1.mp4`)
- Must be MP4 format
- Can be relative path or full URL

**Video Label**
- Text describing the video
- Example: "POV Perspective 1"
- Appears as overlay on video

**Remove Button**
- Click "✕ Remove" to delete this video
- Clears both URL and label

#### Video 2
- Same as Video 1
- Second video for the slide
- Optional

**Note**: Each slide supports exactly 2 videos

### Step 5: Button Configuration

**Primary Button**
- **Text**: Button label (e.g., "VIEW PORTFOLIO")
- **Link To**: Where button navigates
  - home
  - about
  - services
  - workflow
  - portfolio
  - contact
  - pricing

**Secondary Button**
- **Text**: Button label (e.g., "GET IN TOUCH")
- **Link To**: Navigation destination (same options as primary)

### Step 6: Visibility Toggle
**Active (visible on homepage)**
- ✅ Checked = Slide shows on homepage
- ☐ Unchecked = Slide hidden from homepage
- Useful for scheduling or testing

### Step 7: Save
Click **"Save Slide"** button at the bottom right
- Success message appears if saved
- Changes are immediately visible on homepage
- If error occurs, check browser console for details

---

## 🇸🇦 Arabic Slides Tab - Bilingual Content

### Access Arabic Editor
1. Click **"Arabic"** in the left sidebar
2. Click **"Hero Slides"** tab
3. You'll see all 5 slides with Arabic content

### Edit Arabic Content
1. Click **Edit** button on any slide
2. Fill in Arabic fields:
   - **Tag (Arabic)** - Small text in Arabic
   - **Title (Arabic)** - Main heading in Arabic
   - **Description (Arabic)** - Subtitle in Arabic
   - **Video Labels (Arabic)** - 2 video labels in Arabic
   - **Button Text (Arabic)** - Primary and secondary button text in Arabic

### Arabic Text Direction
- All Arabic fields automatically align right-to-left (RTL)
- Text input boxes show `dir="rtl"` attribute
- No need to manually adjust direction

### Save Arabic Content
1. Fill in all Arabic fields
2. Click **"Save Changes"** button
3. Success message confirms save
4. Changes appear immediately on Arabic version of homepage

---

## 🎬 Video Management Guide

### Supported Video Formats
- ✅ MP4 (recommended)
- ✅ WebM
- ✅ Ogg

### Video Sources
**Local Videos** (in `public/` folder)
- `/POV 1.mp4` - POV perspective video
- `/Video.mp4` - General video file
- Reference as: `/filename.mp4`

**External Videos**
- Full URL: `https://example.com/video.mp4`
- Must be publicly accessible
- CORS headers must allow embedding

### Video Best Practices
1. **File Size**: Keep under 50MB for fast loading
2. **Resolution**: 1920x1080 (Full HD) recommended
3. **Duration**: 5-40 seconds ideal for hero slider
4. **Format**: MP4 H.264 codec for best compatibility
5. **Compression**: Use video compression tools to reduce file size

### Video Playback
- Videos play automatically when slide is active
- Muted by default (no audio)
- Loops continuously
- Poster image shows while loading

---

## 🖼️ Image Management Guide

### Image Requirements
- **Format**: JPG, PNG, WebP, GIF
- **Size**: Max 5MB per file
- **Dimensions**: 1920x1080 (16:9 aspect ratio) recommended
- **Optimization**: Compress images for faster loading

### Upload Methods

**Method 1: Upload from Computer**
1. Click "Upload Image" button
2. Select file from your computer
3. Wait for upload to complete
4. Image URL appears automatically

**Method 2: Paste URL**
1. Paste image URL directly in the field
2. Image must be publicly accessible
3. CORS headers must allow embedding

### Image Optimization Tips
1. Use WebP format for smaller file sizes
2. Compress images before uploading
3. Use appropriate dimensions (1920x1080)
4. Remove unnecessary metadata
5. Consider using CDN for faster delivery

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" Error
**Cause**: Backend not running or authentication failed

**Solution**:
1. Check backend is running: `npm start` in `server/` folder
2. Verify backend health: `http://localhost:4242/api/health`
3. Check browser console for detailed error
4. Try logging out and logging back in
5. Clear browser cache and cookies

### Issue: Video Not Playing
**Cause**: Invalid video URL or format

**Solution**:
1. Verify video file exists in `public/` folder
2. Check video URL is correct (e.g., `/POV 1.mp4`)
3. Verify video format is MP4
4. Check video file is not corrupted
5. Try uploading a different video

### Issue: Image Not Displaying
**Cause**: Invalid image URL or format

**Solution**:
1. Verify image file exists
2. Check image URL is correct
3. Verify image format is supported (JPG, PNG, WebP, GIF)
4. Check file size is under 5MB
5. Try uploading a different image

### Issue: Arabic Text Not Saving
**Cause**: Arabic fields not filled or authentication issue

**Solution**:
1. Verify all Arabic fields are filled
2. Check authentication token is valid
3. Try logging out and logging back in
4. Check browser console for errors
5. Verify backend is running

### Issue: Changes Not Appearing on Homepage
**Cause**: Slide not active or cache issue

**Solution**:
1. Verify slide is marked as "Active"
2. Hard refresh homepage (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check if slide is in correct sort order
5. Verify backend is running

---

## 📊 Current Slides Status

### Slide 1: TRQ Design Studio
- **Status**: ✅ Active
- **Videos**: 0/2 (needs videos)
- **Images**: 1/3 (needs 2 more)
- **Arabic**: ❌ Not translated
- **Action**: Add videos and Arabic content

### Slide 2: Luxury Living Spaces
- **Status**: ✅ Active
- **Videos**: 2/2 ✅ Complete
- **Images**: 1/3 (needs 2 more)
- **Arabic**: ✅ Complete
- **Action**: Add images

### Slide 3: Inspiring Workspaces
- **Status**: ✅ Active
- **Videos**: 2/2 ✅ Complete
- **Images**: 1/3 (needs 2 more)
- **Arabic**: ✅ Complete
- **Action**: Add images

### Slide 4: Refined Interiors
- **Status**: ✅ Active
- **Videos**: 2/2 ✅ Complete
- **Images**: 1/3 (needs 2 more)
- **Arabic**: ✅ Complete
- **Action**: Add images

### Slide 5: Featured Projects
- **Status**: ✅ Active
- **Videos**: 2/2 ✅ Complete
- **Images**: 1/3 (needs 2 more)
- **Arabic**: ✅ Complete
- **Action**: Add images

---

## 🚀 Next Steps

### Immediate Actions
1. ✅ Test admin panel login
2. ✅ Edit a slide to verify save works
3. ✅ Add videos to Slide 1
4. ✅ Add Arabic content to Slide 1
5. ✅ Add images to all slides

### Content Improvements
1. Add high-quality images for each slide
2. Add POV videos for better engagement
3. Customize Arabic translations
4. Test on mobile devices
5. Optimize video file sizes

### Deployment
1. Deploy backend to production
2. Deploy frontend to Cloudflare Pages
3. Sync database to Turso (optional)
4. Test on production URL
5. Monitor performance

---

## 📞 Support

### Common Questions

**Q: How many slides can I have?**
A: Unlimited. Add as many as needed using "Add Slide" button.

**Q: Can I reorder slides?**
A: Yes, use the "Sort Order" field. Lower numbers appear first.

**Q: Can I hide a slide without deleting it?**
A: Yes, uncheck the "Active" checkbox to hide it.

**Q: Can I have different content for English and Arabic?**
A: Yes, edit English content in "Hero Slides" tab and Arabic content in "Arabic → Hero Slides" tab.

**Q: What happens if I delete a slide?**
A: It's permanently removed. No undo available.

**Q: Can I upload videos directly?**
A: No, videos must be in `public/` folder or external URL.

**Q: What's the maximum video file size?**
A: No hard limit, but keep under 50MB for fast loading.

**Q: Can I use YouTube videos?**
A: No, only direct MP4 URLs are supported.

---

## 🎓 Best Practices

1. **Always backup** before making major changes
2. **Test on mobile** after making changes
3. **Use high-quality images** for better appearance
4. **Optimize videos** for faster loading
5. **Keep descriptions short** for better readability
6. **Use consistent styling** across all slides
7. **Test Arabic content** on RTL devices
8. **Monitor performance** after changes
9. **Update regularly** with fresh content
10. **Get feedback** from users

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] All 5 slides have titles and descriptions
- [ ] All slides have at least one image
- [ ] Videos are working and playing correctly
- [ ] Arabic content is complete and correct
- [ ] Buttons link to correct pages
- [ ] Slides display correctly on mobile
- [ ] No console errors in browser
- [ ] Backend is running and responsive
- [ ] Database is backed up
- [ ] Changes persist after page reload

---

**Status**: ✅ Admin Panel Ready for Production Use

For technical support, check the backend logs or browser console for error messages.
