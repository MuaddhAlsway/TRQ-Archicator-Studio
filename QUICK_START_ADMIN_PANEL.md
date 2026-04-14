# Hero Slides Admin Panel - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Login
```
URL: http://localhost:5173/admin
Username: admin
Password: trq2026
```

### Step 2: Go to Hero Slides
Click **"Hero Slides"** in the left sidebar

### Step 3: Edit a Slide
1. Click the **Edit** button (pencil icon)
2. Make your changes
3. Click **"Save Slide"**

---

## 📝 What You Can Edit

### Basic Info
- **Tag**: Small text above title (e.g., "TRQ Design Studio")
- **Title**: Main heading (e.g., "Elevating Spaces, Defining Luxury")
- **Description**: Subtitle text
- **Sort Order**: Position in slider (1 = first)

### Media
- **Image**: Main background image (upload or paste URL)
- **Image 2 & 3**: Additional images
- **Video 1 & 2**: Video URLs (e.g., `/POV 1.mp4`)
- **Video Labels**: Text for each video

### Buttons
- **Primary Button**: Text and link destination
- **Secondary Button**: Text and link destination

### Visibility
- **Active**: Check to show on homepage, uncheck to hide

---

## 🎬 Add Videos

1. In slide editor, find **"Videos (2 Videos)"** section
2. Enter video URL: `/POV 1.mp4` or `/Video.mp4`
3. Enter video label: "POV Perspective 1"
4. Click **"Save Slide"**

**Available Videos**:
- `/POV 1.mp4` - POV perspective
- `/Video.mp4` - General video

---

## 🖼️ Add Images

1. In slide editor, find **"Images (3 Images)"** section
2. Click **"Upload Image"** or paste URL
3. Click **"Save Slide"**

**Supported Formats**: JPG, PNG, WebP, GIF
**Max Size**: 5MB

---

## 🇸🇦 Add Arabic Content

1. Click **"Arabic"** in left sidebar
2. Click **"Hero Slides"** tab
3. Click **"Edit"** on any slide
4. Fill in Arabic fields:
   - Tag (Arabic)
   - Title (Arabic)
   - Description (Arabic)
   - Video labels (Arabic)
   - Button text (Arabic)
5. Click **"Save Changes"**

---

## ✅ Current Status

| Slide | Title | Videos | Arabic | Status |
|-------|-------|--------|--------|--------|
| 1 | Elevating Spaces | 0/2 | ❌ | Needs videos |
| 2 | Luxury Living | 2/2 ✅ | ✅ | Complete |
| 3 | Inspiring Workspaces | 2/2 ✅ | ✅ | Complete |
| 4 | Refined Interiors | 2/2 ✅ | ✅ | Complete |
| 5 | Featured Projects | 2/2 ✅ | ✅ | Complete |

---

## 🆘 Troubleshooting

### "Failed to fetch" Error
- Check backend is running: `npm start` in `server/` folder
- Verify: `http://localhost:4242/api/health`

### Video Not Playing
- Check video URL is correct (e.g., `/POV 1.mp4`)
- Verify video file exists in `public/` folder

### Image Not Uploading
- Check file size (max 5MB)
- Verify format (JPG, PNG, WebP, GIF)

### Arabic Text Not Saving
- Verify all Arabic fields are filled
- Check authentication token is valid
- Try logging out and back in

---

## 📞 Need Help?

See full guides:
- **ADMIN_PANEL_HERO_SLIDES_COMPLETE_GUIDE.md** - Complete instructions
- **HERO_SLIDES_ADMIN_PANEL_READY.md** - Technical details
- **WORK_COMPLETED_SUMMARY.md** - What was fixed

---

**Status**: ✅ Ready to Use
**Backend**: Running on http://localhost:4242
**Frontend**: http://localhost:5173
