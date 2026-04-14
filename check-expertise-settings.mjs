import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
});

try {
  const result = await turso.execute('SELECT key, value FROM settings WHERE key LIKE \'aboutExpertise2%\' ORDER BY key ASC');
  console.log('About expertise2 settings in Turso:');
  result.rows.forEach(row => {
    console.log('Key: ' + row.key + ' | Value: ' + row.value);
  });
  
  if (result.rows.length === 0) {
    console.log('No settings found for aboutExpertise2');
    console.log('');
    console.log('Inserting aboutExpertise2Title setting...');
    await turso.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['aboutExpertise2Title', 'Premium Commercial Space']);
    console.log('✓ Setting inserted');
  }
  
  process.exit(0);
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
