# About Videos - Quick Start

## Access Admin Panel
1. Go to Admin Dashboard
2. Click "🇬🇧 About Videos" in sidebar

## Add a Video
1. Click "Add Video" button
2. Fill in:
   - **Title**: "About TRQ Studio"
   - **Description**: Your description text
   - **Video URL**: `/Video.mp4` or full URL
   - **Thumbnail**: Upload image
3. Click "Save Video"

## Add Arabic Version
1. Edit the video
2. Scroll down to Arabic fields
3. Fill in:
   - **Title (Arabic)**: "عن استوديو TRQ"
   - **Description (Arabic)**: Arabic text
   - **Video URL (Arabic)**: Optional separate video
4. Click "Save Video"

## Make Video Active
- Toggle the eye icon to show/hide
- Only active videos appear on About page

## Video URLs
- Local: `/Video.mp4`, `/POV 1.mp4`
- External: `https://example.com/video.mp4`

## Features
✅ Bilingual (English & Arabic)
✅ Multiple videos with sort order
✅ Toggle visibility
✅ Upload thumbnails
✅ Auto-switches based on language

## Files
- Admin: `src/admin/AdminAboutVideos.tsx`
- Component: `src/components/AboutVideoHero.tsx`
- API: `server/index.js` (about-videos endpoints)
- Database: `about_videos` table
