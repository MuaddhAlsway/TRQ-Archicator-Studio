import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'trq.db');

const localDb = new Database(dbPath);

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'trq2026';
const API_URL = 'https://trq-api-prod.muaddhalsway.workers.dev/api';

async function loginAndUpdateSlides() {
  try {
    console.log('🔐 Logging in to admin...\n');

    // Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD
      })
    });

    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.accessToken) {
      throw new Error('Login failed: ' + (loginData.error || 'Unknown error'));
    }

    const token = loginData.accessToken;
    console.log('✅ Logged in successfully\n');

    // Get all slides from local database
    const slides = localDb.prepare(`
      SELECT * FROM hero_slides ORDER BY id
    `).all();

    console.log(`📝 Updating ${slides.length} slides via API...\n`);

    // Update each slide
    for (const slide of slides) {
      console.log(`Updating Slide ${slide.id}: "${slide.title}"`);

      const updateRes = await fetch(`${API_URL}/slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
          video_ar: slide.video_ar,
          video_2_ar: slide.video_2_ar,
          video_3_ar: slide.video_3_ar,
          video_text_ar: slide.video_text_ar,
          video_2_text_ar: slide.video_2_text_ar,
          video_3_text_ar: slide.video_3_text_ar,
          buttonPrimaryText_ar: slide.buttonPrimaryText_ar,
          buttonSecondaryText_ar: slide.buttonSecondaryText_ar
        })
      });

      const updateData = await updateRes.json();
      if (updateRes.ok) {
        console.log(`   ✅ Updated`);
        console.log(`      Videos: ${slide.video ? '✅' : '❌'}`);
        console.log(`      Arabic: ${slide.title_ar ? '✅' : '❌'}\n`);
      } else {
        console.log(`   ❌ Error: ${updateRes.status} - ${updateData.message || JSON.stringify(updateData)}\n`);
      }
    }

    console.log('✅ All slides updated via API!\n');
    console.log('🎉 Hero slides are now available in the admin panel!');
    console.log('   Admin Panel: https://trq-studio.pages.dev/#/admin');
    console.log('   Click "Hero Slides (EN)" or "Hero Slides (AR)" to verify\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    localDb.close();
  }
}

loginAndUpdateSlides();
