/**
 * Settings Routes
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { getCached, setCached, deleteCached, getCacheHeaders, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { addCorsHeaders } from '../middleware/cors';

export default {
  async getAll(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const cached = await getCached(CACHE_KEYS.settings, env);
      if (cached) {
        return addCorsHeaders(
          json(cached, { headers: getCacheHeaders(CACHE_TTL.settings) }),
          request.corsHeaders
        );
      }

      const settings = await db
        .prepare('SELECT key, value FROM settings')
        .all();

      const result = {};
      (settings.results || []).forEach(s => {
        result[s.key] = s.value;
      });

      await setCached(CACHE_KEYS.settings, result, env, CACHE_TTL.settings);

      return addCorsHeaders(
        json(result, { headers: getCacheHeaders(CACHE_TTL.settings) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching settings:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async update(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const body = await request.json();

      // Update each setting
      for (const [key, value] of Object.entries(body)) {
        await db
          .prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)')
          .bind(key, value)
          .run();
      }

      // Invalidate cache
      await deleteCached(CACHE_KEYS.settings, env);

      return addCorsHeaders(json({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error('Error updating settings:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },
};
