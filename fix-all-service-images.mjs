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

async function fixServiceImages() {
  console.log('🔧 FIXING SERVICE IMAGES\n');
  
  const services = await executeQuery('SELECT id, image FROM services WHERE image IS NOT NULL');
  
  let fixedCount = 0;
  
  for (const service of services) {
    if (service.image && !service.image.startsWith('https://')) {
      const newPath = `https://production.trq-studio.pages.dev${service.image.startsWith('/') ? service.image : '/' + service.image}`;
      
      console.log(`Updating Service ${service.id}:`);
      console.log(`  Old: ${service.image}`);
      console.log(`  New: ${newPath}`);
      
      await executeQuery(
        'UPDATE services SET image = ? WHERE id = ?',
        [newPath, service.id]
      );
      
      fixedCount++;
    }
  }
  
  console.log(`\n✅ Fixed ${fixedCount} service images\n`);
}

fixServiceImages().catch(console.error);
