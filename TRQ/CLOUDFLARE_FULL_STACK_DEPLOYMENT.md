# 🚀 Cloudflare Full Stack Deployment Guide

Deploy your entire application (Frontend + API + Database) on Cloudflare's global network.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Your Domain (trq.design)                                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Frontend (Cloudflare Pages)                             │  │
│  │  https://trq.design                                      │  │
│  │  (React/Vite - Global CDN)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ API Calls                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Backend (Cloudflare Workers)                            │  │
│  │  https://api.trq.design/api                              │  │
│  │  (Serverless - Zero Cold Starts)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ Queries                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database (Turso - Cloud SQLite)                         │  │
│  │  libsql://trq-database-*.turso.io                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- ✅ Cloudflare Account (free tier works)
- ✅ Domain registered with Cloudflare
- ✅ Turso Database (already set up)
- ✅ Node.js 18+ installed locally
- ✅ Git repository

## Step 1: Prepare Your Project

### 1.1 Install Dependencies
```bash
npm install --legacy-peer-deps
cd server && npm install && cd ..
```

### 1.2 Verify Environment Variables

Check `.env.production`:
```env
VITE_API_URL=https://api.trq.design/api
```

Check `wrangler-workers.toml` production section has correct values.

## Step 2: Authenticate with Cloudflare

### 2.1 Login to Wrangler
```bash
npx wrangler login
```

This opens a browser window. Authorize and return to terminal.

### 2.2 Verify Authentication
```bash
wrangler whoami
```

Should show your Cloudflare account email.

## Step 3: Deploy Backend (API)

### 3.1 Deploy to Cloudflare Workers

```bash
npm run deploy:worker:prod
```

This will:
- Build the worker code
- Deploy to Cloudflare Workers
- Output your API URL

**Expected output:**
```
✓ Uploaded trq-api-prod
✓ Deployed to https://trq-api-prod.muaddhalsway.workers.dev
```

### 3.2 Test API Health

```bash
curl https://trq-api-prod.muaddhalsway.workers.dev/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-01-22T..."}
```

### 3.3 Test API Endpoints

```bash
# Get projects
curl https://trq-api-prod.muaddhalsway.workers.dev/api/projects

# Get services
curl https://trq-api-prod.muaddhalsway.workers.dev/api/services

# Get settings
curl https://trq-api-prod.muaddhalsway.workers.dev/api/settings
```

## Step 4: Deploy Frontend (Pages)

### 4.1 Build Frontend
```bash
npm run build
```

Verify `dist/` folder is created with your built files.

### 4.2 Deploy to Cloudflare Pages

```bash
npm run deploy:prod
```

This will:
- Build your React app
- Deploy to Cloudflare Pages
- Output your Pages URL

**Expected output:**
```
✓ Uploaded 42 files
✓ Deployed to https://production.trq-studio.pages.dev
```

### 4.3 Test Frontend

Visit: `https://production.trq-studio.pages.dev`

Check browser console for any errors. All API calls should work.

## Step 5: Set Up Custom Domain (Optional but Recommended)

### 5.1 Add Domain to Cloudflare

1. Go to https://dash.cloudflare.com
2. Add your domain (if not already added)
3. Update your domain's nameservers to Cloudflare's

### 5.2 Configure Frontend Custom Domain

1. Cloudflare Dashboard → Pages → Your project
2. Settings → Custom domains
3. Add domain: `trq.design`
4. Verify DNS records

### 5.3 Configure Backend Custom Domain

1. Cloudflare Dashboard → Workers → Your worker
2. Settings → Routes
3. Add route: `api.trq.design/*`
4. Zone: `trq.design`

### 5.4 Update Frontend Environment

Edit `.env.production`:
```env
VITE_API_URL=https://api.trq.design/api
```

Redeploy frontend:
```bash
npm run deploy:prod
```

## Step 6: Verify Everything Works

### 6.1 Test Frontend
- Visit `https://trq.design` (or your custom domain)
- Check all pages load
- Verify no console errors

### 6.2 Test API
```bash
# From your domain
curl https://api.trq.design/api/health
curl https://api.trq.design/api/projects
curl https://api.trq.design/api/services
```

### 6.3 Test Features
- Load projects
- Load services
- Submit contact form
- Subscribe to newsletter
- Load blog articles

## Deployment Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Wrangler authenticated
- [ ] Backend deployed (`npm run deploy:worker:prod`)
- [ ] Backend health check passes
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed (`npm run deploy:prod`)
- [ ] Frontend loads without errors
- [ ] API calls work from frontend
- [ ] Custom domain configured (optional)
- [ ] All features tested

