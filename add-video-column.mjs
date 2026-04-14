import fetch from 'node-fetch';

const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';

async function executeQuery(sql, params = []) {
  try {
    const response = await fetch(TURSO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: sql,
              args: params.map(p => ({ type: 'text', value: String(p) })),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Turso error:', response.status, errorText);
      throw new Error(`Turso error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

async function addVideoColumn() {
  console.log('Adding video column to hero_slides table...\n');

  try {
    // Try to add video column
    await executeQuery('ALTER TABLE hero_slides ADD COLUMN video TEXT');
    console.log('✓ Added video column to hero_slides');
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log('✓ Video column already exists');
    } else {
      console.error('Error adding column:', error.message);
    }
  }

  // Now seed the slides again
  console.log('\nSeeding slides with video data...');
  
  const videoUrl = '/Video.mp4'; // Local video file
  
  const slides = [
    // Image slides
    {
      tag: 'TRQ Design Studio',
      title: 'Elevating Spaces, Defining Luxury',
      description: 'Premium interior design solutions for discerning clients who demand excellence.',
      image: '/uploads/14.webp',
      video: null,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'GET IN TOUCH',
      buttonSecondaryLink: 'contact',
      isActive: 1,
    },
    {
      tag: 'Residential Design',
      title: 'Transform Your Home',
      description: 'Luxury residential spaces crafted with meticulous attention to detail.',
      image: '/uploads/1.webp',
      video: null,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'REQUEST PRICING',
      buttonSecondaryLink: 'pricing',
      isActive: 1,
    },
    {
      tag: 'Commercial Spaces',
      title: 'Inspire Your Workspace',
      description: 'Professional environments that embody brand identity and creativity.',
      image: '/uploads/2.webp',
      video: null,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'CONTACT US',
      buttonSecondaryLink: 'contact',
      isActive: 1,
    },
    // Video slides (3 videos - same video duplicated for now, different images)
    {
      tag: 'Video Showcase 1',
      title: 'Experience Our Work',
      description: 'Watch our latest projects and design transformations in action.',
      image: '/uploads/5.webp',
      video: videoUrl,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'CONTACT US',
      buttonSecondaryLink: 'contact',
      isActive: 1,
    },
    {
      tag: 'Video Showcase 2',
      title: 'Design in Motion',
      description: 'See how we bring luxury interiors to life with precision and creativity.',
      image: '/uploads/11 cave.webp',
      video: videoUrl,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'REQUEST PRICING',
      buttonSecondaryLink: 'pricing',
      isActive: 1,
    },
    {
      tag: 'Video Showcase 3',
      title: 'Transformations Unveiled',
      description: 'Discover the artistry behind every project we create.',
      image: '/uploads/1 copy.webp',
      video: videoUrl,
      buttonPrimaryText: 'VIEW PORTFOLIO',
      buttonPrimaryLink: 'portfolio',
      buttonSecondaryText: 'CONTACT US',
      buttonSecondaryLink: 'contact',
      isActive: 1,
    },
  ];

  // Clear existing
  try {
    await executeQuery('DELETE FROM hero_slides');
    console.log('✓ Cleared existing slides');
  } catch (error) {
    console.log('Note: Could not clear slides');
  }

  // Insert new slides
  for (const slide of slides) {
    try {
      await executeQuery(
        `INSERT INTO hero_slides (tag, title, description, image, video, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slide.tag,
          slide.title,
          slide.description,
          slide.image,
          slide.video,
          slide.buttonPrimaryText,
          slide.buttonPrimaryLink,
          slide.buttonSecondaryText,
          slide.buttonSecondaryLink,
          slide.isActive,
        ]
      );
      console.log(`✓ Added: ${slide.title}`);
    } catch (error) {
      console.error(`✗ Failed: ${slide.title}`, error.message);
    }
  }

  console.log('\n✓ Done! 6 slides seeded (3 images + 3 videos)');
}

addVideoColumn().catch(console.error);
