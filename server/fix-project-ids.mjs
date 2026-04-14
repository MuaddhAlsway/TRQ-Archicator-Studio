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

async function fixProjectIds() {
  console.log('🔄 Fixing project IDs...\n');
  
  // Map old IDs to new IDs
  const idMap = {
    80: 27,
    81: 28,
    82: 29,
    83: 30,
    84: 31
  };
  
  for (const [oldId, newId] of Object.entries(idMap)) {
    try {
      // First, get the project data
      const projects = await executeQuery('SELECT * FROM projects WHERE id = ?', [parseInt(oldId)]);
      
      if (projects.length > 0) {
        const project = projects[0];
        
        // Delete the old ID if it exists
        await executeQuery('DELETE FROM projects WHERE id = ?', [parseInt(newId)]);
        
        // Update the ID
        const sql = `UPDATE projects SET id = ? WHERE id = ?`;
        await executeQuery(sql, [parseInt(newId), parseInt(oldId)]);
        
        console.log(`✓ Project ID ${oldId} → ${newId}: ${project.title}`);
      }
    } catch (e) {
      console.log(`⚠ Error updating ID ${oldId}: ${e.message}`);
    }
  }
  
  console.log('\n✅ Project IDs fixed!');
  
  // Verify
  console.log('\n📋 Verifying all project IDs:');
  const allProjects = await executeQuery('SELECT id, title FROM projects ORDER BY id ASC');
  allProjects.forEach(p => {
    console.log(`  ID ${p.id}: ${p.title}`);
  });
}

fixProjectIds().catch(console.error);
