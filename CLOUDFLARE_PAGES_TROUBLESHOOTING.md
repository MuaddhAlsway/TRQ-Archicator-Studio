# Cloudflare Pages Troubleshooting Guide

## Build Issues

### Build Command Failed

**Error:** `Build command failed`

**Solutions:**
1. Check Node.js version: `node --version` (should be 18+)
2. Clear cache: `rm -rf node_modules dist && npm install`
3. Run build locally: `npm run build`
4. Check for TypeScript errors: `npm run lint`
5. Review build logs in Cloudflare Dashboard

### Missing Dependencies

**Error:** `Cannot find module 'react'`

**Solutions:**
1. Ensure `package.json` has all dependencies
2. Run `npm install` locally
3. Commit `package-lock.json` to git
4. Check Cloudflare build logs for npm errors

### TypeScript Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solutions:**
1. Run `npm run build` locally to see full error
2. Fix TypeScript errors in source files
3. Check `tsconfig.json` configuration
4. Verify all imports are correct

### Build Output Directory Wrong

**Error:** `dist folder not found` or `404 on all pages`

**Solutions:**
1. Verify `vite.config.js` has `outDir: 'dist'`
2. Check Cloudflare Pages build output directory is set to `dist`
3. Run `npm run build` locally and verify `dist/` exists
4. Check `dist/index.html` exists

## Deployment Issues

### Deployment Stuck

**Error:** Deployment shows "In Progress" for > 10 minutes

**Solutions:**
1. Refresh Cloudflare Dashboard
2. Check build logs for errors
3. Cancel deployment and retry
4. Check git repository connectivity

### Deployment Failed

**Error:** Red X on deployment

**Solutions:**
1. Click deployment to view logs
2. Scroll to "Build log" section
3. Look for error messages
4. Fix errors locally and push to git
5. Deployment will retry automatically

### Environment Variables Not Applied

**Error:** API returns 500 or "TURSO_AUTH_TOKEN not configured"

**Solutions:**
1. Go to Pages project → Settings → Environment Variables
2. Verify `TURSO_AUTH_TOKEN` is set
3. Verify `TURSO_API_URL` is set
4. Redeploy after adding variables
5. Check function logs for token value

## API Issues

### API Returns 404

**Error:** `GET /api/projects → 404 Not Found`

**Solutions:**
1. Verify `functions/api/[[route]].js` exists
2. Check file path is exactly `functions/api/[[route]].js`
3. Verify Pages Functions are deployed (check Cloudflare Dashboard)
4. Test with curl: `curl https://trq-studio.pages.dev/api/health`
5. Check function logs in Cloudflare Dashboard

### API Returns 500

**Error:** `GET /api/projects → 500 Internal Server Error`

**Solutions:**
1. Check function logs in Cloudflare Dashboard
2. Verify `TURSO_AUTH_TOKEN` is set
3. Verify database URL is correct
4. Test database connection with curl:
```bash
curl -X POST https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"requests":[{"type":"execute","stmt":{"sql":"SELECT 1"}}]}'
```
5. Check Turso database status

### API Returns Empty Array

**Error:** `GET /api/projects → []` (empty array)

**Solutions:**
1. Verify data exists in database
2. Check database query in `functions/api/[[route]].js`
3. Verify table names are correct
4. Test query directly in Turso dashboard
5. Check for SQL syntax errors

### API Timeout

**Error:** `Request timeout` or `504 Gateway Timeout`

**Solutions:**
1. Check database query performance
2. Optimize SQL queries
3. Add indexes to frequently queried columns
4. Check Turso database status
5. Verify network connectivity

## CORS Issues

### CORS Error in Browser

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Verify API response includes CORS headers:
```bash
curl -i https://trq-studio.pages.dev/api/health
# Look for: Access-Control-Allow-Origin: *
```
2. Check `functions/api/[[route]].js` has CORS headers
3. Verify frontend is using `/api` (not full URL)
4. Check browser console for specific error
5. Test with curl to verify headers are present

### Preflight Request Fails

**Error:** `OPTIONS /api/... → 404`

**Solutions:**
1. Verify `handleOptions()` function exists in API handler
2. Check for `if (method === 'OPTIONS')` in handler
3. Verify CORS headers are returned for OPTIONS requests
4. Test with curl:
```bash
curl -i -X OPTIONS https://trq-studio.pages.dev/api/health
```

## Frontend Issues

### Frontend Shows 404

**Error:** `404 Not Found` on all pages

**Solutions:**
1. Verify `dist/index.html` exists
2. Check Cloudflare Pages build output directory is `dist`
3. Verify `vite.config.js` has correct build settings
4. Check for routing issues in React app
5. Verify `public/_redirects` file exists (if using custom routing)

### Frontend Loads But API Calls Fail

**Error:** `Failed to fetch /api/projects`

**Solutions:**
1. Check browser console for specific error
2. Verify API endpoint is correct
3. Check CORS headers in API response
4. Verify environment variables are set
5. Test API with curl

### Images Not Loading

