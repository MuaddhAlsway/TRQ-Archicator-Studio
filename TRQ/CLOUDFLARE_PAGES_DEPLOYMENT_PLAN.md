# Cloudflare Pages Deployment Plan

## Overview
This plan sets up a complete Cloudflare Pages deployment with:
- Frontend served from Cloudflare Pages
- Backend API via Cloudflare Pages Functions
- Turso database for data persistence
- Proper environment configuration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Frontend (React/Vite)                               │  │
│  │  - Served from /                                     │  │
│  │  - Static assets cached                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages Functions (Backend API)                       │  │
│  │  - Served from /api/*                                │  │
│  │  - Connects to Turso database                        │  │
│  │  - Handles all business logic                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │
         │ HTTP/HTTPS
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Turso Database (SQLite)                        │
│  - Stores all application data                             │
│  - Accessible via HTTP API                                 │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### 1. Project Structure Setup
```
project-root/
├── src/                          # Frontend React app
│   ├── api/
│   │   └── index.ts             # API client
│   ├── components/
│   ├── admin/
│   └── ...
├── functions/                    # Cloudflare Pages Functions
│   └── api/
│       └── [[route]].js         # API handler
├── public/                       # Static assets
├── dist/                         # Build output
├── vite.config.js
├── wrangler.toml                # Cloudflare config
├── .env.production              # Production env vars
└── package.json
```

### 2. Environment Variables

**Production (.env.production):**
```
VITE_API_URL=/api
```

**Development (.env.development):**
```
VITE_API_URL=http://localhost:4242/api
```

**Cloudflare Pages Environment Variables:**
Set in Cloudflare Dashboard → Pages → Settings → Environment Variables
```
TURSO_AUTH_TOKEN=<your-token>
TURSO_API_URL=https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline
```

### 3. Build Configuration

**vite.config.js:**
- Builds frontend to `dist/` folder
- Handles API proxy for development

**wrangler.toml:**
- Configures Cloudflare Pages
- Sets up Pages Functions routing
- Defines environment variables

### 4. API Routes

All API endpoints are handled by `functions/api/[[route]].js`:

```
/api/auth/*              - Authentication
/api/projects/*          - Projects CRUD
/api/services/*          - Services CRUD
/api/slides/*            - Hero slides
/api/articles/*          - Blog articles
/api/contacts            - Contact form
/api/pricing/*           - Pricing requests
/api/settings            - Site settings
/api/newsletter/*        - Newsletter
```

### 5. Deployment Steps

#### Local Development
```bash
# Install dependencies
npm install

# Start dev server (frontend on 5173, API on 4242)
npm run dev

# In another terminal, start local API
npm run worker:dev
```

#### Production Deployment
```bash
# Build frontend
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod

# Or use Cloudflare CLI directly
wrangler pages deploy dist --branch production
```

### 6. Cloudflare Pages Configuration

**Build Settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

**Environment Variables:**
- Set `TURSO_AUTH_TOKEN` in Cloudflare Dashboard
- Set `TURSO_API_URL` in Cloudflare Dashboard

**Custom Domain:**
- Add your domain in Pages settings
- Configure DNS records

### 7. Database Connection

The API connects to Turso via HTTP API:
- Endpoint: `https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline`
- Authentication: Bearer token in Authorization header
- No local database needed

### 8. CORS Configuration

CORS headers are set in the API handler:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};
```

### 9. Monitoring & Debugging

**Cloudflare Dashboard:**
- Monitor Pages deployments
- View function logs
- Check error rates

**Local Testing:**
```bash
# Test API locally
curl http://localhost:4242/api/health

# Test production API
curl https://trq-studio.pages.dev/api/health
```

### 10. Troubleshooting

**API not responding:**
1. Check Cloudflare Pages deployment status
2. Verify environment variables are set
3. Check function logs in Cloudflare Dashboard
4. Verify Turso token is valid

**CORS errors:**
1. Check CORS headers in API response
2. Verify frontend is making requests to `/api` (not full URL)
3. Check browser console for specific error

**Database connection errors:**
1. Verify `TURSO_AUTH_TOKEN` is set
2. Check token hasn't expired
3. Verify database URL is correct
4. Test with curl: `curl -H "Authorization: Bearer <token>" <db-url>`

## Files to Create/Update

1. ✅ `functions/api/[[route]].js` - API handler
2. ✅ `vite.config.js` - Build config
3. ✅ `wrangler.toml` - Cloudflare config
4. ✅ `.env.production` - Production env vars
5. ✅ `src/api/index.ts` - Frontend API client

## Next Steps

1. Create `functions/api/[[route]].js` with complete API implementation
2. Update `vite.config.js` for proper build output
3. Configure `wrangler.toml` for Pages Functions
4. Set environment variables in Cloudflare Dashboard
5. Deploy and test

## Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] API handler created
- [ ] Frontend builds successfully
- [ ] Local testing passes
- [ ] Cloudflare Pages project created
- [ ] Environment variables set in Cloudflare
- [ ] Initial deployment successful
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Admin panel accessible
- [ ] Frontend can communicate with API
