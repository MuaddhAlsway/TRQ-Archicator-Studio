/**
 * Services Routes
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { getCached, setCached, deleteCached, getCacheHeaders, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { addCorsHeaders } from '../middleware/cors';

export default {
  async getAll(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const cached = await getCached(CACHE_KEYS.services, env);
      if (cached) {
        return addCorsHeaders(
          json(cached, { headers: getCacheHeaders(CACHE_TTL.services) }),
          request.corsHeaders
        );
      }

      const services = await db
        .prepare('SELECT * FROM services ORDER BY sortOrder ASC')
        .all();

      const data = services.results || [];
      await setCached(CACHE_KEYS.services, data, env, CACHE_TTL.services);

      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.services) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching services:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async getActive(request) {
    const db = request.env.DB;

    try {
      const services = await db
        .prepare('SELECT * FROM services WHERE isActive = 1 ORDER BY sortOrder ASC')
        .all();

      const data = services.results || [];

      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.services) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching active services:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async create(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const body = await request.json();
      const { title, description, icon, sortOrder, isActive, title_ar, description_ar } = body;

      const result = await db
        .prepare(`
          INSERT INTO services (title, description, icon, sortOrder, isActive, title_ar, description_ar)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(title, description, icon, sortOrder || 0, isActive !== undefined ? isActive : 1, title_ar, description_ar)
        .run();

      await deleteCached(CACHE_KEYS.services, env);

      const newService = await db
        .prepare('SELECT * FROM services WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return addCorsHeaders(json(newService), request.corsHeaders);
    } catch (err) {
      console.error('Error creating service:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async update(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      const body = await request.json();
      const { title, description, icon, sortOrder, isActive, title_ar, description_ar } = body;

      await db
        .prepare(`
          UPDATE services SET
            title=?, description=?, icon=?, sortOrder=?, isActive=?, title_ar=?, description_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `)
        .bind(title, description, icon, sortOrder, isActive, title_ar, description_ar, id)
        .run();

      await deleteCached(CACHE_KEYS.services, env);

      const updated = await db
        .prepare('SELECT * FROM services WHERE id = ?')
        .bind(id)
        .first();

      return addCorsHeaders(json(updated), request.corsHeaders);
    } catch (err) {
      console.error('Error updating service:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async delete(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      await db.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
      await deleteCached(CACHE_KEYS.services, env);

      return addCorsHeaders(json({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error('Error deleting service:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },
};
