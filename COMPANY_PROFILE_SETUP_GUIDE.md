# Company Profile Setup Guide

## 🎯 Overview

The Company Profile page now supports both English and Arabic URLs. Users can switch between languages and see the appropriate company profile flipbook.

---

## 📋 How to Configure

### Step 1: Access Admin Panel
1. Go to: `http://localhost:5173/admin`
2. Login with credentials:
   - Username: `admin`
   - Password: `trq2026`

### Step 2: Navigate to Site Settings
1. Click **"Site Settings"** (for English) or **"Site Settings (Ar)"** (for Arabic)
2. Find the **"Company Profile"** tab

### Step 3: Add English URL
1. In the **"ENGLISH FLIPBOOK URL"** field
2. Paste your English company profile URL
3. Example: `https://publuu.com/flip-book/829640/2262213`

### Step 4: Add Arabic URL (Optional)
1. In the **"ARABIC FLIPBOOK URL"** field
2. Paste your Arabic company profile URL
3. If left empty, English URL will be used as fallback

### Step 5: Save
1. Click **"Save"** button
2. Wait for success message

---

## 🌐 URL Configuration

### English URL
- **Field**: ENGLISH FLIPBOOK URL
- **Required**: Yes
- **Format**: Full URL to flipbook (e.g., `https://publuu.com/flip-book/...`)
- **Fallback**: Used if Arabic URL is not set

### Arabic URL
- **Field**: ARABIC FLIPBOOK URL
- **Required**: No (optional)
- **Format**: Full URL to flipbook (e.g., `https://publuu.com/flip-book/...`)
- **Fallback**: If not set, English URL is used

---

## 🔄 Language Switching

### How It Works
1. User visits `http://localhost:5173/#company-profile`
2. Component fetches company profile settings from admin panel
3. Based on current language:
   - **English (en)**: Shows English flipbook URL
   - **Arabic (ar)**: Shows Arabic flipbook URL (or English as fallback)

### User Experience
- **English Mode**: Displays English company profile
- **Arabic Mode**: Displays Arabic company profile (if configured)
- **No URL**: Shows helpful message with instructions

---

## 📱 Mobile vs Desktop

### Mobile View
- Shows title and description
- "Open Company Profile" button
- Clicking button opens flipbook in modal popup
- Full-screen video player

### Desktop View
- Shows flipbook directly in full-screen iframe
- No modal needed
- Seamless viewing experience

---

## ✅ Error Handling

### If URL is Not Set
**English**: "No company profile URL configured for this language. Please check admin settings."

**Arabic**: "لم يتم تعيين رابط ملف الشركة للغة العربية. يرجى التحقق من إعدادات الإدارة."

### Solution
1. Go to Admin Panel
2. Site Settings → Company Profile
3. Add English URL (required)
4. Add Arabic URL (optional)
5. Click Save

---

## 🎬 Supported Flipbook Services

### Publuu
- ✅ Supported
- Example: `https://publuu.com/flip-book/829640/2262213`
- Recommended for professional flipbooks

### Other Services
- Any service that provides embeddable flipbook URLs
- Must support iframe embedding
- CORS headers must allow embedding

---

## 🔐 Security Notes

- URLs are stored in database
- Only admin can modify URLs
- URLs are public (displayed to all users)
- No sensitive data should be in URLs

---

## 📊 Current Configuration

### Status
- ✅ English URL: Ready to configure
- ✅ Arabic URL: Ready to configure
- ✅ Fallback: English URL used if Arabic not set
- ✅ Error messages: Bilingual support

### Next Steps
1. Get English company profile flipbook URL
2. Get Arabic company profile flipbook URL (optional)
3. Add URLs in Admin Panel
4. Test on both English and Arabic modes

---

## 🧪 Testing

### Test English
1. Go to `http://localhost:5173/#company-profile`
2. Verify English flipbook displays
3. Check mobile and desktop views

### Test Arabic
1. Switch language to Arabic
2. Go to `http://localhost:5173/#company-profile`
3. Verify Arabic flipbook displays (or English fallback)
4. Check mobile and desktop views

### Test Fallback
1. Set only English URL (no Arabic URL)
2. Switch to Arabic
3. Verify English flipbook displays as fallback

---

## 💡 Tips

1. **Use Publuu**: Professional flipbook service with good embedding support
2. **Test URLs**: Verify URLs work before adding to admin panel
3. **Mobile Testing**: Always test on mobile devices
4. **Bilingual Content**: Provide both English and Arabic flipbooks for best UX
5. **Update Regularly**: Keep flipbooks updated with latest company information

---

## 🆘 Troubleshooting

### Issue: "Company Profile Not Available" message
**Cause**: No URL configured in admin panel

**Solution**:
1. Go to Admin Panel → Site Settings → Company Profile
2. Add English URL
3. Click Save
4. Refresh page

### Issue: Flipbook not loading
**Cause**: Invalid URL or CORS issue

**Solution**:
1. Verify URL is correct
2. Test URL in browser directly
3. Check if service allows iframe embedding
4. Try different flipbook service

### Issue: Arabic URL not showing
**Cause**: Arabic URL not configured

**Solution**:
1. Go to Admin Panel → Site Settings (Ar) → Company Profile
2. Add Arabic URL
3. Click Save
4. Switch to Arabic and refresh

### Issue: Mobile modal not opening
**Cause**: JavaScript error or button disabled

**Solution**:
1. Check browser console for errors
2. Verify URL is set
3. Try desktop view
4. Clear browser cache

---

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify URLs are correct
3. Test in different browser
4. Check admin panel settings

---

**Last Updated**: February 28, 2026
**Status**: ✅ Ready for Configuration
