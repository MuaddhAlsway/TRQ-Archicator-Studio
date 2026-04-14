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

async function fixImagePaths() {
  console.log('🔄 Fixing image paths to correct folder structure...\n');
  
  const projects = await executeQuery('SELECT id, image FROM projects ORDER BY id ASC');
  
  let updated = 0;
  for (const project of projects) {
    if (project.image) {
      let newPath = project.image;
      
      // If path contains /uploads/TRQ STUDIO _ PROJECTS/, remove /uploads/ prefix
      if (newPath.includes('/uploads/TRQ STUDIO _ PROJECTS/')) {
        newPath = newPath.replace('/uploads/TRQ STUDIO _ PROJECTS/', '/TRQ STUDIO _ PROJECTS/');
      }
      // If path contains /uploads/ but not a simple file, remove /uploads/ prefix
      else if (newPath.includes('/uploads/') && newPath.includes('/')) {
        const parts = newPath.split('/uploads/');
        if (parts[1] && parts[1].includes('/')) {
          newPath = `https://production.trq-studio.pages.dev/${parts[1]}`;
        }
      }
      
      if (newPath !== project.image) {
        const sql = `UPDATE projects SET image = ? WHERE id = ?`;
        const params = [newPath, parseInt(project.id)];
        
        await executeQuery(sql, params);
        console.log(`✓ Project ${project.id}: ${project.image.substring(0, 60)}...`);
        console.log(`  → ${newPath.substring(0, 60)}...`);
        updated++;
      }
    }
  }
  
  console.log(`\n✅ Updated ${updated} project image paths!`);
}

fixImagePaths().catch(console.error);
