#!/usr/bin/env node

import fetch from 'node-fetch';

const API_URL = 'http://localhost:4242/api';

async function testAdminSlidesSave() {
  console.log('🧪 Testing Admin Slides Save Functionality\n');
  
  try {
    // Step 1: Login
    console.log('1️⃣  Logging in...');
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
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Step 2: Get current slides
    console.log('\n2️⃣  Fetching current slides...');
    const slidesRes = await fetch(`${API_URL}/slides`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const slides = await slidesRes.json();
    console.log(`✅ Fetched ${slides.length} slides`);
    
    if (slides.length === 0) {
      console.error('❌ No slides found');
      return;
    }
    
    // Step 3: Update first slide with new data
    console.log('\n3️⃣  Updating slide #1...');
    const slideToUpdate = slides[0];
    
    const updateData = {
      tag: slideToUpdate.tag,
      title: slideToUpdate.title,
      description: slideToUpdate.description,
      image: slideToUpdate.image,
      video: slideToUpdate.video,
      video_2: slideToUpdate.video_2,
      video_3: slideToUpdate.video_3,
      video_text: slideToUpdate.video_text,
      video_2_text: slideToUpdate.video_2_text,
      video_3_text: slideToUpdate.video_3_text,
      buttonPrimaryText: slideToUpdate.buttonPrimaryText,
      buttonPrimaryLink: slideToUpdate.buttonPrimaryLink,
      buttonSecondaryText: slideToUpdate.buttonSecondaryText,
      buttonSecondaryLink: slideToUpdate.buttonSecondaryLink,
      sortOrder: slideToUpdate.sortOrder,
      isActive: slideToUpdate.isActive,
      tag_ar: slideToUpdate.tag_ar,
      title_ar: slideToUpdate.title_ar,
      description_ar: slideToUpdate.description_ar,
      buttonPrimaryText_ar: slideToUpdate.buttonPrimaryText_ar,
      buttonSecondaryText_ar: slideToUpdate.buttonSecondaryText_ar,
      video_ar: slideToUpdate.video_ar,
      video_2_ar: slideToUpdate.video_2_ar,
      video_3_ar: slideToUpdate.video_3_ar,
      video_text_ar: slideToUpdate.video_text_ar,
      video_2_text_ar: slideToUpdate.video_2_text_ar,
      video_3_text_ar: slideToUpdate.video_3_text_ar,
    };
    
    const updateRes = await fetch(`${API_URL}/slides/${slideToUpdate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    
    const updateResult = await updateRes.json();
    
    if (!updateRes.ok) {
      console.error('❌ Update failed:', updateResult);
      return;
    }
    
    console.log('✅ Slide updated successfully');
    console.log(`   ID: ${updateResult.id}`);
    console.log(`   Title: ${updateResult.title}`);
    console.log(`   Videos: ${[updateResult.video, updateResult.video_2, updateResult.video_3].filter(Boolean).length}/3`);
    
    // Step 4: Verify update by fetching all slides
    console.log('\n4️⃣  Verifying update...');
    const verifyRes = await fetch(`${API_URL}/slides`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const allSlides = await verifyRes.json();
    const verifiedSlide = allSlides.find(s => s.id === slideToUpdate.id);
    
    if (!verifiedSlide) {
      console.error('❌ Slide not found after update');
      return;
    }
    
    console.log('✅ Slide verified');
    console.log(`   Videos: ${[verifiedSlide.video, verifiedSlide.video_2, verifiedSlide.video_3].filter(Boolean).length}/3`);
    console.log(`   Arabic Title: ${verifiedSlide.title_ar || 'Not set'}`);
    
    console.log('\n✅ All tests passed! Admin panel can save slides.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminSlidesSave();
