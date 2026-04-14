# Hero Slides Video Configuration Fixed

## Problem
Videos were duplicating across slides:
- Slide 1 and Slide 2 were both showing the same videos
- No clear separation between slides

## Solution
Fixed the video configuration in the database:

### Current Configuration

**Slide 1**: 2 Videos
- Video 1: `/POV 1.mp4` (10 seconds)
- Video 2: `/Video.mp4` (10 seconds)
- Total: 20 seconds

**Slide 2**: 2 Videos
- Video 1: `/Video.mp4` (10 seconds)
- Video 2: `/POV 1.mp4` (10 seconds)
- Total: 20 seconds

**Slide 3**: Images Only
- No videos
- Display time: 5 seconds

**Slide 4**: Images Only
- No videos
- Display time: 5 seconds

**Slide 5**: Images Only
- No videos
- Display time: 5 seconds

## How Videos Play

### Slide 1 & 2 (Video Slides)
1. First video plays for 10 seconds
2. Second video plays for 10 seconds
3. Total slide duration: 20 seconds
4. Then moves to next slide

### Slide 3, 4, 5 (Image Slides)
1. Image displays for 5 seconds
2. Then moves to next slide

## Video Files Required

Make sure these files exist in the `public/` folder:
- `/POV 1.mp4` - POV video (10 seconds)
- `/Video.mp4` - Main video (10 seconds)

## Database Changes

Updated `hero_slides` table:
- Slide 1: `video = '/POV 1.mp4'`, `video_2 = '/Video.mp4'`
- Slide 2: `video = '/Video.mp4'`, `video_2 = '/POV 1.mp4'`
- Slide 3-5: `video = NULL`, `video_2 = NULL`, `video_3 = NULL`

## Frontend Behavior

The HeroSlider component:
1. Checks for videos in each slide
2. If videos exist, plays them sequentially
3. If no videos, displays image for 5 seconds
4. Automatically moves to next slide when duration complete

## Testing

1. Go to home page
2. Hero slider should show:
   - Slide 1: POV 1.mp4 → Video.mp4 (20 seconds total)
   - Slide 2: Video.mp4 → POV 1.mp4 (20 seconds total)
   - Slide 3: Image (5 seconds)
   - Slide 4: Image (5 seconds)
   - Slide 5: Image (5 seconds)
3. Each slide should have unique videos (no duplication)

## Scripts Used

- `server/fix-hero-slide-videos.mjs` - Fixed local database
- `sync-hero-videos-to-turso.mjs` - Syncs to Turso (requires auth)

## Next Steps

1. Verify videos display correctly on home page
2. Check that each slide shows different videos
3. Confirm no video duplication
4. Test on both English and Arabic
