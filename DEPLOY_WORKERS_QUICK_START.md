# Deploy to Cloudflare Workers + R2 - Quick Start

## TL;DR - 5 Steps to Deploy

### 1. Create R2 Buckets
```bash
wrangler r2 bucket create trq-studio-images
wrangler r2 bucket create trq-studio-images-preview
```

### 2. Create R2 API Token
- Go to https://dash.cloudflare.com → R2 → Settings
- Click "Create API token"
- Copy: Account ID, Access Key ID, Secret Access Key

### 3. Set Environment Variables
```bash
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
export CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
```

### 4. Upload Images & Deploy
```bash
npm install
npm run deploy:full
```

### 5. Test
Visit the URL shown after deployment. Images should load from R2.

---

## What This Does

✅ Builds React frontend (54MB instead of 1.77GB)
✅ Uploads 762 images to R2
✅ Deploys Worker to Cloudflare
✅ Routes requests:
  - `/images/*` → R2
  - `/uploads/*` → R2
  - `/api/*` → Backend (Render)
  - `/*` → Frontend (dist/)

---

## Troubleshooting

**Images not loading?**
```bash
# Check if images uploaded
wrangler r2 object list trq-studio-images | head -20
```

**Worker not deploying?**
```bash
# Authenticate with Cloudflare
wrangler login

# Try again
npm run deploy:worker:prod
```

**API calls failing?**
- Check backend is running: https://trq-express-api.onrender.com/api/projects
- Check Worker logs: `wrangler tail`

---

## Files Changed

- `wrangler.toml` - Added R2 bindings
- `src/worker.js` - New Worker code
- `upload-to-r2.mjs` - New upload script
- `package.json` - Added scripts and AWS SDK

---

## Rollback to Pages

If you want to go back:
```bash
npm run deploy:prod
```

---

## Performance

- **Before**: 1.77GB upload, stuck at 49/59 files
- **After**: 54MB upload, completes in seconds
- **Images**: Served from Cloudflare's global CDN
- **Cost**: ~$5-10/month

Done! 🚀
