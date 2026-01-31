const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';
const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';

async function checkData() {
  try {
    console.log('Checking hero_slides...');
    let response = await fetch(TURSO_API_URL, {
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
              sql: 'SELECT COUNT(*) as count FROM hero_slides',
              args: [],
            },
          },
        ],
      }),
    });
    let data = await response.json();
    console.log('Hero slides count:', JSON.stringify(data, null, 2));

    console.log('\nChecking projects...');
    response = await fetch(TURSO_API_URL, {
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
              sql: 'SELECT COUNT(*) as count FROM projects',
              args: [],
            },
          },
        ],
      }),
    });
    data = await response.json();
    console.log('Projects count:', JSON.stringify(data, null, 2));

    console.log('\nChecking active slides...');
    response = await fetch(TURSO_API_URL, {
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
              sql: 'SELECT * FROM hero_slides WHERE isActive = 1',
              args: [],
            },
          },
        ],
      }),
    });
    data = await response.json();
    console.log('Active slides:', JSON.stringify(data, null, 2));

    console.log('\nChecking published projects...');
    response = await fetch(TURSO_API_URL, {
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
              sql: "SELECT COUNT(*) as count FROM projects WHERE status = 'published'",
              args: [],
            },
          },
        ],
      }),
    });
    data = await response.json();
    console.log('Published projects count:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();
