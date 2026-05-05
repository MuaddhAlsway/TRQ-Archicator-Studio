/**
 * Caching Utilities - Cloudflare KV + HTTP Cache
 */

export const CACHE_TTL = {
  settings: 600, // 10 minutes
  services: 300, // 5 minutes
  slides: 300, // 5 minutes
  projects: 120, // 2 minutes
  projectDetail: 60, // 1 minute
};

export async function getCached(key, env) {
  try {
    const cached = await env.CACHE.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('Cache get error:', err);
  }
  return null;
}

export async function setCached(key, value, env, ttl = 300) {
  try {
    await env.CACHE.put(key, JSON.stringify(value), {
      expirationTtl: ttl,
    });
  } catch (err) {
    console.error('Cache set error:', err);
  }
}

export async function deleteCached(key, env) {
  try {
    await env.CACHE.delete(key);
  } catch (err) {
    console.error('Cache delete error:', err);
  }
}

export function getCacheHeaders(ttl = 300) {
  return {
    'Cache-Control': `public, max-age=${ttl}`,
    'CDN-Cache-Control': `max-age=${ttl}`,
  };
}

export const CACHE_KEYS = {
  settings: 'cache:settings',
  services: 'cache:services',
  slides: 'cache:slides',
  projects: 'cache:projects',
  projectDetail: (id) => `cache:project:${id}`,
};
