import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA'
});

const del = await db.execute('DELETE FROM projects WHERE id IN (27, 28, 29, 30)');
console.log(`Deleted ${del.rowsAffected} duplicate projects (27, 28, 29, 30)`);

const r = await db.execute('SELECT id, title, image FROM projects ORDER BY id');
console.log(`\nRemaining: ${r.rows.length} projects`);
r.rows.forEach(row => console.log(`  ID:${row[0]} | ${row[1]} | ${row[2]}`));
