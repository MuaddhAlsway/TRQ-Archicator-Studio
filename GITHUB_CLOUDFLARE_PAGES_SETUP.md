# GitHub to Cloudflare Pages Auto-Deployment Setup

## Your Repository
**GitHub URL:** https://github.com/MuaddhAlsway/TRQ-Studio-Architecture

---

## Step 1: Connect GitHub to Cloudflare Pages

### Go to Cloudflare Dashboard
1. Open: **https://dash.cloudflare.com**
2. Log in with your Cloudflare account

### Create Pages Project
1. Click **Pages** in the left sidebar
2. Click **Create a project**
3. Click **Connect to Git**
4. Select **GitHub**
5. Click **Authorize Cloudflare** (if prompted)
6. Select your repository: **TRQ-Studio-Architecture**
7. Click **Begin setup**

### Configure Build Settings
Fill in these exact values:

| Setting | Value |
|---------|-------|
| **Framework preset** | None |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Environment variables** | (leave empty for now) |

8. Click **Save and Deploy**

---

## Step 2: After Setup - Your Live URLs

Once deployed, you'll have:

### Frontend (Cloudflare Pages)
```
https://trq-studio-[random].pages.dev
```

### API (Cloudflare Workers)
```
https://trq-api-production.tareq-232.workers.dev/api
```

---

## Step 3: Push Changes to Deploy

Every time you push to GitHub, Cloudflare automatically deploys:

```powershell
# Make your changes locally
# Then push to GitHub:

git add .
git commit -m "Your change description"
git push origin main
```

**That's it!** Your changes will be live in 1-2 minutes.

---

## Step 4: Monitor Deployments

1. Go to: **https://dash.cloudflare.com**
2. Click **Pages**
3. Select **TRQ-Studio-Architecture**
4. You'll see deployment history and status

---

## Troubleshooting

### Build Fails
- Check that `npm run build` works locally: `npm run build`
- Verify `dist` folder is created

### Site Shows 404
- Wait 2-3 minutes for deployment to complete
- Check Cloudflare Pages dashboard for errors
- Verify build output directory is `dist`

### API Not Working
- API is separate: `https://trq-api-production.tareq-232.workers.dev/api`
- Frontend calls should use this URL
- Check CORS settings if needed

---

## Quick Reference

| Action | Command |
|--------|---------|
| Push changes | `git push origin main` |
| Check status | Visit Cloudflare Pages dashboard |
| View logs | Click deployment in dashboard |
| Rebuild | Push a new commit |

