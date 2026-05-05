/**
 * Simple test worker to verify deployment
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Projects endpoint
    if (path === '/api/projects') {
      try {
        const projects = await env.DB.prepare('SELECT id, title FROM projects LIMIT 5').all();
        return new Response(JSON.stringify(projects.results || []), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('DB error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Settings endpoint
    if (path === '/api/settings') {
      try {
        const settings = await env.DB.prepare('SELECT * FROM settings LIMIT 1').first();
        return new Response(JSON.stringify(settings || {}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('DB error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 404
    return new Response(JSON.stringify({ status: 404, error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
