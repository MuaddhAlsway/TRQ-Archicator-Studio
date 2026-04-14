import fetch from 'node-fetch';

async function checkApiSlides() {
  try {
    console.log('Checking /api/slides/active endpoint...\n');
    
    const response = await fetch('https://trq-studio.pages.dev/api/slides/active');
    const slides = await response.json();
    
    console.log(`Found ${slides.length} active slides:\n`);
    slides.forEach((slide, idx) => {
      console.log(`Slide ${idx + 1}:`);
      console.log(`  ID: ${slide.id}`);
      console.log(`  Title: ${slide.title}`);
      console.log(`  Image: ${slide.image}`);
      console.log(`  Video: ${slide.video || 'NULL'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkApiSlides();
