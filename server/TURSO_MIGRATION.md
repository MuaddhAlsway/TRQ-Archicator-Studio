# Turso Migration Guide

## Status
The server is being migrated from SQLite (better-sqlite3) to Turso (libsql).

## What's Done
✅ Created `db-wrapper.js` - Async wrapper for Turso API
✅ Updated imports in `index.js` to use wrapper
✅ Updated login route to use async/await
✅ Updated `routes-arabic.js` to use async/await
✅ Configured Turso credentials in `.env`

## What Needs to be Done

### Pattern to Convert
**Old (SQLite - Synchronous):**
```javascript
app.get('/api/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects').all();
  res.json(projects);
});
```

**New (Turso - Asynchronous):**
```javascript
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.all('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### Database Wrapper Methods
- `db.all(sql, params)` - Returns array of rows
- `db.get(sql, params)` - Returns single row or null
- `db.run(sql, params)` - Returns { lastInsertRowid, changes }
- `db.exec(sql)` - Execute multiple statements

### Routes to Convert (in order of priority)

1. **GET endpoints** (read-only, easier to test)
   - `/api/projects`
   - `/api/projects/published`
   - `/api/services`
   - `/api/articles`
   - `/api/slides`
   - `/api/settings`

2. **POST endpoints** (create operations)
   - `/api/projects`
   - `/api/services`
   - `/api/articles`
   - `/api/slides`

3. **PUT endpoints** (update operations)
   - `/api/projects/:id`
   - `/api/services/:id`
   - `/api/articles/:id`
   - `/api/slides/:id`
   - `/api/settings`

4. **DELETE endpoints** (delete operations)
   - `/api/projects/:id`
   - `/api/services/:id`
   - `/api/articles/:id`
   - `/api/slides/:id`

5. **Complex routes** (with multiple queries)
   - `/api/contacts/:id/reply`
   - `/api/pricing/:id/send-quote`
   - `/api/newsletter/send`

## Testing
After converting each route:
1. Test with Postman or curl
2. Verify data is saved to Turso
3. Verify data is retrieved correctly

## Rollback
If needed, the original file is backed up as `index.js.backup`