## Environment Variables Reference

### Frontend (.env.production)
```env
# API endpoint - update to your domain
VITE_API_URL=https://api.trq.design/api
```

### Backend (wrangler-workers.toml)
```toml
[env.production.vars]
# Database connection
TURSO_DATABASE_URL = "libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io"
TURSO_AUTH_TOKEN = "your-token-here"

# JWT configuration
JWT_SECRET = "trq-design-studio-secret-key-2026"
JWT_EXPIRY = "1h"

# CORS - update with your domain
CORS_ORIGINS = "https://trq.design,https://api.trq.design"
```

## Monitoring & Logs

### View Worker Logs
```bash
wrangler tail --config wrangler-workers.toml --env production
```

### View Deployments
```bash
wrangler deployments list --config wrangler-workers.toml --env production
```

### View in Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Workers → Your worker → Logs
3. Pages → Your project → Deployments

## Troubleshooting

### CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:**
1. Check `CORS_ORIGINS` in `wrangler-workers.toml`
2. Ensure your domain is included
3. Redeploy: `npm run deploy:worker:prod`
4. Clear browser cache

### API 404 Errors
**Error:** `GET https://api.trq.design/api/projects 404`

**Fix:**
1. Verify worker is deployed: `wrangler deployments list`
2. Test health endpoint: `curl https://api.trq.design/api/health`
3. Check route configuration in Cloudflare dashboard

### Database Connection Errors
**Error:** `Failed to connect to Turso`

**Fix:**
1. Verify `TURSO_AUTH_TOKEN` is correct
2. Check `TURSO_DATABASE_URL` is correct
3. Redeploy: `npm run deploy:worker:prod`

### Build Errors
**Error:** `npm run build` fails

**Fix:**
```bash
# Check for TypeScript errors
npm run lint

# Clear cache and rebuild
rm -rf dist node_modules
npm install --legacy-peer-deps
npm run build
```

### Pages Deployment Fails
**Error:** `Deployment failed`

**Fix:**
1. Check build output: `npm run build`
2. Verify `dist/` folder exists
3. Check `wrangler.toml` configuration
4. Try again: `npm run deploy:prod`

## Performance Tips

1. **Enable Caching**
   - Cloudflare Pages caches static assets automatically
   - API responses are not cached (fresh data)

2. **Monitor Performance**
   - Cloudflare Dashboard → Analytics
   - Check request counts and latency

3. **Optimize Images**
   - Use WebP format
   - Compress before uploading
   - Cloudflare will optimize further

4. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use Turso CLI: `turso db shell`

## Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Workers** | 100k req/day | $0.50/M requests |
| **Pages** | Unlimited | $20/month (optional) |
| **Turso** | 9GB storage | $29/month |
| **Total** | **$0/month** | **~$30/month** |

## Rollback

If something goes wrong:

### Rollback Frontend
1. Cloudflare Dashboard → Pages → Your project
2. Deployments tab
3. Click "Rollback" on previous deployment

### Rollback Backend
```bash
wrangler rollback --config wrangler-workers.toml --env production
```

## Update & Redeploy

### Update Backend
```bash
# Make changes to server code
npm run deploy:worker:prod
```

### Update Frontend
```bash
# Make changes to src code
npm run deploy:prod
```

### Update Both
```bash
npm run deploy:worker:prod && npm run deploy:prod
```

## Local Development

### Terminal 1 - Frontend Dev Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

### Terminal 2 - Worker Dev Server
```bash
npm run worker:dev
```

Frontend will call: `http://localhost:8787/api`

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test everything
4. 📊 Set up monitoring
5. 🔐 Configure security headers
6. 📧 Set up email notifications
7. 🔄 Set up CI/CD pipeline

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install --legacy-peer-deps
      
      - run: npm run build
      
      - name: Deploy Backend
        run: npm run deploy:worker:prod
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      
      - name: Deploy Frontend
        run: npm run deploy:prod
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Support & Resources

- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Turso Docs**: https://turso.tech/docs
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

## Summary

Your application is now deployed on Cloudflare's global network:

- ✅ Frontend served from 200+ edge locations
- ✅ API running serverless with zero cold starts
- ✅ Database in the cloud with instant queries
- ✅ Automatic HTTPS and DDoS protection
- ✅ Global performance and reliability

**Deployment Date**: January 22, 2026
**Status**: 🟢 Ready for Production

---

For questions or issues, check the troubleshooting section or visit the support links above.
