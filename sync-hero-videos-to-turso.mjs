import fetch from 'node-fetch';

const API_URL = 'http://localhost:4242/api';

async function syncVideos() {
  try {
    console.log('Syncing Hero Slide Videos to Turso...\n');

    // Get all slides from local database via API
    const slidesResponse = await fetch(`${API_URL}/slides`);
    const slides = await slidesResponse.json();

    console.log(`Found ${slides.length} slides to sync\n`);

    // Update each slide on Turso
    for (const slide of slides) {
      try {
        const response = await fetch(`${API_URL}/slides/${slide.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'test-token'}`,
          },
          body: JSON.stringify({
            tag: slide.tag,
            title: slide.title,
            description: slide.description,
            image: slide.image,
            video: slide.video,
            video_2: slide.video_2,
            video_3: slide.video_3,
            video_text: slide.video_text,
            video_2_text: slide.video_2_text,
            video_3_text: slide.video_3_text,
            buttonPrimaryText: slide.buttonPrimaryText,
            buttonPrimaryLink: slide.buttonPrimaryLink,
            buttonSecondaryText: slide.buttonSecondaryText,
            buttonSecondaryLink: slide.buttonSecondaryLink,
            sortOrder: slide.sortOrder,
            isActive: slide.isActive,
            tag_ar: slide.tag_ar,
            title_ar: slide.title_ar,
            description_ar: slide.description_ar,
            buttonPrimaryText_ar: slide.buttonPrimaryText_ar,
            buttonSecondaryText_ar: slide.buttonSecondaryText_ar,
            video_ar: slide.video_ar,
            video_2_ar: slide.video_2_ar,
            video_3_ar: slide.video_3_ar,
            video_text_ar: slide.video_text_ar,
            video_2_text_ar: slide.video_2_text_ar,
            video_3_text_ar: slide.video_3_text_ar,
          }),
        });

        if (response.ok) {
          const videos = [slide.video, slide.video_2, slide.video_3].filter(v => v && v !== 'null');
          const videoList = videos.length > 0 ? videos.join(' + ') : 'Images only';
          console.log(`✓ Slide ${slide.id} (${slide.title}): ${videoList}`);
        } else {
          console.log(`✗ Slide ${slide.id}: Failed to sync`);
        }
      } catch (error) {
        console.error(`✗ Slide ${slide.id}: ${error.message}`);
      }
    }

    console.log('\n✅ Sync Complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncVideos();
