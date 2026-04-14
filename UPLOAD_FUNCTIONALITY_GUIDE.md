# Upload Functionality Guide

## Overview
The system now supports uploading both images and videos locally. All uploads are stored in `public/uploads/` and work on both local development and Cloudflare Pages.

## Supported File Types

### Images
- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.webp` - WebP images
- `.gif` - GIF images
- `.svg` - SVG vector images

### Videos
- `.mp4` - MPEG-4 video
- `.webm` - WebM video
- `.ogv` - Ogg Theora video
- `.mov` - QuickTime video

## File Size Limits
- **Maximum file size**: 100MB per file
- Images: Recommended under 5MB
- Videos: Recommended under 50MB

## Upload Endpoints

### Upload File
```
POST /api/upload
Headers: Authorization: Bearer {token}
Body: FormData with 'file' field
Response: { success: true, url: "/uploads/filename.ext" }
```

### Delete File
```
DELETE /api/upload/{filename}
Headers: Authorization: Bearer {token}
Response: { success: true, message: "File deleted" }
```

## Admin Panel Upload Features

### Where to Upload

1. **Hero Slides**
   - Admin → 🇬🇧 Hero Slides (EN)
   - Edit slide → Image field
   - Click "Upload Image" button

2. **About Videos**
   - Admin → 🇬🇧 About Videos
   - Edit video → Thumbnail Image field
   - Click "Upload Image" button

3. **Projects**
   - Admin → 🇬🇧 Projects (EN)
   - Edit project → Image fields
   - Click "Upload Image" button

4. **Services**
   - Admin → 🇬🇧 Services (EN)
   - Edit service → Image field
   - Click "Upload Image" button

5. **Blog Articles**
   - Admin → 🇬🇧 Blog Articles (EN)
   - Edit article → Featured Image field
   - Click "Upload Image" button

## How to Upload

### Step 1: Click Upload Button
- Find the upload button in the admin form
- Usually labeled "Upload Image" or "Upload Video"

### Step 2: Select File
- Click the button to open file picker
- Select image or video from your computer
- File must be under 100MB

### Step 3: Wait for Upload
- File uploads to server
- Progress indicator shows upload status
- Success message appears when complete

### Step 4: Confirm Upload
- Image/video URL appears in the field
- Preview shows the uploaded file
- Save the form to apply changes

## Upload Paths

### Local Development
- Files stored in: `public/uploads/`
- Accessed via: `/uploads/filename.ext`
- Example: `/uploads/1234567890-abc123def.jpg`

### Cloudflare Pages
- Files stored in: `public/uploads/`
- Accessed via: `https://trq-studio.pages.dev/uploads/filename.ext`
- Same path structure as local

## File Naming
- Uploaded files get unique names: `{timestamp}-{randomhash}.{ext}`
- Example: `1709067600000-a1b2c3d4e5f6g7h8.jpg`
- Original filename is not preserved (for security)

## Troubleshooting

### Upload Failed
1. Check file size (max 100MB)
2. Verify file type is supported
3. Check internet connection
4. Try a different file
5. Check browser console for errors

### File Not Showing
1. Verify upload was successful
2. Check file URL in database
3. Refresh page to reload
4. Check if file exists in `public/uploads/`

### Large Video Upload Slow
1. Videos over 50MB may take time
2. Check internet speed
3. Try uploading in smaller chunks
4. Consider compressing video first

## Best Practices

1. **Image Optimization**
   - Use WebP format for better compression
   - Resize to appropriate dimensions
   - Keep under 5MB for fast loading

2. **Video Optimization**
   - Use MP4 format for best compatibility
   - Compress video before uploading
   - Keep under 50MB for fast uploads
   - Use 1080p or lower resolution

3. **File Organization**
   - Use descriptive names before uploading
   - Keep track of uploaded files
   - Delete unused files to save space

4. **Security**
   - Only upload files you own
   - Don't upload sensitive data
   - Verify file integrity after upload

## API Usage Example

### Upload with JavaScript
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
if (result.success) {
  console.log('File URL:', result.url);
}
```

### Delete with JavaScript
```javascript
const response = await fetch('/api/upload/filename.ext', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log('File deleted');
}
```

## Storage Location
- **Local**: `public/uploads/`
- **Cloudflare**: Deployed with dist folder
- **Database**: Stores file URLs, not files

## Deployment Notes
- Uploads persist in `public/uploads/`
- Files are included in Cloudflare Pages deployment
- No external storage needed
- All files served from same domain

## Support
For upload issues:
1. Check file type and size
2. Verify authentication token
3. Check server logs for errors
4. Ensure `public/uploads/` directory exists
