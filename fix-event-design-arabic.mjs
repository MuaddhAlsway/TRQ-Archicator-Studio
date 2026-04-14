import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function fix() {
  try {
    console.log('Updating Arabic title for Concept Design...\n');
    
    // Update the Arabic title
    await turso.execute({
      sql: "UPDATE services SET title_ar = 'تصميم المفاهيم' WHERE id = 24",
      args: []
    });
    console.log('✅ Arabic title updated to "تصميم المفاهيم" (Concept Design)');
    
    // Also update the Arabic description if needed
    await turso.execute({
      sql: "UPDATE services SET description_ar = 'صمم تجارب لا تُنسى من خلال تصميم المفاهيم والتصميم المخصص.' WHERE id = 24",
      args: []
    });
    console.log('✅ Arabic description updated');
    
    // Verify the update
    const result = await turso.execute('SELECT id, title, title_ar, description_ar FROM services WHERE id = 24');
    console.log('\n✅ Updated service:');
    const row = result.rows[0];
    console.log(`Title: ${row.title}`);
    console.log(`Title_AR: ${row.title_ar}`);
    console.log(`Description_AR: ${row.description_ar}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fix();
