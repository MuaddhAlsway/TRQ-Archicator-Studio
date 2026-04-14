import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

try {
  console.log('Updating aboutExpertise2Title to "Premium Commercial Space"...');
  await turso.execute('UPDATE settings SET value = ? WHERE key = ?', ['Premium Commercial Space', 'aboutExpertise2Title']);
  console.log('✓ Setting updated');
  
  // Verify
  const result = await turso.execute('SELECT key, value FROM settings WHERE key = ?', ['aboutExpertise2Title']);
  console.log('');
  console.log('Verification:');
  result.rows.forEach(row => {
    console.log('Key: ' + row.key + ' | Value: ' + row.value);
  });
  
  process.exit(0);
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
