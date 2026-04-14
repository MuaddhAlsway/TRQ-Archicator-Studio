# Feature Usage Guide

## Quick Start for Admins

### 1. HeroSlider - Multiple Videos Per Slide

**Location:** Admin Panel → Hero Slides (EN)

**How to Add Videos:**
1. Click "Add Slide" or edit an existing slide
2. Scroll to "Video Management (Up to 3 videos)" section
3. For each video slot:
   - Enter the video URL (MP4 format)
   - Optionally add custom text for that video
   - Click "Remove" to delete a video
4. Save the slide

**Important Notes:**
- Each video displays for 40 seconds
- Videos cycle automatically
- If no videos are added, the slide shows the image for 5 seconds
- Videos are optional - you can have 1, 2, or 3 videos per slide
- Arabic content: Add Arabic video URLs and text in the same fields

**Example:**
- Video 1: Main project video (40s)
- Video 2: Process video (40s)
- Video 3: Final result video (40s)
- Total slide duration: 120 seconds

---

### 2. AboutUs - Video Management

**Location:** Admin Panel → About Videos

**How to Add Videos:**
1. Click "Add Video"
2. Fill in the details:
   - **Title:** Video title (e.g., "Our Design Process")
   - **Description:** Brief description
   - **Video URL:** Link to MP4 video
   - **Thumbnail Image:** Upload or paste image URL
   - **Sort Order:** Display order (lower numbers appear first)
   - **Active:** Toggle to show/hide on website
3. Click "Save Video"

**Managing Videos:**
- **Edit:** Click the edit icon to modify
- **Delete:** Click the trash icon to remove
- **Toggle Visibility:** Click the eye icon to show/hide
- **Reorder:** Use sort order numbers

**Arabic Content:**
- Each video can have separate Arabic title and description
- Videos display in the About Us page in a 2-column grid
- Language automatically switches based on user selection

---

### 3. CompanyProfile - Language-Specific URLs

**Location:** Admin Panel → Site Settings (EN) → Company Profile

**How to Set URLs:**
1. Go to Admin Panel → Site Settings
2. Click the "Company Profile" tab
3. Enter the URLs:
   - **English Flipbook URL:** Publuu link for English version
   - **Arabic Flipbook URL:** Publuu link for Arabic version (optional)
4. Customize the display text:
   - Title (English & Arabic)
   - Description (English & Arabic)
   - Button text (English & Arabic)
5. Click "Save Settings"

**How It Works:**
- When users visit the Company Profile page in English, they see the English flipbook
- When users switch to Arabic, they see the Arabic flipbook (if set)
- If Arabic URL is not set, it falls back to English
- All text automatically translates based on language selection

**Example URLs:**
- English: `https://publuu.com/flip-book/829640/2262213`
- Arabic: `https://publuu.com/flip-book/XXXXX/YYYYYYY`

---

## Admin Panel Navigation

### English Content Section
- **Hero Slides (EN)** - Manage homepage slider with videos
- **About Videos** - Manage About Us section videos
- **Projects (EN)** - Manage portfolio projects
- **Services (EN)** - Manage services
- **Blog Articles (EN)** - Manage blog posts
- **Site Settings (EN)** - Manage all site content and URLs

### Arabic Content Section
- **Hero Slides (AR)** - Arabic hero slides
- **Projects (AR)** - Arabic projects
- **Services (AR)** - Arabic services
- **Blog Articles (AR)** - Arabic blog posts
- **Site Settings (AR)** - Arabic site settings

---

## Best Practices

### Video Management
✅ Use MP4 format for best compatibility
✅ Keep videos under 100MB for fast loading
✅ Use descriptive titles and text
✅ Test videos on both desktop and mobile
✅ Provide both English and Arabic versions

### About Videos
✅ Use high-quality thumbnail images
✅ Keep descriptions concise (1-2 sentences)
✅ Order videos by importance or process flow
✅ Test visibility toggle before publishing
✅ Use consistent image dimensions

### Company Profile
✅ Ensure both English and Arabic flipbooks are up-to-date
✅ Test URLs before saving
✅ Keep display text consistent with brand voice
✅ Update URLs when flipbooks are updated
✅ Test language switching

---

## Troubleshooting

### Videos Not Playing
- Check video URL is correct and accessible
- Ensure video is in MP4 format
- Check file size (should be under 100MB)
- Try a different video URL to test

### Videos Not Cycling
- Ensure multiple videos are added to the slide
- Check that videos have valid URLs
- Refresh the page to reload
- Check browser console for errors

### Arabic Content Not Showing
- Ensure Arabic text is entered in the admin panel
- Check that language is set to Arabic
- Verify Arabic URLs are correct
- Clear browser cache and reload

### Flipbook Not Loading
- Verify the Publuu URL is correct
- Check that the URL is publicly accessible
- Ensure the URL is in the correct format
- Try opening the URL directly in browser

---

## Content Guidelines

### Video Titles
- Keep under 50 characters
- Use clear, descriptive language
- Avoid special characters
- Example: "Contemporary Luxury Villa Design"

### Video Descriptions
- Keep under 200 characters
- Highlight key features or benefits
- Use professional language
- Example: "Showcasing our design process from concept to completion"

### Display Text
- Keep titles concise
- Use action-oriented button text
- Maintain consistent tone
- Example Button: "Open Company Profile"

---

## Technical Details

### Video Format Support
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (Full HD) recommended
- **Frame Rate:** 24-30 fps
- **Bitrate:** 5-10 Mbps
- **Max Size:** 100MB

### Image Format Support
- **Formats:** JPG, PNG, WebP, GIF
- **Resolution:** 1920x1080 recommended
- **Max Size:** 5MB
- **Aspect Ratio:** 16:9 preferred

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

---

## Support & Help

For issues or questions:
1. Check this guide first
2. Review the admin panel help text
3. Test with different browsers
4. Check browser console for errors
5. Contact technical support if needed

---

## Updates & Changes

**Last Updated:** 2026
**Version:** 1.0
**Status:** Production Ready

All features are fully tested and ready for production use.
