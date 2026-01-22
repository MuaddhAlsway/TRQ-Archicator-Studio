# Cloudflare Workers + Pages Full Stack Deployment

Deploy both frontend and backend to Cloudflare's serverless platform.

## Architecture

```
Frontend: Cloudflare Pages (https://trq-studio.pages.dev)
   ↓ (API calls)
Backend: Cloudflare Workers (https://api.trqstudio.com)
   ↓
Database: Turso (libsql) - Cloud SQLite
```

## Prerequisites

1. **Cloudflare Account** - https://dash.cloudflare.com
2. **Domain** - Registered with Cloudflare (or transfer it)
3. **Turso Account** - Already set up ✓
4. **Wrangler CLI** - Will be installed via npm

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 2: Set Up Cloudflare Account

1. Go to https://dash.cloudflare.com
2. Create a new account or sign in
3. Add your domain (or use a subdomain)
4. Get your **Account ID** and **API Token**:
   - Account ID: Dashboard → Right sidebar
   - API Token: My Profile → API Tokens → Create Token

## Step 3: Authenticate Wrangler

```bash
npx wrangler login
```

This opens a browser to authenticate. Follow the prompts.

## Step 4: Configure Cloudflare Workers

Edit `wrangler-workers.toml` and update:

```toml
# Change these to your domain
routes = [
  { pattern = "api.trqstudio.com/*", zone_name = "trqstudio.com" }
]

# Update CORS origins
CORS_ORIGINS = "https://trq-studio.pages.dev,https://trq.design"
```

## Step 5: Set Secrets

Store your Turso auth token securely:

```bash
# For production
wrangler secret put TURSO_AUTH_TOKEN --config wrangler-workers.toml --env production

# For staging
wrangler secret put TURSO_AUTH_TOKEN --config wrangler-workers.toml --env staging
```

Paste your token from `server/.env`:
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNDc0ODQsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.HocF1NjSdRpjQ9TCd8cGnyQVw1TXUolTivGu-tYEI0OeskoVesjwI0IkJC6U7tXu-qKK-5HDVTDYAMS36LTzDg
```

## Step 6: Test Locally

### Terminal 1 - Frontend Dev Server
```bash
npm run dev
```

### Terminal 2 - Worker Dev Server
```bash
npm run worker:dev
```

Visit `http://localhost:5173` - it will call `http://localhost:8787/api`

## Step 7: Deploy Backend (Workers)

### Staging
```bash
npm run deploy:worker
```

### Production
```bash
npm run deploy:worker:prod
```

Verify at: `https://api.trqstudio.com/api/health`

## Step 8: Deploy Frontend (Pages)

```bash
npm run deploy:prod
```

Visit: `https://trq-studio.pages.dev`

## Step 9: Configure Custom Domain (Optional)

### For Frontend
1. Cloudflare Dashboard → Pages → Your project
2. Settings → Custom domains
3. Add `trq.design` or subdomain
4. Update DNS records as instructed

### For Backend
1. Cloudflare Dashboard → Workers → Your worker
2. Settings → Routes
3. Add route: `api.trqstudio.com/*`
4. Ensure DNS points to Cloudflare

## Troubleshooting

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
1. Check `CORS_ORIGINS` in `wrangler-workers.toml`
2. Redeploy: `npm run deploy:worker:prod`
3. Clear browser cache

### Database Connection Errors
```
Error: Failed to connect to Turso
```

**Fix:**
1. Verify `TURSO_AUTH_TOKEN` is set: `wrangler secret list`
2. Check token is valid in `server/.env`
3. Redeploy: `npm run deploy:worker:prod`

### API Calls Return 404
```
GET https://api.trqstudio.com/api/projects 404
```

**Fix:**
1. Verify route in `wrangler-workers.toml`
2. Check worker is deployed: `wrangler deployments list`
3. Test health endpoint: `https://api.trqstudio.com/api/health`

### Build Errors
```bash
npm run build
```

Check for TypeScript errors:
```bash
npm run lint
```

## Monitoring

### View Worker Logs
```bash
wrangler tail --config wrangler-workers.toml
```

### View Deployments
```bash
wrangler deployments list --config wrangler-workers.toml
```

### Rollback
```bash
wrangler rollback --config wrangler-workers.toml
```

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://api.trqstudio.com/api
```

### Backend (wrangler-workers.toml)
```toml
[env.production.vars]
TURSO_DATABASE_URL = "libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io"
JWT_SECRET = "trq-design-studio-secret-key-2026"
CORS_ORIGINS = "https://trq-studio.pages.dev,https://trq.design"
```

## Deployment Checklist

- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] Wrangler authenticated (`wrangler login`)
- [ ] `wrangler-workers.toml` updated with your domain
- [ ] Turso token set as secret (`wrangler secret put`)
- [ ] Backend deployed (`npm run deploy:worker:prod`)
- [ ] Frontend deployed (`npm run deploy:prod`)
- [ ] Health check passes: `https://api.trqstudio.com/api/health`
- [ ] API calls work from frontend
- [ ] Custom domains configured (optional)

## Costs

**Cloudflare Workers:**
- Free tier: 100,000 requests/day
- Paid: $0.50 per million requests

**Cloudflare Pages:**
- Free tier: Unlimited builds & deployments
- Paid: $20/month for advanced features

**Turso:**
- Free tier: 9GB storage, unlimited reads
- Paid: $29/month for more storage

## Next Steps

1. Set up monitoring/alerts
2. Configure custom domain
3. Set up CI/CD pipeline (GitHub Actions)
4. Enable analytics
5. Configure email notifications

## Support

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Turso: https://turso.tech/docs
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
