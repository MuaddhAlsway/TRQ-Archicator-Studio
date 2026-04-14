# Cloudflare Image & Video Path Fixes

## Problem
Image and video paths on Cloudflare Pages were not being converted to absolute URLs, causing broken images and videos on the deployed site.

## Root Cause
The `processImagePaths()` function in the Cloudflare Workers API handler was incomplete:
- Only processed `image` and `gallery` fields
- Did not process video fields (`video`, `video_2`, `video_3`, `video_url`)
- The `/api/slides/active` endpoint had custom path processing that only handled `image` and `video`, missing `video_2` and `video_3`

## Solution Applied

### 1. Enhanced `processImagePaths()` Function
**File:** `functions/api/[[route]].js`

Updated the function to handle all image and video fields:
```javascript
function processImagePaths(obj, baseUrl = 'https://trq-studio.pages.dev') {
  // ... existing code ...
  
  // Process video fields (hero slides and about videos)
  const videoFields = ['video', 'video_2', 'video_3', 'video_url', 'video_url_ar'];
  videoFields.forEach(field => {
    if (processed[field] && typeof processed[field] === 'string' && processed[field].startsWith('/')) {
      processed[field] = `${baseUrl}${processed[field]}`;
    }
  });
  
  return processed;
}
```

### 2. Updated `/api/slides/active` Endpoint
Changed from custom path processing to use the enhanced `processImagePaths()` function:
```javascript
// Before: Custom processing only handled image and video
const processedRows = slidesToReturn.map(row => ({
  ...row,
  image: row.image && row.image.startsWith('/') ? `https://trq-studio.pages.dev${row.image}` : row.image,
  video: row.video && row.video.startsWith('/') ? `https://trq-studio.pages.dev${row.video}` : row.video
}));

// After: Uses enhanced processImagePaths function
const processedRows = processImagePaths(slidesToReturn);
```

## Endpoints Fixed

All these endpoints now properly convert relative paths to absolute URLs:

1. **`GET /api/slides`** - All hero slides with all image/video fields
2. **`GET /api/slides/active`** - Active hero slides with all image/video fields
3. **`GET /api/projects`** - All projects with image and gallery fields
4. **`GET /api/projects/published`** - Published projects with image and gallery fields
5. **`GET /api/projects/:id`** - Individual project with image and gallery fields
6. **`GET /api/services`** - All services with image field
7. **`GET /api/services/active`** - Active services with image field

## Fields Now Processed

- `image` - Project/service/slide cover image
- `gallery` - Project gallery (JSON array of image paths)
- `video` - Hero slide primary video
- `video_2` - Hero slide secondary video
- `video_3` - Hero slide tertiary video
- `video_url` - About video URL
- `video_url_ar` - About video Arabic URL

## Path Conversion Example

**Before (broken on Cloudflare):**
```json
{
  "image": "/uploads/project-1.webp",
  "video": "/Video.mp4"
}
```

**After (working on Cloudflare):**
```json
{
  "image": "https://trq-studio.pages.dev/uploads/project-1.webp",
  "video": "https://trq-studio.pages.dev/Video.mp4"
}
```

## Testing
To verify the fix:
1. Deploy to Cloudflare
2. Check browser DevTools Network tab
3. All image and video URLs should be absolute (starting with `https://trq-studio.pages.dev`)
4. Images and videos should load without 404 errors

## Notes
- Paths that already start with `http://` or `https://` are left unchanged
- The base URL is hardcoded to `https://trq-studio.pages.dev` - update if domain changes
- Local development (server) doesn't need this processing as it serves relative paths directly
