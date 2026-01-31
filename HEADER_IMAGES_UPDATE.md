# Header Images Update

## Overview
Updated header images for Contact, Portfolio, and Services pages with custom project images. All images are now set as defaults and can be customized from the admin panel.

## Changes Made

### 1. **Services Page Header**
- **Default Image:** `/uploads/5.webp`
- **Setting Key:** `servicesHeroImage`
- **Location:** Site Settings → Services Page → Hero Section

### 2. **Portfolio Page Header**
- **Default Image:** `/TRQ STUDIO _ PROJECTS/A Fusion of Art and Elegance  Living room/14.webp`
- **Setting Key:** `portfolioHeroImage`
- **Location:** Site Settings → Portfolio Page → Hero Section

### 3. **Contact Page Header**
- **Default Image:** `/TRQ STUDIO _ PROJECTS/REC. HEAVEN/13.jpg`
- **Setting Key:** `contactHeroImage`
- **Location:** Site Settings → Contact Page → Hero Section

## Files Updated

### Frontend Components
- `src/components/Services.tsx` - Updated to use `servicesHeroImage` setting
- `src/components/Portfolio.tsx` - Updated to use `portfolioHeroImage` setting
- `src/components/Contact.tsx` - Updated to use `contactHeroImage` setting

### Admin Settings
- `src/admin/AdminSettings.tsx` - Added header image settings with defaults

## How to Customize

1. Go to **Site Settings** in the admin panel
2. Navigate to the specific page tab (Services, Portfolio, or Contact)
3. Find the **Hero Section** area
4. Update the header image path
5. Click **Save Changes**

## Database
- Settings are stored in the `settings` table with keys:
  - `servicesHeroImage`
  - `portfolioHeroImage`
  - `contactHeroImage`

## Features
✅ Default images set for all three pages
✅ Images can be customized from admin panel
✅ Fallback to default if setting is not found
✅ All images are from project folders (no external URLs)
✅ Responsive design maintained
✅ No errors or warnings
