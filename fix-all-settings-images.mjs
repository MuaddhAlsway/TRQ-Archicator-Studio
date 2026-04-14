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

function convertToAbsoluteUrl(path) {
  if (!path) return null;
  if (path.startsWith('https://') || path.startsWith('http://')) {
    return path;
  }
  
  // Handle paths with spaces (URL encode them)
  const encodedPath = path
    .split('/')
    .map(part => encodeURIComponent(part))
    .join('/');
  
  return `https://production.trq-studio.pages.dev${encodedPath.startsWith('/') ? encodedPath : '/' + encodedPath}`;
}

async function fixAllSettings() {
  console.log('🔧 FIXING ALL SETTINGS IMAGE PATHS\n');
  
  const settings = await executeQuery(`
    SELECT key, value FROM settings 
    WHERE (key LIKE '%Image%' OR key LIKE '%image%' OR key LIKE '%Video%' OR key LIKE '%video%')
    AND value IS NOT NULL
    AND value NOT LIKE 'https://%'
    AND value NOT LIKE 'http://%'
    ORDER BY key ASC
  `);
  
  console.log(`Found ${settings.length} settings to fix:\n`);
  
  let fixedCount = 0;
  
  for (const setting of settings) {
    const newValue = convertToAbsoluteUrl(setting.value);
    
    console.log(`Updating: ${setting.key}`);
    console.log(`  Old: ${setting.value}`);
    console.log(`  New: ${newValue}`);
    
    await executeQuery(
      'UPDATE settings SET value = ? WHERE key = ?',
      [newValue, setting.key]
    );
    
    fixedCount++;
    console.log('');
  }
  
  console.log(`✅ Fixed ${fixedCount} settings\n`);
}

fixAllSettings().catch(console.error);
