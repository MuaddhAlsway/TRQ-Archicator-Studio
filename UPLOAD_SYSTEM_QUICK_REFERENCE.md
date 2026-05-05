# Upload System Quick Reference

## Overview
The upload system allows users to upload images and videos through the admin panel. Files are stored in `public/uploads/` and served via the Express server.

## System Architecture

```
Frontend (React)
    ↓
Admin Panel Upload Component
    ↓
API Endpoint: POST /api/upload
    ↓
Express Server (multer middleware)
    ↓
public/uploads/ (file storage)
    ↓
Served via: /uploads/[filename]
```

## API Endpoints

### Upload File
**Endpoint:** `POST /api/upload`

**Request:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
// Returns: { success: true, filename: 'abc123.jpg', url: '/uploads/abc123.jpg' }
```

**Response:**
```json
{
  "success": true,
  "filename": "abc123.jpg",
  "url": "/uploads/abc123.jpg",
  "size": 245632,
  "mimetype": "image/jpeg"
}
```

### Get Uploaded Files
**Endpoint:** `GET /api/uploads`

**Response:**
```json
[
  {
    "filename": "abc123.jpg",
    "size": 245632,
    "uploadedAt": "2026-05-04T10:30:00Z"
  }
]
```

### Delete File
**Endpoint:** `DELETE /api/uploads/:filename`

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## File Size Limits

- **Images:** 10MB max
- **Videos:** 100MB max
- **Default:** 50MB

Configure in `server/upload-handler.js`:
```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});
```

## Supported File Types

**Images:**
- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`

**Videos:**
- `.mp4`
- `.webm`
- `.mov`

## Testing

### Validate System Configuration
```bash
node validate-upload-system.mjs
```

This checks:
- ✅ Upload routes configured
- ✅ Upload handler exists
- ✅ Uploads directory exists
- ✅ Environment variables set
- ✅ Dependencies installed
- ✅ Test files available

### Run Comprehensive Tests
```bash
node test-upload-comprehensive.mjs
```

Tests:
1. Upload image file
2. Upload video file
3. Get uploaded files list
4. Delete uploaded file

### Manual Testing

**1. Start the server:**
```bash
cd server
npm run dev
```

**2. Test upload with curl:**
```bash
curl -X POST -F "file=@public/LOGO.png" http://localhost:3000/api/upload
```

**3. Test with JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', document.getElementById('fileInput').files[0]);

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('Upload successful:', data))
.catch(err => console.error('Upload failed:', err));
```

## Troubleshooting

### Issue: "File not found" error
**Solution:** Ensure `public/uploads/` directory exists
```bash
mkdir -p public/uploads
```

### Issue: "CORS error" when uploading
**Solution:** Check CORS configuration in `server/index.js`
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Issue: "File too large" error
**Solution:** Increase file size limit in `server/upload-handler.js`
```javascript
limits: {
  fileSize: 200 * 1024 * 1024 // 200MB
}
```

### Issue: "Unsupported file type" error
**Solution:** Add file type to whitelist in `server/upload-handler.js`
```javascript
const allowedMimes = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'your/mimetype'
];
```

## File Organization

```
public/
├── uploads/
│   ├── abc123.jpg
│   ├── def456.mp4
│   └── ghi789.png
├── LOGO.png
├── Video1.mp4
└── ...
```

## Security Considerations

1. **File Type Validation:** Only allow specific MIME types
2. **File Size Limits:** Prevent disk space exhaustion
3. **Filename Sanitization:** Prevent directory traversal attacks
4. **Access Control:** Require authentication for uploads
5. **Virus Scanning:** Consider adding antivirus scanning for production

## Environment Variables

**.env.development:**
```
API_URL=http://localhost:3000
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=104857600
```

**.env.production:**
```
API_URL=https://your-domain.com
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=104857600
```

## Performance Tips

1. **Compress images** before upload
2. **Use CDN** for serving uploaded files
3. **Implement chunked uploads** for large files
4. **Add progress tracking** for better UX
5. **Clean up old files** periodically

## Integration with Admin Panel

The upload system integrates with the admin panel for:
- Project cover images
- Project gallery images
- Hero slider images
- About section videos
- Service images
- Settings images

Example usage in admin panel:
```javascript
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const { url } = await response.json();
  return url; // Use this URL in your data
};
```

## Next Steps

1. ✅ Validate system: `node validate-upload-system.mjs`
2. ✅ Run tests: `node test-upload-comprehensive.mjs`
3. ✅ Start server: `npm run dev` (in server directory)
4. ✅ Test upload: Use admin panel or API
5. ✅ Monitor uploads: Check `public/uploads/` directory

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review server logs for errors
3. Validate system configuration
4. Run comprehensive tests
5. Check file permissions on `public/uploads/`
