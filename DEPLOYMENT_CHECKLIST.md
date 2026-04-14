# CLOUDFLARE PAGES DEPLOYMENT CHECKLIST

## Pre-Deployment Verification

### 1. Environment Variables Setup
- [ ] Set `VITE_API_URL` in Cloudflare Pages environment
  - Value: `https://trq-api-prod.muaddhalsway.workers.dev/api`
- [ ] Verify `TURSO_AUTH_TOKEN` is set in Cloudflare Workers
- [ ] Verify `JWT_SECRET` is configured
- [ ] Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set

### 2. Database Configuration
- [ ] Turso database is accessible
- [ ] All tables are created (projects, users, contacts, pricing_requests, services, slides, articles, settings)
- [ ] Video column exists in hero_slides table
- [ ] Slides are ordered by sortOrder

### 3. API Endpoints Verification
- [ ] Health check: `GET /api/health`
- [ ] Login: `POST /api/auth/login`
- [ ] Projects: `GET /api/projects`
- [ ] Slides: `GET /api/slides`
- [ ] Services: `GET /api/services`
- [ ] Settings: `GET /api/settings`
- [ ] Upload: `POST /api/upload`

### 4. Admin Panel Testing
- [ ] Login works with admin/trq2026
- [ ] Dashboard loads without errors
- [ ] Projects can be created/edited/deleted
- [ ] Services can be managed
- [ ] Slides can be managed with videos
- [ ] Settings can be updated
- [ ] File uploads work correctly
- [ ] Contact messages display correctly
- [ ] Pricing requests display correctly

### 5. Frontend Testing
- [ ] Website loads on Cloudflare Pages
- [ ] Hero slider displays with correct videos/images
- [ ] Services section displays correctly
- [ ] Projects portfolio loads
- [ ] Contact form works
- [ ] Pricing form works
- [ ] Newsletter subscription works

### 6. Security Verification
- [ ] CORS is properly configured
- [ ] JWT tokens are being issued correctly
- [ ] Token refresh works
- [ ] Rate limiting is active
- [ ] File uploads are validated
- [ ] Input sanitization is working

### 7. Email Service
- [ ] Gmail credentials are correct
- [ ] Contact replies can be sent
- [ ] Pricing quotes can be sent
- [ ] Newsletter emails can be sent

### 8. Performance & Monitoring
- [ ] API response times are acceptable
- [ ] Database queries are optimized
- [ ] Caching is working
- [ ] Error logging is active
- [ ] No console errors in browser

## Deployment Steps

### Step 1: Build Frontend
```bash
npm run build
```

### Step 2: Deploy to Cloudflare Pages
```bash
npm run deploy
```

### Step 3: Verify Deployment
- Check Cloudflare Pages dashboard
- Verify build was successful
- Check deployment URL

### Step 4: Test Admin Panel
1. Navigate to `https://trq-studio.pages.dev/admin`
2. Login with admin/trq2026
3. Test all admin functions

### Step 5: Monitor for Errors
- Check browser console for errors
- Check Cloudflare Workers logs
- Check database sync status

## Rollback Plan

If issues occur:
1. Revert to previous Cloudflare Pages deployment
2. Check error logs in Cloudflare dashboard
3. Verify environment variables
4. Check database connectivity
5. Review recent changes

## Post-Deployment

- [ ] Monitor error rates
- [ ] Check database sync status
- [ ] Verify email notifications are working
- [ ] Test admin panel functionality
- [ ] Monitor API response times
- [ ] Check file upload functionality

## Critical Fixes Applied

1. ✓ Fixed slides ordering (sortOrder ASC)
2. ✓ Added video column to hero_slides table
3. ✓ Fixed video field in slides API endpoints
4. ✓ Fixed ImageUpload API URL configuration
5. ✓ Verified CORS configuration
6. ✓ Verified email service setup
7. ✓ Verified database sync mechanism

## Known Limitations

- Email service requires Gmail app password
- File uploads limited to 10MB
- Database sync is non-blocking (eventual consistency)
- Rate limiting: 5 login attempts per 15 minutes

## Support & Troubleshooting

### Admin Login Issues
- Verify credentials: admin/trq2026
- Check JWT_SECRET environment variable
- Check rate limiting (wait 15 minutes if locked out)

### File Upload Issues
- Check file size (max 10MB)
- Check file type (JPG, PNG, WebP, GIF, SVG)
- Verify upload endpoint is accessible
- Check authorization token

### Database Issues
- Verify Turso connection
- Check TURSO_AUTH_TOKEN
- Verify database tables exist
- Check database sync logs

### Email Issues
- Verify Gmail credentials
- Check GMAIL_USER and GMAIL_APP_PASSWORD
- Verify Gmail app password is correct
- Check email service logs

## Contact & Support

For issues or questions:
1. Check error logs in Cloudflare dashboard
2. Review this checklist
3. Check database connectivity
4. Verify environment variables
