# Hero Slides Deployment Order for Cloudflare Pages

## Current Hero Slides Order (ID 1-5)

This is the exact order that should be maintained when deploying to Cloudflare Pages:

### Slide 1
- **ID:** 1
- **Tag:** TRQ Design Studio
- **Title:** Elevating Spaces, Defining Luxury
- **Description:** Premium interior design solutions for discerning clients who demand excellence.
- **Image:** `/uploads/file-1768858211350-451992102.webp`
- **Sort Order:** 1
- **Active:** Yes

### Slide 2
- **ID:** 2
- **Tag:** Residential Design
- **Title:** Luxury Living Spaces
- **Description:** Creating timeless residential interiors that reflect your unique lifestyle and taste.
- **Image:** `/uploads/file-1768858241207-736804924.webp`
- **Sort Order:** 2
- **Active:** Yes

### Slide 3
- **ID:** 3
- **Tag:** Commercial Design
- **Title:** Inspiring Workspaces
- **Description:** Transforming commercial environments into productive and aesthetically stunning spaces.
- **Image:** `/uploads/file-1768858284780-218301174.webp`
- **Sort Order:** 3
- **Active:** Yes

### Slide 4
- **ID:** 4
- **Tag:** Interior Excellence
- **Title:** Refined Interiors
- **Description:** We aspire to create an interior experience that is both memorable and timeless.
- **Image:** `/uploads/file-1768858302967-578784719.webp`
- **Sort Order:** 4
- **Active:** Yes

### Slide 5
- **ID:** 5
- **Tag:** Our Portfolio
- **Title:** Featured Projects
- **Description:** Explore our collection of award-winning design projects across Saudi Arabia.
- **Image:** `/uploads/file-1768858327670-210437964.webp`
- **Sort Order:** 5
- **Active:** Yes

## Deployment Instructions

### For Cloudflare Pages (Frontend)
1. Push code to GitHub
2. Cloudflare Pages automatically deploys from the repository
3. Environment variables are set in Cloudflare Pages dashboard:
   - `VITE_API_URL`: `https://trq-api-prod.muaddhalsway.workers.dev/api`

### For Cloudflare Workers (Backend)
1. Deploy worker with: `wrangler deploy`
2. Worker serves API at: `https://trq-api-prod.muaddhalsway.workers.dev`
3. Database (Turso) maintains hero slides in this exact order

## Verification After Deployment

After deploying, verify the hero slides order by:

1. **Check API Response:**
   ```bash
   curl https://trq-api-prod.muaddhalsway.workers.dev/api/slides/active
   ```

2. **Expected Response Order:**
   - Slide 1: "Elevating Spaces, Defining Luxury"
   - Slide 2: "Luxury Living Spaces"
   - Slide 3: "Inspiring Workspaces"
   - Slide 4: "Refined Interiors"
   - Slide 5: "Featured Projects"

3. **Check Frontend:**
   - Visit: `https://production.trq-studio.pages.dev`
   - Verify slides rotate in the correct order

## Database Query to Verify Order

```sql
SELECT id, sortOrder, tag, title FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC;
```

Expected output:
```
id | sortOrder | tag | title
1  | 1         | TRQ Design Studio | Elevating Spaces, Defining Luxury
2  | 2         | Residential Design | Luxury Living Spaces
3  | 3         | Commercial Design | Inspiring Workspaces
4  | 4         | Interior Excellence | Refined Interiors
5  | 5         | Our Portfolio | Featured Projects
```

## Important Notes

- The `sortOrder` field controls the display order
- All slides have `isActive = 1` to be displayed
- Images are served from `/uploads/` directory
- The HeroSlider component rotates through slides every 5 seconds
- RTL (Arabic) support is built-in
