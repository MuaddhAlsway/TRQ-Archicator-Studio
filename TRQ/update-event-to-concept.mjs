import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function updateDatabase() {
  try {
    console.log('Updating services table...');
    
    // Update services table - change Event Design to Concept Design
    await turso.execute({
      sql: "UPDATE services SET title = 'Concept Design' WHERE title = 'Event Design'",
      args: []
    });
    console.log('✅ Services title updated');
    
    // Update services description
    await turso.execute({
      sql: "UPDATE services SET description = 'Create unforgettable experiences with bespoke concept design and styling.' WHERE title = 'Concept Design' AND description LIKE '%event design%'",
      args: []
    });
    console.log('✅ Services description updated');
    
    // Update projects table - change Event Design to Concept Design
    await turso.execute({
      sql: "UPDATE projects SET category = 'Concept Design' WHERE category = 'Event Design'",
      args: []
    });
    console.log('✅ Projects category updated');
    
    console.log('\n✅ All updates complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateDatabase();
