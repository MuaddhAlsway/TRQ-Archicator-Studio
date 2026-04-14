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

async function fixGalleryPaths() {
  console.log('🔄 Converting all gallery image paths to absolute URLs...\n');
  
  const projects = await executeQuery('SELECT id, gallery FROM projects WHERE gallery IS NOT NULL AND gallery != ""');
  
  let updated = 0;
  for (const project of projects) {
    if (project.gallery) {
      try {
        const gallery = JSON.parse(project.gallery);
        if (Array.isArray(gallery)) {
          const updatedGallery = gallery.map(img => {
            if (typeof img === 'string' && img.startsWith('/')) {
              return `https://production.trq-studio.pages.dev${img}`;
            }
            return img;
          });
          
          const sql = `UPDATE projects SET gallery = ? WHERE id = ?`;
          const params = [JSON.stringify(updatedGallery), parseInt(project.id)];
          
          await executeQuery(sql, params);
          console.log(`✓ Project ${project.id}: Updated ${updatedGallery.length} gallery images`);
          updated++;
        }
      } catch (e) {
        console.log(`⚠ Project ${project.id}: Could not parse gallery JSON`);
      }
    }
  }
  
  console.log(`\n✅ Updated ${updated} projects with absolute gallery URLs!`);
}

fixGalleryPaths().catch(console.error);
