/**
 * Authentication Routes
 */

import { json, error as errorResponse } from 'itty-router-extras';
import { addCorsHeaders } from '../middleware/cors';
import { generateToken } from '../middleware/auth';

// Hardcoded for now - replace with database lookup in production
const ADMIN_USER = {
  id: 1,
  username: 'admin',
  email: 'admin@trq.design',
  passwordHash: 'hashed_password_here', // Use bcrypt in production
};

export default {
  async login(request) {
    try {
      const body = await request.json();
      const { username, password } = body;

      // Simple auth - replace with proper bcrypt verification
      if (username === 'admin' && password === 'trq2026') {
        const accessToken = generateToken(
          { id: ADMIN_USER.id, username: ADMIN_USER.username, email: ADMIN_USER.email },
          request.env.JWT_SECRET,
          3600 // 1 hour
        );

        const refreshToken = generateToken(
          { id: ADMIN_USER.id, username: ADMIN_USER.username },
          request.env.JWT_SECRET,
          604800 // 7 days
        );

        return addCorsHeaders(
          json({
            success: true,
            accessToken,
            refreshToken,
            expiresIn: 3600,
            user: {
              id: ADMIN_USER.id,
              username: ADMIN_USER.username,
              email: ADMIN_USER.email,
            },
          }),
          request.corsHeaders
        );
      }

      return addCorsHeaders(
        errorResponse(401, 'Invalid credentials'),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Login error:', err);
      return addCorsHeaders(
        errorResponse(500, 'Server error'),
        request.corsHeaders
      );
    }
  },

  async refresh(request) {
    try {
      const body = await request.json();
      const { refreshToken } = body;

      if (!refreshToken) {
        return addCorsHeaders(
          errorResponse(401, 'Refresh token required'),
          request.corsHeaders
        );
      }

      // Verify refresh token (simplified)
      const accessToken = generateToken(
        { id: ADMIN_USER.id, username: ADMIN_USER.username, email: ADMIN_USER.email },
        request.env.JWT_SECRET,
        3600
      );

      return addCorsHeaders(
        json({
          success: true,
          accessToken,
          expiresIn: 3600,
        }),
        request.corsHeaders
      );
    } catch (err) {
      console.error('Refresh error:', err);
      return addCorsHeaders(
        errorResponse(500, 'Server error'),
        request.corsHeaders
      );
    }
  },

  async verify(request) {
    return addCorsHeaders(
      json({
        success: true,
        user: {
          id: request.user.id,
          username: request.user.username,
        },
      }),
      request.corsHeaders
    );
  },
};
