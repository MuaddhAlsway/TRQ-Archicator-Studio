/**
 * Upload Routes - R2 Integration (Placeholder)
 * For now, return placeholder URLs
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { addCorsHeaders } from '../middleware/cors';

export default {
  async upload(request) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return addCorsHeaders(
          errorResponse(400, 'No file provided'),
          request.corsHeaders
        );
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        return addCorsHeaders(
          errorResponse(413, 'File too large'),
          request.corsHeaders
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${random}-${file.name}`;

      // TODO: Upload to R2 when enabled
      // const arrayBuffer = await file.arrayBuffer();
      // await request.env.R2.put(filename, arrayBuffer, {
      //   httpMetadata: { contentType: file.type },
      // });

      // Return placeholder URL
      const publicUrl = `https://media.trq.design/${filename}`;

      return addCorsHeaders(
        json({
          success: true,
          filename,
          url: publicUrl,
          size: file.size,
          mimetype: file.type,
        }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Upload error:', err);
      return addCorsHeaders(
        errorResponse(500, 'Upload failed'),
        request.corsHeaders
      );
    }
  },

  async delete(request) {
    try {
      const { filename } = request.params;

      // Validate filename
      if (!filename || filename.includes('..') || filename.includes('/')) {
        return addCorsHeaders(
          errorResponse(400, 'Invalid filename'),
          request.corsHeaders
        );
      }

      // TODO: Delete from R2 when enabled
      // await request.env.R2.delete(filename);

      return addCorsHeaders(
        json({ success: true }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Delete error:', err);
      return addCorsHeaders(
        errorResponse(500, 'Delete failed'),
        request.corsHeaders
      );
    }
  },
};
