/**
 * Cloudflare Workers Entry Point
 * Connects to Turso database
 */

const TURSO_AUTH_TOKEN = globalThis.TURSO_AUTH_TOKEN;
const CORS_ORIGINS = (globalThis.CORS_ORIGINS || 'https://trq-studio.pages.dev').split(',');

// Turso database connection
const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io';

// Execute SQL query via Turso HTTP API
async function executeQuery(sql, params = []) {
  try {
    const response = await fetch(`${TURSO_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
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
    if (data.results && data.results[0] && data.results[0].response && data.results[0].response.result && data.results[0].response.result.rows) {
      return data.results[0].response.result.rows;
    }
    
    return [];
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

// CORS Headers
function getCorsHeaders(origin) {
  const allowedOrigins = CORS_ORIGINS.map(o => o.trim());
  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle preflight requests
function handleOptions(request) {
  const origin = request.headers.get('origin') || '';
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
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

// API Routes
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const origin = request.headers.get('origin') || '';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return handleOptions(request);
  }

  const corsHeaders = getCorsHeaders(origin);

  try {
    // Health check
    if (pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Projects endpoints
    if (pathname === '/api/projects' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM projects ORDER BY id DESC');
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/api/projects/published' && method === 'GET') {
      const rows = await executeQuery(
        "SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC"
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname.match(/^\/api\/projects\/\d+$/) && method === 'GET') {
      const id = pathname.split('/').pop();
      const rows = await executeQuery(
        'SELECT * FROM projects WHERE id = ?',
        [parseInt(id)]
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Services endpoints
    if (pathname === '/api/services' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM services ORDER BY id DESC');
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/api/services/active' && method === 'GET') {
      const rows = await executeQuery(
        'SELECT * FROM services WHERE isActive = 1 ORDER BY id DESC'
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Slides endpoints
    if (pathname === '/api/slides' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM hero_slides ORDER BY id DESC');
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/api/slides/active' && method === 'GET') {
      const rows = await executeQuery(
        'SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY id DESC'
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Settings endpoint
    if (pathname === '/api/settings' && method === 'GET') {
      const rows = await executeQuery('SELECT * FROM settings LIMIT 1');
      return new Response(JSON.stringify(rows[0] || {}), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Articles endpoints
    if (pathname === '/api/articles/published' && method === 'GET') {
      const rows = await executeQuery(
        "SELECT * FROM blog_articles WHERE status = 'published' ORDER BY created_at DESC"
      );
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname.match(/^\/api\/articles\/slug\//) && method === 'GET') {
      const slug = pathname.split('/').pop();
      const rows = await executeQuery(
        'SELECT * FROM blog_articles WHERE slug = ? AND status = ?',
        [slug, 'published']
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Contact form endpoint
    if (pathname === '/api/contacts' && method === 'POST') {
      const body = await parseJson(request);
      if (!body || !body.email || !body.message) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      await executeQuery(
        'INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)',
        [body.name || '', body.email, body.phone || '', body.message, new Date().toISOString()]
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Newsletter subscribe
    if (pathname === '/api/newsletter/subscribe' && method === 'POST') {
      const body = await parseJson(request);
      if (!body || !body.email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      await executeQuery(
        'INSERT OR IGNORE INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)',
        [body.email, new Date().toISOString()]
      );
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// Export for Cloudflare Workers
export default {
  fetch: handleRequest,
};
