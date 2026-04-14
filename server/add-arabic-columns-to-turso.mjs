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

async function addColumns() {
  console.log('🔄 Adding Arabic columns to hero_slides table...\n');
  
  const columnsToAdd = [
    'tag_ar TEXT',
    'title_ar TEXT',
    'description_ar TEXT',
    'buttonPrimaryText_ar TEXT',
    'buttonSecondaryText_ar TEXT',
    'video_ar TEXT',
    'video_2_ar TEXT',
    'video_3_ar TEXT',
    'video_text_ar TEXT',
    'video_2_text_ar TEXT',
    'video_3_text_ar TEXT',
  ];
  
  for (const column of columnsToAdd) {
    try {
      const sql = `ALTER TABLE hero_slides ADD COLUMN ${column}`;
      await executeQuery(sql);
      console.log(`✓ Added column: ${column.split(' ')[0]}`);
    } catch (error) {
      console.log(`⚠ Column might already exist: ${column.split(' ')[0]}`);
    }
  }
  
  console.log('\n✅ All columns added successfully!');
}

addColumns().catch(console.error);
