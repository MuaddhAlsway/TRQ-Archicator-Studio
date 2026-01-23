# Cloudflare Deployment Checklist

## Pre-Deployment Verification

### 1. Hero Slides Order ✓
- [x] Slide 1: "Elevating Spaces, Defining Luxury"
- [x] Slide 2: "Luxury Living Spaces"
- [x] Slide 3: "Inspiring Workspaces"
- [x] Slide 4: "Refined Interiors"
- [x] Slide 5: "Featured Projects"

### 2. Backend (Cloudflare Workers)
- [ ] Update `server/worker.js` with correct slide ordering (DONE)
- [ ] Verify Turso database connection
- [ ] Test API endpoints locally
- [ ] Deploy with: `wrangler deploy`

### 3. Frontend (Cloudflare Pages)
- [ ] Build frontend: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Push to GitHub
- [ ] Cloudflare Pages auto-deploys from GitHub

### 4. Environment Variables

#### Cloudflare Pages Settings
```
VITE_API_URL = https://trq-api-prod.muaddhalsway.workers.dev/api
```

#### Cloudflare Workers Settings (wrangler.toml)
```toml
[env.production]
vars = { TURSO_AUTH_TOKEN = "your-token-here" }
```

## Deployment Steps

### Step 1: Deploy Backend (Workers)
```bash
cd server
wrangler deploy
```

Expected output:
```
✓ Uploaded worker successfully
✓ Deployed to https://trq-api-prod.muaddhalsway.workers.dev
```

### Step 2: Build Frontend
```bash
npm run build
```

Expected output:
```
✓ built in 2.34s
✓ dist/ ready for deployment
```

### Step 3: Deploy Frontend (Pages)
```bash
git add .
git commit -m "Deploy: Hero slides order maintained"
git push origin main
```

Cloudflare Pages will automatically:
1. Detect the push
2. Build the project
3. Deploy to `https://production.trq-studio.pages.dev`

### Step 4: Verify Deployment

#### Test API
```bash
curl https://trq-api-prod.muaddhalsway.workers.dev/api/slides/active
```

#### Test Frontend
1. Visit: `https://production.trq-studio.pages.dev`
2. Verify hero slides rotate in correct order
3. Check browser console for errors
4. Test both English and Arabic versions

## Post-Deployment Verification

### API Response Check
```bash
# Should return slides in order 1, 2, 3, 4, 5
curl https://trq-api-prod.muaddhalsway.workers.dev/api/slides/active | jq '.[] | {id, title}'
```

### Frontend Check
- [ ] Hero slider displays slide 1 first
- [ ] Slides rotate every 5 seconds
- [ ] Progress bar shows correct count (01/05, 02/05, etc.)
- [ ] Buttons work correctly
- [ ] Arabic version displays correctly
- [ ] Images load properly

### Database Check
```sql
SELECT id, sortOrder, tag, title, isActive 
FROM hero_slides 
ORDER BY sortOrder ASC;
```

Expected:
```
1 | 1 | TRQ Design Studio | Elevating Spaces, Defining Luxury | 1
2 | 2 | Residential Design | Luxury Living Spaces | 1
3 | 3 | Commercial Design | Inspiring Workspaces | 1
4 | 4 | Interior Excellence | Refined Interiors | 1
5 | 5 | Our Portfolio | Featured Projects | 1
```

## Rollback Plan

If deployment fails:

### Rollback Backend
```bash
# Revert to previous worker version
wrangler rollback
```

### Rollback Frontend
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Important Notes

- Hero slides are ordered by `sortOrder` field (not ID)
- All slides must have `isActive = 1` to display
- Images are cached by Cloudflare CDN
- API responses are cached for 60 seconds
- Database is Turso (serverless SQLite)

## Support URLs

- **Frontend:** https://production.trq-studio.pages.dev
- **API:** https://trq-api-prod.muaddhalsway.workers.dev/api
- **Admin Panel:** https://production.trq-studio.pages.dev/admin
- **Database:** Turso (trq-database-muaddhalsway)

## Deployment Status

- **Last Deployed:** [Date]
- **Status:** Ready for deployment
- **Hero Slides Order:** Verified ✓
- **API Endpoints:** Updated ✓
- **Frontend Build:** Ready ✓
