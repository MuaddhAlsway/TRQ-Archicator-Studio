# Cloudflare Pages Deployment Guide

## Setup Complete ✅

Your frontend is ready to deploy to Cloudflare Pages with your backend running separately.

## Architecture

```
Frontend: Cloudflare Pages (https://trq-studio.pages.dev)
   ↓ (API calls)
Backend: Your Server (https://your-backend-domain.com)
   ↓
Database: Turso (libsql)
```

## Step 1: Update Backend URL

Edit `.env.production` and replace with your actual backend domain:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

**Examples:**
- If backend is on Heroku: `https://trq-backend.herokuapp.com/api`
- If backend is on your VPS: `https://api.trqstudio.com/api`
- If backend is on Railway: `https://trq-backend-prod.railway.app/api`

## Step 2: Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authenticate. Follow the prompts.

## Step 3: Deploy Frontend

```bash
npm run deploy
```

Or for production branch:

```bash
npm run deploy:prod
```

## Step 4: Verify Deployment

After deployment completes:

1. Visit `https://trq-studio.pages.dev`
2. Check browser console for any API errors
3. Test a few features (projects, contact form, etc.)

## Backend CORS Configuration

Your backend is already configured to accept requests from:
- `http://localhost:5173` (local dev)
- `http://localhost:4242` (local backend)
- `https://trq-studio.pages.dev` (Cloudflare Pages)

If you need to add more origins, update `server/.env`:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:4242,https://trq-studio.pages.dev,https://your-custom-domain.com
```

Then restart your backend server.

## Environment Variables

### Frontend (.env.production)
- `VITE_API_URL` - Your backend API URL

### Backend (server/.env)
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `JWT_SECRET` - Already configured
- `TURSO_DATABASE_URL` - Already configured
- `TURSO_AUTH_TOKEN` - Already configured

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check that your backend URL in `.env.production` is correct
2. Verify `CORS_ORIGINS` in `server/.env` includes `https://trq-studio.pages.dev`
3. Restart your backend server

### API Calls Failing
1. Check that your backend server is running
2. Verify the backend URL is accessible from the browser
3. Check browser Network tab to see actual request URLs

### Build Errors
```bash
npm run build
```

If build fails, check for TypeScript errors:
```bash
npm run lint
```

## Deployment Checklist

- [ ] Backend URL updated in `.env.production`
- [ ] Backend CORS configured for Cloudflare domain
- [ ] Backend server is running and accessible
- [ ] Ran `npx wrangler login`
- [ ] Ran `npm run deploy`
- [ ] Verified site loads at `https://trq-studio.pages.dev`
- [ ] Tested API calls work (projects, contact form, etc.)

## Custom Domain (Optional)

To use a custom domain instead of `trq-studio.pages.dev`:

1. In Cloudflare dashboard, go to your Pages project
2. Settings → Custom domains
3. Add your domain
4. Update DNS records as instructed

## Rollback

If something goes wrong, Cloudflare Pages keeps deployment history:

1. Go to Cloudflare dashboard
2. Pages → Your project
3. Deployments tab
4. Click "Rollback" on a previous deployment

## Support

For Cloudflare Pages issues: https://developers.cloudflare.com/pages/
For Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
