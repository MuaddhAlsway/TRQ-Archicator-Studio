# Cloudflare Full Stack Deployment - Quick Start

Get your app running on Cloudflare in 5 minutes.

## What You Get

✅ Frontend on Cloudflare Pages (https://trq-studio.pages.dev)
✅ Backend on Cloudflare Workers (https://api.trqstudio.com)
✅ Database on Turso (Cloud SQLite)
✅ Zero cold starts, global CDN, auto-scaling

## Prerequisites

- Cloudflare account (free): https://dash.cloudflare.com
- Domain (can use free .pages.dev subdomain)
- Already have: Turso database ✓

## 5-Minute Setup

### 1. Login to Cloudflare (1 min)
```bash
npx wrangler login
```
Opens browser → Authorize → Done

### 2. Set Turso Secret (1 min)
```bash
wrangler secret put TURSO_AUTH_TOKEN --config wrangler-workers.toml --env production
```

Paste this token (from `server/.env`):
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNDc0ODQsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.HocF1NjSdRpjQ9TCd8cGnyQVw1TXUolTivGu-tYEI0OeskoVesjwI0IkJC6U7tXu-qKK-5HDVTDYAMS36LTzDg
```

### 3. Deploy Backend (1 min)
```bash
npm run deploy:worker:prod
```

Wait for "✓ Uploaded worker successfully"

### 4. Deploy Frontend (2 min)
```bash
npm run deploy:prod
```

Wait for "✓ Deployment successful"

### 5. Verify
- Frontend: https://trq-studio.pages.dev
- Backend: https://api.trqstudio.com/api/health (should show `{"status":"ok"}`)

## Done! 🎉

Your app is live on Cloudflare's global network.

## Local Development

### Terminal 1 - Frontend
```bash
npm run dev
```
Visit: http://localhost:5173

### Terminal 2 - Backend
```bash
npm run worker:dev
```
Runs on: http://localhost:8787

Both will connect automatically.

## Common Tasks

### Update Backend
```bash
npm run deploy:worker:prod
```

### Update Frontend
```bash
npm run deploy:prod
```

### View Logs
```bash
wrangler tail --config wrangler-workers.toml
```

### Rollback
```bash
wrangler rollback --config wrangler-workers.toml
```

## Troubleshooting

**API calls failing?**
- Check: https://api.trqstudio.com/api/health
- View logs: `wrangler tail --config wrangler-workers.toml`

**CORS errors?**
- Update `CORS_ORIGINS` in `wrangler-workers.toml`
- Redeploy: `npm run deploy:worker:prod`

**Build errors?**
```bash
npm run build
npm run lint
```

## Next: Custom Domain

1. Go to Cloudflare Dashboard
2. Pages → Your project → Settings → Custom domains
3. Add your domain
4. Update DNS records

## Costs

- **Free tier**: 100k requests/day (Workers) + unlimited (Pages)
- **Turso**: 9GB free storage
- **Total**: $0/month for most projects

## Full Guide

See `CLOUDFLARE_WORKERS_DEPLOYMENT.md` for detailed setup.
