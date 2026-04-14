import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function run() {
  // Create table
  await turso.execute(`CREATE TABLE IF NOT EXISTS about_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    image TEXT,
    sortOrder INTEGER DEFAULT 0,
    isActive INTEGER DEFAULT 1,
    title_ar TEXT,
    description_ar TEXT,
    video_url_ar TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Table ready');

  // Insert the video from local DB
  await turso.execute({
    sql: `INSERT OR REPLACE INTO about_videos 
      (id, title, description, video_url, image, sortOrder, isActive, title_ar, description_ar, video_url_ar)
      VALUES (1, ?, ?, ?, NULL, 1, 1, ?, ?, ?)`,
    args: [
      'About TRQ Studio',
      "We are a luxury interior design studio dedicated to creating timeless, sophisticated spaces that reflect our clients' refined taste and elevated lifestyle.",
      '/Video.mp4',
      'عن استوديو TRQ',
      'نحن استوديو تصميم داخلي فاخر مكرس لإنشاء مساحات خالدة وراقية تعكس ذوق عملائنا المتطور ونمط حياتهم الرفيع.',
      '/POV 1.mp4',
    ],
  });
  console.log('Video synced to Turso');

  // Verify
  const rows = await turso.execute('SELECT id, title, video_url, isActive FROM about_videos');
  console.log('Turso about_videos:', rows.rows.length, 'row(s)');
  rows.rows.forEach(r => console.log(' ', r));
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
