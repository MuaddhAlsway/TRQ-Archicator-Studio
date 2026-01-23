# Deployment Verification Checklist

## Pre-Deployment Checks

### Local Build
- [ ] Run `npm install` - all dependencies installed
- [ ] Run `npm run build` - build completes without errors
- [ ] Check `dist/` folder exists and contains files
- [ ] Run `npm run lint` - no critical errors

### Environment Configuration
- [ ] `.env.production` exists with `VITE_API_URL=/api`
- [ ] `.env.development` exists with `VITE_API_URL=http://localhost:4242/api`
- [ ] `functions/api/[[route]].js` exists
- [ ] `wrangler.toml` configured correctly
- [ ] `vite.config.js` has proper build settings

### Git Repository
- [ ] All changes committed
- [ ] No uncommitted changes
- [ ] Repository is public or Cloudflare has access
- [ ] Main branch is up to date

## Cloudflare Pages Setup

### Project Creation
- [ ] Cloudflare Pages project created
- [ ] Git repository connected
- [ ] Build command set to `npm run build`
- [ ] Build output directory set to `dist`
- [ ] Root directory set to `/`

### Environment Variables
- [ ] `TURSO_AUTH_TOKEN` set in Cloudflare
- [ ] `TURSO_API_URL` set in Cloudflare
- [ ] Variables visible in Pages settings

### Initial Deployment
- [ ] First deployment triggered
- [ ] Build completed successfully
- [ ] Deployment shows green checkmark
- [ ] No build errors in logs

## Post-Deployment Verification

### Frontend Access
- [ ] Frontend loads at `https://trq-studio.pages.dev`
- [ ] Page renders without errors
- [ ] CSS styles applied correctly
- [ ] Images load properly
- [ ] No console errors

### API Endpoints

#### Health Check
```bash
curl https://trq-studio.pages.dev/api/health
# Expected: {"status":"ok","timestamp":"..."}
```
- [ ] Returns 200 status
- [ ] Returns valid JSON
- [ ] Timestamp is current

#### Projects
```bash
curl https://trq-studio.pages.dev/api/projects
# Expected: Array of projects
```
- [ ] Returns 200 status
- [ ] Returns array of projects
- [ ] Projects have correct fields
- [ ] Images have absolute URLs

#### Published Projects
```bash
curl https://trq-studio.pages.dev/api/projects/published
# Expected: Array of published projects
```
- [ ] Returns 200 status
- [ ] Only published projects returned
- [ ] Correct count of projects

#### Services
```bash
curl https://trq-studio.pages.dev/api/services
# Expected: Array of services
```
- [ ] Returns 200 status
- [ ] Returns array of services
- [ ] Services have correct fields

#### Active Services
```bash
curl https://trq-studio.pages.dev/api/services/active
# Expected: Array of active services
```
- [ ] Returns 200 status
- [ ] Only active services returned

#### Slides
```bash
curl https://trq-studio.pages.dev/api/slides
# Expected: Array of slides
```
- [ ] Returns 200 status
- [ ] Returns array of slides
- [ ] Slides ordered by sortOrder

#### Active Slides
```bash
curl https://trq-studio.pages.dev/api/slides/active
# Expected: Array of active slides
```
- [ ] Returns 200 status
- [ ] Only active slides returned
- [ ] Images have absolute URLs

#### Settings
```bash
curl https://trq-studio.pages.dev/api/settings
# Expected: Settings object
```
- [ ] Returns 200 status
- [ ] Returns settings object
- [ ] All settings fields present

#### Articles
```bash
curl https://trq-studio.pages.dev/api/articles/published
# Expected: Array of published articles
```
- [ ] Returns 200 status
- [ ] Only published articles returned
- [ ] Articles have correct fields

### Admin Panel

#### Login
- [ ] Admin panel loads at `/admin`
- [ ] Login form displays
- [ ] Can enter credentials
- [ ] Login button works

#### Authentication
- [ ] Login with `admin` / `trq2026` succeeds
- [ ] Token stored in localStorage
- [ ] Redirects to dashboard
- [ ] Token verified on page load

#### Dashboard
- [ ] Dashboard loads without errors
- [ ] All sections visible
- [ ] Navigation works
- [ ] Sidebar displays correctly

