# Data Migration Guide - SQLite to D1

## Overview

This guide walks you through migrating your existing data from the Render SQLite database to Cloudflare D1.

---

## Step 1: Export Data from Current SQLite

### Option A: Export via CLI (Recommended)

```bash
# Navigate to server directory
cd server

# Export all tables
sqlite3 trq.db ".dump" > ../backup.sql

# Or export specific tables
sqlite3 trq.db ".dump projects" > ../projects.sql
sqlite3 trq.db ".dump hero_slides" > ../slides.sql
sqlite3 trq.db ".dump services" > ../services.sql
sqlite3 trq.db ".dump settings" > ../settings.sql
sqlite3 trq.db ".dump blog_articles" > ../articles.sql
```

### Option B: Export via Node.js

```javascript
// export-data.js
import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('server/trq.db');

const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];

for (const table of tables) {
  const data = db.prepare(`SELECT * FROM ${table}`).all();
  fs.writeFileSync(`${table}.json`, JSON.stringify(data, null, 2));
  console.log(`✓ Exported ${table}: ${data.length} rows`);
}

db.close();
```

Run: `node export-data.js`

---

## Step 2: Clean Data for D1

D1 has some differences from SQLite. Clean your data:

```javascript
// clean-data.js
import fs from 'fs';

const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];

for (const table of tables) {
  const data = JSON.parse(fs.readFileSync(`${table}.json`, 'utf-8'));
  
  // Remove auto-increment IDs (D1 will generate new ones)
  // Keep them if you want to preserve IDs
  
  // Ensure JSON fields are strings
  if (table === 'projects') {
    data.forEach(row => {
      row.features = typeof row.features === 'string' ? row.features : JSON.stringify(row.features || []);
      row.materials = typeof row.materials === 'string' ? row.materials : JSON.stringify(row.materials || []);
      row.awards = typeof row.awards === 'string' ? row.awards : JSON.stringify(row.awards || []);
      row.team = typeof row.team === 'string' ? row.team : JSON.stringify(row.team || []);
      row.gallery = typeof row.gallery === 'string' ? row.gallery : JSON.stringify(row.gallery || []);
    });
  }
  
  fs.writeFileSync(`${table}-clean.json`, JSON.stringify(data, null, 2));
  console.log(`✓ Cleaned ${table}`);
}
```

Run: `node clean-data.js`

---

## Step 3: Create SQL Insert Statements

```javascript
// generate-inserts.js
import fs from 'fs';

function generateInserts(table, data) {
  if (data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const columnList = columns.join(', ');
  
  const values = data.map(row => {
    const vals = columns.map(col => {
      const val = row[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      if (typeof val === 'boolean') return val ? '1' : '0';
      return val;
    });
    return `(${vals.join(', ')})`;
  }).join(',\n  ');
  
  return `INSERT INTO ${table} (${columnList}) VALUES\n  ${values};\n`;
}

const tables = ['projects', 'hero_slides', 'services', 'settings', 'blog_articles'];
let allInserts = '';

for (const table of tables) {
  const data = JSON.parse(fs.readFileSync(`${table}-clean.json`, 'utf-8'));
  allInserts += generateInserts(table, data);
}

fs.writeFileSync('migration-inserts.sql', allInserts);
console.log('✓ Generated migration-inserts.sql');
```

Run: `node generate-inserts.js`

---

## Step 4: Run Migration on D1

### Option A: Direct SQL File

```bash
# First, run the schema
wrangler d1 execute trq-db --file migrations/001_init_schema.sql

# Then, run the data inserts
wrangler d1 execute trq-db --file migration-inserts.sql
```

### Option B: Batch Insert (for large datasets)

```bash
# Split large files
split -l 1000 migration-inserts.sql migration-part-

# Run each part
for file in migration-part-*; do
  wrangler d1 execute trq-db --file "$file"
  echo "✓ Imported $file"
done
```

---

## Step 5: Verify Migration

```bash
# Check row counts
wrangler d1 execute trq-db --command "SELECT 'projects' as table_name, COUNT(*) as count FROM projects UNION ALL SELECT 'hero_slides', COUNT(*) FROM hero_slides UNION ALL SELECT 'services', COUNT(*) FROM services UNION ALL SELECT 'settings', COUNT(*) FROM settings UNION ALL SELECT 'blog_articles', COUNT(*) FROM blog_articles"

# Check specific data
wrangler d1 execute trq-db --command "SELECT * FROM projects LIMIT 1"

# Verify indexes
wrangler d1 execute trq-db --command "SELECT * FROM sqlite_master WHERE type='index'"
```

