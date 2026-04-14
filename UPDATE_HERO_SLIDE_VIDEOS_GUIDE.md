# How to Update Hero Slide Videos in Admin Panel

## Access Admin Panel

1. Go to `http://localhost:5173/admin` (or your production URL)
2. Login with admin credentials
3. Click "🇬🇧 Hero Slides (EN)" in the sidebar

## Edit a Slide

1. Find the slide you want to edit
2. Click the **Edit** button (pencil icon)
3. The slide editor will open

## Update Videos

### Video Section
You'll see a section labeled "📹 Videos (2 Videos)" with two video input fields:

#### Video 1
- **Video URL**: Enter the URL to your first video (e.g., `/POV 1.mp4`)
- **Video Label**: Optional label for the video (e.g., "POV Perspective 1")
- **Remove Button**: Click ✕ to remove the video

#### Video 2
- **Video URL**: Enter the URL to your second video (e.g., `/Video.mp4`)
- **Video Label**: Optional label for the video (e.g., "Main Video")
- **Remove Button**: Click ✕ to remove the video

### Video URL Examples

**Local Videos** (in public folder):
- `/POV 1.mp4`
- `/Video.mp4`
- `/uploads/my-video.mp4`

**External URLs**:
- `https://example.com/video.mp4`
- `https://cdn.example.com/videos/promo.mp4`

## Current Configuration

### Slide 1
- Video 1: `/POV 1.mp4`
- Video 2: `/Video.mp4`

### Slide 2
- Video 1: `/Video.mp4`
- Video 2: `/POV 1.mp4`

### Slide 3, 4, 5
- No videos (images only)

## Save Changes

1. After updating videos, scroll to the bottom
2. Click **"Save Slide"** button
3. You'll see a success message
4. Changes appear immediately on the home page

## Video Playback

- Each video plays for **10 seconds**
- Videos play sequentially (Video 1 → Video 2)
- After all videos complete, moves to next slide
- Image-only slides display for **5 seconds**

## Troubleshooting

### Video Not Playing
1. Check the video URL is correct
2. Verify the video file exists in the public folder
3. Ensure video format is MP4
4. Check browser console for errors

### Changes Not Saving
1. Verify you're logged in
2. Check backend is running on port 4242
3. Look for error message in admin panel
4. Check browser console for API errors

### Video Duplicating
1. Make sure each slide has different video URLs
2. Don't use the same video URL for multiple slides
3. Check the database configuration

## Video Management Tips

1. **Keep videos short**: 10 seconds per video is ideal
2. **Use MP4 format**: Best compatibility across browsers
3. **Optimize file size**: Compress videos for faster loading
4. **Test on mobile**: Ensure videos work on mobile devices
5. **Use CDN**: For better performance, host videos on a CDN

## Advanced: Arabic Videos

To add Arabic-specific videos:

1. Go to Admin → 🇸🇦 Hero Slides (AR)
2. Edit the slide
3. In the "Arabic Videos" section, add:
   - `video_ar`: Arabic video URL
   - `video_2_ar`: Second Arabic video URL
4. Save changes
5. When user switches to Arabic, these videos will play instead

## API Endpoint

Videos are saved via the `/api/slides/:id` endpoint with these fields:
- `video`: First video URL
- `video_2`: Second video URL
- `video_3`: Third video URL (optional)
- `video_text`: Label for first video
- `video_2_text`: Label for second video
- `video_3_text`: Label for third video
- `video_ar`: Arabic first video
- `video_2_ar`: Arabic second video
- `video_3_ar`: Arabic third video

## Next Steps

1. Go to Admin Panel
2. Edit a hero slide
3. Update the video URLs
4. Click Save
5. Refresh home page to see changes
