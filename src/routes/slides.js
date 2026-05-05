/**
 * Hero Slides Routes
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { getCached, setCached, deleteCached, getCacheHeaders, CACHE_KEYS, CACHE_TTL } from '../utils/cache';
import { addCorsHeaders } from '../middleware/cors';

export default {
  async getAll(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const cached = await getCached(CACHE_KEYS.slides, env);
      if (cached) {
        return addCorsHeaders(
          json(cached, { headers: getCacheHeaders(CACHE_TTL.slides) }),
          request.corsHeaders
        );
      }

      const slides = await db
        .prepare('SELECT * FROM hero_slides ORDER BY sortOrder ASC')
        .all();

      const data = (slides.results || []).map(parseSlideData);
      await setCached(CACHE_KEYS.slides, data, env, CACHE_TTL.slides);

      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.slides) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching slides:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async getActive(request) {
    const db = request.env.DB;

    try {
      const slides = await db
        .prepare('SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC')
        .all();

      const data = (slides.results || []).map(parseSlideData);

      return addCorsHeaders(
        json(data, { headers: getCacheHeaders(CACHE_TTL.slides) }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Error fetching active slides:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async create(request) {
    const db = request.env.DB;
    const env = request.env;

    try {
      const body = await request.json();
      const {
        tag, title, description, image, video, video_2, video_3,
        video_text, video_2_text, video_3_text,
        buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink,
        sortOrder, isActive,
        tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
        video_text_ar, video_2_text_ar, video_3_text_ar,
        buttonPrimaryText_ar, buttonSecondaryText_ar,
      } = body;

      const result = await db
        .prepare(`
          INSERT INTO hero_slides (
            tag, title, description, image, video, video_2, video_3,
            video_text, video_2_text, video_3_text,
            buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink,
            sortOrder, isActive,
            tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
            video_text_ar, video_2_text_ar, video_3_text_ar,
            buttonPrimaryText_ar, buttonSecondaryText_ar
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          tag, title, description, image, video, video_2, video_3,
          video_text, video_2_text, video_3_text,
          buttonPrimaryText || 'VIEW PORTFOLIO', buttonPrimaryLink || 'portfolio',
          buttonSecondaryText || 'GET IN TOUCH', buttonSecondaryLink || 'contact',
          sortOrder || 0, isActive !== undefined ? isActive : 1,
          tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
          video_text_ar, video_2_text_ar, video_3_text_ar,
          buttonPrimaryText_ar, buttonSecondaryText_ar
        )
        .run();

      await deleteCached(CACHE_KEYS.slides, env);

      const newSlide = await db
        .prepare('SELECT * FROM hero_slides WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return addCorsHeaders(json(parseSlideData(newSlide)), request.corsHeaders);
    } catch (err) {
      console.error('Error creating slide:', err);
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
        tag, title, description, image, video, video_2, video_3,
        video_text, video_2_text, video_3_text,
        buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink,
        sortOrder, isActive,
        tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
        video_text_ar, video_2_text_ar, video_3_text_ar,
        buttonPrimaryText_ar, buttonSecondaryText_ar,
      } = body;

      await db
        .prepare(`
          UPDATE hero_slides SET
            tag=?, title=?, description=?, image=?, video=?, video_2=?, video_3=?,
            video_text=?, video_2_text=?, video_3_text=?,
            buttonPrimaryText=?, buttonPrimaryLink=?, buttonSecondaryText=?, buttonSecondaryLink=?,
            sortOrder=?, isActive=?,
            tag_ar=?, title_ar=?, description_ar=?, video_ar=?, video_2_ar=?, video_3_ar=?,
            video_text_ar=?, video_2_text_ar=?, video_3_text_ar=?,
            buttonPrimaryText_ar=?, buttonSecondaryText_ar=?,
            updatedAt=CURRENT_TIMESTAMP
          WHERE id=?
        `)
        .bind(
          tag, title, description, image, video, video_2, video_3,
          video_text, video_2_text, video_3_text,
          buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink,
          sortOrder, isActive,
          tag_ar, title_ar, description_ar, video_ar, video_2_ar, video_3_ar,
          video_text_ar, video_2_text_ar, video_3_text_ar,
          buttonPrimaryText_ar, buttonSecondaryText_ar,
          id
        )
        .run();

      await deleteCached(CACHE_KEYS.slides, env);

      const updated = await db
        .prepare('SELECT * FROM hero_slides WHERE id = ?')
        .bind(id)
        .first();

      return addCorsHeaders(json(parseSlideData(updated)), request.corsHeaders);
    } catch (err) {
      console.error('Error updating slide:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },

  async delete(request) {
    const db = request.env.DB;
    const env = request.env;
    const { id } = request.params;

    try {
      await db.prepare('DELETE FROM hero_slides WHERE id = ?').bind(id).run();
      await deleteCached(CACHE_KEYS.slides, env);

      return addCorsHeaders(json({ success: true }), request.corsHeaders);
    } catch (err) {
      console.error('Error deleting slide:', err);
      return addCorsHeaders(errorResponse(500, 'Server error'), request.corsHeaders);
    }
  },
};

function parseSlideData(slide) {
  return slide;
}
