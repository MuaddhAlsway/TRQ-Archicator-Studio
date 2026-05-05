/**
 * TRQ API - Cloudflare Workers Backend
 * Edge-first architecture with D1 + R2 + KV
 */

import { Router } from 'itty-router';
import { json, error as errorResponse } from 'itty-router-extras';
import { handleCors } from './middleware/cors';
import { authenticateToken } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import projectRoutes from './routes/projects';
import slideRoutes from './routes/slides';
import serviceRoutes from './routes/services';
import settingsRoutes from './routes/settings';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/uploads';

const router = Router();

// ============ MIDDLEWARE ============
router.all('*', handleCors);
router.all('*', rateLimitMiddleware);

// ============ HEALTH CHECK ============
router.get('/api/health', () => json({ status: 'ok', timestamp: new Date().toISOString() }));

// ============ PUBLIC ROUTES ============
router.get('/api/projects', projectRoutes.getAll);
router.get('/api/projects/published', projectRoutes.getPublished);
router.get('/api/projects/:id', projectRoutes.getById);

router.get('/api/slides', slideRoutes.getAll);
router.get('/api/slides/active', slideRoutes.getActive);

router.get('/api/services', serviceRoutes.getAll);
router.get('/api/services/active', serviceRoutes.getActive);

router.get('/api/settings', settingsRoutes.getAll);

// ============ AUTH ROUTES ============
router.post('/api/auth/login', authRoutes.login);
router.post('/api/auth/refresh', authRoutes.refresh);
router.get('/api/auth/verify', authenticateToken, authRoutes.verify);

// ============ ADMIN ROUTES (Protected) ============
router.post('/api/projects', authenticateToken, projectRoutes.create);
router.put('/api/projects/:id', authenticateToken, projectRoutes.update);
router.delete('/api/projects/:id', authenticateToken, projectRoutes.delete);

router.post('/api/slides', authenticateToken, slideRoutes.create);
router.put('/api/slides/:id', authenticateToken, slideRoutes.update);
router.delete('/api/slides/:id', authenticateToken, slideRoutes.delete);

router.post('/api/services', authenticateToken, serviceRoutes.create);
router.put('/api/services/:id', authenticateToken, serviceRoutes.update);
router.delete('/api/services/:id', authenticateToken, serviceRoutes.delete);

router.put('/api/settings', authenticateToken, settingsRoutes.update);

// ============ UPLOAD ROUTES ============
router.post('/api/upload', authenticateToken, uploadRoutes.upload);
router.delete('/api/upload/:filename', authenticateToken, uploadRoutes.delete);

// ============ 404 HANDLER ============
router.all('*', () => errorResponse(404, 'Not Found'));

// ============ ERROR HANDLER ============
export default {
  async fetch(request, env, ctx) {
    try {
      // Attach environment to request for use in handlers
      request.env = env;
      request.ctx = ctx;
      
      const response = await router.handle(request, env, ctx);
      return response || errorResponse(404, 'Not Found');
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse(500, 'Internal Server Error');
    }
  },

  async scheduled(event, env, ctx) {
    // Scheduled task: refresh cache every 6 hours
    console.log('Running scheduled cache refresh...');
    try {
      await ctx.waitUntil(refreshCacheTask(env));
    } catch (err) {
      console.error('Scheduled task error:', err);
    }
  }
};

async function refreshCacheTask(env) {
  // Refresh critical caches
  const cacheKeys = ['settings', 'services', 'slides'];
  for (const key of cacheKeys) {
    await env.CACHE.delete(key);
  }
  console.log('Cache refresh complete');
}
