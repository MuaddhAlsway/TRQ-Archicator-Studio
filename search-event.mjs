import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function search() {
  try {
    console.log('Searching for "Event" in services...\n');
    const result = await turso.execute("SELECT id, title, description FROM services WHERE title LIKE '%Event%' OR description LIKE '%event%'");
    
    if (result.rows.length === 0) {
      console.log('❌ No services with "Event" found');
    } else {
      console.log('Found services with "Event":');
      result.rows.forEach(row => {
        console.log(`ID: ${row.id}, Title: ${row.title}`);
        console.log(`  Description: ${row.description}\n`);
      });
    }
    
    console.log('\n--- All services (checking isActive) ---');
    const allResult = await turso.execute('SELECT id, title, isActive FROM services ORDER BY sortOrder');
    allResult.rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Active: ${row.isActive}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

search();
