/**
 * Cloudflare Workers API — full admin + public routes via Turso
 */

const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

async function parseJson(req) {
  try { return await req.json(); } catch { return null; }
}

// ── Turso HTTP query ──────────────────────────────────────────────────────────
async function q(sql, params = [], token) {
  const args = params.map(p => {
    if (p === null || p === undefined) return { type: 'null' };
    if (typeof p === 'number') return { type: 'integer', value: String(p) };
    return { type: 'text', value: String(p) };
  });

  const res = await fetch(TURSO_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql, args } }] }),
  });

  if (!res.ok) throw new Error(`Turso ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const result = data.results?.[0]?.response?.result;
  if (!result) return [];
  const cols = result.cols || [];
  return (result.rows || []).map(row => {
    const obj = {};
    cols.forEach((c, i) => { obj[c.name] = row[i]?.value ?? null; });
    return obj;
  });
}

// last insert id
async function qInsert(sql, params, token) {
  const args = params.map(p => {
    if (p === null || p === undefined) return { type: 'null' };
    if (typeof p === 'number') return { type: 'integer', value: String(p) };
    return { type: 'text', value: String(p) };
  });
  const res = await fetch(TURSO_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql, args } }] }),
  });
  if (!res.ok) throw new Error(`Turso ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.results?.[0]?.response?.result?.last_insert_rowid ?? null;
}

// ── Image path normalisation ──────────────────────────────────────────────────
function toRootRelative(p) {
  if (!p || typeof p !== 'string') return p;
  if (p.startsWith('http://') || p.startsWith('https://')) {
    try { return new URL(p).pathname; } catch { return p; }
  }
  return p.startsWith('/') ? p : `/${p}`;
}

