import db from './database.js';

// Get all projects ordered by current ID
const projects = db.prepare('SELECT id FROM projects ORDER BY id').all();

console.log(`Found ${projects.length} projects. Renumbering from 1 to ${projects.length}...\n`);

// Create a temporary mapping
const mapping = {};
projects.forEach((p, index) => {
  mapping[p.id] = index + 1;
});

console.log('Mapping:');
Object.entries(mapping).forEach(([oldId, newId]) => {
  console.log(`  ${oldId} → ${newId}`);
});

// Disable foreign key constraints temporarily
db.pragma('foreign_keys = OFF');

// Update all projects with new IDs
let updated = 0;
for (const [oldId, newId] of Object.entries(mapping)) {
  db.prepare('UPDATE projects SET id = ? WHERE id = ?').run(newId, oldId);
  updated++;
}

// Re-enable foreign key constraints
db.pragma('foreign_keys = ON');

console.log(`\n✓ Successfully renumbered ${updated} projects`);
console.log('Projects now use IDs from 1 to ' + projects.length);
