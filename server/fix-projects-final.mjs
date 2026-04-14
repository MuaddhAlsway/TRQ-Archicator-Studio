import { createClient } from '@libsql/client';

const db = createClient({ 
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io', 
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA'
});

// Verified correct data for every project — cover + full gallery from actual files in uploads/
const projectFixes = {
  1:  {
    cover: '/uploads/REC. HEAVEN/Cover.webp',
    gallery: ['/uploads/REC. HEAVEN/Cover.webp','/uploads/REC. HEAVEN/13.jpg','/uploads/REC. HEAVEN/14 c.png','/uploads/REC. HEAVEN/22 c.png','/uploads/REC. HEAVEN/24.png','/uploads/REC. HEAVEN/25.png','/uploads/REC. HEAVEN/26.png']
  },
  2:  {
    cover: '/uploads/RSG BOOTH/10.webp',
    gallery: ['/uploads/RSG BOOTH/10.webp','/uploads/RSG BOOTH/11a2.webp','/uploads/RSG BOOTH/7a.webp','/uploads/RSG BOOTH/8.webp']
  },
  3:  {
    cover: '/uploads/RAFAL APARTMENT/14.webp',
    gallery: ['/uploads/RAFAL APARTMENT/14.webp','/uploads/RAFAL APARTMENT/5.webp','/uploads/RAFAL APARTMENT/7.webp','/uploads/RAFAL APARTMENT/imag 5.webp','/uploads/RAFAL APARTMENT/imag2.png','/uploads/RAFAL APARTMENT/image 10.webp','/uploads/RAFAL APARTMENT/image 3.png','/uploads/RAFAL APARTMENT/image 4.webp','/uploads/RAFAL APARTMENT/image 6.webp','/uploads/RAFAL APARTMENT/image 7.webp','/uploads/RAFAL APARTMENT/image 8.webp','/uploads/RAFAL APARTMENT/image 9.webp','/uploads/RAFAL APARTMENT/0458b3195884987.664b3dab09355.png']
  },
  4:  {
    cover: '/uploads/ARYASH AL-DRIIYAH/Event Gate A.webp',
    gallery: ['/uploads/ARYASH AL-DRIIYAH/Event Gate A.webp','/uploads/ARYASH AL-DRIIYAH/Gate B.webp','/uploads/ARYASH AL-DRIIYAH/Indoor A.webp','/uploads/ARYASH AL-DRIIYAH/Indoor B.webp','/uploads/ARYASH AL-DRIIYAH/Indoor C.webp','/uploads/ARYASH AL-DRIIYAH/Indoor D.webp','/uploads/ARYASH AL-DRIIYAH/Indoor E.webp','/uploads/ARYASH AL-DRIIYAH/Indoor F.webp','/uploads/ARYASH AL-DRIIYAH/Indoor G.webp','/uploads/ARYASH AL-DRIIYAH/Outdoor A.webp','/uploads/ARYASH AL-DRIIYAH/Outdoor B.webp','/uploads/ARYASH AL-DRIIYAH/plan.webp','/uploads/ARYASH AL-DRIIYAH/Seating A.webp','/uploads/ARYASH AL-DRIIYAH/Seating B.webp','/uploads/ARYASH AL-DRIIYAH/Seating C.webp','/uploads/ARYASH AL-DRIIYAH/Seating D.webp','/uploads/ARYASH AL-DRIIYAH/Seating E.webp','/uploads/ARYASH AL-DRIIYAH/Seating F.webp']
  },
  5:  {
    cover: '/uploads/DIRIYAH PARADE/Image43.png',
    gallery: ['/uploads/DIRIYAH PARADE/Image43.png','/uploads/DIRIYAH PARADE/Image44.png','/uploads/DIRIYAH PARADE/Image47.png','/uploads/DIRIYAH PARADE/Image48.png','/uploads/DIRIYAH PARADE/Image50.png','/uploads/DIRIYAH PARADE/Image53_000.png','/uploads/DIRIYAH PARADE/Image54_000.png','/uploads/DIRIYAH PARADE/Image59.png','/uploads/DIRIYAH PARADE/Image60.png','/uploads/DIRIYAH PARADE/Image61.jpg.png','/uploads/DIRIYAH PARADE/Image62.png','/uploads/DIRIYAH PARADE/Image64.png','/uploads/DIRIYAH PARADE/Image68.png']
  },
  6:  {
    cover: '/uploads/DIRIYAH NATIONAL DAY EVENT/Image29.png',
    gallery: ['/uploads/DIRIYAH NATIONAL DAY EVENT/Image29.png','/uploads/DIRIYAH NATIONAL DAY EVENT/Image36.png','/uploads/DIRIYAH NATIONAL DAY EVENT/Image37.webp']
  },
  7:  {
    cover: '/uploads/DIRIYAH MARKET/Image44_000.png',
    gallery: ['/uploads/DIRIYAH MARKET/Image44_000.png','/uploads/DIRIYAH MARKET/Image46_000.png','/uploads/DIRIYAH MARKET/Image47.png','/uploads/DIRIYAH MARKET/Image47_000.png','/uploads/DIRIYAH MARKET/Image48.png','/uploads/DIRIYAH MARKET/Image48_000.png','/uploads/DIRIYAH MARKET/Image49.png','/uploads/DIRIYAH MARKET/Image50.png','/uploads/DIRIYAH MARKET/Image52.png']
  },
  8:  {
    cover: '/uploads/PAWS & PARTNERS/1.png',
    gallery: ['/uploads/PAWS & PARTNERS/1.png','/uploads/PAWS & PARTNERS/2.png','/uploads/PAWS & PARTNERS/3.png','/uploads/PAWS & PARTNERS/4.png','/uploads/PAWS & PARTNERS/5.png','/uploads/PAWS & PARTNERS/6.png','/uploads/PAWS & PARTNERS/7.png','/uploads/PAWS & PARTNERS/8.png','/uploads/PAWS & PARTNERS/9.png']
  },
  9:  {
    cover: '/uploads/A Fusion of Art and Elegance  Living room/14.webp',
    gallery: ['/uploads/A Fusion of Art and Elegance  Living room/14.webp','/uploads/A Fusion of Art and Elegance  Living room/14a.webp','/uploads/A Fusion of Art and Elegance  Living room/14b.webp','/uploads/A Fusion of Art and Elegance  Living room/14c.webp']
  },
  10: {
    cover: '/uploads/ALULAH/Image38.png',
    gallery: ['/uploads/ALULAH/Image38.png','/uploads/ALULAH/Image39.png','/uploads/ALULAH/Image40.png','/uploads/ALULAH/Image43.png','/uploads/ALULAH/Image44.png']
  },
  11: {
    cover: '/uploads/CLASSIC BEDROOM/1.webp',
    gallery: ['/uploads/CLASSIC BEDROOM/1.webp','/uploads/CLASSIC BEDROOM/2.webp','/uploads/CLASSIC BEDROOM/3.webp','/uploads/CLASSIC BEDROOM/4.webp']
  },
  12: {
    cover: '/uploads/H & P/2.webp',
    gallery: ['/uploads/H & P/2.webp','/uploads/H & P/3.webp','/uploads/H & P/4.webp','/uploads/H & P/5.webp','/uploads/H & P/6.webp','/uploads/H & P/7.webp','/uploads/H & P/8.webp']
  },
  13: {
    cover: '/uploads/Half million/1.jpg',
    gallery: ['/uploads/Half million/1.jpg','/uploads/Half million/2A.jpg']
  },
  14: {
    cover: '/uploads/Modern LuxuryLiving room/1.webp',
    gallery: ['/uploads/Modern LuxuryLiving room/1.webp','/uploads/Modern LuxuryLiving room/2.webp','/uploads/Modern LuxuryLiving room/3.webp','/uploads/Modern LuxuryLiving room/11 cave.webp']
  },
  15: {
    cover: '/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/2.png',
    gallery: ['/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/2.png','/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/4.png','/uploads/QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT/7.png']
  },
  16: {
    cover: '/uploads/Oasis/Image1.webp',
    gallery: ['/uploads/Oasis/Image1.webp','/uploads/Oasis/imag4.webp','/uploads/Oasis/image2.jpg','/uploads/Oasis/image3.webp','/uploads/Oasis/image4.webp']
  },
  17: {
    cover: '/uploads/ALMajid/Cover.webp',
    gallery: ['/uploads/ALMajid/Cover.webp','/uploads/ALMajid/img1.webp','/uploads/ALMajid/img2.webp','/uploads/ALMajid/img3.webp','/uploads/ALMajid/img4.webp','/uploads/ALMajid/img5.webp']
  },
  18: {
    cover: '/uploads/HERITAGE Day/Cover.webp',
    gallery: ['/uploads/HERITAGE Day/Cover.webp','/uploads/HERITAGE Day/img1.webp','/uploads/HERITAGE Day/img2.webp','/uploads/HERITAGE Day/img3.webp','/uploads/HERITAGE Day/img4.webp','/uploads/HERITAGE Day/img5.webp','/uploads/HERITAGE Day/img6.webp','/uploads/HERITAGE Day/img8.webp','/uploads/HERITAGE Day/img9.webp','/uploads/HERITAGE Day/img10.webp','/uploads/HERITAGE Day/img12.webp','/uploads/HERITAGE Day/img13.webp','/uploads/HERITAGE Day/img14.webp','/uploads/HERITAGE Day/img15.webp','/uploads/HERITAGE Day/img16.webp']
  },
  19: {
    cover: '/uploads/ALFUNDATIONDay/Cover.webp',
    gallery: ['/uploads/ALFUNDATIONDay/Cover.webp','/uploads/ALFUNDATIONDay/img1.webp','/uploads/ALFUNDATIONDay/img2.webp','/uploads/ALFUNDATIONDay/img3.webp','/uploads/ALFUNDATIONDay/img4.webp','/uploads/ALFUNDATIONDay/img5.webp','/uploads/ALFUNDATIONDay/img6.webp','/uploads/ALFUNDATIONDay/img7.webp']
  },
  20: {
    cover: '/uploads/Diriyah Gate Development Authority/img1.webp',
    gallery: ['/uploads/Diriyah Gate Development Authority/img1.webp','/uploads/Diriyah Gate Development Authority/img2.webp','/uploads/Diriyah Gate Development Authority/img3.webp','/uploads/Diriyah Gate Development Authority/img4.webp','/uploads/Diriyah Gate Development Authority/img5.webp','/uploads/Diriyah Gate Development Authority/img6.webp','/uploads/Diriyah Gate Development Authority/img7.webp','/uploads/Diriyah Gate Development Authority/img8.webp','/uploads/Diriyah Gate Development Authority/img9.webp','/uploads/Diriyah Gate Development Authority/img10.webp']
  },
  21: {
    cover: '/uploads/Luxe Residence/Cover.webp',
    gallery: ['/uploads/Luxe Residence/Cover.webp','/uploads/Luxe Residence/img1.webp','/uploads/Luxe Residence/img2.webp','/uploads/Luxe Residence/img3.webp']
  },
  22: {
    cover: '/uploads/Contemporary & luxury/6.webp',
    gallery: ['/uploads/Contemporary & luxury/6.webp','/uploads/Contemporary & luxury/6A.webp','/uploads/Contemporary & luxury/6B.webp','/uploads/Contemporary & luxury/6C.webp']
  },
  23: {
    cover: '/uploads/8. Coffee & Dates _ Lathama/3-Recovered.png',
    gallery: ['/uploads/8. Coffee & Dates _ Lathama/3-Recovered.png','/uploads/8. Coffee & Dates _ Lathama/5-Recovered.png','/uploads/8. Coffee & Dates _ Lathama/6-Recovered.png']
  },
  24: {
    cover: '/uploads/ApartmentA/1.png',
    gallery: ['/uploads/ApartmentA/1.png','/uploads/ApartmentA/2.png','/uploads/ApartmentA/5.png','/uploads/ApartmentA/6.png','/uploads/ApartmentA/27. Apartments A/1.png','/uploads/ApartmentA/27. Apartments A/2.png','/uploads/ApartmentA/27. Apartments A/5.png','/uploads/ApartmentA/27. Apartments A/6.png']
  },
  25: {
    cover: '/uploads/playGround/Image30.webp',
    gallery: ['/uploads/playGround/Image30.webp','/uploads/playGround/Image37.webp','/uploads/playGround/Image38.webp','/uploads/playGround/Image39.webp','/uploads/playGround/Image40.webp','/uploads/playGround/Image43.webp','/uploads/playGround/Image44.webp','/uploads/playGround/Image46.webp','/uploads/playGround/Image47.webp','/uploads/playGround/Image48.webp']
  },
  26: {
    cover: '/uploads/011/webp/Image36.webp',
    gallery: ['/uploads/011/webp/Image36.webp','/uploads/011/webp/Image37.webp','/uploads/011/webp/Image38.webp','/uploads/011/webp/Image391.webp','/uploads/011/webp/Image331.webp','/uploads/011/webp/Image40 (2).webp','/uploads/011/webp/Image41.webp']
  },
  // ID 27 = Lathama Apartment (duplicate title as 23, but keep — use same folder)
  27: {
    cover: '/uploads/8. Coffee & Dates _ Lathama/3-Recovered.png',
    gallery: ['/uploads/8. Coffee & Dates _ Lathama/3-Recovered.png','/uploads/8. Coffee & Dates _ Lathama/5-Recovered.png','/uploads/8. Coffee & Dates _ Lathama/6-Recovered.png']
  },
  // ID 28 = Apartment A (duplicate title as 24, but keep — use same folder)
  28: {
    cover: '/uploads/ApartmentA/1.png',
    gallery: ['/uploads/ApartmentA/1.png','/uploads/ApartmentA/2.png','/uploads/ApartmentA/5.png','/uploads/ApartmentA/6.png','/uploads/ApartmentA/27. Apartments A/1.png','/uploads/ApartmentA/27. Apartments A/2.png','/uploads/ApartmentA/27. Apartments A/5.png','/uploads/ApartmentA/27. Apartments A/6.png']
  },
  // ID 29 = School Refurbishment (duplicate title as 25, but keep — use same folder)
  29: {
    cover: '/uploads/playGround/Image30.webp',
    gallery: ['/uploads/playGround/Image30.webp','/uploads/playGround/Image37.webp','/uploads/playGround/Image38.webp','/uploads/playGround/Image39.webp','/uploads/playGround/Image40.webp','/uploads/playGround/Image43.webp','/uploads/playGround/Image44.webp','/uploads/playGround/Image46.webp','/uploads/playGround/Image47.webp','/uploads/playGround/Image48.webp']
  },
  // ID 30 = Al Bujairi Dining - Tent (duplicate title as 26, but keep — use same folder)
  30: {
    cover: '/uploads/011/webp/Image36.webp',
    gallery: ['/uploads/011/webp/Image36.webp','/uploads/011/webp/Image37.webp','/uploads/011/webp/Image38.webp','/uploads/011/webp/Image391.webp','/uploads/011/webp/Image331.webp','/uploads/011/webp/Image40 (2).webp','/uploads/011/webp/Image41.webp']
  },
  // ID 31 = Hospitality Station → coffeE folder (no Hospitality folder exists)
  31: {
    cover: '/uploads/coffeE/1aaa.jpg',
    gallery: ['/uploads/coffeE/1aaa.jpg','/uploads/coffeE/2a.jpg','/uploads/coffeE/3 no logo.jpg','/uploads/coffeE/8a.jpg','/uploads/coffeE/10 a.jpg']
  },
};

async function run() {
  // Fix cover + gallery for all projects (no deletions)
  console.log('Fixing cover images and galleries for all projects...');
  for (const [idStr, fix] of Object.entries(projectFixes)) {
    const id = parseInt(idStr);
    const galleryJson = JSON.stringify(fix.gallery);
    await db.execute({
      sql: 'UPDATE projects SET image = ?, gallery = ? WHERE id = ?',
      args: [fix.cover, galleryJson, id]
    });
    console.log(`  ID ${id}: ${fix.cover}`);
  }

  // Step 3: Verify final state
  console.log('\n=== FINAL STATE ===');
  const r = await db.execute('SELECT id, title, image FROM projects ORDER BY id');
  r.rows.forEach(row => {
    console.log(`  ID:${row[0]} | ${String(row[1]).substring(0,30)} | ${row[2]}`);
  });
  console.log(`\nTotal: ${r.rows.length} projects`);
}

run().catch(console.error);