function processImagePaths(obj) {
  if (Array.isArray(obj)) return obj.map(processImagePaths);
  if (obj && typeof obj === 'object') {
    const o = { ...obj };
    if (o.image) o.image = toRootRelative(o.image);
    if (o.gallery && typeof o.gallery === 'string') {
      try { o.gallery = JSON.stringify(JSON.parse(o.gallery).map(toRootRelative)); } catch {}
    }
    return o;
  }
  return obj;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────
function makeToken() { return 'jwt-token-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11); }
function validToken(h) { return h && h.startsWith('Bearer jwt-token-'); }
function authError() { return json({ success: false, error: 'Unauthorized' }, 401); }

// ── Main handler ──────────────────────────────────────────────────────────────
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  const TOKEN = env?.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';
  const authHeader = request.headers.get('Authorization') || '';

  try {

    // ── HEALTH ──────────────────────────────────────────────────────────────
    if (path === '/api/health') return json({ status: 'ok', timestamp: new Date().toISOString() });

    // ── AUTH ────────────────────────────────────────────────────────────────
    if (path === '/api/auth/login' && method === 'POST') {
      const b = await parseJson(request);
      if (b?.username === 'admin' && b?.password === 'trq2026') {
        return json({ success: true, accessToken: makeToken(), refreshToken: makeToken(), expiresIn: 3600, user: { id: 1, username: 'admin', email: 'admin@trq.design' } });
      }
      return json({ success: false, error: 'Invalid credentials' }, 401);
    }

    if (path === '/api/auth/verify' && method === 'GET') {
      if (!validToken(authHeader)) return authError();
      return json({ success: true, user: { id: 1, username: 'admin' } });
    }

    if (path === '/api/auth/refresh' && method === 'POST') {
      return json({ success: true, accessToken: makeToken(), expiresIn: 3600 });
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      return json({ success: true });
    }

    // ── PROJECTS ────────────────────────────────────────────────────────────
    if (path === '/api/projects' && method === 'GET') {
      const rows = await q('SELECT * FROM projects ORDER BY id ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/projects/published' && method === 'GET') {
      const rows = await q("SELECT * FROM projects WHERE status='published' ORDER BY id ASC", [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/projects' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      const id = await qInsert(
        `INSERT INTO projects (title,category,subcategory,description,image,year,location,client,size,duration,detailedDescription,challenge,solution,features,materials,awards,team,gallery,clientQuote,clientName,status,title_ar,category_ar,subcategory_ar,description_ar,location_ar,client_ar,size_ar,duration_ar,detailedDescription_ar,challenge_ar,solution_ar,features_ar,materials_ar,awards_ar,team_ar,clientQuote_ar,clientName_ar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [b.title,b.category,b.subcategory||'',b.description||'',b.image||'',b.year||'',b.location||'',b.client||'',b.size||'',b.duration||'',b.detailedDescription||'',b.challenge||'',b.solution||'',JSON.stringify(b.features||[]),JSON.stringify(b.materials||[]),JSON.stringify(b.awards||[]),JSON.stringify(b.team||[]),JSON.stringify(b.gallery||[]),b.clientQuote||'',b.clientName||'',b.status||'draft',b.title_ar||'',b.category_ar||'',b.subcategory_ar||'',b.description_ar||'',b.location_ar||'',b.client_ar||'',b.size_ar||'',b.duration_ar||'',b.detailedDescription_ar||'',b.challenge_ar||'',b.solution_ar||'',b.features_ar||'[]',b.materials_ar||'[]',b.awards_ar||'[]',b.team_ar||'[]',b.clientQuote_ar||'',b.clientName_ar||''],
        TOKEN
      );
      const rows = await q('SELECT * FROM projects WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/projects\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      const rows = await q('SELECT * FROM projects WHERE id=?', [parseInt(id)], TOKEN);
      if (!rows.length) return json({ error: 'Not found' }, 404);
      return json(processImagePaths(rows[0]));
    }
    if (path.match(/^\/api\/projects\/\d+$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      const b = await parseJson(request);
      await q(
        `UPDATE projects SET title=?,category=?,subcategory=?,description=?,image=?,year=?,location=?,client=?,size=?,duration=?,detailedDescription=?,challenge=?,solution=?,features=?,materials=?,awards=?,team=?,gallery=?,clientQuote=?,clientName=?,status=?,title_ar=?,category_ar=?,subcategory_ar=?,description_ar=?,location_ar=?,client_ar=?,size_ar=?,duration_ar=?,detailedDescription_ar=?,challenge_ar=?,solution_ar=?,features_ar=?,materials_ar=?,awards_ar=?,team_ar=?,clientQuote_ar=?,clientName_ar=? WHERE id=?`,
        [b.title,b.category,b.subcategory||'',b.description||'',b.image||'',b.year||'',b.location||'',b.client||'',b.size||'',b.duration||'',b.detailedDescription||'',b.challenge||'',b.solution||'',typeof b.features==='string'?b.features:JSON.stringify(b.features||[]),typeof b.materials==='string'?b.materials:JSON.stringify(b.materials||[]),typeof b.awards==='string'?b.awards:JSON.stringify(b.awards||[]),typeof b.team==='string'?b.team:JSON.stringify(b.team||[]),typeof b.gallery==='string'?b.gallery:JSON.stringify(b.gallery||[]),b.clientQuote||'',b.clientName||'',b.status||'draft',b.title_ar||'',b.category_ar||'',b.subcategory_ar||'',b.description_ar||'',b.location_ar||'',b.client_ar||'',b.size_ar||'',b.duration_ar||'',b.detailedDescription_ar||'',b.challenge_ar||'',b.solution_ar||'',b.features_ar||'[]',b.materials_ar||'[]',b.awards_ar||'[]',b.team_ar||'[]',b.clientQuote_ar||'',b.clientName_ar||'',id],
        TOKEN
      );
      const rows = await q('SELECT * FROM projects WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/projects\/\d+$/) && method === 'DELETE') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      await q('DELETE FROM projects WHERE id=?', [id], TOKEN);
      return json({ success: true });
    }

    // ── SERVICES ────────────────────────────────────────────────────────────
    if (path === '/api/services' && method === 'GET') {
      const rows = await q('SELECT * FROM services ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/services/active' && method === 'GET') {
      const rows = await q('SELECT * FROM services WHERE isActive=1 ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/services' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      const id = await qInsert(
        'INSERT INTO services (title,description,image,icon,features,sortOrder,isActive,title_ar,description_ar,features_ar) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [b.title,b.description||'',b.image||'',b.icon||'Briefcase',JSON.stringify(b.features||[]),b.sortOrder||0,b.isActive??1,b.title_ar||'',b.description_ar||'',b.features_ar||'[]'],
        TOKEN
      );
      const rows = await q('SELECT * FROM services WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/services\/\d+$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      const b = await parseJson(request);
      await q(
        'UPDATE services SET title=?,description=?,image=?,icon=?,features=?,sortOrder=?,isActive=?,title_ar=?,description_ar=?,features_ar=? WHERE id=?',
        [b.title,b.description||'',b.image||'',b.icon||'Briefcase',JSON.stringify(b.features||[]),b.sortOrder||0,b.isActive??1,b.title_ar||'',b.description_ar||'',b.features_ar||'[]',id],
        TOKEN
      );
      return json({ success: true });
    }
    if (path.match(/^\/api\/services\/\d+$/) && method === 'DELETE') {
      if (!validToken(authHeader)) return authError();
      await q('DELETE FROM services WHERE id=?', [parseInt(path.split('/').pop())], TOKEN);
      return json({ success: true });
    }

    // ── HERO SLIDES ─────────────────────────────────────────────────────────
    if (path === '/api/slides' && method === 'GET') {
      const rows = await q('SELECT * FROM hero_slides ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/slides/active' && method === 'GET') {
      const rows = await q('SELECT * FROM hero_slides WHERE isActive=1 ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/slides' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      const id = await qInsert(
        `INSERT INTO hero_slides (tag,title,description,image,image_2,image_3,video,video_2,video_3,video_text,video_2_text,video_3_text,buttonPrimaryText,buttonPrimaryLink,buttonSecondaryText,buttonSecondaryLink,sortOrder,isActive,tag_ar,title_ar,description_ar,buttonPrimaryText_ar,buttonSecondaryText_ar,video_ar,video_2_ar,video_3_ar,video_text_ar,video_2_text_ar,video_3_text_ar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [b.tag||'',b.title||'',b.description||'',b.image||'',b.image_2||'',b.image_3||'',b.video||'',b.video_2||'',b.video_3||'',b.video_text||'',b.video_2_text||'',b.video_3_text||'',b.buttonPrimaryText||'VIEW PORTFOLIO',b.buttonPrimaryLink||'portfolio',b.buttonSecondaryText||'GET IN TOUCH',b.buttonSecondaryLink||'contact',b.sortOrder||0,b.isActive??1,b.tag_ar||'',b.title_ar||'',b.description_ar||'',b.buttonPrimaryText_ar||'',b.buttonSecondaryText_ar||'',b.video_ar||'',b.video_2_ar||'',b.video_3_ar||'',b.video_text_ar||'',b.video_2_text_ar||'',b.video_3_text_ar||''],
        TOKEN
      );
      const rows = await q('SELECT * FROM hero_slides WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/slides\/\d+$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      const b = await parseJson(request);
      await q(
        `UPDATE hero_slides SET tag=?,title=?,description=?,image=?,image_2=?,image_3=?,video=?,video_2=?,video_3=?,video_text=?,video_2_text=?,video_3_text=?,buttonPrimaryText=?,buttonPrimaryLink=?,buttonSecondaryText=?,buttonSecondaryLink=?,sortOrder=?,isActive=?,tag_ar=?,title_ar=?,description_ar=?,buttonPrimaryText_ar=?,buttonSecondaryText_ar=?,video_ar=?,video_2_ar=?,video_3_ar=?,video_text_ar=?,video_2_text_ar=?,video_3_text_ar=? WHERE id=?`,
        [b.tag||'',b.title||'',b.description||'',b.image||'',b.image_2||'',b.image_3||'',b.video||'',b.video_2||'',b.video_3||'',b.video_text||'',b.video_2_text||'',b.video_3_text||'',b.buttonPrimaryText||'VIEW PORTFOLIO',b.buttonPrimaryLink||'portfolio',b.buttonSecondaryText||'GET IN TOUCH',b.buttonSecondaryLink||'contact',b.sortOrder||0,b.isActive??1,b.tag_ar||'',b.title_ar||'',b.description_ar||'',b.buttonPrimaryText_ar||'',b.buttonSecondaryText_ar||'',b.video_ar||'',b.video_2_ar||'',b.video_3_ar||'',b.video_text_ar||'',b.video_2_text_ar||'',b.video_3_text_ar||'',id],
        TOKEN
      );
      const rows = await q('SELECT * FROM hero_slides WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/slides\/\d+$/) && method === 'DELETE') {
      if (!validToken(authHeader)) return authError();
      await q('DELETE FROM hero_slides WHERE id=?', [parseInt(path.split('/').pop())], TOKEN);
      return json({ success: true });
    }

    // ── ABOUT VIDEOS ────────────────────────────────────────────────────────
    if (path === '/api/about-videos' && method === 'GET') {
      try {
        await q(`CREATE TABLE IF NOT EXISTS about_videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          video_url TEXT NOT NULL,
          image TEXT,
          sortOrder INTEGER DEFAULT 0,
          isActive INTEGER DEFAULT 1,
          title_ar TEXT,
          description_ar TEXT,
          video_url_ar TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const rows = await q('SELECT * FROM about_videos ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/about-videos/active' && method === 'GET') {
      try {
        await q(`CREATE TABLE IF NOT EXISTS about_videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          video_url TEXT NOT NULL,
          image TEXT,
          sortOrder INTEGER DEFAULT 0,
          isActive INTEGER DEFAULT 1,
          title_ar TEXT,
          description_ar TEXT,
          video_url_ar TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const rows = await q('SELECT * FROM about_videos WHERE isActive=1 ORDER BY sortOrder ASC', [], TOKEN);
      return json(processImagePaths(rows));
    }
    if (path === '/api/about-videos' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      try {
        await q(`CREATE TABLE IF NOT EXISTS about_videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL, description TEXT, video_url TEXT NOT NULL,
          image TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1,
          title_ar TEXT, description_ar TEXT, video_url_ar TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const id = await qInsert(
        'INSERT INTO about_videos (title,description,video_url,image,sortOrder,isActive,title_ar,description_ar,video_url_ar) VALUES (?,?,?,?,?,?,?,?,?)',
        [b.title||'',b.description||'',b.video_url||'',b.image||'',b.sortOrder||0,b.isActive??1,b.title_ar||'',b.description_ar||'',b.video_url_ar||''],
        TOKEN
      );
      const rows = await q('SELECT * FROM about_videos WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/about-videos\/\d+$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      const b = await parseJson(request);
      await q(
        'UPDATE about_videos SET title=?,description=?,video_url=?,image=?,sortOrder=?,isActive=?,title_ar=?,description_ar=?,video_url_ar=? WHERE id=?',
        [b.title||'',b.description||'',b.video_url||'',b.image||'',b.sortOrder||0,b.isActive??1,b.title_ar||'',b.description_ar||'',b.video_url_ar||'',id],
        TOKEN
      );
      return json({ success: true });
    }
    if (path.match(/^\/api\/about-videos\/\d+$/) && method === 'DELETE') {
      if (!validToken(authHeader)) return authError();
      await q('DELETE FROM about_videos WHERE id=?', [parseInt(path.split('/').pop())], TOKEN);
      return json({ success: true });
    }

    // ── BLOG ARTICLES ────────────────────────────────────────────────────────
    if (path === '/api/articles' && method === 'GET') {
      try {
        await q(`CREATE TABLE IF NOT EXISTS blog_articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT,
          image TEXT,
          author TEXT,
          date TEXT,
          readTime TEXT,
          category TEXT,
          categorySlug TEXT,
          tags TEXT,
          status TEXT DEFAULT 'draft',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const rows = await q('SELECT * FROM blog_articles ORDER BY id DESC', [], TOKEN);
      return json(rows);
    }
    if (path === '/api/articles/published' && method === 'GET') {
      try {
        await q(`CREATE TABLE IF NOT EXISTS blog_articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT,
          image TEXT,
          author TEXT,
          date TEXT,
          readTime TEXT,
          category TEXT,
          categorySlug TEXT,
          tags TEXT,
          status TEXT DEFAULT 'draft',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const rows = await q("SELECT * FROM blog_articles WHERE status='published' ORDER BY id DESC", [], TOKEN);
      return json(rows);
    }
    if (path.match(/^\/api\/articles\/slug\//) && method === 'GET') {
      const slug = path.split('/').pop();
      const rows = await q('SELECT * FROM blog_articles WHERE slug=?', [slug], TOKEN);
      if (!rows.length) return json({ error: 'Not found' }, 404);
      return json(rows[0]);
    }
    if (path.match(/^\/api\/articles\/\d+$/) && method === 'GET') {
      const rows = await q('SELECT * FROM blog_articles WHERE id=?', [parseInt(path.split('/').pop())], TOKEN);
      if (!rows.length) return json({ error: 'Not found' }, 404);
      return json(rows[0]);
    }
    if (path === '/api/articles' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      try {
        await q(`CREATE TABLE IF NOT EXISTS blog_articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, excerpt TEXT,
          content TEXT, image TEXT, author TEXT, date TEXT, readTime TEXT,
          category TEXT, categorySlug TEXT, tags TEXT,
          status TEXT DEFAULT 'draft', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);
      } catch (_) {}
      const id = await qInsert(
        'INSERT INTO blog_articles (title,slug,excerpt,content,image,author,date,readTime,category,categorySlug,tags,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [b.title,b.slug,b.excerpt||'',b.content||'',b.image||'',b.author||'',b.date||'',b.readTime||'',b.category||'',b.categorySlug||'',typeof b.tags==='string'?b.tags:JSON.stringify(b.tags||[]),b.status||'draft'],
        TOKEN
      );
      const rows = await q('SELECT * FROM blog_articles WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/articles\/\d+$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/').pop());
      const b = await parseJson(request);
      await q(
        'UPDATE blog_articles SET title=?,slug=?,excerpt=?,content=?,image=?,author=?,date=?,readTime=?,category=?,categorySlug=?,tags=?,status=? WHERE id=?',
        [b.title,b.slug,b.excerpt||'',b.content||'',b.image||'',b.author||'',b.date||'',b.readTime||'',b.category||'',b.categorySlug||'',typeof b.tags==='string'?b.tags:JSON.stringify(b.tags||[]),b.status||'draft',id],
        TOKEN
      );
      const rows = await q('SELECT * FROM blog_articles WHERE id=?', [id], TOKEN);
      return json(rows[0] || { id });
    }
    if (path.match(/^\/api\/articles\/\d+$/) && method === 'DELETE') {
      if (!validToken(authHeader)) return authError();
      await q('DELETE FROM blog_articles WHERE id=?', [parseInt(path.split('/').pop())], TOKEN);
      return json({ success: true });
    }

    // ── SETTINGS ────────────────────────────────────────────────────────────
    if (path === '/api/settings' && method === 'GET') {
      const rows = await q('SELECT key, value FROM settings', [], TOKEN);
      const result = {};
      rows.forEach(r => { result[r.key] = r.value; });
      return json(result);
    }
    if (path === '/api/settings' && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      if (!b) return json({ error: 'Invalid body' }, 400);
      // Process entries in batches to avoid Turso rate limits
      const entries = Object.entries(b);
      for (const [key, value] of entries) {
        try {
          await q(
            'INSERT OR REPLACE INTO settings (key,value,updatedAt) VALUES (?,?,CURRENT_TIMESTAMP)',
            [String(key), value == null ? '' : String(value)],
            TOKEN
          );
        } catch (e) {
          // Skip individual key errors, continue saving others
          console.error('Settings key error:', key, e.message);
        }
      }
      return json({ success: true });
    }

    // ── CONTACTS ────────────────────────────────────────────────────────────
    if (path === '/api/contacts' && method === 'GET') {
      const rows = await q('SELECT * FROM contacts ORDER BY id DESC', [], TOKEN);
      return json(rows);
    }
    if (path === '/api/contacts' && method === 'POST') {
      const b = await parseJson(request);
      if (!b?.email) return json({ error: 'Email required' }, 400);
      const id = await qInsert(
        'INSERT INTO contacts (name,email,phone,subject,message,date,status) VALUES (?,?,?,?,?,?,?)',
        [b.name||'',b.email,b.phone||'',b.subject||'',b.message||'',new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),'new'],
        TOKEN
      );
      return json({ success: true, id });
    }
    if (path.match(/^\/api\/contacts\/\d+\/status$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/')[3]);
      const b = await parseJson(request);
      await q('UPDATE contacts SET status=? WHERE id=?', [b.status, id], TOKEN);
      return json({ success: true });
    }
    if (path.match(/^\/api\/contacts\/\d+\/reply$/) && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/')[3]);
      await q("UPDATE contacts SET status='replied' WHERE id=?", [id], TOKEN);
      return json({ success: true, message: 'Status updated to replied (email sending requires server)' });
    }

    // ── PRICING ─────────────────────────────────────────────────────────────
    if (path === '/api/pricing' && method === 'GET') {
      const rows = await q('SELECT * FROM pricing_requests ORDER BY id DESC', [], TOKEN);
      return json(rows);
    }
    if (path === '/api/pricing' && method === 'POST') {
      const b = await parseJson(request);
      if (!b?.email) return json({ error: 'Email required' }, 400);
      const id = await qInsert(
        'INSERT INTO pricing_requests (name,email,phone,company,projectType,location,budget,timeline,description,contactMethod,date,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [b.name||'',b.email,b.phone||'',b.company||'',b.projectType||'',b.location||'',b.budget||'',b.timeline||'',b.description||'',b.contactMethod||'',new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),'new'],
        TOKEN
      );
      return json({ success: true, id });
    }
    if (path.match(/^\/api\/pricing\/\d+\/status$/) && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/')[3]);
      const b = await parseJson(request);
      await q('UPDATE pricing_requests SET status=? WHERE id=?', [b.status, id], TOKEN);
      return json({ success: true });
    }
    if (path.match(/^\/api\/pricing\/\d+\/send-quote$/) && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      const id = parseInt(path.split('/')[3]);
      await q("UPDATE pricing_requests SET status='quoted' WHERE id=?", [id], TOKEN);
      return json({ success: true, message: 'Status updated to quoted (email requires server)' });
    }

    // ── NEWSLETTER ──────────────────────────────────────────────────────────
    if (path === '/api/newsletter/subscribe' && method === 'POST') {
      const b = await parseJson(request);
      if (!b?.email) return json({ error: 'Email required' }, 400);
      await q("INSERT OR IGNORE INTO newsletter_subscribers (email,status) VALUES (?,'active')", [b.email], TOKEN);
      return json({ success: true });
    }
    if (path === '/api/newsletter/unsubscribe' && method === 'POST') {
      const b = await parseJson(request);
      if (!b?.email) return json({ error: 'Email required' }, 400);
      await q("UPDATE newsletter_subscribers SET status='unsubscribed' WHERE email=?", [b.email], TOKEN);
      return json({ success: true });
    }
    if (path === '/api/newsletter/subscribers' && method === 'GET') {
      if (!validToken(authHeader)) return authError();
      const rows = await q('SELECT * FROM newsletter_subscribers ORDER BY id DESC', [], TOKEN);
      return json(rows);
    }
    if (path === '/api/newsletter/send' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      return json({ success: false, message: 'Email sending requires the Express server (not available in Worker)' });
    }

    // ── UPLOAD ──────────────────────────────────────────────────────────────
    // Stores file as base64 in Turso, serves it back via /api/uploads/:id
    if (path === '/api/upload' && method === 'POST') {
      if (!validToken(authHeader)) return authError();
      try {
        // Ensure uploads table exists
        await q(`CREATE TABLE IF NOT EXISTS uploads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL,
          mimetype TEXT NOT NULL,
          data TEXT NOT NULL,
          size INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], TOKEN);

        const formData = await request.formData();
        const file = formData.get('file');
        if (!file || typeof file === 'string') {
          return json({ success: false, message: 'No file provided' }, 400);
        }

        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        // Convert to base64
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        const mimetype = file.type || 'application/octet-stream';
        const filename = file.name || 'upload';
        const size = bytes.byteLength;

        // Validate type
        const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/ogg','video/quicktime'];
        if (!allowed.includes(mimetype)) {
          return json({ success: false, message: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV' }, 400);
        }

        // 50MB limit
        if (size > 50 * 1024 * 1024) {
          return json({ success: false, message: 'File too large. Maximum 50MB.' }, 400);
        }

        const id = await qInsert(
          'INSERT INTO uploads (filename, mimetype, data, size) VALUES (?, ?, ?, ?)',
          [filename, mimetype, base64, size],
          TOKEN
        );

        const url = `/api/uploads/${id}`;
        return json({ success: true, url, filename, size, mimetype });
      } catch (err) {
        console.error('Upload error:', err);
        return json({ success: false, message: 'Upload failed: ' + err.message }, 500);
      }
    }

    // ── SERVE UPLOADED FILES ─────────────────────────────────────────────────
    if (path.match(/^\/api\/uploads\/\d+$/) && method === 'GET') {
      try {
        const id = parseInt(path.split('/').pop());
        const rows = await q('SELECT filename, mimetype, data FROM uploads WHERE id=?', [id], TOKEN);
        if (!rows.length) return new Response('Not found', { status: 404 });
        const { filename, mimetype, data } = rows[0];
        const binary = atob(data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Response(bytes, {
          status: 200,
          headers: {
            'Content-Type': mimetype,
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'public, max-age=31536000',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err) {
        return new Response('Error serving file', { status: 500 });
      }
    }

    // ── COMPANY PROFILE ─────────────────────────────────────────────────────
    if (path === '/api/company-profile' && method === 'GET') {
      const rows = await q('SELECT * FROM company_profile_settings', [], TOKEN);
      return json(rows);
    }
    if (path === '/api/company-profile' && method === 'PUT') {
      if (!validToken(authHeader)) return authError();
      const b = await parseJson(request);
      await q(
        'INSERT OR REPLACE INTO company_profile_settings (language,url,title,description) VALUES (?,?,?,?)',
        [b.language||'en', b.url||'', b.title||'', b.description||''],
        TOKEN
      );
      return json({ success: true });
    }

    // ── 404 ─────────────────────────────────────────────────────────────────
    return json({ error: 'Not found', path }, 404);

  } catch (err) {
    console.error('Worker error:', err);
    return json({ error: 'Internal server error', message: err.message }, 500);
  }
}

export default { fetch: handleRequest };
