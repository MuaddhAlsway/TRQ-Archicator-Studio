# About Videos Customization Guide

## Overview
The About page hero section now supports fully customizable videos through the admin panel. You can manage videos, add titles, descriptions, and support both English and Arabic content.

## How It Works

### Frontend Component
- **File**: `src/components/AboutVideoHero.tsx`
- **Functionality**: 
  - Fetches active videos from the API
  - Displays the first video as the hero background
  - Supports bilingual content (English & Arabic)
  - Automatically switches video based on language selection
  - Falls back to default video if no custom video is configured

### Admin Panel
- **Location**: Admin Dashboard → 🇬🇧 About Videos
- **Features**:
  - Create, edit, and delete videos
  - Upload thumbnail images
  - Set video sort order
  - Toggle visibility (active/inactive)
  - Add English and Arabic content separately

## Managing About Videos

### Step 1: Access Admin Panel
1. Go to `http://localhost:5173/admin` (or your production URL)
2. Login with your admin credentials
3. Click on "🇬🇧 About Videos" in the sidebar

### Step 2: Create a New Video
1. Click the "Add Video" button
2. Fill in the following fields:

#### English Content
- **Title**: Main heading (e.g., "About TRQ Studio")
- **Description**: Subtitle text (e.g., "We are a luxury interior design studio...")
- **Video URL**: Link to MP4 video file (e.g., `/Video.mp4` or full URL)
- **Thumbnail Image**: Upload or paste image URL for preview

#### Arabic Content (Optional)
- **Title (Arabic)**: Arabic heading (e.g., "عن استوديو TRQ")
- **Description (Arabic)**: Arabic subtitle
- **Video URL (Arabic)**: Separate video for Arabic (optional)

#### Settings
- **Sort Order**: Display order (lower numbers appear first)
- **Active**: Toggle to show/hide on the About page

### Step 3: Save and Publish
1. Click "Save Video"
2. Video appears immediately on the About page
3. Only active videos are displayed to visitors

## Video Configuration Examples

### Example 1: Single Video (English Only)
```
Title: About TRQ Studio
Description: We are a luxury interior design studio...
Video URL: /Video.mp4
Thumbnail: [upload image]
Active: ✓
```

### Example 2: Bilingual Videos
```
English:
- Title: About TRQ Studio
- Description: We are a luxury interior design studio...
- Video URL: /Video.mp4

Arabic:
- Title: عن استوديو TRQ
- Description: نحن استوديو تصميم داخلي فاخر...
- Video URL: /POV 1.mp4
```

## Video URL Sources

### Local Videos (Recommended)
- Place videos in the `public/` folder
- Reference as: `/Video.mp4` or `/POV 1.mp4`
- Examples: `/Video.mp4`, `/POV 1.mp4`

### External URLs
- Use full URLs: `https://example.com/video.mp4`
- Ensure CORS headers allow embedding
- Recommended: Use CDN for better performance

## API Endpoints

### Get All Videos
```
GET /api/about-videos
```

### Get Active Videos Only
```
GET /api/about-videos/active
```

### Create Video
```
POST /api/about-videos
Headers: Authorization: Bearer {token}
Body: {
  title: string,
  description: string,
  video_url: string,
  image?: string,
  sortOrder: number,
  isActive: 1 | 0,
  title_ar?: string,
  description_ar?: string,
  video_url_ar?: string
}
```

### Update Video
```
PUT /api/about-videos/{id}
Headers: Authorization: Bearer {token}
Body: [same as POST]
```

### Delete Video
```
DELETE /api/about-videos/{id}
Headers: Authorization: Bearer {token}
```

## Database Schema

### about_videos Table
```sql
CREATE TABLE about_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  image TEXT,
  sortOrder INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  title_ar TEXT,
  description_ar TEXT,
  video_url_ar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Features

✅ **Bilingual Support**: English and Arabic content
✅ **Multiple Videos**: Create multiple videos with sort order
✅ **Visibility Control**: Toggle videos on/off without deleting
✅ **Thumbnail Upload**: Upload custom preview images
✅ **Language Switching**: Automatically switches video based on user language
✅ **Fallback Support**: Uses default video if none configured
✅ **Admin Panel**: Full CRUD operations with intuitive UI

## Troubleshooting

### Video Not Showing
1. Check if video is marked as "Active" in admin panel
2. Verify video URL is correct and accessible
3. Check browser console for errors
4. Ensure video file format is MP4

### Arabic Content Not Displaying
1. Verify Arabic title and description are filled in
2. Check if Arabic video URL is provided (optional)
3. Switch language to Arabic to test
4. Check browser console for API errors

### Image Upload Failed
1. Ensure file is an image (JPG, PNG, WebP, GIF)
2. Check file size is under 5MB
3. Verify you're logged in with valid token
4. Check network tab for upload errors

## Best Practices

1. **Video Format**: Use MP4 format for best compatibility
2. **Video Size**: Keep videos under 50MB for fast loading
3. **Thumbnail**: Upload high-quality thumbnail images (16:9 aspect ratio)
4. **Descriptions**: Keep descriptions concise and engaging
5. **Sort Order**: Use sequential numbers (1, 2, 3...) for clarity
6. **Bilingual**: Always provide both English and Arabic for full accessibility

## Files Modified

- `src/components/AboutVideoHero.tsx` - Updated to fetch from API
- `src/admin/AdminAboutVideos.tsx` - Admin panel for video management
- `server/index.js` - API endpoints for about videos
- `server/database.js` - Database table definition
- `src/api/index.ts` - API client functions

## Next Steps

1. Access the admin panel
2. Navigate to "About Videos"
3. Create your first video
4. Test on the About page
5. Switch languages to verify bilingual support
