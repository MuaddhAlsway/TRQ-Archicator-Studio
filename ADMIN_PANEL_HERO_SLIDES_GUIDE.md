# 🎬 ADMIN PANEL - HERO SLIDES MANAGEMENT GUIDE

**Complete guide to manage hero slides with 2 videos and 3 images**

---

## 📍 WHERE TO FIND HERO SLIDES

### Admin Panel URL
```
https://trq-studio.pages.dev/#/admin
```

### Login Credentials
```
Username: admin
Password: trq2026
```

### Navigation
1. Login to admin panel
2. Look for **"Hero Slides"** in the sidebar
3. Click to open Hero Slides management

---

## 🎯 HERO SLIDES INTERFACE

### Main List View
When you open Hero Slides, you'll see a list of all slides with:

**For Each Slide:**
- 📷 Thumbnail image (left side)
- 📝 Slide title and description
- 📹 Video count (e.g., "2/2 Videos")
- 🖼️ Image count (e.g., "3/3 Images")
- 🔘 Buttons (Primary & Secondary)
- ✏️ Edit button
- 🗑️ Delete button
- 👁️ Active/Inactive toggle

---

## ✏️ HOW TO EDIT A SLIDE

### Step 1: Click Edit
1. Find the slide you want to edit
2. Click the **"Edit"** button (pencil icon)
3. A modal window will open

### Step 2: Edit Basic Information
In the modal, you can edit:
- **Tag:** Category label (e.g., "TRQ Design Studio")
- **Title:** Main heading
- **Description:** Subtitle text
- **Sort Order:** Display order (1, 2, 3, etc.)
- **Active:** Toggle to show/hide on homepage

### Step 3: Update Image
- **Main Image:** Click "Upload Image" or paste URL
- Preview shows in the modal

---

## 🎥 HOW TO ADD/UPDATE VIDEOS (2 Videos)

### Video Section Layout
The video section shows **2 video slots** side by side:

```
┌─────────────────────────────────────────┐
│  📹 Videos (2 Videos)                   │
├─────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────┐ │
│  │  Video 1         │  │  Video 2     │ │
│  │  [URL input]     │  │  [URL input] │ │
│  │  [Label input]   │  │  [Label]     │ │
│  │  ✓ Video added   │  │  ✓ Added     │ │
│  └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────┘
```

### To Add a Video:
1. **Click in the "Video URL" field**
2. **Paste your video URL** (e.g., `/POV 1.mp4` or `https://...`)
3. **Add a label** (e.g., "POV Perspective 1")
4. **Green checkmark** appears when video is added

### To Remove a Video:
1. Click the **"✕ Remove"** button
2. Video URL and label will be cleared

### Video URL Examples
```
/POV 1.mp4              (Local file)
/Video.mp4              (Local file)
https://example.com/video.mp4  (External URL)
```

---

## 🖼️ HOW TO ADD/UPDATE IMAGES (3 Images)

### Image Section Layout
The image section shows **3 image slots** in a row:

```
┌──────────────────────────────────────────────────────┐
│  🖼️ Images (3 Images)                                │
├──────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Image 1  │  │ Image 2  │  │ Image 3  │           │
│  │ [Preview]│  │ [Preview]│  │ [Preview]│           │
│  │ [URL]    │  │ [URL]    │  │ [URL]    │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└──────────────────────────────────────────────────────┘
```

### To Add an Image:
1. **Click in the "Image URL" field**
2. **Paste your image URL** (e.g., `/uploads/image.webp`)
3. **Preview appears** in the box above
4. **Click "✕ Remove"** to clear

### To Upload an Image:
1. Click **"Upload Image"** button (blue button)
2. Select image from your computer
3. Image URL will be automatically filled
4. Preview will appear

### Image URL Examples
```
/uploads/file-1768858211350-451992102.webp
https://example.com/image.jpg
```

---

## 🔘 HOW TO UPDATE BUTTONS

### Button Section
Shows 2 buttons side by side:

**Primary Button (Left):**
- Button text (e.g., "VIEW PORTFOLIO")
- Link destination (Home, About, Services, etc.)

**Secondary Button (Right):**
- Button text (e.g., "GET IN TOUCH")
- Link destination (Home, About, Services, etc.)

### To Update Button:
1. **Change Button Text:** Type new text
2. **Change Link:** Select from dropdown menu
3. Options: Home, About, Services, Workflow, Portfolio, Contact, Pricing

---

## 💾 HOW TO SAVE CHANGES

### Save Button
Located at the bottom right of the modal:

