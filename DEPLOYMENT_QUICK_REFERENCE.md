# Deployment Quick Reference Card

## 🚀 Quick Start (5 minutes)

### Local Build & Test
```bash
npm install
npm run build
npm run dev
```

### Deploy to Cloudflare Pages
```bash
# Via Cloudflare Dashboard (recommended)
1. Go to https://dash.cloudflare.com
2. Select Pages → Create project
3. Connect Git repository
4. Build command: npm run build
5. Output directory: dist
6. Add environment variables
7. Deploy

# Via CLI (alternative)
wrangler pages deploy dist --branch production
```

## 📋 Environment Variables

**Set in Cloudflare Dashboard:**
```
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
TURSO_API_URL=https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline
```

## 🔍 Verify Deployment

```bash
# Health check
curl https://trq-studio.pages.dev/api/health

# Get projects
curl https://trq-studio.pages.dev/api/projects

# Open frontend
open https://trq-studio.pages.dev
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `functions/api/[[route]].js` | API handler |
| `vite.config.js` | Build config |
| `wrangler.toml` | Cloudflare config |
| `src/api/index.ts` | API client |
| `.env.production` | Production env |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally |
| API 404 | Verify `functions/api/[[route]].js` exists |
| API 500 | Check environment variables in Cloudflare |
| CORS error | Verify API response has CORS headers |
| Images broken | Check image paths in database |

## 📊 API Endpoints

```
GET  /api/health                    # Health check
GET  /api/projects                  # All projects
GET  /api/projects/published        # Published projects
GET  /api/services                  # All services
GET  /api/services/active           # Active services
GET  /api/slides                    # All slides
GET  /api/slides/active             # Active slides
GET  /api/articles/published        # Published articles
GET  /api/settings                  # Site settings
POST /api/contacts                  # Submit contact
POST /api/newsletter/subscribe      # Subscribe
POST /api/auth/login                # Login
```

## 🔐 Admin Login

```
Username: admin
Password: trq2026
```

## 📈 Monitoring

1. **Cloudflare Dashboard**
   - Pages → Deployments (check status)
   - Pages → Analytics (view traffic)
   - Pages → Functions (view logs)

2. **Test API**
   ```bash
   curl -v https://trq-studio.pages.dev/api/health
   ```

3. **Check Logs**
   - Cloudflare Dashboard → Pages → Deployment → View logs

## 🔄 Continuous Deployment

- Push to `main` → automatic deployment
- Push to other branches → preview deployment
- Deployments take 2-5 minutes

## ⏮️ Rollback

1. Go to Cloudflare Dashboard
2. Pages → Deployments
3. Find previous working deployment
4. Click "Rollback to this deployment"

## 📚 Documentation

- `CLOUDFLARE_PAGES_DEPLOYMENT_PLAN.md` - Full architecture
- `CLOUDFLARE_PAGES_QUICK_START.md` - Detailed setup
- `DEPLOYMENT_VERIFICATION.md` - Verification checklist
- `CLOUDFLARE_PAGES_TROUBLESHOOTING.md` - Troubleshooting guide

## ✅ Deployment Checklist

- [ ] `npm install` - dependencies installed
- [ ] `npm run build` - builds successfully
- [ ] `functions/api/[[route]].js` - exists
- [ ] Environment variables - set in Cloudflare
- [ ] Git repository - connected
- [ ] Initial deployment - successful
- [ ] API endpoints - responding
- [ ] Frontend - loads correctly
- [ ] Admin panel - accessible

## 🎯 Success Criteria

✅ Frontend loads at `https://trq-studio.pages.dev`
✅ API responds at `/api/*`
✅ Admin panel works
✅ Database queries work
✅ Images load
✅ No console errors

## 🆘 Get Help

- Check function logs in Cloudflare Dashboard
- Run `npm run build` locally to debug
- Test API with curl
- Review CLOUDFLARE_PAGES_TROUBLESHOOTING.md

---

**Status:** Ready to deploy ✅
