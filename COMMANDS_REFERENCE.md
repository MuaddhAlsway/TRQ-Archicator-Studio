# Commands Reference - Cloudflare Workers

## Deployment Commands

### Deploy Worker
```bash
wrangler deploy
```

### Deploy to Production
```bash
wrangler deploy --env production
```

### View Deployment History
```bash
wrangler deployments list
```

### Rollback to Previous Version
```bash
wrangler rollback --env production
```

---

## Database Commands

### Execute Query
```bash
wrangler d1 execute trq-db --command "SELECT * FROM projects LIMIT 1;" --remote
```

### Run Migration
```bash
wrangler d1 execute trq-db --file migrations/001_init_schema.sql --remote
```

### Check Database Info
```bash
wrangler d1 info trq-db
```

### List Tables
```bash
wrangler d1 execute trq-db --command "SELECT name FROM sqlite_master WHERE type='table';" --remote
```

### List Indexes
```bash
wrangler d1 execute trq-db --command "SELECT name FROM sqlite_master WHERE type='index';" --remote
```

### Check Row Counts
```bash
wrangler d1 execute trq-db --command "SELECT 'projects' as table_name, COUNT(*) as count FROM projects UNION ALL SELECT 'hero_slides', COUNT(*) FROM hero_slides UNION ALL SELECT 'services', COUNT(*) FROM services UNION ALL SELECT 'settings', COUNT(*) FROM settings UNION ALL SELECT 'blog_articles', COUNT(*) FROM blog_articles;" --remote
```

### Check Database Size
```bash
wrangler d1 execute trq-db --command "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();" --remote
```

### Backup Database
```bash
wrangler d1 execute trq-db --command ".dump" --remote > backup.sql
```

---

## R2 Commands

### Create Bucket
```bash
wrangler r2 bucket create trq-media
```

### List Files
```bash
wrangler r2 object list trq-media
```

### List Files Recursively
```bash
wrangler r2 object list trq-media --recursive
```

### Upload File
```bash
wrangler r2 object put trq-media filename.jpg --file path/to/filename.jpg
```

### Upload Directory
```bash
for file in public/**/*; do
  if [ -f "$file" ]; then
    wrangler r2 object put trq-media "$file" --file "$file"
  fi
done
```

### Download File
```bash
wrangler r2 object get trq-media filename.jpg > filename.jpg
```

### Delete File
```bash
wrangler r2 object delete trq-media filename.jpg
```

### Delete Bucket
```bash
wrangler r2 bucket delete trq-media
```

---

## KV Commands

### List Keys
```bash
wrangler kv:namespace list
```

### List Keys in Namespace
```bash
wrangler kv:key list --namespace-id YOUR_NAMESPACE_ID
```

### Get Value
```bash
wrangler kv:key get --namespace-id YOUR_NAMESPACE_ID key_name
```

### Set Value
```bash
wrangler kv:key put --namespace-id YOUR_NAMESPACE_ID key_name "value"
```

### Delete Key
```bash
wrangler kv:key delete --namespace-id YOUR_NAMESPACE_ID key_name
```

### Create Namespace
```bash
wrangler kv:namespace create CACHE
```

### Create Namespace for Production
```bash
wrangler kv:namespace create CACHE --preview false
```

---

## Logging Commands

### View Real-time Logs
```bash
wrangler tail
```

### View Logs with Format
```bash
wrangler tail --format json
```

### View Logs for Specific Environment
```bash
wrangler tail --env production
```

### View Logs with Filters
```bash
wrangler tail --status error
```

---

## Pages Commands

### Deploy Frontend
```bash
wrangler pages deploy dist --project-name trq-frontend
```

### Deploy to Production
```bash
wrangler pages deploy dist --project-name trq-frontend --branch production
```

### List Deployments
```bash
wrangler pages deployments list --project trq-frontend
```

### Rollback Deployment
```bash
wrangler pages rollback --project trq-frontend
```

---

## Development Commands

### Start Local Development
```bash
wrangler dev
```

### Start with Specific Port
```bash
wrangler dev --port 8787
```

### Start with Remote Database
```bash
wrangler dev --remote
```

---

## Testing Commands

### Test Health Endpoint
```bash
curl https://trq-api.tareq-232.workers.dev/api/health
```

### Test Login
```bash
curl -X POST https://trq-api.tareq-232.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"trq2026"}'
```

### Test Protected Route
```bash
TOKEN="your-token-from-login"
curl https://trq-api.tareq-232.workers.dev/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

### Test GET Endpoint
```bash
curl https://trq-api.tareq-232.workers.dev/api/projects
```

### Test POST Endpoint
```bash
TOKEN="your-token"
curl -X POST https://trq-api.tareq-232.workers.dev/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "category": "Design",
    "description": "Test",
    "status": "published"
  }'
```

### Test CORS Headers
```bash
curl -i https://trq-api.tareq-232.workers.dev/api/projects
```

### Test Rate Limiting
```bash
# Send 6 login requests (limit is 5 per 15 min)
for i in {1..6}; do
  curl -X POST https://trq-api.tareq-232.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
