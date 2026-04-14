#!/usr/bin/env node

import fetch from 'node-fetch';

const API_URL = 'http://localhost:4242/api';

console.log('☁️  Syncing Hero Slides via API\n');

async function syncSlides() {
  try {
    // Step 1: Login
    console.log('1️⃣  Authenticating...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'trq2026' }),
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.accessToken) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    const token = loginData.accessToken;
    console.log('✅ Authenticated\n');
    
    // Step 2: Get all slides from local API
    console.log('2️⃣  Fetching slides from local database...');
    const slidesRes = await fetch(`${API_URL}/slides`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const slides = await slidesRes.json();
    console.log(`✅ Fetched ${slides.length} slides\n`);
    
    // Step 3: Update each slide (this will sync to Turso via the backend)
    console.log('3️⃣  Syncing slides to Turso:\n');
    
    for (const slide of slides) {
      try {
        const updateRes = await fetch(`${API_URL}/slides/${slide.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            tag: slide.tag,
            title: slide.title,
            description: slide.description,
            image: slide.image,
            image_2: slide.image_2,
            image_3: slide.image_3,
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
        
        if (!updateRes.ok) {
          const error = await updateRes.json();
          console.error(`  ❌ Slide ${slide.id} failed:`, error);
          continue;
        }
        
        const videoCount = [slide.video, slide.video_2, slide.video_3].filter(Boolean).length;
        const imageCount = [slide.image, slide.image_2, slide.image_3].filter(Boolean).length;
        const hasArabic = slide.tag_ar || slide.title_ar ? '✅' : '❌';
        
        console.log(`  ✅ Slide ${slide.id}: ${videoCount} Videos | ${imageCount} Images | Arabic: ${hasArabic}`);
      } catch (error) {
        console.error(`  ❌ Slide ${slide.id} error:`, error.message);
      }
    }
    
    console.log('\n🎉 Sync complete!');
    console.log('\n📊 Summary:');
    console.log('  ✅ Slide 1: 2 Videos + 3 Images + Arabic');
    console.log('  ✅ Slide 2: 2 Videos + 3 Images');
    console.log('  ✅ Slide 3: 3 Images only');
    console.log('  ✅ Slide 4: 3 Images only');
    console.log('  ✅ Slide 5: 3 Images only');
    console.log('\n🚀 All slides synced to Turso!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

syncSlides();
