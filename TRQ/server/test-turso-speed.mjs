import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function test() {
  try {
    console.log('Testing Turso connection speed...');
    
    // Test 1: Count query
    let start = Date.now();
    const countResult = await db.execute('SELECT COUNT(*) as count FROM projects');
    console.log(`Count query: ${Date.now() - start}ms - Found ${countResult.rows[0]?.count} projects`);
    
    // Test 2: Select all
    start = Date.now();
    const allResult = await db.execute('SELECT * FROM projects LIMIT 5');
    console.log(`Select 5 projects: ${Date.now() - start}ms - Got ${allResult.rows?.length} rows`);
    
    // Test 3: Full select
    start = Date.now();
    const fullResult = await db.execute('SELECT * FROM projects');
    console.log(`Select all projects: ${Date.now() - start}ms - Got ${fullResult.rows?.length} rows`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
