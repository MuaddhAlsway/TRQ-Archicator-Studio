import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

async function fixHeroSlidesOrder() {
  try {
    console.log('Fixing hero slides to correct order...\n');
    
    // Current order:
    // ID 1: Featured Projects
    // ID 2: Luxury Living Spaces
    // ID 3: Inspiring Workspaces
    // ID 4: Refined Interiors
    // ID 5: Elevating Spaces, Defining Luxury
    
    // Desired order:
    // ID 1: Elevating Spaces, Defining Luxury (currently ID 5)
    // ID 2: Refined Interiors (currently ID 4)
    // ID 3: Inspiring Workspaces (currently ID 3) - no change
    // ID 4: Luxury Living Spaces (currently ID 2)
    // ID 5: Featured Projects (currently ID 1)
    
    console.log('Step 1: Move ID 1 (Featured Projects) to temp 101...');
    await turso.execute('UPDATE hero_slides SET id = 101 WHERE id = 1');
    
    console.log('Step 2: Move ID 2 (Luxury Living Spaces) to temp 102...');
    await turso.execute('UPDATE hero_slides SET id = 102 WHERE id = 2');
    
    console.log('Step 3: Move ID 4 (Refined Interiors) to temp 104...');
    await turso.execute('UPDATE hero_slides SET id = 104 WHERE id = 4');
    
    console.log('Step 4: Move ID 5 (Elevating Spaces) to ID 1...');
    await turso.execute('UPDATE hero_slides SET id = 1 WHERE id = 5');
    
    console.log('Step 5: Move temp 104 (Refined Interiors) to ID 2...');
    await turso.execute('UPDATE hero_slides SET id = 2 WHERE id = 104');
    
    console.log('Step 6: Move temp 102 (Luxury Living Spaces) to ID 4...');
    await turso.execute('UPDATE hero_slides SET id = 4 WHERE id = 102');
    
    console.log('Step 7: Move temp 101 (Featured Projects) to ID 5...');
    await turso.execute('UPDATE hero_slides SET id = 5 WHERE id = 101');
    
    console.log('\n✅ Order fixed!\n');
    
    // Verify
    console.log('Verifying final order:');
    const verifyResult = await turso.execute('SELECT id, title FROM hero_slides ORDER BY id ASC');
    verifyResult.rows.forEach(row => {
      console.log(`  ID ${row[0]}: ${row[1]}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixHeroSlidesOrder();
