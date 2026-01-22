import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

async function test() {
  try {
    console.log('Testing SELECT * FROM projects...');
    let start = Date.now();
    const result = await db.execute('SELECT * FROM projects');
    console.log(`Query took ${Date.now() - start}ms`);
    console.log(`Got ${result.rows?.length} rows`);
    if (result.rows?.length > 0) {
      console.log('First row:', result.rows[0]);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
