/**
 * Projects Routes - CRUD operations with caching
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { getCached, setCached, deleteCached, getCacheHeaders, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { addCorsHeaders } from '../middleware/cors';

export default {
  async getAll(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      // Check cache first
      const cached = await getCached(CACHE_KEYS.projects, env);
      if (cached) {
        return addCorsHeaders(
          json(cached, { headers: getCacheHeaders(CACHE_TTL.projects) }),
          request.corsHeaders
        );
      }

      // Query only required fields (no overfetching)
      const projects = await db
        .prepare(`
          SELECT 
            id, title, category, description, image, year, 
            location, client, status, sortOrder
          FROM projects 
          ORDER BY sortOrder ASC, id ASC
        `)
        .all();

      const data = projects.results || [];
      
      // Cache the result
      await setCached(CACHE_KEYS.projects, data, env, CACHE_TTL.projects);

      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.projects) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching projects:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async getPublished(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const projects = await db
        .prepare(`
          SELECT 
            id, title, category, description, image, year, 
            location, client, status, sortOrder
          FROM projects 
          WHERE status = 'published'
          ORDER BY sortOrder ASC, id ASC
        `)
        .all();

      const data = projects.results || [];
      
      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.projects) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching published projects:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async getById(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      // Check cache
      const cacheKey = CACHE_KEYS.projectDetail(id);
      const cached = await getCached(cacheKey, env);
      if (cached) {
        return addCorsHeaders(
          json(cached, { headers: getCacheHeaders(CACHE_TTL.projectDetail) }),
          request.corsHeaders
        );
      }

      const project = await db
        .prepare('SELECT * FROM projects WHERE id = ?')
        .bind(id)
        .first();

      if (!project) {
        return addCorsHeaders(errorResponse(404, 'Project not found'), request.corsHeaders);
      }

      // Parse JSON fields
      const parsed = parseProjectData(project);
      
      // Cache the result
      await setCached(cacheKey, parsed, env, CACHE_TTL.projectDetail);

      return addCorsHeaders(
        json(parsed, { headers: getCacheHeaders(CACHE_TTL.projectDetail) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching project:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async create(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const body = await request.json();
      const {
        title, category, description, image, year, location, client, status,
        title_ar, category_ar, description_ar, location_ar, client_ar,
        features, materials, awards, team, gallery,
        features_ar, materials_ar, awards_ar, team_ar,
      } = body;

      const result = await db
        .prepare(`
          INSERT INTO projects (
            title, category, description, image, year, location, client, status,
            title_ar, category_ar, description_ar, location_ar, client_ar,
            features, materials, awards, team, gallery,
            features_ar, materials_ar, awards_ar, team_ar
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          title, category, description, image, year, location, client, status || 'draft',
          title_ar, category_ar, description_ar, location_ar, client_ar,
          JSON.stringify(features || []),
          JSON.stringify(materials || []),
          JSON.stringify(awards || []),
          JSON.stringify(team || []),
          JSON.stringify(gallery || []),
          JSON.stringify(features_ar || []),
          JSON.stringify(materials_ar || []),
          JSON.stringify(awards_ar || []),
          JSON.stringify(team_ar || [])
        )
        .run();

      // Invalidate cache
      await deleteCached(CACHE_KEYS.projects, env);

      const newProject = await db
        .prepare('SELECT * FROM projects WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return addCorsHeaders(json(parseProjectData(newProject)), request.corsHeaders);
    } catch (err) {
      console.error('Error creating project:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async update(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      const body = await request.json();
      const {
        title, category, description, image, year, location, client, status,
        title_ar, category_ar, description_ar, location_ar, client_ar,
        features, materials, awards, team, gallery,
        features_ar, materials_ar, awards_ar, team_ar,
      } = body;

      await db
        .prepare(`
          UPDATE projects SET
            title=?, category=?, description=?, image=?, year=?, location=?, client=?, status=?,
            title_ar=?, category_ar=?, description_ar=?, location_ar=?, client_ar=?,
            features=?, materials=?, awards=?, team=?, gallery=?,
            features_ar=?, materials_ar=?, awards_ar=?, team_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `)
        .bind(
          title, category, description, image, year, location, client, status,
          title_ar, category_ar, description_ar, location_ar, client_ar,
          JSON.stringify(features || []),
          JSON.stringify(materials || []),
          JSON.stringify(awards || []),
          JSON.stringify(team || []),
          JSON.stringify(gallery || []),
          JSON.stringify(features_ar || []),
          JSON.stringify(materials_ar || []),
          JSON.stringify(awards_ar || []),
          JSON.stringify(team_ar || []),
          id
        )
        .run();

      // Invalidate caches
      await deleteCached(CACHE_KEYS.projects, env);
      await deleteCached(CACHE_KEYS.projectDetail(id), env);

      const updated = await db
        .prepare('SELECT * FROM projects WHERE id = ?')
        .bind(id)
        .first();

      return addCorsHeaders(json(parseProjectData(updated)), request.corsHeaders);
    } catch (err) {
      console.error('Error updating project:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async delete(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

      // Invalidate caches
      await deleteCached(CACHE_KEYS.projects, env);
      await deleteCached(CACHE_KEYS.projectDetail(id), env);

      return addCorsHeaders(json({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error('Error deleting project:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },
};

function parseProjectData(project) {
  if (!project) return null;
  return {
    ...project,
    features: tryParse(project.features),
    materials: tryParse(project.materials),
    awards: tryParse(project.awards),
    team: tryParse(project.team),
    gallery: tryParse(project.gallery),
    features_ar: tryParse(project.features_ar),
    materials_ar: tryParse(project.materials_ar),
    awards_ar: tryParse(project.awards_ar),
    team_ar: tryParse(project.team_ar),
  };
}

function tryParse(value) {
  if (!value) return [];
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return [];
  }
}
