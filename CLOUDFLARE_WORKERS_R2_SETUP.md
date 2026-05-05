# Cloudflare Workers + R2 Storage Setup Guide

## Overview
This setup deploys your React frontend to Cloudflare Workers and serves images from Cloudflare R2 (object storage). This solves the upload timeout issue and provides better performance.

## Architecture
```
User Request
    ↓
Cloudflare Workers (src/worker.js)
    ├─ /images/* → R2 Storage (images)
    ├─ /uploads/* → R2 Storage (uploads)
    ├─ /api/* → Backend API (Render)
    └─ /* → Static files (dist/)
```

## Step 1: Create R2 Bucket

### Via Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Navigate to **R2** → **Create bucket**
3. Name: `trq-studio-images`
4. Create bucket
5. Repeat for preview: `trq-studio-images-preview`

### Via Wrangler CLI
```bash
wrangler r2 bucket create trq-studio-images
wrangler r2 bucket create trq-studio-images-preview
```

## Step 2: Create R2 API Token

1. Go to Cloudflare Dashboard → **R2** → **Settings**
2. Click **Create API token**
3. Name: `trq-studio-r2-upload`
4. Permissions: `Object Read & Write`
5. TTL: 1 year (or as needed)
6. Copy the credentials:
   - Account ID
   - Access Key ID
   - Secret Access Key

## Step 3: Set Environment Variables

```bash
# Set these in your shell or .env file
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
```

Or create `.env.local`:
```
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
```

## Step 4: Install Dependencies

```bash
npm install
```

This installs the AWS SDK needed for R2 uploads.

## Step 5: Upload Images to R2

```bash
npm run upload:r2
```

This will:
- Scan `public/` directory
- Upload all images (jpg, png, gif, webp, etc.)
- Skip fonts, videos, and client logos
- Set proper cache headers (1 year)

**Expected output:**
```
🚀 Starting R2 upload...

✓ Uploaded: ALULAH/Image38.png
✓ Uploaded: ALULAH/Image39.png
...
✓ Upload complete!
  Uploaded: 762 files
  Skipped: 0 files
```

## Step 6: Build Frontend

```bash
npm run build
```

This creates `dist/` with only the frontend code (no images).

## Step 7: Deploy to Cloudflare Workers

### Option A: Deploy Everything at Once
```bash
npm run deploy:full
```

This:
1. Builds the frontend
2. Uploads images to R2
3. Deploys Worker to production

### Option B: Deploy Step by Step
```bash
# Build
npm run build

# Upload images
npm run upload:r2

# Deploy worker
npm run deploy:worker:prod
```

### Option C: Deploy to Preview First
```bash
npm run deploy:worker
```

This deploys to preview environment for testing.

## Step 8: Configure Wrangler Auth

If you haven't authenticated with Cloudflare yet:

```bash
wrangler login
```

This opens a browser to authorize Wrangler with your Cloudflare account.

## Step 9: Update Frontend Image URLs

Your frontend code should reference images like:

```javascript
// Instead of: /public/ALULAH/Image38.png
// Use: /images/ALULAH/Image38.png

// Or for uploads:
// /uploads/project-1-1.webp
```

The Worker will automatically route these to R2.

## Step 10: Verify Deployment

1. Visit your Worker URL (shown after deployment)
2. Check that:
   - Frontend loads correctly
   - Images load from R2
   - API calls work to backend
   - SPA routing works (refresh on any page)

## Troubleshooting

### Images not loading
- Check R2 bucket name in `wrangler.toml`
- Verify images were uploaded: `wrangler r2 object list trq-studio-images`
- Check browser console for 404 errors

### API calls failing
- Verify backend URL in Worker: `env.VITE_API_URL`
- Check CORS headers in Worker response
- Test API directly: `curl https://trq-express-api.onrender.com/api/projects`

### Worker deployment fails
- Run `wrangler login` to authenticate
- Check `wrangler.toml` configuration
- Verify R2 bucket names match

### Upload script fails
- Check environment variables are set
- Verify R2 credentials are correct
- Check file permissions in `public/`

## Performance Benefits

✅ **Faster uploads**: 54MB instead of 1.77GB
✅ **Better caching**: Images cached for 1 year
✅ **Global CDN**: Cloudflare's edge network
✅ **Automatic optimization**: Cloudflare optimizes images
✅ **Scalable**: R2 handles unlimited storage

## Cost Estimate

- **Workers**: $0.50/million requests (first 10M free)
- **R2**: $0.015/GB stored + $0.015/GB downloaded
- **Bandwidth**: Included in R2 pricing

For your use case: ~$5-10/month

## Next Steps

1. ✅ Create R2 buckets
2. ✅ Generate API token
3. ✅ Set environment variables
4. ✅ Install dependencies
5. ✅ Upload images
6. ✅ Deploy Worker
7. ✅ Test deployment
8. ✅ Update image URLs in frontend (if needed)

## Rollback

If you need to go back to Pages deployment:

```bash
npm run deploy:prod
```

This deploys to Cloudflare Pages instead of Workers.

## Support

For issues:
- Cloudflare Docs: https://developers.cloudflare.com/workers/
- R2 Docs: https://developers.cloudflare.com/r2/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
