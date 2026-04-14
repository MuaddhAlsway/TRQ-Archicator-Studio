import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function check() {
  try {
    console.log('Checking ALL services in database...\n');
    const result = await turso.execute('SELECT * FROM services ORDER BY id');
    
    console.log(`Total services: ${result.rows.length}\n`);
    result.rows.forEach(row => {
      console.log(`ID: ${row.id}`);
      console.log(`Title: ${row.title}`);
      console.log(`Title_AR: ${row.title_ar || 'N/A'}`);
      console.log(`Description: ${row.description}`);
      console.log(`IsActive: ${row.isActive}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
