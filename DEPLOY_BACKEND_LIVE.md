# Deploy Backend to Render (Live 24/7)

Your backend is currently running locally. To make it live 24/7, follow these steps:

## Quick Deploy to Render (2 minutes)

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up with GitHub (use your GitHub account)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `TRQ-Archicator-Studio`
   - Select the repo and click "Connect"

3. **Configure Service**
   - **Name:** `trq-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `cd server && npm start`
   - **Plan:** Free (or Starter if you want better uptime)

4. **Add Environment Variables**
   Click "Advanced" and add these:
   
   ```
   TURSO_DATABASE_URL = libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io
   TURSO_AUTH_TOKEN = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA
   JWT_SECRET = trq-design-studio-secret-key-2026
   CORS_ORIGINS = https://197f8c96.trq-studio.pages.dev,https://trq-studio.pages.dev
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a live URL like: `https://trq-api-xxxxx.onrender.com`

6. **Update Frontend**
   After deployment, update `.env.production`:
   ```
   VITE_API_URL=https://trq-api-xxxxx.onrender.com/api
   ```
   
   Then redeploy frontend:
   ```bash
   npm run deploy
   ```

## Alternative: Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub"
4. Connect your repo
5. Add environment variables (same as above)
6. Deploy

## Alternative: Deploy to Heroku

1. Go to https://www.heroku.com
2. Create new app
3. Connect GitHub repo
4. Add environment variables
5. Deploy

## Your Live URLs After Deployment

- **Frontend:** https://197f8c96.trq-studio.pages.dev
- **Backend:** https://trq-api-xxxxx.onrender.com (or your chosen service)
- **API:** https://trq-api-xxxxx.onrender.com/api

## Test Your Live Backend

After deployment, test it:
```bash
curl https://trq-api-xxxxx.onrender.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-01-22T..."}
```

## Important Notes

- **Free tier on Render:** Spins down after 15 minutes of inactivity. Upgrade to Starter ($7/month) for always-on.
- **Data is safe:** Your data is in Turso cloud database, not on the server
- **Auto-deploy:** Every time you push to GitHub, it auto-deploys
- **Logs:** Check deployment logs in the service dashboard

## Need Help?

1. Render docs: https://render.com/docs
2. Railway docs: https://docs.railway.com
3. Heroku docs: https://devcenter.heroku.com
