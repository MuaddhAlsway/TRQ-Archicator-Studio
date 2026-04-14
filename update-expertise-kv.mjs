import fetch from 'node-fetch';

const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';

async function executeQuery(sql, params = []) {
  try {
    const response = await fetch(TURSO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: sql,
              args: params.map(p => ({ type: 'text', value: String(p) })),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Turso error:', response.status, errorText);
      throw new Error(`Turso error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const result = data.results[0];
      if (result.response && result.response.result && Array.isArray(result.response.result.rows)) {
        const cols = result.response.result.cols || [];
        const rows = result.response.result.rows || [];
        
        const mappedRows = rows.map(row => {
          const obj = {};
          cols.forEach((col, idx) => {
            const cell = row[idx];
            obj[col.name] = cell ? cell.value : null;
          });
          return obj;
        });
        
        return mappedRows;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

async function updateExpertiseTitle() {
  try {
    console.log('Updating aboutExpertise2Title to "Premium Commercial Space"...');
    
    // First check if the key exists
    const existing = await executeQuery(
      `SELECT * FROM settings WHERE key = ?`,
      ['aboutExpertise2Title']
    );
    
    if (existing.length > 0) {
      console.log('Key exists, updating...');
      await executeQuery(
        `UPDATE settings SET value = ? WHERE key = ?`,
        ['Premium Commercial Space', 'aboutExpertise2Title']
      );
    } else {
      console.log('Key does not exist, inserting...');
      await executeQuery(
        `INSERT INTO settings (key, value) VALUES (?, ?)`,
        ['aboutExpertise2Title', 'Premium Commercial Space']
      );
    }
    
    console.log('✓ Update successful');
    
    // Verify the update
    const verify = await executeQuery(
      `SELECT * FROM settings WHERE key = ?`,
      ['aboutExpertise2Title']
    );
    
    console.log('Verified value:', verify[0]?.value);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateExpertiseTitle();
