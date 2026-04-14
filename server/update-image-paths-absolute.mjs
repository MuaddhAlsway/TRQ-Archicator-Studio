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

const imageUpdates = {
  1: 'https://production.trq-studio.pages.dev/uploads/file-1768858211350-451992102.webp',
  2: 'https://production.trq-studio.pages.dev/uploads/file-1768858241207-736804924.webp',
  3: 'https://production.trq-studio.pages.dev/uploads/file-1768858284780-218301174.webp',
  4: 'https://production.trq-studio.pages.dev/uploads/file-1768858302967-578784719.webp',
  5: 'https://production.trq-studio.pages.dev/uploads/file-1768858327670-210437964.webp',
};

async function updateImages() {
  console.log('🔄 Updating image paths to absolute URLs...\n');
  
  for (const [id, imageUrl] of Object.entries(imageUpdates)) {
    const sql = `UPDATE hero_slides SET image = ? WHERE id = ?`;
    const params = [imageUrl, parseInt(id)];
    
    await executeQuery(sql, params);
    console.log(`✓ Slide ${id} image updated`);
  }
  
  console.log('\n✅ All image paths updated successfully!');
}

updateImages().catch(console.error);
