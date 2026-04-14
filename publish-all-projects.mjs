import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function publish() {
  try {
    console.log('Publishing all draft projects...\n');
    
    // Publish all draft projects
    await turso.execute("UPDATE projects SET status = 'published' WHERE status = 'draft'");
    console.log('✅ All draft projects published');
    
    // Add placeholder images for projects without images
    await turso.execute({
      sql: "UPDATE projects SET image = ? WHERE id = 19",
      args: ['/TRQ STUDIO _ PROJECTS/Diriyah Gate Development Authority/1.webp']
    });
    console.log('✅ Added image for DIRIYAH GATE DEVELOPMENT AUTHORITY');
    
    await turso.execute({
      sql: "UPDATE projects SET image = ? WHERE id = 20",
      args: ['/TRQ STUDIO _ PROJECTS/Serenity Luxe Residence/1.webp']
    });
    console.log('✅ Added image for Serenity Luxe Residence');
    
    // Verify
    const result = await turso.execute('SELECT status, COUNT(*) as count FROM projects GROUP BY status');
    console.log('\n✅ Final Status:');
    result.rows.forEach(row => {
      console.log(`${row.status}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

publish();
