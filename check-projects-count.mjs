import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function check() {
  try {
    console.log('Checking projects...\n');
    
    // Total count
    const totalResult = await turso.execute('SELECT COUNT(*) as count FROM projects');
    const total = totalResult.rows[0].count;
    console.log(`Total projects in database: ${total}`);
    
    // Active count
    const activeResult = await turso.execute('SELECT COUNT(*) as count FROM projects WHERE isActive = 1');
    const active = activeResult.rows[0].count;
    console.log(`Active projects: ${active}`);
    
    // Inactive count
    const inactiveResult = await turso.execute('SELECT COUNT(*) as count FROM projects WHERE isActive = 0');
    const inactive = inactiveResult.rows[0].count;
    console.log(`Inactive projects: ${inactive}\n`);
    
    // List all projects
    const allProjects = await turso.execute('SELECT id, title, isActive FROM projects ORDER BY id');
    console.log('All projects:');
    allProjects.rows.forEach(p => {
      console.log(`  ID: ${p.id}, Title: ${p.title}, Active: ${p.isActive}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

check();
