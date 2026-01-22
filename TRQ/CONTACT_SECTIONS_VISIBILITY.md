# Contact Page Sections Visibility Toggle

## Overview
Added toggles to hide "Find Us" (map section) and "Visit Our Studio" sections on the Contact page, similar to the blog visibility feature.

## Changes Made

### 1. **Contact Component** (`src/components/Contact.tsx`)
- Added `contactMapShow` setting (default: `'true'`)
- Made "Find Us" section conditional - only renders when `contactMapShow === 'true'`
- "Visit Our Studio" section already had `contactStudioShow` setting

### 2. **Admin Settings** (`src/admin/AdminSettings.tsx`)
- Added `contactMapShow` setting to settings state (default: `'true'`)
- Added toggle switch for "Map Section" visibility in Contact Page settings
- Toggle switch for "Visit Our Studio" already existed

## How to Use

### Hide "Find Us" (Map Section)
1. Go to **Site Settings** → **Contact Page** tab
2. Find the **Map Section** area
3. Toggle the **Show** switch to OFF
4. Click **Save Changes**
5. Map section will be hidden from the Contact page

### Hide "Visit Our Studio"
1. Go to **Site Settings** → **Contact Page** tab
2. Find the **Visit Our Studio Section** area
3. Toggle the **Show** switch to OFF
4. Click **Save Changes**
5. Studio visit section will be hidden from the Contact page

## Default State
- **Find Us (Map):** Visible by default (`contactMapShow: 'true'`)
- **Visit Our Studio:** Visible by default (`contactStudioShow: 'true'`)

## Database
- Settings stored in `settings` table:
  - `contactMapShow` - Controls map section visibility
  - `contactStudioShow` - Controls studio visit section visibility
- Values: `'true'` (visible) or `'false'` (hidden)

## Features
✅ Toggle visibility from admin panel
✅ Real-time updates (with event listener)
✅ Both sections can be hidden independently
✅ Default to visible
✅ Consistent with blog visibility feature
✅ No errors or warnings
