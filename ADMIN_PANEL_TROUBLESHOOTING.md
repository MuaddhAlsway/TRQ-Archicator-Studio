# 🔧 ADMIN PANEL - TROUBLESHOOTING GUIDE

**Solutions for common admin panel errors**

---

## ❌ ERROR: "Failed to fetch"

This error means the admin panel cannot connect to the backend API.

### ✅ SOLUTION 1: Check Backend Status

**Is the backend running?**

The backend needs to be running for the admin panel to work.

#### For Local Development:
```bash
# Terminal 1: Start the backend
cd server
npm start

# Terminal 2: Start the frontend
npm run dev
```

#### For Production:
The backend should be running on Cloudflare Workers:
- URL: `https://trq-api-prod.muaddhalsway.workers.dev/api`

### ✅ SOLUTION 2: Check Your Login

**Are you logged in?**

1. Make sure you're logged in with correct credentials:
   - Username: `admin`
   - Password: `trq2026`

2. If not logged in:
   - Go to: https://trq-studio.pages.dev/#/admin/login
   - Enter credentials
   - Click "Login"

### ✅ SOLUTION 3: Check Network Connection

**Is your internet working?**

1. Open browser console (F12)
2. Go to "Network" tab
3. Try to save a slide
4. Look for failed requests
5. Check the error details

### ✅ SOLUTION 4: Clear Browser Cache

**Try clearing cache and cookies:**

1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "All time"
3. Check "Cookies and other site data"
4. Check "Cached images and files"
5. Click "Clear data"
6. Refresh page and try again

### ✅ SOLUTION 5: Try Different Browser

**Try a different browser:**

- Chrome
- Firefox
- Safari
- Edge

If it works in another browser, there might be a browser-specific issue.

---

## ❌ ERROR: "Error saving slide: Failed to fetch"

### Possible Causes:

1. **Backend not running** → Start backend server
2. **Wrong API URL** → Check environment variables
3. **Network timeout** → Check internet connection
4. **CORS issue** → Check backend CORS configuration
5. **Invalid data** → Check all fields are filled correctly

### ✅ QUICK FIX:

1. **Check browser console (F12)**
   - Look for error messages
   - Check Network tab for failed requests

2. **Verify backend is running**
   - Local: `http://localhost:4242/api/health`
   - Production: `https://trq-api-prod.muaddhalsway.workers.dev/api/health`

3. **Check all required fields:**
   - Title (required)
   - Description (required)
   - Image URL (required)
   - At least one video URL (recommended)

4. **Try again**
   - Refresh page
   - Log out and log back in
   - Try in different browser

---

## ❌ ERROR: "Unauthorized" or "401"

This means your login token is invalid or expired.

### ✅ SOLUTION:

1. **Log out:**
   - Click your profile icon (top right)
   - Click "Logout"

2. **Clear browser data:**
   - Press `Ctrl + Shift + Delete`
   - Clear all data

3. **Log back in:**
   - Go to: https://trq-studio.pages.dev/#/admin/login
   - Enter credentials again
   - Click "Login"

4. **Try saving again**

---

## ❌ ERROR: "Slide not found" or "404"

This means the slide doesn't exist in the database.

### ✅ SOLUTION:

1. **Refresh the page**
   - Press `F5` or `Ctrl + R`

2. **Reload slides list**
   - Click "Hero Slides" in sidebar again

3. **Try creating a new slide instead**
   - Click "Add Slide" button
   - Fill in all fields
   - Click "Save Slide"

---

## ❌ ERROR: "Network timeout"

The request took too long to complete.

### ✅ SOLUTION:

1. **Check internet speed**
   - Try speedtest.net

2. **Try again**
   - Wait a few seconds
   - Try saving again

3. **Check backend performance**
   - Backend might be slow
   - Try at a different time

4. **Use local backend**
   - If using production, try local backend
   - Start local backend: `cd server && npm start`

---

## ❌ ERROR: "Image upload failed"

The image upload didn't work.

### ✅ SOLUTION:

1. **Check file size**
   - Max size: 5MB
   - Compress image if needed

2. **Check file format**
   - Supported: JPG, PNG, WebP, GIF
   - Convert if needed

3. **Try uploading again**
   - Click "Upload Image" button
   - Select file
   - Wait for upload to complete

4. **Use image URL instead**
   - Paste image URL directly
   - Click outside field to load preview

---

## ❌ ERROR: "Video URL not working"

The video URL is invalid or not accessible.

### ✅ SOLUTION:

1. **Check video URL format**
   - Local: `/POV 1.mp4` or `/Video.mp4`
   - External: `https://example.com/video.mp4`

2. **Verify video is accessible**
   - Open URL in new tab
   - Video should play or download

3. **Check video format**
   - Supported: MP4
   - Convert if needed

4. **Try different video URL**
   - Use a different video
   - Test with `/Video.mp4`

---

## ❌ ERROR: "Changes not saving"

Changes are made but not being saved.

### ✅ SOLUTION:

1. **Check all required fields**
   - Title must be filled
   - Description must be filled
   - Image URL must be filled

2. **Check for validation errors**
   - Look for red error messages
   - Fix any errors shown

3. **Try saving again**
   - Click "Save Slide" button
   - Wait for confirmation

4. **Check browser console**
   - Press F12
   - Look for error messages
   - Report errors if needed

---

## 🔍 HOW TO DEBUG

### Step 1: Open Browser Console
- Press `F12` (Windows) or `Cmd + Option + I` (Mac)
- Click "Console" tab

### Step 2: Look for Errors
- Red error messages
- Network errors
- API errors

### Step 3: Check Network Tab
- Click "Network" tab
- Try to save a slide
- Look for failed requests
- Click on failed request to see details

### Step 4: Check Application Tab
- Click "Application" tab
- Look for stored data
- Check localStorage for tokens

---

## 📞 GETTING HELP

### Information to Provide:

1. **Error message** (exact text)
2. **What you were doing** (step by step)
3. **Browser** (Chrome, Firefox, etc.)
4. **Operating system** (Windows, Mac, Linux)
5. **Browser console errors** (F12 → Console)
6. **Network errors** (F12 → Network)

### URLs:

- **Admin Panel:** https://trq-studio.pages.dev/#/admin
- **Frontend:** https://trq-studio.pages.dev
- **Local Backend:** http://localhost:4242/api/health

---

## ✅ QUICK CHECKLIST

Before reporting an error:

- [ ] Backend is running
- [ ] You are logged in
- [ ] All required fields are filled
- [ ] Video/image URLs are valid
- [ ] Browser cache is cleared
- [ ] You tried a different browser
- [ ] You checked browser console (F12)
- [ ] You checked network tab (F12)

---

## 🚀 COMMON SOLUTIONS

### Solution 1: Restart Backend
```bash
# Stop backend (Ctrl + C)
# Start backend again
cd server
npm start
```

### Solution 2: Clear Cache
- Press `Ctrl + Shift + Delete`
- Select "All time"
- Clear all data
- Refresh page

### Solution 3: Log Out and Log In
- Click profile icon
- Click "Logout"
- Go to login page
- Log in again

### Solution 4: Try Local Backend
```bash
# Terminal 1
cd server
npm start

# Terminal 2
npm run dev
```

### Solution 5: Check API Health
- Local: http://localhost:4242/api/health
- Production: https://trq-api-prod.muaddhalsway.workers.dev/api/health

---

**Still having issues? Check the browser console (F12) for detailed error messages!**