#### Data Management
- [ ] Projects section loads
- [ ] Services section loads
- [ ] Slides section loads
- [ ] Articles section loads
- [ ] Settings section loads

### CORS Headers

```bash
curl -i https://trq-studio.pages.dev/api/health
# Check response headers
```
- [ ] `Access-Control-Allow-Origin: *` present
- [ ] `Access-Control-Allow-Methods` includes GET, POST, PUT, DELETE
- [ ] `Access-Control-Allow-Headers` includes Content-Type, Authorization
- [ ] `Content-Type: application/json` present

### Error Handling

#### 404 Errors
```bash
curl https://trq-studio.pages.dev/api/nonexistent
# Expected: 404 with error message
```
- [ ] Returns 404 status
- [ ] Returns JSON error message
- [ ] CORS headers present

#### Invalid Requests
```bash
curl -X POST https://trq-studio.pages.dev/api/contacts
# Expected: 400 with error message
```
- [ ] Returns 400 status
- [ ] Returns JSON error message
- [ ] CORS headers present

### Frontend Features

#### Home Page
- [ ] Hero slides display
- [ ] Images load correctly
- [ ] Navigation works
- [ ] Footer displays

#### Projects Page
- [ ] Projects load from API
- [ ] Projects display correctly
- [ ] Images load
- [ ] Filtering works (if implemented)

#### Services Page
- [ ] Services load from API
- [ ] Services display correctly
- [ ] Active services only shown

#### Blog Page
- [ ] Articles load from API
- [ ] Articles display correctly
- [ ] Pagination works (if implemented)

#### Contact Form
- [ ] Form displays
- [ ] Can submit contact
- [ ] Success message shows
- [ ] Data saved to database

#### Newsletter
- [ ] Newsletter signup displays
- [ ] Can enter email
- [ ] Can subscribe
- [ ] Success message shows

### Performance

#### Page Load Time
- [ ] Initial page load < 3 seconds
- [ ] API responses < 1 second
- [ ] Images load quickly

#### Network Requests
- [ ] No failed requests
- [ ] No 5xx errors
- [ ] No CORS errors
- [ ] All requests successful

### Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge - works
- [ ] Firefox - works
- [ ] Safari - works
- [ ] Mobile browsers - works

### Mobile Responsiveness

- [ ] Mobile layout displays correctly
- [ ] Touch interactions work
- [ ] Images scale properly
- [ ] Navigation accessible on mobile

## Rollback Plan

If issues found:

1. [ ] Identify the problem
2. [ ] Check Cloudflare Pages logs
3. [ ] Review recent changes
4. [ ] Rollback to previous deployment if needed
5. [ ] Fix issue locally
6. [ ] Redeploy

## Monitoring Setup

- [ ] Cloudflare Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Alerts configured (optional)

## Documentation

- [ ] Deployment guide updated
- [ ] API documentation current
- [ ] Admin panel guide available
- [ ] Troubleshooting guide created

## Sign-Off

- [ ] All checks passed
- [ ] System ready for production
- [ ] Team notified of deployment
- [ ] Monitoring active

---

## Quick Verification Script

Run this to verify deployment:

```bash
#!/bin/bash

echo "Verifying Cloudflare Pages Deployment..."
echo ""

# Test health endpoint
echo "Testing health endpoint..."
curl -s https://trq-studio.pages.dev/api/health | jq .

# Test projects endpoint
echo "Testing projects endpoint..."
curl -s https://trq-studio.pages.dev/api/projects | jq 'length'

# Test services endpoint
echo "Testing services endpoint..."
curl -s https://trq-studio.pages.dev/api/services | jq 'length'

# Test slides endpoint
echo "Testing slides endpoint..."
curl -s https://trq-studio.pages.dev/api/slides | jq 'length'

# Test articles endpoint
echo "Testing articles endpoint..."
curl -s https://trq-studio.pages.dev/api/articles/published | jq 'length'

# Test settings endpoint
echo "Testing settings endpoint..."
curl -s https://trq-studio.pages.dev/api/settings | jq .

echo ""
echo "Verification complete!"
```

Save as `verify-deployment.sh` and run:
```bash
chmod +x verify-deployment.sh
./verify-deployment.sh
```
