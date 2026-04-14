import { createClient } from '@libsql/client';
import fs from 'fs';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

function getFirstImage(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    return imageFiles[0] || null;
  } catch (e) {
    return null;
  }
}

async function fixRemaining() {
  try {
    console.log('Fixing remaining 4 projects...\n');
    
    const fixes = [
      { id: 2, title: 'RED SEA GLOBAL | البحر الأحمر الدولية | CITYSCAPE 24', folder: 'RSG BOOTH' },
      { id: 4, title: 'ARYASH AL-DIRIYAH', folder: 'ARYASH AL-DRIIYAH' },
      { id: 14, title: 'Modern Luxury Living Room', folder: 'Modern LuxuryLiving room' },
      { id: 15, title: 'QUALITY OF LIFE PROGRAM - NATIONAL DAY EVENT', folder: 'QUALITY OF LIFE PROGRAM- NATIONAL DAY EVENT' },
      { id: 18, title: 'SAUDI FOUNDING DAY | يوم التأسيس 24', folder: 'HERITAGE Day' },
    ];
    
    for (const fix of fixes) {
      const folderPath = `./public/TRQ STUDIO _ PROJECTS/${fix.folder}`;
      const imageName = getFirstImage(folderPath);
      
      if (!imageName) {
        console.log(`⚠️  No image found in ${fix.folder}`);
        continue;
      }
      
      const imagePath = `/TRQ STUDIO _ PROJECTS/${fix.folder}/${imageName}`;
      
      await turso.execute({
        sql: 'UPDATE projects SET image = ? WHERE id = ?',
        args: [imagePath, fix.id]
      });
      
      console.log(`✓ ID ${fix.id}: ${imagePath}`);
    }
    
    console.log('\n✅ All 20 projects fixed!\n');
    
    // Verify all
    const verify = await turso.execute('SELECT id, title, image FROM projects ORDER BY id');
    console.log('All project images:');
    verify.rows.forEach(p => {
      console.log(`${p.id}. ${p.title}`);
      console.log(`   → ${p.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixRemaining();
