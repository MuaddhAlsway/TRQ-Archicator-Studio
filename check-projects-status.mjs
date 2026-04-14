import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function check() {
  try {
    console.log('Checking project status and images...\n');
    
    const result = await turso.execute('SELECT id, title, status, image FROM projects ORDER BY id');
    
    console.log('Project Status:');
    result.rows.forEach(p => {
      console.log(`\nID: ${p.id}`);
      console.log(`Title: ${p.title}`);
      console.log(`Status: ${p.status}`);
      console.log(`Image: ${p.image}`);
    });
    
    // Count by status
    const statusResult = await turso.execute('SELECT status, COUNT(*) as count FROM projects GROUP BY status');
    console.log('\n\nStatus Summary:');
    statusResult.rows.forEach(row => {
      console.log(`${row.status}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
