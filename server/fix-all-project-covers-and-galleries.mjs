import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA'
});

// Strip domain prefix from any URL, return root-relative path
function cleanPath(p) {
  if (!p) return p;
  return p.replace(/^https?:\/\/[^/]+/, '');
}

// Clean all paths in a gallery array
function cleanGallery(galleryRaw) {
  if (!galleryRaw) return null;
  let arr;
  try {
    arr = typeof galleryRaw === 'string' ? JSON.parse(galleryRaw) : galleryRaw;
  } catch {
    return galleryRaw;
  }
  if (!Array.isArray(arr)) return galleryRaw;
  const cleaned = arr.map(cleanPath);
  return JSON.stringify(cleaned);
}

// Correct cover image for each project ID (root-relative paths from uploads folder)
const correctCovers = {
  1:  '/uploads/REC. HEAVEN/Cover.webp',
  2:  '/uploads/RSG BOOTH/10.webp',
  3:  '/uploads/RAFAL APARTMENT/14.webp',
  4:  '/uploads/ARYASH AL-DRIIYAH/Event Gate A.webp',
  5:  '/uploads/DIRIYAH PARADE/Image43.png',
  6:  '/uploads/DIRIYAH NATIONAL DAY EVENT/Image29.png',
  7:  '/uploads/DIRIYAH MARKET/Image44_000.png',
  8:  '/uploads/PAWS & PARTNERS/1.png',
  9:  '/uploads/A Fusion of Art and Elegance  Living room/14.webp',
  10: '/uploads/ALULAH/Image38.png',
  11: '/uploads/CLASSIC BEDROOM/1.webp',
  12: '/uploads/H & P/2.webp',
  13: '/uploads/Half million/1.jpg',
  14: '/uploads/Modern LuxuryLiving room/1.webp',
  15: '/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/2.png',
  16: '/uploads/Oasis/Image1.webp',
  17: '/uploads/ALMajid/Cover.webp',
  18: '/uploads/HERITAGE Day/Cover.webp',
  19: '/uploads/ALFUNDATIONDay/Cover.webp',
  20: '/uploads/Diriyah Gate Development Authority/img1.webp',
  21: '/uploads/Luxe Residence/Cover.webp',
};

