import fetch from 'node-fetch';

const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';

async function executeQuery(sql, params = []) {
  const response = await fetch(TURSO_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        type: 'execute',
        stmt: {
          sql: sql,
          args: params.map(p => ({ type: 'text', value: String(p) })),
        },
      }],
    }),
  });

  const data = await response.json();
  if (data.results?.[0]?.response?.result?.rows) {
    const cols = data.results[0].response.result.cols || [];
    const rows = data.results[0].response.result.rows || [];
    return rows.map(row => {
      const obj = {};
      cols.forEach((col, idx) => {
        obj[col.name] = row[idx]?.value || null;
      });
      return obj;
    });
  }
  return [];
}

async function scan() {
  console.log('🔍 SCANNING ALL IMAGE PATHS\n');
  
  // Check projects
  console.log('📦 PROJECTS:');
  const projects = await executeQuery('SELECT id, title, image FROM projects ORDER BY id ASC');
  
  let validCount = 0;
  let invalidCount = 0;
  
  projects.forEach(p => {
    if (!p.image) {
      console.log(`  ❌ ID ${p.id}: NO IMAGE PATH`);
      invalidCount++;
    } else if (!p.image.startsWith('https://')) {
      console.log(`  ⚠️  ID ${p.id}: NOT ABSOLUTE URL - ${p.image}`);
      invalidCount++;
    } else {
      validCount++;
    }
  });
  
  console.log(`\n  Summary: ${validCount} valid, ${invalidCount} invalid\n`);
  
  // Check hero slides
  console.log('🎬 HERO SLIDES:');
  const slides = await executeQuery('SELECT id, image, video FROM hero_slides ORDER BY id ASC');
  
  let slideValidCount = 0;
  let slideInvalidCount = 0;
  
  slides.forEach(s => {
    const imageValid = s.image && s.image.startsWith('https://');
    const videoValid = s.video && s.video.startsWith('https://');
    
    if (!imageValid) {
      console.log(`  ❌ Slide ${s.id}: IMAGE - ${s.image || 'MISSING'}`);
      slideInvalidCount++;
    } else {
      slideValidCount++;
    }
    
    if (s.video && !videoValid) {
      console.log(`  ⚠️  Slide ${s.id}: VIDEO - ${s.video}`);
      slideInvalidCount++;
    }
  });
  
  console.log(`\n  Summary: ${slideValidCount} valid images, ${slideInvalidCount} issues\n`);
  
  // Check services
  console.log('🛠️  SERVICES:');
  const services = await executeQuery('SELECT id, image FROM services WHERE image IS NOT NULL LIMIT 5');
  
  services.forEach(s => {
    if (s.image && !s.image.startsWith('https://')) {
      console.log(`  ⚠️  Service ${s.id}: ${s.image}`);
    }
  });
  
  console.log('\n✅ SCAN COMPLETE\n');
}

scan().catch(console.error);
