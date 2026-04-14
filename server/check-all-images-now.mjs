import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA'
});

setTimeout(() => {
  db.execute('SELECT id, title, image, gallery FROM projects ORDER BY id').then(r => {
    r.rows.forEach(row => {
      const gallery = row[3] ? String(row[3]).substring(0, 120) : 'null';
      console.log(`ID:${row[0]} | ${String(row[1]).substring(0,30)} | cover: ${row[2]} | gallery: ${gallery}`);
    });
  }).catch(e => console.error(e));
}, 100);
