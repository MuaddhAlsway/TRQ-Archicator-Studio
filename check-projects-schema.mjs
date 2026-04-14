import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function check() {
  try {
    console.log('Checking projects schema and data...\n');
    
    // Get all projects
    const result = await turso.execute('SELECT * FROM projects LIMIT 1');
    console.log('Columns:', Object.keys(result.rows[0]));
    
    // Count all
    const countResult = await turso.execute('SELECT COUNT(*) as count FROM projects');
    console.log(`\nTotal projects: ${countResult.rows[0].count}`);
    
    // List all projects
    const allProjects = await turso.execute('SELECT id, title FROM projects ORDER BY id');
    console.log('\nAll projects:');
    allProjects.rows.forEach((p, i) => {
      console.log(`  ${i + 1}. ID: ${p.id}, Title: ${p.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
