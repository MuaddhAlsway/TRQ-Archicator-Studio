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

// Map of project IDs to correct image paths
const correctImagePaths = {
  1: 'https://production.trq-studio.pages.dev/uploads/1770307902707-0d947abeb26116a3.webp',
  2: 'https://production.trq-studio.pages.dev/uploads/project-77-1.webp',
  3: 'https://production.trq-studio.pages.dev/uploads/project-3-1.png',
  4: 'https://production.trq-studio.pages.dev/uploads/Event Gate A.webp',
  5: 'https://production.trq-studio.pages.dev/uploads/project-19-1.webp',
  6: 'https://production.trq-studio.pages.dev/uploads/project-19-1.webp',
  7: 'https://production.trq-studio.pages.dev/uploads/project-19-1.webp',
  8: 'https://production.trq-studio.pages.dev/uploads/project-8-1.png',
  9: 'https://production.trq-studio.pages.dev/uploads/project-3-1.png',
  10: 'https://production.trq-studio.pages.dev/uploads/project-19-1.webp',
  11: 'https://production.trq-studio.pages.dev/uploads/1.webp',
  12: 'https://production.trq-studio.pages.dev/uploads/project-16-1.webp',
  13: 'https://production.trq-studio.pages.dev/uploads/13.jpg',
  14: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
  15: 'https://production.trq-studio.pages.dev/uploads/project-18-1.webp',
  16: 'https://production.trq-studio.pages.dev/uploads/project-16-1.webp',
  17: 'https://production.trq-studio.pages.dev/uploads/project-17-1.webp',
  18: 'https://production.trq-studio.pages.dev/uploads/project-18-1.webp',
  19: 'https://production.trq-studio.pages.dev/uploads/project-19-1.webp',
  20: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
  21: 'https://production.trq-studio.pages.dev/uploads/project-16-1.webp',
  22: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
  23: 'https://production.trq-studio.pages.dev/uploads/project-3-1.png',
  24: 'https://production.trq-studio.pages.dev/uploads/project-8-1.png',
  25: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
  26: 'https://production.trq-studio.pages.dev/uploads/project-8-1.png',
  27: 'https://production.trq-studio.pages.dev/uploads/project-3-1.png',
  28: 'https://production.trq-studio.pages.dev/uploads/project-8-1.png',
  29: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
  30: 'https://production.trq-studio.pages.dev/uploads/project-8-1.png',
  31: 'https://production.trq-studio.pages.dev/uploads/project-20-1.webp',
};

async function fixImagePaths() {
  console.log('🔍 Scanning and fixing image paths...\n');
  
  const projects = await executeQuery('SELECT id, image FROM projects ORDER BY id ASC');
  
  console.log('Current image paths:');
  projects.forEach(p => {
    console.log(`  ID ${p.id}: ${p.image}`);
  });
  
  console.log('\n🔄 Updating image paths...\n');
  
  let updated = 0;
  for (const [id, correctPath] of Object.entries(correctImagePaths)) {
    const sql = `UPDATE projects SET image = ? WHERE id = ?`;
    const params = [correctPath, parseInt(id)];
    
    await executeQuery(sql, params);
    console.log(`✓ Project ${id}: Updated to correct path`);
    updated++;
  }
  
  console.log(`\n✅ Updated ${updated} project image paths!`);
}

fixImagePaths().catch(console.error);