// Correct gallery arrays for each project (root-relative)
const correctGalleries = {
  1:  ['/uploads/REC. HEAVEN/Cover.webp','/uploads/REC. HEAVEN/13.jpg','/uploads/REC. HEAVEN/14 c.png','/uploads/REC. HEAVEN/22 c.png','/uploads/REC. HEAVEN/24.png','/uploads/REC. HEAVEN/25.png','/uploads/REC. HEAVEN/26.png'],
  2:  ['/uploads/RSG BOOTH/10.webp','/uploads/RSG BOOTH/11a2.webp','/uploads/RSG BOOTH/7a.webp','/uploads/RSG BOOTH/8.webp'],
  3:  ['/uploads/RAFAL APARTMENT/14.webp','/uploads/RAFAL APARTMENT/5.webp','/uploads/RAFAL APARTMENT/7.webp','/uploads/RAFAL APARTMENT/imag 5.webp','/uploads/RAFAL APARTMENT/imag2.png','/uploads/RAFAL APARTMENT/image 10.webp','/uploads/RAFAL APARTMENT/image 3.png','/uploads/RAFAL APARTMENT/image 4.webp','/uploads/RAFAL APARTMENT/image 6.webp','/uploads/RAFAL APARTMENT/image 7.webp','/uploads/RAFAL APARTMENT/image 8.webp','/uploads/RAFAL APARTMENT/image 9.webp'],
  4:  ['/uploads/ARYASH AL-DRIIYAH/Event Gate A.webp','/uploads/ARYASH AL-DRIIYAH/Gate B.webp','/uploads/ARYASH AL-DRIIYAH/Indoor A.webp','/uploads/ARYASH AL-DRIIYAH/Indoor B.webp','/uploads/ARYASH AL-DRIIYAH/Indoor C.webp','/uploads/ARYASH AL-DRIIYAH/Indoor D.webp','/uploads/ARYASH AL-DRIIYAH/Indoor E.webp','/uploads/ARYASH AL-DRIIYAH/Indoor F.webp','/uploads/ARYASH AL-DRIIYAH/Indoor G.webp','/uploads/ARYASH AL-DRIIYAH/Outdoor A.webp','/uploads/ARYASH AL-DRIIYAH/Outdoor B.webp','/uploads/ARYASH AL-DRIIYAH/Seating A.webp','/uploads/ARYASH AL-DRIIYAH/Seating B.webp','/uploads/ARYASH AL-DRIIYAH/Seating C.webp','/uploads/ARYASH AL-DRIIYAH/Seating D.webp','/uploads/ARYASH AL-DRIIYAH/Seating E.webp','/uploads/ARYASH AL-DRIIYAH/Seating F.webp'],
  5:  ['/uploads/DIRIYAH PARADE/Image43.png','/uploads/DIRIYAH PARADE/Image44.png','/uploads/DIRIYAH PARADE/Image47.png','/uploads/DIRIYAH PARADE/Image48.png','/uploads/DIRIYAH PARADE/Image50.png','/uploads/DIRIYAH PARADE/Image53_000.png','/uploads/DIRIYAH PARADE/Image54_000.png','/uploads/DIRIYAH PARADE/Image59.png','/uploads/DIRIYAH PARADE/Image60.png','/uploads/DIRIYAH PARADE/Image61.jpg.png','/uploads/DIRIYAH PARADE/Image62.png','/uploads/DIRIYAH PARADE/Image64.png','/uploads/DIRIYAH PARADE/Image68.png'],
  6:  ['/uploads/DIRIYAH NATIONAL DAY EVENT/Image29.png','/uploads/DIRIYAH NATIONAL DAY EVENT/Image36.png','/uploads/DIRIYAH NATIONAL DAY EVENT/Image37.webp'],
  7:  ['/uploads/DIRIYAH MARKET/Image44_000.png','/uploads/DIRIYAH MARKET/Image46_000.png','/uploads/DIRIYAH MARKET/Image47.png','/uploads/DIRIYAH MARKET/Image47_000.png','/uploads/DIRIYAH MARKET/Image48.png','/uploads/DIRIYAH MARKET/Image48_000.png','/uploads/DIRIYAH MARKET/Image49.png','/uploads/DIRIYAH MARKET/Image50.png','/uploads/DIRIYAH MARKET/Image52.png'],
  8:  ['/uploads/PAWS & PARTNERS/1.png','/uploads/PAWS & PARTNERS/2.png','/uploads/PAWS & PARTNERS/3.png','/uploads/PAWS & PARTNERS/4.png','/uploads/PAWS & PARTNERS/5.png','/uploads/PAWS & PARTNERS/6.png','/uploads/PAWS & PARTNERS/7.png','/uploads/PAWS & PARTNERS/8.png','/uploads/PAWS & PARTNERS/9.png'],
  9:  ['/uploads/A Fusion of Art and Elegance  Living room/14.webp','/uploads/A Fusion of Art and Elegance  Living room/14a.webp','/uploads/A Fusion of Art and Elegance  Living room/14b.webp','/uploads/A Fusion of Art and Elegance  Living room/14c.webp'],
  10: ['/uploads/ALULAH/Image38.png','/uploads/ALULAH/Image39.png','/uploads/ALULAH/Image40.png','/uploads/ALULAH/Image43.png','/uploads/ALULAH/Image44.png'],
  11: ['/uploads/CLASSIC BEDROOM/1.webp','/uploads/CLASSIC BEDROOM/2.webp','/uploads/CLASSIC BEDROOM/3.webp','/uploads/CLASSIC BEDROOM/4.webp'],
  12: ['/uploads/H & P/2.webp','/uploads/H & P/3.webp','/uploads/H & P/4.webp','/uploads/H & P/5.webp','/uploads/H & P/6.webp','/uploads/H & P/7.webp','/uploads/H & P/8.webp'],
  13: ['/uploads/Half million/1.jpg','/uploads/Half million/2A.jpg'],
  14: ['/uploads/Modern LuxuryLiving room/1.webp','/uploads/Modern LuxuryLiving room/2.webp','/uploads/Modern LuxuryLiving room/3.webp','/uploads/Modern LuxuryLiving room/11 cave.webp'],
  15: ['/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/2.png','/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/4.png','/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/7.png'],
  16: ['/uploads/Oasis/Image1.webp','/uploads/Oasis/imag4.webp','/uploads/Oasis/image2.jpg','/uploads/Oasis/image3.webp','/uploads/Oasis/image4.webp'],
  17: ['/uploads/ALMajid/Cover.webp','/uploads/ALMajid/img1.webp','/uploads/ALMajid/img2.webp','/uploads/ALMajid/img3.webp','/uploads/ALMajid/img4.webp','/uploads/ALMajid/img5.webp'],
  18: ['/uploads/HERITAGE Day/Cover.webp','/uploads/HERITAGE Day/img1.webp','/uploads/HERITAGE Day/img2.webp','/uploads/HERITAGE Day/img3.webp','/uploads/HERITAGE Day/img4.webp','/uploads/HERITAGE Day/img5.webp','/uploads/HERITAGE Day/img6.webp','/uploads/HERITAGE Day/img8.webp','/uploads/HERITAGE Day/img9.webp','/uploads/HERITAGE Day/img10.webp','/uploads/HERITAGE Day/img12.webp','/uploads/HERITAGE Day/img13.webp','/uploads/HERITAGE Day/img14.webp','/uploads/HERITAGE Day/img15.webp','/uploads/HERITAGE Day/img16.webp'],
  19: ['/uploads/ALFUNDATIONDay/Cover.webp','/uploads/ALFUNDATIONDay/img1.webp','/uploads/ALFUNDATIONDay/img2.webp','/uploads/ALFUNDATIONDay/img3.webp','/uploads/ALFUNDATIONDay/img4.webp','/uploads/ALFUNDATIONDay/img5.webp','/uploads/ALFUNDATIONDay/img6.webp','/uploads/ALFUNDATIONDay/img7.webp'],
  20: ['/uploads/Diriyah Gate Development Authority/img1.webp','/uploads/Diriyah Gate Development Authority/img2.webp','/uploads/Diriyah Gate Development Authority/img3.webp','/uploads/Diriyah Gate Development Authority/img4.webp','/uploads/Diriyah Gate Development Authority/img5.webp','/uploads/Diriyah Gate Development Authority/img6.webp','/uploads/Diriyah Gate Development Authority/img7.webp','/uploads/Diriyah Gate Development Authority/img8.webp','/uploads/Diriyah Gate Development Authority/img9.webp','/uploads/Diriyah Gate Development Authority/img10.webp'],
  21: ['/uploads/Luxe Residence/Cover.webp','/uploads/Luxe Residence/img1.webp','/uploads/Luxe Residence/img2.webp','/uploads/Luxe Residence/img3.webp'],
};

async function run() {
  // Step 1: Delete duplicate projects (IDs 22-31)
  console.log('Deleting duplicate projects (IDs 22-31)...');
  const deleteResult = await db.execute('DELETE FROM projects WHERE id >= 22');
  console.log(`Deleted ${deleteResult.rowsAffected} duplicate projects`);

  // Step 2: Fix cover images and galleries for IDs 1-21
  console.log('\nFixing cover images and galleries for projects 1-21...');
  for (const [idStr, cover] of Object.entries(correctCovers)) {
    const id = parseInt(idStr);
    const gallery = correctGalleries[id];
    const galleryJson = JSON.stringify(gallery);
    
    await db.execute({
      sql: 'UPDATE projects SET image = ?, gallery = ? WHERE id = ?',
      args: [cover, galleryJson, id]
    });
    console.log(`  ID ${id}: cover=${cover}`);
  }

  // Step 3: Verify
  console.log('\nVerification:');
  const r = await db.execute('SELECT id, title, image FROM projects ORDER BY id');
  r.rows.forEach(row => {
    console.log(`  ID:${row[0]} | ${String(row[1]).substring(0,25)} | ${row[2]}`);
  });
  console.log(`\nTotal projects: ${r.rows.length}`);
}

run().catch(console.error);