1. **Review all changes** (videos, images, text, buttons)
2. **Click "Save Slide"** button
3. **Wait for confirmation** (usually 1-2 seconds)
4. **Modal closes** and list updates

### If Save Fails:
- Check that all required fields are filled
- Verify video/image URLs are correct
- Try again

---

## 🌍 ARABIC CONTENT (OPTIONAL)

### Arabic Slides Tab
If you need to add Arabic content:

1. Click **"Hero Slides (AR)"** in sidebar
2. Click **"Edit"** on the slide
3. Fill in Arabic fields:
   - Arabic Tag
   - Arabic Title
   - Arabic Description
   - Arabic Video Texts
   - Arabic Buttons
4. Click **"Save Changes"**

---

## 📋 COMPLETE WORKFLOW EXAMPLE

### Example: Update Slide 1 with New Videos

**Step 1: Open Admin Panel**
- Go to: https://trq-studio.pages.dev/#/admin
- Login with admin credentials

**Step 2: Click Edit on Slide 1**
- Find "Elevating Spaces, Defining Luxury"
- Click the Edit button (pencil icon)

**Step 3: Update Videos**
- **Video 1 URL:** `/POV 1.mp4`
- **Video 1 Label:** `POV Perspective 1`
- **Video 2 URL:** `/POV 1.mp4`
- **Video 2 Label:** `POV Perspective 2`

**Step 4: Update Images**
- **Image 1:** `/uploads/image1.webp`
- **Image 2:** `/uploads/image2.webp`
- **Image 3:** `/uploads/image3.webp`

**Step 5: Save**
- Click "Save Slide" button
- Wait for confirmation
- Modal closes

**Step 6: Verify on Frontend**
- Visit: https://trq-studio.pages.dev
- Check that videos and images display correctly

---

## ✅ QUICK CHECKLIST

### Before Saving:
- [ ] Title is filled in
- [ ] Description is filled in
- [ ] Main image is set
- [ ] Video 1 URL is valid
- [ ] Video 2 URL is valid
- [ ] Image 1 URL is valid
- [ ] Image 2 URL is valid
- [ ] Image 3 URL is valid
- [ ] Buttons are configured
- [ ] Slide is set to Active

---

## 🎥 VIDEO MANAGEMENT TIPS

### Video URL Format
- **Local files:** `/POV 1.mp4` or `/Video.mp4`
- **External URLs:** `https://example.com/video.mp4`
- **Format:** MP4 recommended
- **Duration:** 40 seconds per video

### Video Labels
- **Video 1:** "POV Perspective 1"
- **Video 2:** "POV Perspective 2"
- **Video 3:** "Final Result"

### Video Playback
- Each video plays for 40 seconds
- After 2 videos, moves to next slide
- Videos are muted (no audio)
- Videos loop automatically

---

## 🖼️ IMAGE MANAGEMENT TIPS

### Image URL Format
- **Local files:** `/uploads/filename.webp`
- **External URLs:** `https://example.com/image.jpg`
- **Formats:** JPG, PNG, WebP, GIF
- **Size:** Max 5MB per image

### Image Preview
- Preview appears in the modal
- Shows how image will look
- Update URL to change preview

### Image Optimization
- Use WebP format for smaller file size
- Recommended resolution: 1920x1080
- Compress images before uploading

---

## 🆘 TROUBLESHOOTING

### Problem: Video not playing
**Solution:**
1. Check video URL is correct
2. Verify video format is MP4
3. Check video is publicly accessible
4. Try different video URL

### Problem: Image not showing
**Solution:**
1. Check image URL is correct
2. Verify image format is supported
3. Check image is publicly accessible
4. Try uploading image instead

### Problem: Changes not saving
**Solution:**
1. Check all required fields are filled
2. Verify URLs are valid
3. Check browser console for errors
4. Try refreshing page and editing again

### Problem: Can't find Hero Slides tab
**Solution:**
1. Make sure you're logged in
2. Check sidebar for "Hero Slides"
3. Refresh page
4. Try different browser

---

## 📞 SUPPORT

### Admin Panel URL
- https://trq-studio.pages.dev/#/admin

### Frontend URL
- https://trq-studio.pages.dev

### Login
- Username: admin
- Password: trq2026

### Available Video Files
- `/POV 1.mp4` - POV perspective video
- `/Video.mp4` - Regular video

---

## 🎉 YOU'RE READY!

You now know how to:
- ✅ Add/update 2 videos per slide
- ✅ Add/update 3 images per slide
- ✅ Customize slide content
- ✅ Update buttons and links
- ✅ Save changes to database

**Start managing your hero slides! 🚀**

