# 🚀 EXPRESS SERVER DEPLOYMENT - QUICK START

## Overview

Deploy the Express server to Railway (free tier available) to serve images immediately.

**Timeline:** 30 minutes
**Cost:** Free (with limitations) or $5-10/month

---

## Step 1: Prepare Express Server (5 minutes)

### Check server/index.js
The Express server already has the image serving endpoint:

```javascript
// server/index.js - Line ~100
app.get('/api/images/*', (req, res) => {
  try {
    const imagePath = req.params[0];
    if (!imagePath) return res.status(400).json({ success: false, message: 'Image path required' });
    if (imagePath.includes('..')) return res.status(400).json({ success: false, message: 'Invalid path' });
    
    const fullPath = path.join(__dirname, '../public', imagePath);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ success: false, message: 'Image not found' });
    
    res.set('Cache-Control', 'public, max-age=604800'); // 7 days
    fs.createReadStream(fullPath).pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

✅ Already implemented!

### Check server/package.json
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

✅ Already configured!

---

## Step 2: Deploy to Railway (15 minutes)

### Option A: Railway CLI (Recommended)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login to Railway
```bash
railway login
```

#### 3. Create Railway Project
```bash
cd server
railway init
```

Follow the prompts:
- Project name: `trq-api-express`
- Select Node.js

#### 4. Add Environment Variables
```bash
railway variable add PORT 4242
railway variable add NODE_ENV production
railway variable add CORS_ORIGINS "https://trqlatestversion.trq-studio-7ie.pages.dev"
```

#### 5. Deploy
```bash
railway up
```

#### 6. Get Public URL
```bash
railway open
```

Copy the URL (e.g., `https://trq-api-express-production.railway.app`)

---

### Option B: Railway Dashboard (Manual)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub repo
5. Select the `server` directory
6. Add environment variables
7. Deploy

---

## Step 3: Update Frontend Configuration (5 minutes)

### Update .env.production
```bash
# .env.production
VITE_API_URL=https://trq-api-express-production.railway.app/api
```

### Update .env.development (Optional)
```bash
# .env.development
VITE_API_URL=http://localhost:4242/api
```

---

## Step 4: Redeploy Frontend (5 minutes)

```bash
npm run build
npm run deploy:prod
```

Or use Cloudflare Pages directly:
```bash
wrangler pages deploy dist --project-name=trq-studio --branch production
```

---

## Step 5: Test (5 minutes)

### Test API Health
```bash
curl https://trq-api-express-production.railway.app/api/health
# Response: {"status":"ok","timestamp":"..."}
```

### Test Image Endpoint
```bash
curl https://trq-api-express-production.railway.app/api/images/uploads/REC.%20HEAVEN/Cover.webp
# Response: Image file (binary)
```

### Test Frontend
1. Visit https://trqlatestversion.trq-studio-7ie.pages.dev
2. Check if images load
3. Check portfolio page
4. Check admin panel

---

## Troubleshooting

### Images still not loading?

**Check 1: API is running**
```bash
curl https://trq-api-express-production.railway.app/api/health
```

**Check 2: Image path is correct**
```bash
curl https://trq-api-express-production.railway.app/api/images/uploads/REC.%20HEAVEN/Cover.webp
```

**Check 3: CORS is configured**
- Check server/index.js CORS settings
- Verify frontend URL is in CORS_ORIGINS

**Check 4: Images exist locally**
```bash
ls public/uploads/
```

### Server crashes?

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Port already in use
- Database connection error
- File permissions

### Performance issues?

**Solutions:**
1. Enable caching (already done - 7 days)
2. Use CDN (Cloudflare)
3. Compress images
4. Use WebP format

---

## Configuration Files

### server/index.js
```javascript
const PORT = process.env.PORT || 4242;
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'https://trqlatestversion.trq-studio-7ie.pages.dev'
  ],
  credentials: true,
};
```

### server/package.json
```json
{
  "name": "trq-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^9.0.0"
  }
}
```

---

## Environment Variables

### Required
- `PORT` - Server port (default: 4242)
- `NODE_ENV` - Environment (development/production)

### Optional
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `JWT_SECRET` - JWT signing key
- `DATABASE_URL` - Database connection string

---

## Monitoring

### Railway Dashboard
- CPU usage
- Memory usage
- Network traffic
- Logs
- Deployments

### Health Check
```bash
# Every 5 minutes
curl https://trq-api-express-production.railway.app/api/health
```

---

## Scaling

### Free Tier Limits
- 5GB/month bandwidth
- 500 hours/month runtime
- 1 shared CPU
- 512MB RAM

### Upgrade to Pro
- Unlimited bandwidth
- Dedicated resources
- Custom domains
- $5-10/month

---

## Next Steps

### Immediate
1. Deploy Express server
2. Update frontend configuration
3. Redeploy frontend
4. Test images

### Short Term
1. Monitor server performance
2. Set up error tracking
3. Configure backups

### Long Term
1. Migrate to R2 (optional)
2. Implement image optimization
3. Add CDN caching

---

## Comparison: Express vs R2

| Feature | Express | R2 |
|---------|---------|-----|
| **Setup Time** | 30 min | 2-3 hours |
| **Cost** | Free-$10/mo | ~$0.25/mo |
| **Performance** | Good | Excellent |
| **Serverless** | No | Yes |
| **Maintenance** | Medium | Low |
| **Scalability** | Limited | Unlimited |

**Recommendation:** Use Express for quick fix, migrate to R2 later.

---

## Support

For issues:
1. Check Railway logs
2. Verify environment variables
3. Test API endpoints
4. Check CORS configuration
5. Verify file permissions

---

**Status:** Ready to deploy
**Timeline:** 30 minutes
**Priority:** HIGH

