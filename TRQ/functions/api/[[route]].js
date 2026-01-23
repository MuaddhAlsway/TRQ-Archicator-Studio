/**
 * Cloudflare Pages Functions - API Handler
 * Handles all API requests and connects to Turso database
 */

// Get environment variables
const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';

// Execute SQL query via Turso HTTP API
async function executeQuery(sql, params = [], token) {
  if (!token) {
    throw new Error('TURSO_AUTH_TOKEN not configured');
  }

  try {
    const response = await fetch(TURSO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: sql,
              args: params.map(p => ({ type: 'text', value: String(p) })),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Turso error:', response.status, errorText);
      throw new Error(`Turso error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract rows from Turso response
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const result = data.results[0];
      if (result.response && result.response.result && Array.isArray(result.response.result.rows)) {
        const cols = result.response.result.cols || [];
        const rows = result.response.result.rows || [];
        
        return rows.map(row => {
          const obj = {};
          cols.forEach((col, idx) => {
            const cell = row[idx];
            obj[col.name] = cell ? cell.value : null;
          });
          return obj;
        });
      }
    }
    
    return [];
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Helper to convert relative image paths to absolute URLs
function processImagePaths(obj, baseUrl = 'https://trq-studio.pages.dev') {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => processImagePaths(item, baseUrl));
  }
  
  if (typeof obj === 'object') {
    const processed = { ...obj };
    
    if (processed.image && typeof processed.image === 'string' && processed.image.startsWith('/')) {
      processed.image = `${baseUrl}${processed.image}`;
    }
    
    if (processed.gallery && typeof processed.gallery === 'string') {
      try {
        const gallery = JSON.parse(processed.gallery);
        processed.gallery = JSON.stringify(
          gallery.map(img => img.startsWith('/') ? `${baseUrl}${img}` : img)
        );
      } catch (e) {
        // If not valid JSON, leave as is
      }
    }
    
    return processed;
  }
  
  return obj;
}

// Handle preflight requests
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Parse JSON body
async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Main handler
export async function onRequest(context) {
  const request = context.request;
  const env = context.env;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  
  // Get token from environment
  const TURSO_AUTH_TOKEN = env?.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Health check
    if (pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { status: 200, headers: corsHeaders }
      );
    }

    // ============ AUTH ENDPOINTS ============
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJson(request);
      if (!body) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const { username, password } = body;
      
      if (username === 'admin' && password === 'trq2026') {
        const token = 'jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        return new Response(
          JSON.stringify({
            success: true,
            token,
            user: { id: 1, username: 'admin', email: 'admin@trq.design' }
          }),
          { status: 200, headers: corsHeaders }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { status: 401, headers: corsHeaders }
        );
      }
    }

    if (pathname === '/api/auth/verify' && method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ success: false, error: 'No token provided' }),
          { status: 401, headers: corsHeaders }
        );
      }

      const token = authHeader.substring(7);
      if (token.startsWith('jwt-token-')) {
        return new Response(
          JSON.stringify({ success: true, user: { id: 1, username: 'admin' } }),
          { status: 200, headers: corsHeaders }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid token' }),
          { status: 401, headers: corsHeaders }
        );
      }
    }

    // ============ PROJECTS ENDPOINTS ============
    if (pathname === '/api/projects' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM projects ORDER BY id DESC', [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }

    if (pathname === '/api/projects/published' && method === 'GET') {
      const rows = await executeQuery(
        "SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'GET') {
      const id = pathname.split('/').pop();
      const rows = await executeQuery(
        'SELECT * FROM projects WHERE id = ?',
        [parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }
      return new Response(JSON.stringify(processImagePaths(rows[0])), { status: 200, headers: corsHeaders });
    }

    // ============ SERVICES ENDPOINTS ============
    if (pathname === '/api/services' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM services ORDER BY id DESC', [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }

    if (pathname === '/api/services/active' && method === 'GET') {
      const rows = await executeQuery(
        'SELECT * FROM services WHERE isActive = 1 ORDER BY id DESC',
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }

    // ============ SLIDES ENDPOINTS ============
    if (pathname === '/api/slides' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM hero_slides ORDER BY id DESC', [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(processImagePaths(rows)), { status: 200, headers: corsHeaders });
    }

    if (pathname === '/api/slides/active' && method === 'GET') {
      const rows = await executeQuery(
        'SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY id DESC',
        [],
        TURSO_AUTH_TOKEN
      );
      const processedRows = rows.map(row => ({
        ...row,
        image: row.image && row.image.startsWith('/') 
          ? `https://trq-studio.pages.dev${row.image}`
          : row.image
      }));
      return new Response(JSON.stringify(processedRows), { status: 200, headers: corsHeaders });
    }

    // ============ SETTINGS ENDPOINT ============
    if (pathname === '/api/settings' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM settings LIMIT 1', [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows[0] || {}), { status: 200, headers: corsHeaders });
    }

    // ============ ARTICLES ENDPOINTS ============
    if (pathname === '/api/articles/published' && method === 'GET') {
      const rows = await executeQuery(
        "SELECT * FROM blog_articles WHERE status = 'published' ORDER BY created_at DESC",
        [],
        TURSO_AUTH_TOKEN
      );
      return new Response(JSON.stringify(rows), { status: 200, headers: corsHeaders });
    }

    if (pathname.match(/^\/api\/articles\/slug\//) && method === 'GET') {
      const slug = pathname.split('/').pop();
      const rows = await executeQuery(
        'SELECT * FROM blog_articles WHERE slug = ? AND status = ?',
        [slug, 'published'],
        TURSO_AUTH_TOKEN
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: corsHeaders
        });
      }
      return new Response(JSON.stringify(rows[0]), { status: 200, headers: corsHeaders });
    }

    // ============ CONTACTS ENDPOINT ============
    if (pathname === '/api/contacts' && method === 'POST') {
      const body = await parseJson(request);
      if (!body || !body.email || !body.message) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      await executeQuery(
        'INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)',
        [body.name || '', body.email, body.phone || '', body.message, new Date().toISOString()],
        TURSO_AUTH_TOKEN
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }

    // ============ NEWSLETTER ENDPOINTS ============
    if (pathname === '/api/newsletter/subscribe' && method === 'POST') {
      const body = await parseJson(request);
      if (!body || !body.email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      await executeQuery(
        'INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)',
        [body.email, new Date().toISOString()],
        TURSO_AUTH_TOKEN
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }

    // ============ PRICING ENDPOINTS ============
    if (pathname === '/api/pricing' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM pricing_requests ORDER BY id DESC', [], TURSO_AUTH_TOKEN);
      return new Response(JSON.stringify(rows), { status: 200, headers: corsHeaders });
    }

    if (pathname === '/api/pricing' && method === 'POST') {
      const body = await parseJson(request);
      if (!body || !body.email || !body.service) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      await executeQuery(
        'INSERT INTO pricing_requests (name, email, phone, service, budget, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [body.name || '', body.email, body.phone || '', body.service, body.budget || '', body.message || '', 'pending', new Date().toISOString()],
        TURSO_AUTH_TOKEN
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: corsHeaders
      });
    }

    if (pathname.match(/^\/api\/pricing\/\d+\/status$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseJson(request);
      if (!body || !body.status) {
        return new Response(JSON.stringify({ error: 'Status required' }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      await executeQuery(
        'UPDATE pricing_requests SET status = ? WHERE id = ?',
        [body.status, parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (pathname.match(/^\/api\/pricing\/\d+\/send-quote$/) && method === 'POST') {
      const id = pathname.split('/')[3];
      const body = await parseJson(request);
      if (!body || !body.message) {
        return new Response(JSON.stringify({ error: 'Message required' }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      await executeQuery(
        'UPDATE pricing_requests SET status = ? WHERE id = ?',
        ['quoted', parseInt(id)],
        TURSO_AUTH_TOKEN
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
