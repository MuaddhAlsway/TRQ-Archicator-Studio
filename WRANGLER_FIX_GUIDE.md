# Wrangler Deployment Fix - 826 Files Issue

## Root Cause
Wrangler was attempting to upload the entire `dist` folder (827 files) along with the worker code. Cloudflare Workers has deployment size and file count limits.

## Solution Applied

### 1. Updated `wrangler.toml`
Added `exclude_dirs` configuration to prevent large directories from being uploaded:

```toml
exclude_dirs = ["dist", "node_modules", "public", "videos", "Graphik_Collection", "GretaTextArabicAR+LT_complete_OTF", "larsseit-sans-serif-font-family", "NewsFontFamily"]
```

### 2. Why This Works
- **dist**: Frontend build output (not needed in worker)
- **node_modules**: Dependencies (Wrangler bundles what's needed)
- **public**: Static assets (should be served via R2 or Pages)
- **Font/Video folders**: Large media files (not needed in worker)

### 3. Deployment Strategy

Your deployment should follow this order:

```
1. Build frontend: npm run build
   → Creates optimized dist/ folder

2. Upload assets to R2: node upload-to-r2.mjs
   → Uploads images/videos to Cloudflare R2

3. Deploy worker: wrangler deploy --env production
   → Deploys only src/worker.js and dependencies
   → Now excludes the 827 files from dist/
```

### 4. How to Deploy

**Option A: Using the PowerShell script (recommended)**
```powershell
.\RUN_DEPLOYMENT.ps1
```

**Option B: Manual deployment**
```powershell
npm run build
node upload-to-r2.mjs
wrangler deploy --env production
```

### 5. Verification

After deployment, check:
1. Worker is live: `wrangler tail` (shows logs)
2. API endpoints respond: Test `/api/projects`, `/api/settings`
3. Images load from R2: Check browser Network tab
4. No 413 or file limit errors in Wrangler output

### 6. If Issues Persist

If you still see file count errors:

```powershell
# Clean build artifacts
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force .wrangler

# Rebuild and deploy
npm run build
wrangler deploy --env production
```

## Summary
The issue was **not** with your code, but with Wrangler trying to upload unnecessary files. The `exclude_dirs` configuration now ensures only the worker code is deployed, keeping the package size well within Cloudflare's limits.
