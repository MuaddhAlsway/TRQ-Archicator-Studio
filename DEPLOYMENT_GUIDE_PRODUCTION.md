# Production Deployment Guide

## Current Deployment Status ✅

- **Frontend**: https://9aaf65da.trq-studio.pages.dev (Cloudflare Pages)
- **Backend API**: https://trq-api-prod.muaddhalsway.workers.dev (Cloudflare Workers)
- **Database**: Turso (libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io)

## How to Deploy Future Updates

### Option 1: Deploy Everything (Frontend + Backend)

```bash
# Build frontend
npm run build

# Deploy frontend to Cloudflare Pages
wrangler pages deploy dist

# Deploy backend to Cloudflare Workers
wrangler deploy --config wrangler-workers.toml --env production
```

### Option 2: Deploy Only Frontend

```bash
npm run build
wrangler pages deploy dist
```

### Option 3: Deploy Only Backend

```bash
wrangler deploy --config wrangler-workers.toml --env production
```

## Pre-Deployment Checklist

Before deploying, ensure:

1. ✅ All code changes are tested locally
2. ✅ No console errors in browser DevTools
3. ✅ Database migrations are complete
4. ✅ Environment variables are correct
5. ✅ API endpoints are responding correctly

## Testing After Deployment

```bash
# Verify API is working
curl https://trq-api-prod.muaddhalsway.workers.dev/api/services/active

# Check frontend is live
curl https://9aaf65da.trq-studio.pages.dev
```

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://trq-api-prod.muaddhalsway.workers.dev/api
```

### Backend (wrangler-workers.toml)
```
TURSO_DATABASE_URL=libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
JWT_SECRET=trq-design-studio-secret-key-2026
JWT_EXPIRY=1h
CORS_ORIGINS=https://9aaf65da.trq-studio.pages.dev,https://trq-api-prod.muaddhalsway.workers.dev
```

## Troubleshooting

### Frontend not updating
- Clear browser cache (Ctrl+Shift+R)
- Check if build was successful
- Verify dist folder has latest files

### API not responding
- Check Cloudflare Workers dashboard
- Verify database connection
- Check CORS headers

### Database issues
- Verify Turso connection string
- Check auth token is valid
- Test with: `node verify-services.mjs`

## Rollback Procedure

If something goes wrong:

1. Check Cloudflare Pages deployment history
2. Revert to previous deployment
3. Or redeploy from git: `git revert <commit-hash>`

## Performance Tips

- Monitor bundle size (currently ~1.7MB)
- Use dynamic imports for large components
- Enable gzip compression (automatic on Cloudflare)
- Cache static assets (configured in Pages)

## Support

For issues:
1. Check Cloudflare dashboard
2. Review wrangler logs: `~/.wrangler/logs/`
3. Test API directly: `https://trq-api-prod.muaddhalsway.workers.dev/api/services`
