import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function change() {
  try {
    console.log('Changing ALL "Event Design" to "Concept Design"...\n');
    
    // Find all services with Event Design
    const result = await turso.execute("SELECT id, title, title_ar FROM services WHERE title LIKE '%Event%' OR title_ar LIKE '%فعالي%'");
    
    if (result.rows.length > 0) {
      console.log('Found services with "Event":');
      result.rows.forEach(row => {
        console.log(`  ID: ${row.id}, Title: ${row.title}, Title_AR: ${row.title_ar}`);
      });
    }
    
    // Update all Event Design to Concept Design
    await turso.execute({
      sql: "UPDATE services SET title = 'Concept Design' WHERE title LIKE '%Event%'",
      args: []
    });
    console.log('\n✅ Updated service titles');
    
    // Update Arabic titles
    await turso.execute({
      sql: "UPDATE services SET title_ar = 'تصميم المفاهيم' WHERE title_ar LIKE '%فعالي%'",
      args: []
    });
    console.log('✅ Updated Arabic titles');
    
    // Verify
    const verify = await turso.execute('SELECT id, title, title_ar FROM services ORDER BY id');
    console.log('\n✅ All services now:');
    verify.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Title: ${row.title}, Title_AR: ${row.title_ar}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

change();
