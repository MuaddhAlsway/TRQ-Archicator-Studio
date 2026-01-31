import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function updateProject3() {
  try {
    console.log('Fetching project 3 from Turso...');
    
    // Get current project 3
    const result = await turso.execute({
      sql: 'SELECT id, title, image FROM projects WHERE id = 3',
      args: []
    });
    
    if (result.rows.length === 0) {
      console.log('Project 3 not found');
      return;
    }
    
    console.log('Current project 3:', result.rows[0]);
    
    // Update project 3 image
    console.log('Updating project 3 image...');
    await turso.execute({
      sql: 'UPDATE projects SET image = ? WHERE id = 3',
      args: ['/TRQ STUDIO _ PROJECTS/RAFAL APARTMENT/5.webp']
    });
    
    // Verify update
    const updated = await turso.execute({
      sql: 'SELECT id, title, image FROM projects WHERE id = 3',
      args: []
    });
    
    console.log('Updated project 3:', updated.rows[0]);
    console.log('✅ Project 3 updated successfully in Turso');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateProject3();
