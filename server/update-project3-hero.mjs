import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function run() {
  // Update project 3 hero image to use 5.webp (better hero shot)
  await turso.execute({
    sql: "UPDATE projects SET image = ? WHERE id = 3",
    args: ['/uploads/RAFAL APARTMENT/5.webp'],
  });
  
  const rows = await turso.execute('SELECT id, title, image FROM projects WHERE id = 3');
  console.log('Project 3 updated:', rows.rows[0]);
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
