# 🚀 TRQ STUDIO - Quick Start Guide (LIVE SYSTEM)

## 🌐 Your Website is LIVE

**Website**: https://production.trq-studio.pages.dev  
**Admin Panel**: https://production.trq-studio.pages.dev/admin  
**API**: https://trq-api-prod.muaddhalsway.workers.dev/api

---

## 🔐 Login to Admin Panel

1. Go to: https://production.trq-studio.pages.dev/admin
2. Username: `admin`
3. Password: `trq2026`
4. Click "Login"

---

## 📝 Update Content

### Option 1: Via Admin Panel (Easiest)
1. Login to admin panel
2. Click on the section you want to edit
3. Make changes
4. Click "Save"
5. Changes appear immediately

### Option 2: Via Code (For Developers)
1. Edit `src/i18n/en.json` (English)
2. Edit `src/i18n/ar.json` (Arabic)
3. Run: `npm run deploy:prod`
4. Changes live in ~2 minutes

---

## 🎨 What You Can Manage

### Projects
- Add new projects
- Edit project details
- Upload project images
- Publish/unpublish projects
- Delete projects

### Services
- Add new services
- Edit service descriptions
- Upload service images
- Manage service order
- Delete services

### Hero Slides
- Add new slides
- Edit slide content
- Upload slide images
- Set slide order
- Delete slides

### Blog Articles
- Write new articles
- Edit articles
- Upload article images
- Publish/unpublish articles
- Delete articles

### Site Settings
- Update site title
- Update site description
- Update contact information
- Update social media links
- Manage other settings

---

## 🚀 Deploy Changes

### Deploy Frontend
```bash
npm run deploy:prod
```

### Deploy Backend
```bash
npm run deploy:worker:prod
```

### Deploy Both
```bash
npm run deploy:prod && npm run deploy:worker:prod
```

---

## 💻 Local Development

### Start Frontend (Port 5173)
```bash
npm run dev
```

### Start Backend (Port 4242)
```bash
npm run worker:dev
```

### Build for Production
```bash
npm run build
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/i18n/en.json` | English content |
| `src/i18n/ar.json` | Arabic content |
| `.env.production` | Production API URL |
| `.env.development` | Development API URL |
| `src/api/index.ts` | API client |
| `server/worker.js` | Backend API |

---

## 🔍 Check System Status

### Check API Health
```bash
curl https://trq-api-prod.muaddhalsway.workers.dev/api/health
```

### View Backend Logs
```bash
wrangler tail --config wrangler-workers.toml --env production
```

### Check Frontend Build
```bash
npm run build
```

---

## 🐛 Troubleshooting

### Content Not Updating
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Wait 2-3 minutes for deployment

### Admin Panel Not Loading
1. Clear localStorage
2. Try incognito/private mode
3. Check browser console for errors

### API Not Responding
1. Check internet connection
2. Verify API URL in .env.production
3. Check Cloudflare status

### Images Not Loading
1. Verify image URLs are correct
2. Check image file exists
3. Verify image permissions

---

## 📊 Performance Tips

- Keep images optimized (< 500KB)
- Use WebP format when possible
- Minimize CSS/JS bundles
- Enable caching headers
- Monitor API response times

---

## 🔒 Security Tips

- Change admin password regularly
- Keep environment variables secret
- Use HTTPS for all connections
- Enable 2FA if available
- Monitor access logs

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Deploy frontend | `npm run deploy:prod` |
| Deploy backend | `npm run deploy:worker:prod` |
| Start dev server | `npm run dev` |
| Build for prod | `npm run build` |
| View logs | `wrangler tail --config wrangler-workers.toml --env production` |
| Check health | `curl https://trq-api-prod.muaddhalsway.workers.dev/api/health` |

---

## 🎯 Common Tasks

### Add a New Project
1. Login to admin panel
2. Go to "Projects"
3. Click "Add New Project"
4. Fill in details
5. Upload images
6. Click "Save"
7. Publish when ready

### Update Home Page Title
1. Edit `src/i18n/en.json`
2. Find `"home.introTitle"`
3. Change the value
4. Run `npm run deploy:prod`

### Update Home Page Description
1. Edit `src/i18n/en.json`
2. Find `"home.introText1"` and `"home.introText2"`
3. Change the values
4. Run `npm run deploy:prod`

### Add Arabic Content
1. Edit `src/i18n/ar.json`
2. Find the corresponding key
3. Add Arabic translation
4. Run `npm run deploy:prod`

---

## 📈 Monitoring

### Check Website Performance
- Visit: https://production.trq-studio.pages.dev
- Open DevTools (F12)
- Check Network tab for load times
- Check Console for errors

### Monitor API Performance
- Check response times in Network tab
- Monitor error rates
- Track request volume

### Database Performance
- Monitor query times
- Check connection status
- Review storage usage

---

## 🎉 You're All Set!

Your TRQ STUDIO website is live and ready to use. Everything is working perfectly.

**Next Steps:**
1. Visit your website: https://production.trq-studio.pages.dev
2. Login to admin: https://production.trq-studio.pages.dev/admin
3. Start managing your content
4. Monitor performance
5. Update content as needed

---

## 📚 Documentation

- **Full Deployment Report**: FINAL_DEPLOYMENT_REPORT.md
- **System Status**: DEPLOYMENT_STATUS_CURRENT.md
- **Verification Results**: DEPLOYMENT_VERIFICATION_COMPLETE.md
- **System Summary**: SYSTEM_READY_SUMMARY.md

---

**Status**: ✅ LIVE & OPERATIONAL  
**Last Updated**: January 23, 2026  
**Everything Working**: 100%

---

## 🚀 Ready to Go!

Your TRQ STUDIO website is fully deployed and operational. No action needed. Everything is working perfectly.

**Happy designing! 🎨**
