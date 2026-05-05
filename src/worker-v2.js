/**
 * TRQ API - Cloudflare Workers Backend (v2)
 * Simplified routing without itty-router
 */

// Helper functions
function json(data, options = {}) {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

function error(status, message) {
  return json({ status, error: message }, { status });
}

function addCorsHeaders(response, origin) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Route handlers
async function handleProjects(request, env) {
  try {
    const projects = await env.DB.prepare(`
      SELECT id, title, category, description, image, year, location, client, status, sortOrder
      FROM projects 
      ORDER BY sortOrder ASC, id ASC
    `).all();
    return json(projects.results || []);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return error(500, 'Server error');
  }
}

async function handleSettings(request, env) {
  try {
    const settings = await env.DB.prepare('SELECT * FROM settings LIMIT 1').first();
    return json(settings || {});
  } catch (err) {
    console.error('Error fetching settings:', err);
    return error(500, 'Server error');
  }
}

async function handleServices(request, env) {
  try {
    const services = await env.DB.prepare(`
      SELECT id, title, description, icon, sortOrder
      FROM services
      ORDER BY sortOrder ASC, id ASC
    `).all();
    return json(services.results || []);
  } catch (err) {
    console.error('Error fetching services:', err);
    return error(500, 'Server error');
  }
}

async function handleSlides(request, env) {
  try {
    const slides = await env.DB.prepare(`
      SELECT id, title, description, image, video, sortOrder
      FROM hero_slides
      ORDER BY sortOrder ASC, id ASC
    `).all();
    return json(slides.results || []);
  } catch (err) {
    console.error('Error fetching slides:', err);
    return error(500, 'Server error');
  }
}

async function handleHealth(request, env) {
  return json({ status: 'ok', timestamp: new Date().toISOString() });
}

// Main worker
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const origin = request.headers.get('origin') || '*';

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return addCorsHeaders(new Response(null, { status: 204 }), origin);
    }

    let response;

    try {
      // Route matching
      if (path === '/api/health') {
        response = await handleHealth(request, env);
      } else if (path === '/api/projects') {
        response = await handleProjects(request, env);
      } else if (path === '/api/settings') {
        response = await handleSettings(request, env);
      } else if (path === '/api/services') {
        response = await handleServices(request, env);
      } else if (path === '/api/slides') {
        response = await handleSlides(request, env);
      } else {
        response = error(404, 'Not Found');
      }
    } catch (err) {
      console.error('Worker error:', err);
      response = error(500, 'Internal Server Error');
    }

    // Add CORS headers
    return addCorsHeaders(response, origin);
  },

  async scheduled(event, env, ctx) {
    console.log('Running scheduled cache refresh...');
    try {
      // Refresh critical caches
      const cacheKeys = ['settings', 'services', 'slides'];
      for (const key of cacheKeys) {
        await env.CACHE.delete(key);
      }
      console.log('Cache refresh complete');
    } catch (err) {
      console.error('Scheduled task error:', err);
    }
  }
};
