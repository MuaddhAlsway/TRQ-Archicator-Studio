# Blog Visibility Toggle Feature

## Overview
Added a button/toggle in Site Settings to hide the blog from the navbar and hide the entire blog page from the website. **Blog is hidden by default.**

## Changes Made

### 1. **AdminSettings.tsx** - Added Blog Visibility Toggle
- Added `blogHidden` setting to the settings state (default: `'true'` - **hidden by default**)
- Added a new "Blog Visibility" section at the top of the Blog tab in Site Settings
- Includes a checkbox labeled "Show Blog on Website" with a status badge (VISIBLE/HIDDEN)
- The toggle controls whether the blog is visible on the website
- **Dispatches `settingsUpdated` event** after saving to notify App.tsx to refresh

**Location:** `src/admin/AdminSettings.tsx` (line 3043+)

### 2. **App.tsx** - Conditional Blog Display
- Imported the API module to fetch settings
- Added `blogHidden` state to track blog visibility (default: `true` - **hidden by default**)
- Added `settingsRefresh` state to trigger re-fetching of settings
- Fetch settings on component mount and whenever `settingsRefresh` changes
- **Added event listener** for `settingsUpdated` event to refresh settings in real-time
- Updated navigation array to conditionally include blog link based on `blogHidden` state
- Added `pageToRender` logic to redirect to home if user tries to access blog when it's hidden
- Updated main content rendering to only show Blog component when blog is not hidden

**Location:** `src/App.tsx`

## How It Works

1. **Default State:**
   - Blog is **HIDDEN by default** on all pages
   - Blog link does NOT appear in navbar
   - Blog link does NOT appear in footer
   - Direct blog URL access redirects to home

2. **Admin Panel (To Show Blog):**
   - Go to Site Settings → Blog Page tab
   - Check the "Show Blog on Website" checkbox to enable blog
   - Click "Save Changes" to apply
   - Blog link will immediately appear in navbar and footer

3. **Frontend Behavior (Real-time):**
   - When settings are saved, `settingsUpdated` event is dispatched
   - App.tsx listens for this event and immediately re-fetches settings
   - Blog link is automatically removed/added from navbar when toggled
   - Blog link is removed/added from footer quick links when toggled
   - If user tries to access blog URL directly when hidden, they're redirected to home
   - Changes are visible immediately without page refresh

## Database
- Setting key: `blogHidden`
- Values: `'true'` (hidden) or `'false'` (visible)
- Default: `'true'` (hidden)
- Stored in the `settings` table

## Features
✅ Blog hidden by default
✅ Toggle blog visibility from admin panel
✅ Blog link automatically hidden from navbar
✅ Blog link automatically hidden from footer
✅ Direct URL access redirected to home when blog is hidden
✅ Visual status indicator (VISIBLE/HIDDEN badge)
✅ **Real-time updates** - changes take effect immediately after saving
✅ Responsive design
✅ No errors or warnings
