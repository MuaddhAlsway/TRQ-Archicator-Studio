import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function checkTurso() {
  console.log('Checking Turso database...\n');
  
  try {
    const result = await turso.execute('SELECT id, title, status FROM projects ORDER BY id DESC');
    console.log(`Total projects in Turso: ${result.rows.length}`);
    result.rows.forEach(row => {
      console.log(`ID: ${row[0]}, Title: ${row[1]}, Status: ${row[2]}`);
    });
    
    console.log('\nChecking for project 21...');
    const p21 = await turso.execute('SELECT id, title FROM projects WHERE id = 21');
    if (p21.rows.length > 0) {
      console.log('✓ Project 21 found in Turso:', p21.rows[0]);
    } else {
      console.log('✗ Project 21 NOT found in Turso');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTurso();
