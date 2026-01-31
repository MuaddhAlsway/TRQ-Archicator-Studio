# TRQ Studio - Cloudflare Deployment Quick Start

This guide provides three automated deployment scripts to make deploying to Cloudflare Pages as simple as possible.

## 📋 Quick Overview

| Script | OS | Usage |
|--------|----|----|
| `deploy-quick-start.sh` | macOS/Linux | `bash deploy-quick-start.sh` |
| `deploy-quick-start.bat` | Windows (CMD) | `deploy-quick-start.bat` |
| `deploy-quick-start.ps1` | Windows (PowerShell) | `.\deploy-quick-start.ps1` |

## 🚀 Quick Start (Choose Your OS)

### macOS/Linux
```bash
bash deploy-quick-start.sh
```

### Windows (PowerShell - Recommended)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-quick-start.ps1
```

### Windows (Command Prompt)
```cmd
deploy-quick-start.bat
```

## 📋 What Each Script Does

All three scripts perform the same steps:

1. **Check Prerequisites** - Verifies Node.js, npm, and Wrangler are installed
2. **Setup Environment** - Configures backend URL from `.env.production`
3. **Install Dependencies** - Runs `npm install` if needed
4. **Build Frontend** - Compiles React app with `npm run build`
5. **Check Authentication** - Verifies Cloudflare login (prompts if needed)
6. **Deploy** - Uploads to Cloudflare Pages (preview or production)
7. **Verify** - Checks that the site is live
8. **Summary** - Shows next steps and useful links

## 🔧 Prerequisites

Before running any script, ensure you have:

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (v7+) - Comes with Node.js
- **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **Wrangler CLI** - Installed via npm (scripts will use `npx` if not global)

### Verify Prerequisites
```bash
node --version    # Should be v16 or higher
npm --version     # Should be v7 or higher
```

## 🔑 First Time Setup

### 1. Authenticate with Cloudflare

The script will prompt you to authenticate if needed. You can also do this manually:

```bash
npx wrangler login
```

This opens a browser window to authorize Wrangler with your Cloudflare account.

### 2. Configure Backend URL

Edit `.env.production` and set your backend API URL:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

**Examples:**
- Heroku: `https://trq-backend.herokuapp.com/api`
- Railway: `https://trq-backend-prod.railway.app/api`
- Custom VPS: `https://api.trqstudio.com/api`
- Local testing: `http://localhost:4242/api`

### 3. Configure Backend CORS

Update `server/.env` to allow requests from Cloudflare:

```env
CORS_ORIGINS=http://localhost:5173,http://localhost:4242,https://trq-studio.pages.dev
```

Then restart your backend server.

## 📊 Deployment Options

### Preview Deployment (Default)
```bash
bash deploy-quick-start.sh
# When prompted, choose "n" for preview
```

This deploys to a preview URL and doesn't affect production.

### Production Deployment
```bash
bash deploy-quick-start.sh
# When prompted, choose "y" for production
```

Or use the production flag (PowerShell only):
```powershell
.\deploy-quick-start.ps1 -Production
```

## 🎯 Advanced Usage

### PowerShell Advanced Options

Skip build if you already built:
```powershell
.\deploy-quick-start.ps1 -SkipBuild
```

Skip authentication check:
```powershell
.\deploy-quick-start.ps1 -SkipAuth
```

Deploy to production directly:
```powershell
.\deploy-quick-start.ps1 -Production
```

Combine options:
```powershell
.\deploy-quick-start.ps1 -Production -SkipBuild
```

## 📍 Deployment URLs

After successful deployment:

- **Preview**: `https://trq-studio.pages.dev`
- **Custom Domain**: Configure in Cloudflare dashboard

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Site loads at `https://trq-studio.pages.dev`
- [ ] Navigation works (Home, Portfolio, Services, etc.)
- [ ] Projects load and display correctly
- [ ] Contact form works (check browser console)
- [ ] API calls succeed (check Network tab in DevTools)
- [ ] No CORS errors in console
- [ ] Images load properly
- [ ] Responsive design works on mobile

## 🐛 Troubleshooting

### CORS Errors in Console
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Check backend URL in `.env.production` is correct
2. Update `CORS_ORIGINS` in `server/.env`
3. Restart backend server
4. Redeploy frontend

### API Calls Failing
```
Failed to fetch from https://your-backend-domain.com/api
```

**Solution:**
1. Verify backend server is running
2. Check backend URL is accessible from browser
3. Check Network tab in DevTools for actual request URL
4. Verify backend is listening on correct port

### Build Errors
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
npm run lint          # Check for TypeScript errors
npm run build         # Try building manually
npm install --legacy-peer-deps  # If dependency conflicts
```

### Authentication Failed
```
Error: Not authenticated with Cloudflare
```

**Solution:**
```bash
npx wrangler logout
npx wrangler login
```

### Deployment Stuck
If deployment seems stuck:
1. Check Cloudflare dashboard: https://dash.cloudflare.com/pages
2. Look at deployment logs
3. Try deploying again
4. Check for build errors in console

## 📚 Manual Deployment (Without Script)

If you prefer to deploy manually:

```bash
# 1. Install dependencies
npm install

# 2. Build frontend
npm run build

# 3. Authenticate with Cloudflare
npx wrangler login

# 4. Deploy to preview
npm run deploy

# 5. Or deploy to production
npm run deploy:prod
```

## 🔄 Redeployment

To redeploy after making changes:

```bash
bash deploy-quick-start.sh
```

The script will:
- Rebuild your site
- Deploy the new version
- Keep deployment history for rollback

## ⏮️ Rollback to Previous Deployment

If something goes wrong:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages → Your Project
3. Click "Deployments" tab
4. Find the previous working deployment
5. Click "Rollback"

## 📞 Support & Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Troubleshooting Guide**: See `CLOUDFLARE_DEPLOYMENT_GUIDE.md`
- **Full Setup Guide**: See `COMPLETE_SETUP_GUIDE.md`

## 🔐 Security Notes

- Never commit `.env.production` with real credentials
- Keep `TURSO_AUTH_TOKEN` secret in `server/.env`
- Use environment variables for sensitive data
- Regularly rotate authentication tokens

## 📝 Environment Variables Reference

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend (server/.env)
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:4242,https://trq-studio.pages.dev
JWT_SECRET=your-secret-key
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## 🎓 Learning Resources

- [Cloudflare Pages Getting Started](https://developers.cloudflare.com/pages/get-started/)
- [Wrangler CLI Guide](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [React Deployment Best Practices](https://react.dev/learn/deployment)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## 💡 Tips & Best Practices

1. **Test Locally First**
   ```bash
   npm run dev
   ```

2. **Check Build Size**
   - Keep under 25MB for optimal performance
   - Use `npm run build` to see size

3. **Monitor Deployments**
   - Check Cloudflare dashboard regularly
   - Review deployment logs for errors

4. **Use Preview First**
   - Always test on preview before production
   - Share preview URL with team for testing

5. **Keep Backups**
   - Cloudflare keeps deployment history
   - Use rollback feature if needed

## 🚀 Next Steps

1. Run the deployment script for your OS
2. Follow the prompts
3. Visit your deployed site
4. Test all functionality
5. Share with your team!

---

**Happy deploying! 🎉**

For detailed information, see:
- `CLOUDFLARE_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `COMPLETE_SETUP_GUIDE.md` - Complete project setup
- `README.md` - Project overview
