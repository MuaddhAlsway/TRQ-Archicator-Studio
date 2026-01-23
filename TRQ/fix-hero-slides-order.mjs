import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function fixHeroSlides() {
  try {
    console.log('Fetching current hero slides...');
    
    // Get all slides
    const result = await turso.execute('SELECT * FROM hero_slides ORDER BY id ASC');
    const slides = result.rows;
    
    console.log('Current slides:');
    slides.forEach(row => {
      console.log(`  ID ${row[0]}: ${row[2]}`);
    });
    
    console.log('\nSwapping slides: ID 1 ↔ ID 5...');
    
    // Get slide 1 and slide 5 data
    const slide1Result = await turso.execute('SELECT * FROM hero_slides WHERE id = 1');
    const slide5Result = await turso.execute('SELECT * FROM hero_slides WHERE id = 5');
    
    if (slide1Result.rows.length > 0 && slide5Result.rows.length > 0) {
      const slide1 = slide1Result.rows[0];
      const slide5 = slide5Result.rows[0];
      
      // Swap using temporary ID
      console.log('Step 1: Moving ID 1 to temporary ID 999...');
      await turso.execute('UPDATE hero_slides SET id = 999 WHERE id = 1');
      
      console.log('Step 2: Moving ID 5 to ID 1...');
      await turso.execute('UPDATE hero_slides SET id = 1 WHERE id = 5');
      
      console.log('Step 3: Moving temporary ID 999 to ID 5...');
      await turso.execute('UPDATE hero_slides SET id = 5 WHERE id = 999');
      
      console.log('\n✅ Swap complete!');
      
      // Verify
      console.log('\nVerifying new order:');
      const verifyResult = await turso.execute('SELECT id, title FROM hero_slides ORDER BY id ASC');
      verifyResult.rows.forEach(row => {
        console.log(`  ID ${row[0]}: ${row[1]}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixHeroSlides();
