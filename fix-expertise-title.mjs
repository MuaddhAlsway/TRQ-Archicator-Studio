import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

try {
  console.log('Fixing aboutExpertise2Title...');
  
  // Delete the old setting
  await turso.execute('DELETE FROM settings WHERE key = \'aboutExpertise2Title\'');
  console.log('✓ Deleted old setting');
  
  // Insert the new setting
  await turso.execute('INSERT INTO settings (key, value) VALUES (?, ?)', ['aboutExpertise2Title', 'Premium Commercial Space']);
  console.log('✓ Inserted new setting');
  
  // Verify
  const result = await turso.execute('SELECT key, value FROM settings WHERE key = \'aboutExpertise2Title\'');
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
