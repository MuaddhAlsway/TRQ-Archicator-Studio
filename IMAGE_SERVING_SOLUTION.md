# Image Serving Solution for Cloudflare Pages

## Problem
- Videos are now served from Cloudflare Pages (dist folder) ✓
- Images are stored in `/public/` folder but not accessible on Cloudflare Pages
- Cloudflare Workers (backend API) can't access local filesystem

## Current Status
- ✓ Videos (Video1.mp4, Video2.mp4, Video3.mp4) are copied to dist and served from Cloudflare Pages
- ✗ Project images need a solution for serving

## Solutions (in order of preference)

### Solution 1: Cloudflare R2 (Recommended)
1. Create a Cloudflare R2 bucket
2. Upload all images from `/public/` to R2
3. Update database image paths to point to R2 URLs
4. Images will be served from R2 CDN

**Setup:**
```bash
# Install wrangler
npm install -g wrangler

# Create R2 bucket
wrangler r2 bucket create trq-images

# Upload images (script needed)
```

### Solution 2: External CDN
1. Upload images to an external CDN (e.g., Cloudinary, imgix)
2. Update database with CDN URLs
3. Images served from CDN

### Solution 3: Backend Image Serving
1. Deploy backend server (not Workers) that can serve files
2. Create image serving endpoints
3. Update components to use backend URLs

### Solution 4: Embed Images in Database
1. Convert images to base64
2. Store in database
3. Serve directly from database
(Not recommended - large database size)

## Recommended Next Steps

1. **For Videos**: ✓ Already working - served from Cloudflare Pages
2. **For Images**: Set up Cloudflare R2 and upload images
3. **Update Database**: Change image paths to R2 URLs
4. **Update Components**: Use new image URLs

## Current Implementation
- Videos: Served from `/Video1.mp4`, `/Video2.mp4`, `/Video3.mp4` on Cloudflare Pages
- Images: Need to be served from R2 or external CDN
- API: `getImageUrl()` returns placeholder paths (needs R2 integration)

## Files to Update
- `src/api/index.ts` - Update `getImageUrl()` to use R2 URLs
- Database - Update image paths to R2 URLs
- Components - Already set up to use `getImageUrl()` helper

## Testing
- ✓ Videos: https://22091108.trq-studio.pages.dev/Video1.mp4 (200 OK)
- ✗ Images: Need R2 setup