**Error:** Images show broken icon

**Solutions:**
1. Verify image paths are correct
2. Check if images are in `public/` folder
3. Verify image URLs in database
4. Check `processImagePaths()` function in API handler
5. Test image URL directly in browser

### Styles Not Applied

**Error:** Page loads but no CSS styling

**Solutions:**
1. Check `dist/` folder has CSS files
2. Verify Tailwind CSS is configured
3. Check `vite.config.js` has CSS processing
4. Verify `src/index.css` is imported in `src/main.jsx`
5. Check browser console for CSS loading errors

## Database Issues

### Database Connection Failed

**Error:** `TURSO_AUTH_TOKEN not configured` or `Turso error: 401`

**Solutions:**
1. Verify token is set in Cloudflare Pages environment variables
2. Check token hasn't expired
3. Generate new token if needed
4. Verify token format is correct
5. Test token with curl:
```bash
curl -H "Authorization: Bearer <token>" \
  https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline
```

### Database Query Failed

**Error:** `Turso error: 400` or `SQL syntax error`

**Solutions:**
1. Check SQL query syntax in `functions/api/[[route]].js`
2. Verify table names are correct
3. Verify column names are correct
4. Test query in Turso dashboard
5. Check for special characters in query

### Database Timeout

**Error:** `Request timeout` or `504 Gateway Timeout`

**Solutions:**
1. Check database query performance
2. Add indexes to frequently queried columns
3. Optimize SQL queries
4. Check Turso database status
5. Verify network connectivity

## Performance Issues

### Slow Page Load

**Error:** Page takes > 5 seconds to load

**Solutions:**
1. Check Cloudflare Analytics for bottlenecks
2. Optimize images (use WebP, compress)
3. Enable caching for static assets
4. Check API response times
5. Use Lighthouse to identify issues

### Slow API Responses

**Error:** API takes > 2 seconds to respond

**Solutions:**
1. Check database query performance
2. Add indexes to frequently queried columns
3. Optimize SQL queries
4. Check Turso database status
5. Monitor Cloudflare Analytics

### High Memory Usage

**Error:** Function crashes or times out

**Solutions:**
1. Optimize data processing
2. Avoid loading entire datasets
3. Use pagination for large datasets
4. Check for memory leaks
5. Monitor function logs

## Authentication Issues

### Login Fails

**Error:** `Invalid credentials` or `401 Unauthorized`

**Solutions:**
1. Verify credentials are correct (admin / trq2026)
2. Check login endpoint in `functions/api/[[route]].js`
3. Verify token is being stored in localStorage
4. Check browser console for errors
5. Test login with curl:
```bash
curl -X POST https://trq-studio.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"trq2026"}'
```

### Token Verification Fails

**Error:** `Invalid token` or `401 Unauthorized`

**Solutions:**
1. Verify token is stored in localStorage
2. Check token format is correct
3. Verify token is being sent in Authorization header
4. Check token verification logic in API handler
5. Test with curl:
```bash
curl -H "Authorization: Bearer <token>" \
  https://trq-studio.pages.dev/api/auth/verify
```

### Admin Panel Not Accessible

**Error:** Redirected to login or `403 Forbidden`

**Solutions:**
1. Verify you're logged in
2. Check token is valid
3. Verify admin panel route is correct
4. Check browser console for errors
5. Clear localStorage and login again

## Monitoring & Debugging

### View Function Logs

1. Go to Cloudflare Dashboard
2. Select Pages project
3. Click on deployment
4. Scroll to "Functions" section
5. Click "View logs"

### Enable Debug Logging

Add to `functions/api/[[route]].js`:
```javascript
console.log('Request:', method, pathname);
console.log('Headers:', request.headers);
console.log('Body:', body);
```

### Test with curl

```bash
# Test health endpoint
curl -v https://trq-studio.pages.dev/api/health

# Test with headers
curl -v -H "Authorization: Bearer <token>" \
  https://trq-studio.pages.dev/api/projects

# Test POST request
curl -v -X POST https://trq-studio.pages.dev/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

### Check Cloudflare Analytics

1. Go to Pages project
2. Click "Analytics" tab
3. View traffic, errors, and performance metrics
4. Check for patterns in errors

## Getting Help

### Cloudflare Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)

### Turso Support

- [Turso Documentation](https://docs.turso.tech/)
- [Turso Discord](https://discord.gg/turso)

### Common Resources

- Check function logs first
- Review error messages carefully
- Test with curl to isolate issues
- Check Cloudflare status page
- Review recent changes

## Rollback Procedure

If deployment has critical issues:

1. Go to Cloudflare Pages project
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "Rollback to this deployment"
5. Confirm rollback
6. Wait for rollback to complete
7. Verify system is working
8. Fix issue locally
9. Redeploy

## Prevention Tips

1. Test locally before deploying
2. Use staging environment for testing
3. Monitor deployments closely
4. Keep backups of database
5. Document all changes
6. Use version control
7. Set up alerts for errors
8. Review logs regularly
