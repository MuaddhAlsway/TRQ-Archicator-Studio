/**
 * Rate Limiting Middleware - Using Cloudflare KV
 */

import { error as errorResponse } from 'itty-router-extras';

const RATE_LIMITS = {
  '/api/auth/login': { requests: 5, window: 900 }, // 5 requests per 15 minutes
  '/api/upload': { requests: 10, window: 3600 }, // 10 requests per hour
  default: { requests: 100, window: 60 }, // 100 requests per minute
};

export async function rateLimitMiddleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip rate limiting for health checks
  if (path === '/api/health') return;

  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  const limit = RATE_LIMITS[path] || RATE_LIMITS.default;
  
  const key = `ratelimit:${clientIp}:${path}`;
  
  try {
    const current = await request.env.RATE_LIMIT.get(key);
    const count = current ? parseInt(current) + 1 : 1;

    if (count > limit.requests) {
      return errorResponse(429, 'Too many requests');
    }

    // Set/update counter with expiration
    await request.env.RATE_LIMIT.put(key, count.toString(), {
      expirationTtl: limit.window,
    });
  } catch (err) {
    console.error('Rate limit check failed:', err);
    // Don't block on rate limit errors
  }
}
