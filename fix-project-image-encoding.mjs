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

function encodeImagePath(path) {
  if (!path) return path;
  
  // Split by / and encode each part
  const parts = path.split('/');
  const encoded = parts.map(part => {
    // Only encode if it contains spaces or special characters
    if (part.includes(' ') || part.includes('%')) {
      return encodeURIComponent(part);
    }
    return part;
  }).join('/');
  
  return encoded;
}

async function fixProjectImages() {
  console.log('🔧 FIXING PROJECT IMAGE PATHS WITH PROPER ENCODING\n');
  
  const projects = await executeQuery('SELECT id, image FROM projects WHERE image IS NOT NULL');
  
  let fixedCount = 0;
  
  for (const project of projects) {
    if (project.image && project.image.includes(' ')) {
      const encodedPath = encodeImagePath(project.image);
      
      if (encodedPath !== project.image) {
        console.log(`Updating Project ${project.id}:`);
        console.log(`  Old: ${project.image}`);
        console.log(`  New: ${encodedPath}`);
        
        await executeQuery(
          'UPDATE projects SET image = ? WHERE id = ?',
          [encodedPath, project.id]
        );
        
        fixedCount++;
      }
    }
  }
  
  console.log(`\n✅ Fixed ${fixedCount} project images with proper encoding\n`);
}

fixProjectImages().catch(console.error);
