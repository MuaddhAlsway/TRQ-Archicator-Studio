# 🚀 DEPLOY EXPRESS SERVER - EXACT COMMANDS

## Quick Deploy (Copy & Paste)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Railway Project
```bash
cd server
railway init
```

When prompted:
- Project name: `trq-api-express`
- Select: Node.js

### Step 4: Add Environment Variables
```bash
railway variable add PORT 4242
railway variable add NODE_ENV production
railway variable add CORS_ORIGINS "https://trqlatestversion.trq-studio-7ie.pages.dev"
```

### Step 5: Deploy
```bash
railway up
```

### Step 6: Get Public URL
```bash
railway open
```

Copy the URL from the browser (e.g., `https://trq-api-express-production.railway.app`)

---

## Step 7: Update Frontend Configuration

### Edit .env.production
```bash
# .env.production
VITE_API_URL=https://trq-api-express-production.railway.app/api
```

Replace `trq-api-express-production.railway.app` with your actual Railway URL.

### Edit .env.development (Optional)
```bash
# .env.development
VITE_API_URL=http://localhost:4242/api
```

---

## Step 8: Rebuild and Deploy Frontend

### Build
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
npm run deploy:prod
```

Or manually:
```bash
wrangler pages deploy dist --project-name=trq-studio --branch production
```

---

## Step 9: Test

### Test API Health
```bash
curl https://trq-api-express-production.railway.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-05-04T14:30:00.000Z"}
```

### Test Image Endpoint
```bash
curl https://trq-api-express-production.railway.app/api/images/uploads/REC.%20HEAVEN/Cover.webp -o test.webp
```

### Test Frontend
1. Visit https://trqlatestversion.trq-studio-7ie.pages.dev
2. Check if images load
3. Check portfolio page
4. Check admin panel

---

## Troubleshooting Commands

### Check Railway Logs
```bash
railway logs
```

### Check Railway Status
```bash
railway status
```

### List Environment Variables
```bash
railway variable list
```

### Update Environment Variable
```bash
railway variable update PORT 4242
```

### Redeploy
```bash
railway up
```

### Stop Server
```bash
railway down
```

---

## Alternative: Deploy to Render

If Railway doesn't work, use Render:

### Step 1: Create Render Account
Go to https://render.com and sign up

### Step 2: Create New Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repo
4. Select `server` directory
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables
8. Deploy

### Step 3: Get Public URL
Copy the URL from Render dashboard

### Step 4: Update Frontend
Same as Railway (update .env.production)

---

## Alternative: Deploy to Heroku

If Railway and Render don't work, use Heroku:

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

### Step 2: Login
```bash
heroku login
```

### Step 3: Create App
```bash
heroku create trq-api-express
```

### Step 4: Add Environment Variables
```bash
heroku config:set PORT=4242
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGINS="https://trqlatestversion.trq-studio-7ie.pages.dev"
```

### Step 5: Deploy
```bash
git push heroku main
```

### Step 6: Get Public URL
```bash
heroku open
```

---

## Verify Deployment

### Check if Server is Running
```bash
curl https://your-railway-url.railway.app/api/health
```

### Check if Images Endpoint Works
```bash
curl https://your-railway-url.railway.app/api/images/uploads/REC.%20HEAVEN/Cover.webp
```

### Check if CORS is Configured
```bash
curl -H "Origin: https://trqlatestversion.trq-studio-7ie.pages.dev" \
  https://your-railway-url.railway.app/api/health
```

---

## Monitor Server

### Railway Dashboard
https://railway.app/dashboard

### Check Logs
```bash
railway logs -f
```

### Check Metrics
```bash
railway status
```

---

## Rollback (If Something Goes Wrong)

### Revert to Previous Deployment
```bash
railway rollback
```

### Redeploy Current Version
```bash
railway up
```

### Delete Deployment
```bash
railway down
```

---

## Environment Variables Reference

### Required
- `PORT` - Server port (default: 4242)
- `NODE_ENV` - Environment (development/production)

### Optional
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `JWT_SECRET` - JWT signing key (default: auto-generated)
- `DATABASE_URL` - Database connection string (if using external DB)

### Example
```bash
railway variable add PORT 4242
railway variable add NODE_ENV production
railway variable add CORS_ORIGINS "https://trqlatestversion.trq-studio-7ie.pages.dev,http://localhost:5173"
railway variable add JWT_SECRET "your-secret-key-here"
```

---

## Performance Monitoring

### Check Response Time
```bash
time curl https://your-railway-url.railway.app/api/health
```

### Check Image Serving Speed
```bash
time curl https://your-railway-url.railway.app/api/images/uploads/REC.%20HEAVEN/Cover.webp -o /dev/null
```

### Monitor CPU/Memory
```bash
railway status
```

---

## Scaling

### Upgrade Railway Plan
1. Go to https://railway.app/dashboard
2. Select project
3. Click "Settings"
4. Upgrade plan

### Increase Resources
```bash
railway variable add RAILWAY_MEMORY 1024
```

---

## Cleanup

### Remove Local Railway Config
```bash
rm -rf .railway
```

### Logout from Railway
```bash
railway logout
```

---

## Complete Workflow

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd server
railway init

# 4. Add environment variables
railway variable add PORT 4242
railway variable add NODE_ENV production
railway variable add CORS_ORIGINS "https://trqlatestversion.trq-studio-7ie.pages.dev"

# 5. Deploy
railway up

# 6. Get URL (opens in browser)
railway open

# 7. Update frontend config
# Edit .env.production with your Railway URL

# 8. Rebuild frontend
cd ..
npm run build

# 9. Deploy frontend
npm run deploy:prod

# 10. Test
curl https://your-railway-url.railway.app/api/health
```

---

## Estimated Time

- Install Railway CLI: 2 minutes
- Login: 1 minute
- Initialize project: 2 minutes
- Add environment variables: 2 minutes
- Deploy: 5 minutes
- Get URL: 1 minute
- Update frontend: 2 minutes
- Rebuild frontend: 3 minutes
- Deploy frontend: 3 minutes
- Test: 2 minutes

**Total: ~23 minutes**

---

## Success Indicators

✅ Railway deployment successful
✅ API health check returns 200
✅ Image endpoint returns image file
✅ Frontend loads without errors
✅ Images visible on all pages
✅ Admin panel works
✅ Portfolio displays images

---

## Next Steps After Deployment

1. Monitor server performance
2. Set up error tracking
3. Plan R2 migration (optional)
4. Implement image optimization
5. Add CDN caching

---

## Support

If deployment fails:
1. Check Railway logs: `railway logs`
2. Verify environment variables: `railway variable list`
3. Check server status: `railway status`
4. Review error messages
5. Try alternative (Render or Heroku)

---

**Ready to deploy!**