---

## Step 6: Test API Endpoints

```bash
# Test projects endpoint
curl https://your-worker.workers.dev/api/projects

# Test specific project
curl https://your-worker.workers.dev/api/projects/1

# Test settings
curl https://your-worker.workers.dev/api/settings

# Test slides
curl https://your-worker.workers.dev/api/slides/active
```

---

## Step 7: Handle R2 Media Files

### Option A: Copy from Local Storage

```bash
# Upload all files from public folder to R2
for file in public/**/*; do
  if [ -f "$file" ]; then
    wrangler r2 object put trq-media "$file" --file "$file"
    echo "✓ Uploaded $file"
  fi
done
```

### Option B: Update Database with R2 URLs

If your database has local file paths, update them to R2 URLs:

```javascript
// update-media-urls.js
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('projects-clean.json', 'utf-8'));

data.forEach(project => {
  // Update image paths
  if (project.image && project.image.startsWith('/public/')) {
    project.image = `https://media.trq.design/${project.image.replace('/public/', '')}`;
  }
  
  // Update gallery paths
  if (project.gallery) {
    const gallery = JSON.parse(project.gallery);
    gallery.forEach(img => {
      if (img.startsWith('/public/')) {
        img = `https://media.trq.design/${img.replace('/public/', '')}`;
      }
    });
    project.gallery = JSON.stringify(gallery);
  }
});

fs.writeFileSync('projects-updated.json', JSON.stringify(data, null, 2));
console.log('✓ Updated media URLs');
```

---

## Step 8: Verify Everything Works

### Test Admin Login
```bash
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"trq2026"}'
```

### Test Protected Route
```bash
# Get token from login response
TOKEN="your-token-here"

curl https://your-worker.workers.dev/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

### Test Create/Update
```bash
curl -X POST https://your-worker.workers.dev/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "category": "Design",
    "description": "Test",
    "status": "published"
  }'
```

---

## Troubleshooting

### "Column not found" Error
- Check column names match exactly
- Verify schema was created: `wrangler d1 execute trq-db --command "PRAGMA table_info(projects)"`

### "Constraint violation" Error
- Check for duplicate IDs
- Verify foreign key constraints
- Check UNIQUE constraints on slug fields

### "File too large" Error
- Split SQL file into smaller chunks
- Use batch import approach

### Data Not Appearing
- Verify insert statements ran successfully
- Check row counts: `SELECT COUNT(*) FROM projects`
- Check for errors in logs: `wrangler tail`

---

## Rollback Plan

If something goes wrong:

```bash
# Delete and recreate database
wrangler d1 delete trq-db
wrangler d1 create trq-db

# Re-run migrations
wrangler d1 execute trq-db --file migrations/001_init_schema.sql
wrangler d1 execute trq-db --file migration-inserts.sql
```

---

## Performance Tips

1. **Batch Inserts**: Group multiple rows in single INSERT
2. **Disable Indexes**: Drop indexes before bulk insert, recreate after
3. **Use Transactions**: Wrap inserts in BEGIN/COMMIT
4. **Verify Indexes**: Ensure all indexes are created

---

## Complete Migration Script

```bash
#!/bin/bash

echo "🚀 Starting D1 Migration..."

# Step 1: Export data
echo "📤 Exporting data from SQLite..."
cd server
sqlite3 trq.db ".dump" > ../backup.sql
cd ..

# Step 2: Create schema
echo "📋 Creating D1 schema..."
wrangler d1 execute trq-db --file migrations/001_init_schema.sql

# Step 3: Import data
echo "📥 Importing data to D1..."
wrangler d1 execute trq-db --file backup.sql

# Step 4: Verify
echo "✅ Verifying migration..."
wrangler d1 execute trq-db --command "SELECT COUNT(*) as total_projects FROM projects"

echo "✨ Migration complete!"
```

Save as `migrate.sh` and run: `bash migrate.sh`

---

## Next Steps

1. ✅ Export data from SQLite
2. ✅ Create D1 database
3. ✅ Run migrations
4. ✅ Import data
5. ✅ Verify data integrity
6. ✅ Upload media to R2
7. ✅ Test all endpoints
8. ✅ Update frontend API URL
9. ✅ Deploy Worker
10. ✅ Monitor performance

