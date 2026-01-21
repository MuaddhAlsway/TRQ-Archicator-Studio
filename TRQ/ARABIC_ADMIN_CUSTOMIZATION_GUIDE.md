# 🇸🇦 Arabic Admin Customization Guide

## Overview

Your TRQ Design admin panel now includes a complete Arabic customization system. You can customize all content in Arabic directly from the admin dashboard without touching any code.

---

## 🎯 What You Can Customize

### 1. **Hero Slides** 🎬
- Slide titles
- Slide descriptions
- Button text
- All hero section content

### 2. **Projects** 📁
- Project titles
- Project descriptions
- Detailed descriptions
- Challenge & Solution
- Client quotes
- Client names

### 3. **Services** ⚙️
- Service titles
- Service descriptions
- Service features

### 4. **Blog Articles** 📝
- Article titles
- Article excerpts
- Full article content

### 5. **Site Settings** ⚙️
- Navigation labels
- Button text
- Common UI elements
- Page titles
- All static text

---

## 🚀 How to Access

1. **Login to Admin Panel**
   - Go to: `http://localhost:3000/admin`
   - Enter your credentials

2. **Navigate to Arabic Customization**
   - Click on **"🇸🇦 Arabic Customize"** in the sidebar
   - Or look for the Arabic flag icon in the navigation menu

3. **Select Content Type**
   - Choose from: Hero Slides, Projects, Services, Blog Articles, or Site Settings

---

## 📝 How to Customize

### Step 1: Select Content Type
Click on one of the tabs at the top:
- 🎬 Hero Slides
- 📁 Projects
- ⚙️ Services
- 📝 Blog Articles
- ⚙️ Site Settings

### Step 2: Choose Item to Edit
- View list of all items in that category
- Click the **Edit** button (pencil icon) next to the item you want to customize

### Step 3: Edit Content
You'll see a bilingual editor with:
- **Left side**: English content (reference)
- **Right side**: Arabic content (editable)

### Step 4: Save Changes
- Click **"Save Changes"** button
- Your changes are instantly saved to the database
- Changes appear on the website immediately

---

## 💡 Tips for Arabic Customization

### 1. **RTL Support**
- All Arabic text automatically displays right-to-left
- No need to manually set direction
- Layouts automatically mirror for Arabic

### 2. **Copy from English**
- Use the copy button to quickly populate Arabic from English
- Then edit the Arabic text as needed
- Saves time for similar content

### 3. **Character Limits**
- Keep titles concise (under 100 characters)
- Descriptions can be longer (up to 1000 characters)
- Test on mobile to ensure text fits

### 4. **Arabic Grammar**
- Use proper Arabic grammar and spelling
- Include diacritics (تشكيل) where needed
- Use appropriate formal/informal tone

### 5. **Consistency**
- Use consistent terminology across pages
- Maintain brand voice in Arabic
- Review all translations before publishing

---

## 🔄 Workflow Example

### Customizing a Project

1. **Go to Arabic Customize** → **Projects**
2. **Find your project** in the list
3. **Click Edit** button
4. **Edit the following fields:**
   - Project Title (Arabic)
   - Project Description (Arabic)
   - Detailed Description (Arabic)
   - Challenge (Arabic)
   - Solution (Arabic)
   - Client Quote (Arabic)
   - Client Name (Arabic)
5. **Click Save Changes**
6. **Verify on website** - Switch language to Arabic and check the project page

---

## 📊 Database Structure

All Arabic content is stored in the `settings` table with keys like:
- `slide_1_title_ar` - Slide 1 title in Arabic
- `project_5_desc_ar` - Project 5 description in Arabic
- `service_2_title_ar` - Service 2 title in Arabic
- `article_3_excerpt_ar` - Article 3 excerpt in Arabic
- `homeIntroTitle_ar` - Home page intro title in Arabic

---

## 🔐 Permissions

- **Admin users** can customize all Arabic content
- **Changes are saved immediately** to the database
- **No approval process** - changes go live instantly
- **Audit trail** - all changes are timestamped

---

## 🐛 Troubleshooting

### Issue: Changes not appearing on website
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh the page
3. Check if you're viewing the Arabic version
4. Verify the setting key is correct

### Issue: Arabic text appears reversed
**Solution:**
- This is normal for RTL text
- Check that your browser language is set to Arabic
- Verify the text direction is set to RTL in CSS

### Issue: Can't save changes
**Solution:**
1. Check your internet connection
2. Verify you're logged in as admin
3. Check browser console for errors (F12)
4. Try refreshing the page and trying again

### Issue: Special characters not displaying
**Solution:**
- Ensure your text editor supports UTF-8
- Copy-paste from a reliable Arabic source
- Avoid mixing different Arabic dialects

---

## 📱 Mobile Testing

After customizing Arabic content:

1. **Test on Mobile**
   - Switch to Arabic language
   - Check layout on iPhone and Android
   - Verify text wrapping and alignment

2. **Test on Desktop**
   - Check all pages display correctly
   - Verify RTL layout is applied
   - Test all interactive elements

3. **Test in Different Browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

---

## 🎨 Best Practices

### 1. **Content Quality**
- ✅ Use professional Arabic
- ✅ Proofread before saving
- ✅ Maintain brand consistency
- ❌ Don't use machine translation
- ❌ Don't mix dialects

### 2. **SEO Optimization**
- Include relevant Arabic keywords
- Use descriptive titles
- Write compelling descriptions
- Add proper meta descriptions

### 3. **User Experience**
- Keep text concise
- Use clear language
- Break long text into paragraphs
- Use bullet points for lists

### 4. **Accessibility**
- Use semantic HTML
- Include alt text for images
- Ensure sufficient color contrast
- Test with screen readers

---

## 📚 Content Guidelines

### Hero Slides
- **Title**: 5-10 words max
- **Description**: 1-2 sentences
- **Buttons**: 2-3 words each

### Projects
- **Title**: 3-8 words
- **Description**: 2-3 sentences
- **Challenge**: 2-3 paragraphs
- **Solution**: 2-3 paragraphs

### Services
- **Title**: 3-5 words
- **Description**: 2-3 sentences
- **Features**: 3-5 bullet points

### Blog Articles
- **Title**: 5-10 words
- **Excerpt**: 1-2 sentences
- **Content**: 500-2000 words

---

## 🔄 Sync with Turso

All Arabic customizations are automatically:
- ✅ Saved to local SQLite database
- ✅ Synced to Turso database
- ✅ Available across all environments
- ✅ Backed up regularly

---

## 📞 Support

For issues or questions:

1. **Check this guide** - Most answers are here
2. **Check browser console** - Look for error messages (F12)
3. **Check database** - Verify settings are saved
4. **Contact support** - Reach out to the development team

---

## 🎉 Quick Start

1. Go to Admin → 🇸🇦 Arabic Customize
2. Select a content type (e.g., Hero Slides)
3. Click Edit on an item
4. Fill in the Arabic content
5. Click Save Changes
6. Done! Your Arabic content is live

---

## 📋 Checklist for Full Arabic Setup

- [ ] Customize all Hero Slides
- [ ] Customize all Projects
- [ ] Customize all Services
- [ ] Customize all Blog Articles
- [ ] Customize Site Settings
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Verify RTL layout
- [ ] Check all pages in Arabic
- [ ] Proofread all content
- [ ] Get stakeholder approval
- [ ] Launch Arabic version

---

**Version**: 1.0
**Last Updated**: January 18, 2026
**Status**: Ready for Use
