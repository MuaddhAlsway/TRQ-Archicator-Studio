# 📦 MULTI-PART UPLOAD STRATEGY

## Problem

The complete public folder (2GB) is too large to upload to Cloudflare Pages in one go. We need to split it into manageable parts.

---

## Solution: Multi-Part Upload to Cloudflare R2

### Overview

1. **Part 1-10:** Project images (split by folder)
2. **Fonts:** All font files
3. **Videos:** Hero slider videos

---

## Upload Plan

### Part 1: Uploads Folder (913.51 MB)
```
Files: 359 images
Size: 913.51 MB
Command: wrangler r2 object put trq-images/part1/* --recursive
```

### Part 2: TRQ STUDIO Projects (299.36 MB)
```
Files: 153 images
Size: 299.36 MB
Command: wrangler r2 object put trq-images/part2/* --recursive
```

### Part 3: CottonSkin + PlayGround (220 MB)
```
Files: 19 images
Size: 220 MB
Command: wrangler r2 object put trq-images/part3/* --recursive
```

### Part 4: Modern Minimalist + 011 (134.49 MB)
```
Files: 14 images
Size: 134.49 MB
Command: wrangler r2 object put trq-images/part4/* --recursive
```

### Part 5: DIRIYAH + ALULAH + PAWS (155.08 MB)
```
Files: 27 images
Size: 155.08 MB
Command: wrangler r2 object put trq-images/part5/* --recursive
```

### Part 6: Remaining Projects (351.49 MB)
```
Files: 100+ images
Size: 351.49 MB
Command: wrangler r2 object put trq-images/part6/* --recursive
```

### Part 7: Fonts (1.5 MB)
```
Files: 36+ font files
Size: 1.5 MB
Command: wrangler r2 object put trq-images/fonts/* --recursive
```

### Part 8: Videos (30 MB)
```
Files: 3 videos
Size: 30 MB
Command: wrangler r2 object put trq-images/videos/* --recursive
```

---

## Step-by-Step Implementation

### Step 1: Create R2 Bucket

```bash
wrangler r2 bucket create trq-images
```

### Step 2: Upload Each Part

```bash
# Part 1: Uploads
wrangler r2 object put trq-images/uploads/* --recursive --local-dir=public/uploads

# Part 2: TRQ STUDIO Projects
wrangler r2 object put trq-images/projects/* --recursive --local-dir="public/TRQ STUDIO _ PROJECTS"

# Part 3: CottonSkin + PlayGround
wrangler r2 object put trq-images/part3/* --recursive --local-dir=public/CottonSkin
wrangler r2 object put trq-images/part3/* --recursive --local-dir=public/playGround

# Part 4: Modern Minimalist + 011
wrangler r2 object put trq-images/part4/* --recursive --local-dir="public/Modern minimalist -20260227T190544Z-1-001"
wrangler r2 object put trq-images/part4/* --recursive --local-dir=public/011

# Part 5: DIRIYAH + ALULAH + PAWS
wrangler r2 object put trq-images/part5/* --recursive --local-dir="public/DIRIYAH PARADE"
wrangler r2 object put trq-images/part5/* --recursive --local-dir=public/ALULAH
wrangler r2 object put trq-images/part5/* --recursive --local-dir="public/PAWS & PARTNERS"

# Part 6: Remaining Projects
wrangler r2 object put trq-images/part6/* --recursive --local-dir=public/daria
wrangler r2 object put trq-images/part6/* --recursive --local-dir="public/DIRIYAH MARKET"
# ... continue for other folders

# Part 7: Fonts
wrangler r2 object put trq-images/fonts/* --recursive --local-dir=public
# Copy only .otf files

# Part 8: Videos
wrangler r2 object put trq-images/videos/* --recursive --local-dir=public
# Copy only .mp4 files
```

### Step 3: Configure Cloudflare Pages

