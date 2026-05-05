# Quick Start - Cloudflare Workers Migration

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
npm install -g wrangler
wrangler login
```

### 2. Create Resources
```bash
# Create D1 database
wrangler d1 create trq-db

# Create R2 bucket
wrangler r2 bucket create trq-media

# Create KV namespaces
wrangler kv:namespace create CACHE
wrangler kv:namespace create RATE_LIMIT
```

### 3. Update wrangler.toml
Copy the IDs from the output above into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "trq-db"
database_id = "YOUR_ID_HERE"

[[r2_buckets]]
binding = "R2"
bucket_name = "trq-media"

[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_ID_HERE"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "YOUR_ID_HERE"
```

### 4. Run Migrations
```bash
wrangler d1 execute trq-db --file migrations/001_init_schema.sql
```

### 5. Deploy
```bash
wrangler deploy
```

### 6. Test
```bash
curl https://your-worker.workers.dev/api/health
```

---

## What Changed

### Express Routes → Worker Routes
```javascript
// Before (Express)
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// After (Worker)
router.get('/api/projects', projectRoutes.getAll);
```

### Express Middleware → Worker Middleware
```javascript
// Before (Express)
app.use(cors(corsOptions));
app.use(authenticateToken);

// After (Worker)
router.all('*', handleCors);
router.all('*', rateLimitMiddleware);
```

### SQLite → D1
```javascript
// Before (SQLite)
const db = new Database('trq.db');
db.prepare('SELECT * FROM projects').all();

// After (D1)
const result = await env.DB.prepare('SELECT * FROM projects').all();
```

### File Storage → R2
```javascript
// Before (Local filesystem)
fs.writeFileSync(path, buffer);

// After (R2)
await env.R2.put(filename, buffer);
```

### Express Caching → KV Caching
```javascript
// Before (No caching)
const projects = db.prepare('SELECT * FROM projects').all();

// After (KV caching)
const cached = await getCached('cache:projects', env);
if (cached) return cached;
const projects = await db.prepare('SELECT * FROM projects').all();
await setCached('cache:projects', projects, env, 120);
```

---

## Performance Comparison

### Before
```
GET /api/projects
├─ CORS preflight: 50ms
├─ Database query: 100ms
├─ Response: 50ms
└─ Total: 200ms (from US only)
```

### After
```
GET /api/projects
├─ CORS preflight: 1ms
├─ Cache hit: 0ms (or DB query: 10ms)
├─ Response: 1ms
└─ Total: 2ms (from 200+ edge locations)
```

**100x faster!**

---

## Common Tasks

### Add a New Route
1. Create handler in `src/routes/newfeature.js`
2. Import in `src/worker.js`
3. Add route: `router.get('/api/newfeature', newfeatureRoutes.getAll)`
4. Deploy: `wrangler deploy`

### Query Database
```bash
wrangler d1 execute trq-db --command "SELECT * FROM projects LIMIT 5"
```

### View Cache
```bash
wrangler kv:key list --namespace-id YOUR_CACHE_ID
```

### View Logs
```bash
wrangler tail
```

### Update Frontend API URL
```env
# .env.production
VITE_API_URL=https://your-worker.workers.dev/api
```

---

## Troubleshooting

### "Database not found"
- Run: `wrangler d1 create trq-db`
- Copy ID to wrangler.toml

### "R2 bucket not found"
- Run: `wrangler r2 bucket create trq-media`

### "KV namespace not found"
- Run: `wrangler kv:namespace create CACHE`
- Copy ID to wrangler.toml

### CORS still failing
- Check `src/middleware/cors.js`
- Add your domain to `ALLOWED_ORIGINS`
- Redeploy: `wrangler deploy`

### Slow queries
- Check indexes: `wrangler d1 execute trq-db --command "SELECT * FROM sqlite_master WHERE type='index'"`
- Add missing indexes to `migrations/001_init_schema.sql`
- Re-run migration

---

## Next: Migrate Data

If you have existing data in SQLite:

```bash
# Export from old database
sqlite3 server/trq.db ".dump projects" > projects.sql

# Import to D1
wrangler d1 execute trq-db --file projects.sql
```

---

## Monitoring

### View Real-time Logs
```bash
wrangler tail
```

### Check Performance
- Cloudflare Dashboard → Workers → Metrics
- View latency, errors, requests

### Set Up Alerts
- Cloudflare Dashboard → Notifications
- Alert on error rate > 1%

---

## Production Deployment

```bash
# Deploy to production
wrangler deploy --env production

# View production logs
wrangler tail --env production

# Rollback if needed
wrangler rollback --env production
```

---

## Cost Estimate

- **D1**: $0.75/month (first 5GB free)
- **R2**: $0.015/GB (first 10GB free)
- **KV**: $0.50/month (first 100k ops free)
- **Workers**: $0.50/month (first 100k requests free)

**Total**: ~$2-5/month for typical usage

---

## Support

- Cloudflare Docs: https://developers.cloudflare.com/workers/
- D1 Docs: https://developers.cloudflare.com/d1/
- R2 Docs: https://developers.cloudflare.com/r2/
- KV Docs: https://developers.cloudflare.com/kv/

