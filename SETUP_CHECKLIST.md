# Cloudflare Workers + R2 Setup Checklist

## ✅ Completed
- [x] Created `src/worker.js` - Cloudflare Worker code
- [x] Created `upload-to-r2.mjs` - R2 upload script
- [x] Updated `wrangler.toml` - R2 bindings configured
- [x] Updated `package.json` - Added scripts and AWS SDK
- [x] Built frontend - `dist/` ready (54MB)
- [x] Installed dependencies - AWS SDK installed

## ⏳ TODO - Manual Setup Required

### Step 1: Enable R2 in Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Click **R2** in left sidebar
3. Click **Get Started** (if not already enabled)
4. Accept terms and enable R2

**Time: 2 minutes**

### Step 2: Create R2 Buckets
1. In Cloudflare Dashboard, go to **R2**
2. Click **Create bucket**
3. Name: `trq-studio-images`
4. Click **Create bucket**
5. Repeat for: `trq-studio-images-preview`

**Time: 2 minutes**

### Step 3: Create R2 API Token
1. In R2, click **Settings** (bottom left)
2. Click **Create API token**
3. Name: `trq-studio-r2-upload`
4. Permissions: Select **Object Read & Write**
5. TTL: 1 year (or as needed)
6. Click **Create API token**
7. Copy these three values:
   - Account ID
   - Access Key ID
   - Secret Access Key

**Time: 3 minutes**

### Step 4: Set Environment Variables
Open PowerShell and run:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
$env:CLOUDFLARE_R2_ACCESS_KEY_ID = "your-access-key"
$env:CLOUDFLARE_R2_SECRET_ACCESS_KEY = "your-secret-key"
```

Or create `.env.local` file:
```
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
```

**Time: 2 minutes**

### Step 5: Authenticate with Cloudflare
```bash
wrangler login
```

This opens a browser to authorize Wrangler.

**Time: 1 minute**

### Step 6: Upload Images to R2
```bash
npm run upload:r2
```

This uploads 762 images to R2.

**Expected output:**
```
✓ Uploaded: ALULAH/Image38.png
✓ Uploaded: ALULAH/Image39.png
...
✓ Upload complete!
  Uploaded: 762 files
  Skipped: 0 files
```

**Time: 5-10 minutes** (depends on internet speed)

### Step 7: Deploy to Cloudflare Workers
```bash
npm run deploy:worker:prod
```

This deploys the Worker to production.

**Expected output:**
```
✨ Compiled Worker successfully
✓ Uploaded Worker script
✓ Deployed to trq-studio.pages.dev
```

**Time: 2 minutes**

### Step 8: Test Deployment
1. Visit the URL shown after deployment
2. Check that:
   - Frontend loads
   - Images load (check Network tab)
   - API calls work
   - SPA routing works (refresh on /portfolio)

**Time: 5 minutes**

## Total Setup Time: ~25 minutes

## Commands to Run (In Order)

```bash
# 1. Authenticate
wrangler login

# 2. Set environment variables (PowerShell)
$env:CLOUDFLARE_ACCOUNT_ID = "your-id"
$env:CLOUDFLARE_R2_ACCESS_KEY_ID = "your-key"
$env:CLOUDFLARE_R2_SECRET_ACCESS_KEY = "your-secret"

# 3. Upload images
npm run upload:r2

# 4. Deploy
npm run deploy:worker:prod
```

## Troubleshooting

### "R2 not enabled" error
- Go to https://dash.cloudflare.com → R2 → Get Started
- Enable R2 and try again

### "Bucket not found" error
- Make sure buckets are created:
  - `trq-studio-images`
  - `trq-studio-images-preview`

### "Invalid credentials" error
- Check environment variables are set correctly
- Verify API token has Object Read & Write permissions

### Images not loading
- Check R2 bucket has files: `wrangler r2 object list trq-studio-images`
- Check Worker logs: `wrangler tail`

### Worker deployment fails
- Run `wrangler login` again
- Check `wrangler.toml` is valid
- Try: `wrangler deploy --env production`

## Next Steps After Setup

1. ✅ Monitor deployment at https://dash.cloudflare.com → Workers
2. ✅ Check R2 storage usage at https://dash.cloudflare.com → R2
3. ✅ Set up custom domain (optional)
4. ✅ Configure analytics (optional)

## Support

- Cloudflare Docs: https://developers.cloudflare.com/workers/
- R2 Docs: https://developers.cloudflare.com/r2/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
