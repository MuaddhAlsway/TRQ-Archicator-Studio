# Cloudflare Pages Deployment - Quick Start

## Prerequisites

- Cloudflare account with Pages enabled
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally
- Turso database already set up

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment Files

**`.env.production`** (already exists):
```
VITE_API_URL=/api
```

**`.env.development`** (already exists):
```
VITE_API_URL=http://localhost:4242/api
```

### 3. Test Locally

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens http://localhost:5173
```

**Terminal 2 - API (optional for local testing):**
```bash
npm run worker:dev
# API available at http://localhost:4242/api
```

## Cloudflare Pages Setup

### Step 1: Create Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Pages** from the left sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select your repository
6. Click **Begin setup**

### Step 2: Configure Build Settings

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:**
```
/
```

**Environment variables:**
Click **Add environment variable** and add:

| Name | Value |
|------|-------|
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `TURSO_API_URL` | `https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline` |

### Step 3: Deploy

Click **Save and Deploy**

The deployment will:
1. Build the frontend (React app)
2. Create the Pages Functions for API
3. Deploy everything to Cloudflare's global network

## Verify Deployment

### Check Deployment Status
1. Go to Pages project in Cloudflare Dashboard
2. Look for green checkmark next to latest deployment
3. Click on deployment to see details

### Test API Endpoints

```bash
# Health check
curl https://trq-studio.pages.dev/api/health

# Get projects
curl https://trq-studio.pages.dev/api/projects

# Get active slides
curl https://trq-studio.pages.dev/api/slides/active

# Get published articles
curl https://trq-studio.pages.dev/api/articles/published
```

### Test Frontend
Open https://trq-studio.pages.dev in browser

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch → automatic deployment
- Every push to other branches → preview deployment
- Deployments take 2-5 minutes

## Environment Variables

### Production Environment

Set in Cloudflare Dashboard → Pages → Settings → Environment Variables

```
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
TURSO_API_URL=https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline
```

### Preview Environment

Same variables are used for preview deployments

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Pages project
2. Click on failed deployment
3. Scroll to "Build log" section
4. Look for error messages

**Common issues:**
- Missing dependencies: Run `npm install`
- TypeScript errors: Run `npm run build` locally to debug
- Environment variables: Verify they're set in Cloudflare Dashboard

### API Returns 404

**Check:**
1. Verify `functions/api/[[route]].js` exists
2. Check Cloudflare Pages Functions are deployed
3. Verify environment variables are set
4. Check function logs in Cloudflare Dashboard

### CORS Errors

**Check:**
1. API response includes CORS headers
2. Frontend is using `/api` (not full URL)
3. Browser console shows specific error

### Database Connection Fails

**Check:**
1. `TURSO_AUTH_TOKEN` is set in Cloudflare
2. Token hasn't expired
3. Database URL is correct
4. Test with curl:
```bash
curl -H "Authorization: Bearer <token>" \
  https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline
```

## Rollback

If deployment has issues:

1. Go to Pages project
2. Click **Deployments** tab
3. Find previous working deployment
4. Click **Rollback to this deployment**

## Custom Domain

### Add Custom Domain

1. Go to Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `trq-studio.com`)
4. Follow DNS setup instructions
5. Wait for DNS propagation (5-30 minutes)

### SSL/TLS

Cloudflare automatically provides free SSL/TLS certificate

## Monitoring

### View Logs

1. Go to Pages project
2. Click on deployment
3. Scroll to **Functions** section
4. Click **View logs** to see real-time logs

### Analytics

1. Go to Pages project
2. Click **Analytics** tab
3. View traffic, errors, and performance metrics

## Performance Tips

1. **Enable caching:**
   - Static assets cached for 1 year
   - API responses cached based on headers

2. **Optimize images:**
   - Use WebP format
   - Compress before uploading
   - Use responsive images

3. **Monitor performance:**
   - Check Cloudflare Analytics
   - Use Lighthouse for frontend performance
   - Monitor API response times

## Next Steps

1. ✅ Set up Cloudflare Pages project
2. ✅ Configure build settings
3. ✅ Set environment variables
4. ✅ Deploy
5. ✅ Test API endpoints
6. ✅ Test frontend
7. ✅ Add custom domain (optional)
8. ✅ Monitor performance

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Turso Documentation](https://docs.turso.tech/)

## Deployment Checklist

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Initial deployment successful
- [ ] API endpoints responding
- [ ] Frontend loads correctly
- [ ] Admin panel accessible
- [ ] Database queries working
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