Add R2 bucket binding in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "IMAGES"
bucket_name = "trq-images"
```

### Step 4: Update Image URLs

Change image paths from:
```
/uploads/project/image.jpg
```

To:
```
https://r2-bucket-url.example.com/uploads/project/image.jpg
```

### Step 5: Update Database

```sql
UPDATE projects SET image = REPLACE(image, '/uploads/', 'https://r2-url/uploads/');
UPDATE projects SET gallery = REPLACE(gallery, '/uploads/', 'https://r2-url/uploads/');
```

---

## Alternative: Keep in Dist with Compression

If you want to keep everything in dist:

1. **Compress images** (reduce by 50-70%)
2. **Use WebP format** (smaller than PNG/JPG)
3. **Split into multiple deployments**

### Commands:

```bash
# Compress images
imagemin public/**/*.{jpg,png} --out-dir=public-compressed

# Convert to WebP
cwebp public/uploads/*.jpg -o public/uploads/%.webp

# Deploy compressed version
npm run build
wrangler pages deploy dist
```

---

## Recommended Approach

### Option A: Cloudflare R2 (Recommended)
- ✅ Unlimited storage
- ✅ Fast CDN delivery
- ✅ Easy multi-part upload
- ✅ Integrates with Cloudflare
- ⚠️ Additional cost (~$0.015/GB)

### Option B: Compress & Deploy
- ✅ No additional cost
- ✅ Faster load times
- ⚠️ Requires image optimization
- ⚠️ Still large build

### Option C: Serve from Express
- ✅ No additional cost
- ✅ Works with existing setup
- ⚠️ Requires server running
- ⚠️ Slower than CDN

---

## Current Status

### Build Size
- **Total:** 2,073.93 MB
- **Files:** 822
- **Status:** Too large for single upload

### Breakdown
- Uploads: 913.51 MB (359 files)
- Projects: 299.36 MB (153 files)
- Other folders: 861.06 MB (310 files)

---

## Next Steps

### Immediate
1. Choose upload strategy (R2 recommended)
2. Create R2 bucket
3. Upload files in parts

### Short Term
1. Update image URLs
2. Update database paths
3. Test image loading

### Long Term
1. Implement image optimization
2. Add image compression
3. Set up CDN caching

---

## File Structure for R2

```
trq-images/
├── uploads/
│   ├── project-1/
│   ├── project-2/
│   └── ...
├── projects/
│   ├── TRQ STUDIO _ PROJECTS/
│   ├── CottonSkin/
│   └── ...
├── fonts/
│   ├── SFMada-Bold.otf
│   ├── SFMada-Regular.otf
│   └── ...
└── videos/
    ├── Video1.mp4
    ├── Video2.mp4
    └── Video3.mp4
```

---

## Estimated Upload Time

| Part | Size | Time |
|------|------|------|
| Part 1 | 913.51 MB | 15-20 min |
| Part 2 | 299.36 MB | 5-10 min |
| Part 3 | 220 MB | 4-8 min |
| Part 4 | 134.49 MB | 3-5 min |
| Part 5 | 155.08 MB | 3-5 min |
| Part 6 | 351.49 MB | 6-10 min |
| Part 7 | 1.5 MB | <1 min |
| Part 8 | 30 MB | 1-2 min |
| **Total** | **2,073.93 MB** | **40-60 min** |

---

## Cost Estimate (R2)

- **Storage:** 2GB × $0.015/GB = $0.03/month
- **Requests:** ~1M requests × $0.0000002 = $0.20/month
- **Total:** ~$0.25/month

---

## Summary

**Recommended:** Use Cloudflare R2 for multi-part upload
- Split into 8 parts
- Upload each part separately
- Update image URLs
- Update database paths
- Test and verify

**Timeline:** 1-2 hours setup + 1 hour upload

---

## Support

For questions:
1. Check R2 bucket configuration
2. Verify upload permissions
3. Check image URL paths
4. Verify database updates

---

**Ready to implement multi-part upload!**