done
```

### Test Caching
```bash
# First request (cache miss)
time curl https://trq-api.tareq-232.workers.dev/api/settings

# Second request (cache hit - should be faster)
time curl https://trq-api.tareq-232.workers.dev/api/settings
```

### Test with Postman
```
Base URL: https://trq-api.tareq-232.workers.dev/api

Headers:
- Content-Type: application/json
- Authorization: Bearer YOUR_TOKEN (for protected routes)

Login:
POST /auth/login
Body: {"username":"admin","password":"trq2026"}

Get Projects:
GET /projects

Create Project:
POST /projects
Body: {"title":"Test","category":"Design","description":"Test","status":"published"}
```

---

## Data Migration Commands

### Export from SQLite
```bash
cd server
sqlite3 trq.db ".dump" > ../backup.sql
cd ..
```

### Export Specific Table
```bash
sqlite3 server/trq.db ".dump projects" > projects.sql
```

### Import to D1
```bash
wrangler d1 execute trq-db --file backup.sql --remote
```

### Import Specific Table
```bash
wrangler d1 execute trq-db --file projects.sql --remote
```

### Verify Import
```bash
wrangler d1 execute trq-db --command "SELECT COUNT(*) FROM projects;" --remote
```

---

## Monitoring Commands

### Check Worker Status
```bash
wrangler deployments list
```

### Check Database Status
```bash
wrangler d1 info trq-db
```

### Check R2 Bucket
```bash
wrangler r2 object list trq-media
```

### Check KV Namespace
```bash
wrangler kv:key list --namespace-id YOUR_NAMESPACE_ID
```

### View Metrics
```bash
# In Cloudflare Dashboard:
# Workers → Metrics
# View latency, errors, requests
```

---

## Configuration Commands

### Show Current Config
```bash
wrangler publish --dry-run
```

### Validate Config
```bash
wrangler publish --dry-run
```

### Update Environment Variables
```bash
# Edit wrangler.toml and redeploy
wrangler deploy
```

---

## Troubleshooting Commands

### Check Logs for Errors
```bash
wrangler tail --status error
```

### Check Specific Error
```bash
wrangler tail | grep "error message"
```

### Test Database Connection
```bash
wrangler d1 execute trq-db --command "SELECT 1;" --remote
```

### Test Worker Deployment
```bash
curl https://trq-api.tareq-232.workers.dev/api/health
```

### Check CORS Configuration
```bash
curl -i -X OPTIONS https://trq-api.tareq-232.workers.dev/api/projects
```

### View Worker Bindings
```bash
wrangler publish --dry-run
```

---

## Useful Aliases

Add these to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Deployment
alias deploy="wrangler deploy"
alias deploy-prod="wrangler deploy --env production"
alias logs="wrangler tail"

# Database
alias db-query="wrangler d1 execute trq-db --command"
alias db-info="wrangler d1 info trq-db"
alias db-backup="wrangler d1 execute trq-db --command '.dump' --remote > backup.sql"

# R2
alias r2-list="wrangler r2 object list trq-media"
alias r2-upload="wrangler r2 object put trq-media"

# KV
alias kv-list="wrangler kv:key list --namespace-id"

# Testing
alias test-health="curl https://trq-api.tareq-232.workers.dev/api/health"
alias test-login="curl -X POST https://trq-api.tareq-232.workers.dev/api/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"trq2026\"}'"
alias test-projects="curl https://trq-api.tareq-232.workers.dev/api/projects"
```

---

## Common Workflows

### Deploy and Test
```bash
wrangler deploy
sleep 2
curl https://trq-api.tareq-232.workers.dev/api/health
```

### Migrate Data
```bash
cd server
sqlite3 trq.db ".dump" > ../backup.sql
cd ..
wrangler d1 execute trq-db --file backup.sql --remote
wrangler d1 execute trq-db --command "SELECT COUNT(*) FROM projects;" --remote
```

### Upload Media
```bash
wrangler r2 bucket create trq-media
for file in public/**/*; do
  if [ -f "$file" ]; then
    wrangler r2 object put trq-media "$file" --file "$file"
  fi
done
```

### Full Deployment
```bash
# 1. Deploy Worker
wrangler deploy

# 2. Migrate data
cd server
sqlite3 trq.db ".dump" > ../backup.sql
cd ..
wrangler d1 execute trq-db --file backup.sql --remote

# 3. Upload media
for file in public/**/*; do
  if [ -f "$file" ]; then
    wrangler r2 object put trq-media "$file" --file "$file"
  fi
done

# 4. Deploy frontend
npm run build
wrangler pages deploy dist --project-name trq-frontend

# 5. Test
curl https://trq-api.tareq-232.workers.dev/api/health
```

---

## Help Commands

### Get Help
```bash
wrangler --help
wrangler d1 --help
wrangler r2 --help
wrangler kv --help
wrangler pages --help
```

### Get Command Help
```bash
wrangler deploy --help
wrangler d1 execute --help
wrangler r2 object put --help
```

---

## Documentation Links

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [R2 Storage](https://developers.cloudflare.com/r2/)
- [KV Storage](https://developers.cloudflare.com/kv/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

