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

function normalizeImagePath(path) {
  if (!path) return null;
  
  // Remove full URLs
  if (path.includes('https://') || path.includes('http://')) {
    // Extract just the path part
    try {
      const url = new URL(path);
      path = url.pathname;
    } catch {
      return null;
    }
  }
  
  // If it starts with /uploads/, keep it
  if (path.startsWith('/uploads/')) {
    return path;
  }
  
  // If it's just a filename or path without /uploads/, add it
  if (!path.startsWith('/')) {
    return `/uploads/${path}`;
  }
  
  // If it starts with / but not /uploads/, add uploads
  return `/uploads${path}`;
}

async function fixPaths() {
  console.log('🔄 Fixing about_videos image paths...\n');
  
  const videos = await executeQuery('SELECT id, image FROM about_videos');
  console.log(`Found ${videos.length} about videos\n`);
  
  for (const video of videos) {
    const oldPath = video.image;
    const newPath = normalizeImagePath(oldPath);
    
    if (oldPath !== newPath) {
      console.log(`Video ${video.id}:`);
      console.log(`  Old: ${oldPath}`);
      console.log(`  New: ${newPath}`);
      
      await executeQuery(
        'UPDATE about_videos SET image = ? WHERE id = ?',
        [newPath, video.id]
      );
      console.log(`  ✓ Updated\n`);
    } else {
      console.log(`Video ${video.id}: ✓ Already correct\n`);
    }
  }
  
  console.log('✅ All paths fixed!');
}

fixPaths().catch(console.error);
