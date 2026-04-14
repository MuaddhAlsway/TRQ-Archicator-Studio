import db from './server/database.js';

console.log('Current services:');
const services = db.prepare('SELECT id, title FROM services ORDER BY id').all();
services.forEach(s => {
  console.log(`  ${s.id}. ${s.title}`);
});

// Find and update "Furniture Design" to "Custom Design"
const furnitureService = db.prepare('SELECT id FROM services WHERE title = ?').get('Furniture Design');

if (furnitureService) {
  db.prepare('UPDATE services SET title = ? WHERE id = ?').run('Custom Design', furnitureService.id);
  console.log(`\n✓ Updated service ${furnitureService.id}: "Furniture Design" → "Custom Design"`);
} else {
  console.log('\n✗ "Furniture Design" service not found');
}

console.log('\nUpdated services:');
const updated = db.prepare('SELECT id, title FROM services ORDER BY id').all();
updated.forEach(s => {
  console.log(`  ${s.id}. ${s.title}`);
});
