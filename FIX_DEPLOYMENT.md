# Fix Deployment Issues

## Problem
1. **Error 522** - Cloudflare Pages is timing out trying to reach an origin server
2. **API 404s** - Frontend can't reach the API

## Root Cause
Pages was deployed without proper configuration. It's trying to act as a reverse proxy instead of serving static files.

## Solution

### Step 1: Delete the broken Pages project
```powershell
wrangler pages project delete trq-studio-github
```

### Step 2: Create a new Pages project with proper configuration
```powershell
wrangler pages project create trq-studio-live --production-branch main
```

### Step 3: Deploy the static files
```powershell
wrangler pages deploy dist --project-name trq-studio-live --branch main
```

### Step 4: Verify deployment
Visit: https://trq-studio-live.pages.dev

---

## What's Different
- **Old approach**: Tried to use Pages as a reverse proxy (wrong)
- **New approach**: Pages serves static files only, API is separate (correct)

---

## Your URLs After Fix
- **Frontend**: https://trq-studio-live.pages.dev
- **API**: https://trq-api-production.tareq-232.workers.dev/api

---

## Why This Works
1. Pages serves your React app as static files (HTML, CSS, JS)
2. Your React app makes API calls to the Workers endpoint
3. No origin server needed - Pages is the origin

