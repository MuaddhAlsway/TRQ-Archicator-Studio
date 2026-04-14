import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function run() {
  // Set portfolio hero image to "A Fusion of Art and Elegance" project
  await turso.execute({
    sql: "INSERT OR REPLACE INTO settings (key, value) VALUES ('portfolioHeroImage', ?)",
    args: ['/uploads/A Fusion of Art and Elegance  Living room/14.webp'],
  });
  console.log('portfolioHeroImage updated');

  // Also set portfolioHeroImage_ar to same image
  await turso.execute({
    sql: "INSERT OR REPLACE INTO settings (key, value) VALUES ('portfolioHeroImage_ar', ?)",
    args: ['/uploads/A Fusion of Art and Elegance  Living room/14.webp'],
  });
  console.log('portfolioHeroImage_ar updated');
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
