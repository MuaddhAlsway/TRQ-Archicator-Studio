import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function fixImages() {
  try {
    console.log('Fixing all project image paths...\n');
    
    // Get all projects
    const result = await turso.execute('SELECT id, title, image FROM projects ORDER BY id');
    
    console.log('Current images:');
    result.rows.forEach(p => {
      console.log(`ID ${p.id}: ${p.image}`);
    });
    
    console.log('\n\nUpdating image paths...\n');
    
    // Update all image paths to use /TRQ STUDIO _ PROJECTS/ prefix
    for (const project of result.rows) {
      let newPath = project.image;
      
      // If image starts with /uploads/, keep it as is
      if (newPath && newPath.startsWith('/uploads/')) {
        console.log(`✓ ID ${project.id}: Already correct (${newPath})`);
        continue;
      }
      
      // If image doesn't start with /, add it
      if (newPath && !newPath.startsWith('/')) {
        newPath = '/' + newPath;
      }
      
      // If image is empty or null, set a default
      if (!newPath) {
        newPath = '/TRQ STUDIO _ PROJECTS/Default/1.webp';
      }
      
      // Update in database
      await turso.execute({
        sql: 'UPDATE projects SET image = ? WHERE id = ?',
        args: [newPath, project.id]
      });
      
      console.log(`✓ ID ${project.id}: ${newPath}`);
    }
    
    console.log('\n✅ All project images updated!');
    
    // Verify
    const verify = await turso.execute('SELECT id, title, image FROM projects ORDER BY id');
    console.log('\n\nFinal image paths:');
    verify.rows.forEach(p => {
      console.log(`ID ${p.id}: ${p.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixImages();
