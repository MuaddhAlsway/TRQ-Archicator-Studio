# Turso Conversion Template

## Quick Reference

### Pattern 1: Simple GET (Read)
```javascript
// OLD (SQLite)
app.get('/api/items', (req, res) => {
  const items = db.prepare('SELECT * FROM items').all();
  res.json(items);
});

// NEW (Turso)
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.all('SELECT * FROM items');
    res.json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### Pattern 2: GET with Parameter
```javascript
// OLD
app.get('/api/items/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ message: 'Not found' });
});

// NEW
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await db.get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Not found' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### Pattern 3: POST (Create)
```javascript
// OLD
app.post('/api/items', authenticateToken, (req, res) => {
  const { name, value } = req.body;
  const result = db.prepare('INSERT INTO items (name, value) VALUES (?, ?)').run(name, value);
  const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
  res.json(newItem);
});

// NEW
app.post('/api/items', authenticateToken, async (req, res) => {
  try {
    const { name, value } = req.body;
    const result = await db.run('INSERT INTO items (name, value) VALUES (?, ?)', [name, value]);
    const newItem = await db.get('SELECT * FROM items WHERE id = ?', [result.lastInsertRowid]);
    res.json(newItem);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### Pattern 4: PUT (Update)
```javascript
// OLD
app.put('/api/items/:id', authenticateToken, (req, res) => {
  const { name, value } = req.body;
  db.prepare('UPDATE items SET name = ?, value = ? WHERE id = ?').run(name, value, req.params.id);
  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// NEW
app.put('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const { name, value } = req.body;
    await db.run('UPDATE items SET name = ?, value = ? WHERE id = ?', [name, value, req.params.id]);
    const updated = await db.get('SELECT * FROM items WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### Pattern 5: DELETE
```javascript
// OLD
app.delete('/api/items/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// NEW
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

## Key Changes
1. Add `async` to route handler
2. Add `await` before db calls
3. Wrap in try/catch
4. Change `db.prepare().all()` → `await db.all()`
5. Change `db.prepare().get()` → `await db.get()`
6. Change `db.prepare().run()` → `await db.run()`
7. Change `args: [...]` → second parameter `[...]`
8. Add error handling with 500 response

## Remaining Routes to Convert
- [ ] /api/contacts (GET, POST, PUT)
- [ ] /api/pricing (GET, POST, PUT)
- [ ] /api/services (GET, POST, PUT, DELETE)
- [ ] /api/articles (GET, POST, PUT, DELETE)
- [ ] /api/slides (GET, POST, PUT, DELETE)
- [ ] /api/settings (GET, PUT)
- [ ] /api/newsletter/* (GET, POST)
- [ ] /api/auth/* (forgot-password, reset-password, change-password, update-email)
- [ ] /api/contacts/:id/reply
- [ ] /api/pricing/:id/send-quote
- [ ] /api/newsletter/send
