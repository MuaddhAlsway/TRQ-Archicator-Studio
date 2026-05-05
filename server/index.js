import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database.js';
import upload, { handleUploadError, getFileUrl, extractFilenameFromUrl, deleteUploadedFile } from './upload-handler.js';
import { sendContactReply, sendPricingReply } from './email-service.js';

const app = express();
const PORT = process.env.PORT || 4242;

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production_min_32_chars';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',      // Vite dev
    'http://localhost:4242',      // Local backend
    'http://localhost:3000',      // Alternative local
    'https://trq-studio.pages.dev', // Cloudflare Pages production
    'https://d77c7f3d.trq-studio-7ie.pages.dev', // Cloudflare Pages preview
    'https://trqlatestversion.trq-efw.pages.dev', // Current deployment
    /\.trq-efw\.pages\.dev$/, // Allow all trq-efw preview deployments
    /\.trq-studio-7ie\.pages\.dev$/ // Allow all preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ FILE SERVING ============
// Serve videos from /public/ folder
app.get('/api/videos/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }
    
    const videoPath = path.join(__dirname, '../public', filename);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    
    // Set cache headers for videos
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.set('Content-Type', 'video/mp4');
    
    // Stream the video file
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error serving video:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve project images from /public/ folder
// Supports paths like: /api/images/CLASSIC%20BEDROOM/1.webp
app.get('/api/images/*', (req, res) => {
  try {
    // Get the full path after /api/images/
    const imagePath = req.params[0];
    
    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'Image path required' });
    }
    
    // Validate path to prevent directory traversal
    if (imagePath.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid path' });
    }
    
    const fullPath = path.join(__dirname, '../public', imagePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn('Image not found:', fullPath);
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Set cache headers for images
    res.set('Cache-Control', 'public, max-age=604800'); // 7 days
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };
    
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.set('Content-Type', contentType);
    
    // Stream the image file
    fs.createReadStream(fullPath).pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ AUTH MIDDLEWARE ============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.authenticated = true;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// ============ PROJECTS ============
app.get('/api/projects', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=30');
    const projects = db.prepare('SELECT * FROM projects ORDER BY id ASC').all();
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/published', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60');
    let projects = db.prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY id ASC").all();
    if (projects.length === 0) {
      projects = db.prepare("SELECT * FROM projects ORDER BY id ASC").all();
    }
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ FILE UPLOAD ============
app.post('/api/upload', authenticateToken, upload.single('file'), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = getFileUrl(req.file.filename);
    res.json({
      success: true,
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Delete uploaded file
app.delete('/api/upload/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }

    if (deleteUploadedFile(filename)) {
      res.json({ success: true, message: 'File deleted' });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

// ============ SERVICES ============
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY sortOrder ASC').all();
    res.json(services);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/services/active', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE isActive = 1 ORDER BY sortOrder ASC').all();
    res.json(services);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ HERO SLIDES ============
app.get('/api/slides', (req, res) => {
  try {
    const slides = db.prepare('SELECT * FROM hero_slides ORDER BY sortOrder ASC').all();
    res.json(slides);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/slides/active', (req, res) => {
  try {
    const slides = db.prepare('SELECT * FROM hero_slides WHERE isActive = 1 ORDER BY sortOrder ASC').all();
    res.json(slides);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ SETTINGS ============
app.get('/api/settings', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=600'); // 10 minutes
    const settings = db.prepare('SELECT key, value FROM settings').all();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ ARTICLES ============
app.get('/api/articles', (req, res) => {
  try {
    const articles = db.prepare('SELECT * FROM blog_articles ORDER BY id DESC').all();
    res.json(articles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/articles/published', (req, res) => {
  try {
    const articles = db.prepare("SELECT * FROM blog_articles WHERE status = 'published' ORDER BY id DESC").all();
    res.json(articles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/articles/slug/:slug', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM blog_articles WHERE slug = ?').get(req.params.slug);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/articles/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM blog_articles WHERE id = ?').get(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/articles', authenticateToken, (req, res) => {
  try {
    const { title, slug, excerpt, content, image, author, date, readTime, category, categorySlug, tags, status } = req.body;
    const result = db.prepare(`
      INSERT INTO blog_articles (title, slug, excerpt, content, image, author, date, readTime, category, categorySlug, tags, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, slug, excerpt, content, image, author, date, readTime, category, categorySlug,
      typeof tags === 'string' ? tags : JSON.stringify(tags || []),
      status || 'draft'
    );
    const article = db.prepare('SELECT * FROM blog_articles WHERE id = ?').get(result.lastInsertRowid);
    res.json(article);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const { title, slug, excerpt, content, image, author, date, readTime, category, categorySlug, tags, status } = req.body;
    db.prepare(`
      UPDATE blog_articles SET title=?, slug=?, excerpt=?, content=?, image=?, author=?, date=?, readTime=?, category=?, categorySlug=?, tags=?, status=?
      WHERE id=?
    `).run(
      title, slug, excerpt, content, image, author, date, readTime, category, categorySlug,
      typeof tags === 'string' ? tags : JSON.stringify(tags || []),
      status || 'draft',
      req.params.id
    );
    const article = db.prepare('SELECT * FROM blog_articles WHERE id = ?').get(req.params.id);
    res.json(article);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM blog_articles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple auth - in production use proper JWT
    if (username === 'admin' && password === 'trq2026') {
      const accessToken = jwt.sign(
        { id: 1, username: 'admin', email: 'admin@trq.design' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
      const refreshToken = jwt.sign(
        { id: 1, username: 'admin' },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );
      res.json({ 
        success: true, 
        accessToken,
        refreshToken,
        expiresIn: 3600,
        user: { id: 1, username: 'admin', email: 'admin@trq.design' }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }
    
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const accessToken = jwt.sign(
        { id: decoded.id, username: decoded.username, email: decoded.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
      
      res.json({
        success: true,
        accessToken,
        expiresIn: 3600
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: { id: 1, username: 'admin' } });
});

// ============ ADMIN - PROJECTS ============
app.post('/api/projects', authenticateToken, (req, res) => {
  try {
    const { title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status, title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, features_ar, materials_ar, awards_ar, team_ar, clientQuote_ar, clientName_ar } = req.body;
    
    const result = db.prepare(`
      INSERT INTO projects (title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status, title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, features_ar, materials_ar, awards_ar, team_ar, clientQuote_ar, clientName_ar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, JSON.stringify(features || []), JSON.stringify(materials || []), JSON.stringify(awards || []), JSON.stringify(team || []), JSON.stringify(gallery || []), clientQuote, clientName, status || 'draft', title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, typeof features_ar === 'string' ? features_ar : JSON.stringify(features_ar || []), typeof materials_ar === 'string' ? materials_ar : JSON.stringify(materials_ar || []), typeof awards_ar === 'string' ? awards_ar : JSON.stringify(awards_ar || []), typeof team_ar === 'string' ? team_ar : JSON.stringify(team_ar || []), clientQuote_ar, clientName_ar);
    
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.json(newProject);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const { title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status, title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, features_ar, materials_ar, awards_ar, team_ar, clientQuote_ar, clientName_ar } = req.body;
    
    const isArabicOnlyUpdate = Object.keys(req.body).length > 0 && Object.keys(req.body).every(key => key.endsWith('_ar'));
    
    if (isArabicOnlyUpdate) {
      db.prepare(`UPDATE projects SET title_ar=?, category_ar=?, subcategory_ar=?, description_ar=?, location_ar=?, client_ar=?, size_ar=?, duration_ar=?, detailedDescription_ar=?, challenge_ar=?, solution_ar=?, features_ar=?, materials_ar=?, awards_ar=?, team_ar=?, clientQuote_ar=?, clientName_ar=? WHERE id=?`).run(title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, typeof features_ar === 'string' ? features_ar : JSON.stringify(features_ar || []), typeof materials_ar === 'string' ? materials_ar : JSON.stringify(materials_ar || []), typeof awards_ar === 'string' ? awards_ar : JSON.stringify(awards_ar || []), typeof team_ar === 'string' ? team_ar : JSON.stringify(team_ar || []), clientQuote_ar, clientName_ar, req.params.id);
    } else {
      db.prepare(`UPDATE projects SET title=?, category=?, subcategory=?, description=?, image=?, year=?, location=?, client=?, size=?, duration=?, detailedDescription=?, challenge=?, solution=?, features=?, materials=?, awards=?, team=?, gallery=?, clientQuote=?, clientName=?, status=?, title_ar=?, category_ar=?, subcategory_ar=?, description_ar=?, location_ar=?, client_ar=?, size_ar=?, duration_ar=?, detailedDescription_ar=?, challenge_ar=?, solution_ar=?, features_ar=?, materials_ar=?, awards_ar=?, team_ar=?, clientQuote_ar=?, clientName_ar=? WHERE id=?`).run(title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, JSON.stringify(features || []), JSON.stringify(materials || []), JSON.stringify(awards || []), JSON.stringify(team || []), JSON.stringify(gallery || []), clientQuote, clientName, status, title_ar, category_ar, subcategory_ar, description_ar, location_ar, client_ar, size_ar, duration_ar, detailedDescription_ar, challenge_ar, solution_ar, typeof features_ar === 'string' ? features_ar : JSON.stringify(features_ar || []), typeof materials_ar === 'string' ? materials_ar : JSON.stringify(materials_ar || []), typeof awards_ar === 'string' ? awards_ar : JSON.stringify(awards_ar || []), typeof team_ar === 'string' ? team_ar : JSON.stringify(team_ar || []), clientQuote_ar, clientName_ar, req.params.id);
    }
    
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Scan projects from TRQ STUDIO _ PROJECTS folder
app.post('/api/projects/scan-folder', authenticateToken, async (req, res) => {
  try {
    const { scanProjectsFromFolder } = await import('./scan-projects-from-folder.js');
    const result = await scanProjectsFromFolder();
    res.json(result);
  } catch (error) {
    console.error('Error scanning projects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ ADMIN - SETTINGS ============
app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    const settings = req.body;
    const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
    
    for (const [key, value] of Object.entries(settings)) {
      updateSetting.run(key, value);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ ADMIN - SLIDES ============
app.post('/api/slides', authenticateToken, (req, res) => {
  try {
    const { tag, title, description, image, video, video_2, video_3, video_text, video_2_text, video_3_text, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive } = req.body;
    
    const result = db.prepare(`INSERT INTO hero_slides (tag, title, description, image, video, video_2, video_3, video_text, video_2_text, video_3_text, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(tag, title, description, image, video || null, video_2 || null, video_3 || null, video_text || null, video_2_text || null, video_3_text || null, buttonPrimaryText || 'VIEW PORTFOLIO', buttonPrimaryLink || 'portfolio', buttonSecondaryText || 'GET IN TOUCH', buttonSecondaryLink || 'contact', sortOrder || 0, isActive !== undefined ? isActive : 1);
    
    const newSlide = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(result.lastInsertRowid);
    res.json(newSlide);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/slides/:id', authenticateToken, (req, res) => {
  try {
    const { tag, title, description, image, video, video_2, video_3, video_text, video_2_text, video_3_text, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive, tag_ar, title_ar, description_ar, buttonPrimaryText_ar, buttonSecondaryText_ar, video_ar, video_2_ar, video_3_ar, video_text_ar, video_2_text_ar, video_3_text_ar } = req.body;
    
    // Get current slide to preserve existing fields
    const currentSlide = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(req.params.id);
    
    if (!currentSlide) {
      return res.status(404).json({ success: false, message: 'Slide not found' });
    }

    // Use provided values or fall back to current values
    const updateValues = {
      tag: tag !== undefined ? tag : currentSlide.tag,
      title: title !== undefined ? title : currentSlide.title,
      description: description !== undefined ? description : currentSlide.description,
      image: image !== undefined ? image : currentSlide.image,
      video: video !== undefined ? video : currentSlide.video,
      video_2: video_2 !== undefined ? video_2 : currentSlide.video_2,
      video_3: video_3 !== undefined ? video_3 : currentSlide.video_3,
      video_text: video_text !== undefined ? video_text : currentSlide.video_text,
      video_2_text: video_2_text !== undefined ? video_2_text : currentSlide.video_2_text,
      video_3_text: video_3_text !== undefined ? video_3_text : currentSlide.video_3_text,
      buttonPrimaryText: buttonPrimaryText !== undefined ? buttonPrimaryText : currentSlide.buttonPrimaryText,
      buttonPrimaryLink: buttonPrimaryLink !== undefined ? buttonPrimaryLink : currentSlide.buttonPrimaryLink,
      buttonSecondaryText: buttonSecondaryText !== undefined ? buttonSecondaryText : currentSlide.buttonSecondaryText,
      buttonSecondaryLink: buttonSecondaryLink !== undefined ? buttonSecondaryLink : currentSlide.buttonSecondaryLink,
      sortOrder: sortOrder !== undefined ? sortOrder : currentSlide.sortOrder,
      isActive: isActive !== undefined ? isActive : currentSlide.isActive,
      tag_ar: tag_ar !== undefined ? tag_ar : currentSlide.tag_ar,
      title_ar: title_ar !== undefined ? title_ar : currentSlide.title_ar,
      description_ar: description_ar !== undefined ? description_ar : currentSlide.description_ar,
      buttonPrimaryText_ar: buttonPrimaryText_ar !== undefined ? buttonPrimaryText_ar : currentSlide.buttonPrimaryText_ar,
      buttonSecondaryText_ar: buttonSecondaryText_ar !== undefined ? buttonSecondaryText_ar : currentSlide.buttonSecondaryText_ar,
      video_ar: video_ar !== undefined ? video_ar : currentSlide.video_ar,
      video_2_ar: video_2_ar !== undefined ? video_2_ar : currentSlide.video_2_ar,
      video_3_ar: video_3_ar !== undefined ? video_3_ar : currentSlide.video_3_ar,
      video_text_ar: video_text_ar !== undefined ? video_text_ar : currentSlide.video_text_ar,
      video_2_text_ar: video_2_text_ar !== undefined ? video_2_text_ar : currentSlide.video_2_text_ar,
      video_3_text_ar: video_3_text_ar !== undefined ? video_3_text_ar : currentSlide.video_3_text_ar,
    };
    
    db.prepare(`UPDATE hero_slides SET tag=?, title=?, description=?, image=?, video=?, video_2=?, video_3=?, video_text=?, video_2_text=?, video_3_text=?, buttonPrimaryText=?, buttonPrimaryLink=?, buttonSecondaryText=?, buttonSecondaryLink=?, sortOrder=?, isActive=?, tag_ar=?, title_ar=?, description_ar=?, buttonPrimaryText_ar=?, buttonSecondaryText_ar=?, video_ar=?, video_2_ar=?, video_3_ar=?, video_text_ar=?, video_2_text_ar=?, video_3_text_ar=? WHERE id=?`).run(
      updateValues.tag, updateValues.title, updateValues.description, updateValues.image, 
      updateValues.video, updateValues.video_2, updateValues.video_3, 
      updateValues.video_text, updateValues.video_2_text, updateValues.video_3_text, 
      updateValues.buttonPrimaryText, updateValues.buttonPrimaryLink, 
      updateValues.buttonSecondaryText, updateValues.buttonSecondaryLink, 
      updateValues.sortOrder, updateValues.isActive, 
      updateValues.tag_ar, updateValues.title_ar, updateValues.description_ar, 
      updateValues.buttonPrimaryText_ar, updateValues.buttonSecondaryText_ar, 
      updateValues.video_ar, updateValues.video_2_ar, updateValues.video_3_ar, 
      updateValues.video_text_ar, updateValues.video_2_text_ar, updateValues.video_3_text_ar, 
      req.params.id
    );
    
    const updated = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/slides/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM hero_slides WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ ABOUT VIDEOS ============
app.get('/api/about-videos', (req, res) => {
  try {
    const videos = db.prepare('SELECT * FROM about_videos ORDER BY sortOrder ASC').all();
    res.json(videos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/about-videos/active', (req, res) => {
  try {
    const videos = db.prepare('SELECT * FROM about_videos WHERE isActive = 1 ORDER BY sortOrder ASC').all();
    res.json(videos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/about-videos', authenticateToken, (req, res) => {
  try {
    const { title, description, video_url, image, sortOrder, isActive, title_ar, description_ar, video_url_ar } = req.body;
    
    const result = db.prepare(`INSERT INTO about_videos (title, description, video_url, image, sortOrder, isActive, title_ar, description_ar, video_url_ar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, description, video_url, image || null, sortOrder || 0, isActive !== undefined ? isActive : 1, title_ar, description_ar, video_url_ar || null);
    
    const newVideo = db.prepare('SELECT * FROM about_videos WHERE id = ?').get(result.lastInsertRowid);
    res.json(newVideo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/about-videos/:id', authenticateToken, (req, res) => {
  try {
    const { title, description, video_url, image, sortOrder, isActive, title_ar, description_ar, video_url_ar } = req.body;
    
    db.prepare(`UPDATE about_videos SET title=?, description=?, video_url=?, image=?, sortOrder=?, isActive=?, title_ar=?, description_ar=?, video_url_ar=? WHERE id=?`).run(title, description, video_url, image || null, sortOrder, isActive, title_ar, description_ar, video_url_ar || null, req.params.id);
    
    const updated = db.prepare('SELECT * FROM about_videos WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/about-videos/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM about_videos WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ COMPANY PROFILE ============
app.get('/api/company-profile', (req, res) => {
  try {
    const profiles = db.prepare('SELECT * FROM company_profile_settings ORDER BY language ASC').all();
    res.json(profiles);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/company-profile', authenticateToken, (req, res) => {
  try {
    const { language, url, title, description } = req.body;
    
    db.prepare(`INSERT OR REPLACE INTO company_profile_settings (language, url, title, description) VALUES (?, ?, ?, ?)`).run(language, url, title, description);
    
    const updated = db.prepare('SELECT * FROM company_profile_settings WHERE language = ?').get(language);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ ADMIN - SERVICES ============
app.post('/api/services', authenticateToken, (req, res) => {
  try {
    const { title, description, image, icon, features, sortOrder, isActive, title_ar, description_ar, features_ar } = req.body;
    
    const result = db.prepare(`INSERT INTO services (title, description, image, icon, features, sortOrder, isActive, title_ar, description_ar, features_ar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, description, image, icon || 'Briefcase', JSON.stringify(features || []), sortOrder || 0, isActive !== undefined ? isActive : 1, title_ar, description_ar, typeof features_ar === 'string' ? features_ar : JSON.stringify(features_ar || []));
    
    const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.json(newService);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  try {
    const { title, description, image, icon, features, sortOrder, isActive, title_ar, description_ar, features_ar } = req.body;
    
    db.prepare(`UPDATE services SET title=?, description=?, image=?, icon=?, features=?, sortOrder=?, isActive=?, title_ar=?, description_ar=?, features_ar=? WHERE id=?`).run(title, description, image, icon, JSON.stringify(features || []), sortOrder, isActive, title_ar, description_ar, typeof features_ar === 'string' ? features_ar : JSON.stringify(features_ar || []), req.params.id);
    
    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ============ CONTACTS ============
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY id DESC').all();
    res.json(contacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/contacts', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const result = db.prepare('INSERT INTO contacts (name, email, phone, subject, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, email, phone, subject, message, new Date().toISOString(), 'new');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/contacts/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send reply to contact
app.post('/api/contacts/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    const result = await sendContactReply(contact.email, contact.name, contact.subject, message);
    
    if (result.success) {
      db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run('replied', req.params.id);
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ PRICING REQUESTS ============
app.get('/api/pricing', (req, res) => {
  try {
    const requests = db.prepare('SELECT * FROM pricing_requests ORDER BY id DESC').all();
    res.json(requests);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/pricing', (req, res) => {
  try {
    const { name, email, phone, company, projectType, projectSize, location, budget, timeline, description, contactMethod } = req.body;
    const result = db.prepare('INSERT INTO pricing_requests (name, email, phone, company, projectType, projectSize, location, budget, timeline, description, contactMethod, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(name, email, phone, company, projectType, projectSize, location, budget, timeline, description, contactMethod, new Date().toISOString(), 'new');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/pricing/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE pricing_requests SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send reply to pricing request
app.post('/api/pricing/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const pricing = db.prepare('SELECT * FROM pricing_requests WHERE id = ?').get(req.params.id);
    
    if (!pricing) {
      return res.status(404).json({ success: false, message: 'Pricing request not found' });
    }

    const result = await sendPricingReply(pricing.email, pricing.name, 'Pricing Inquiry Response', message);
    
    if (result.success) {
      db.prepare('UPDATE pricing_requests SET status = ? WHERE id = ?').run('replied', req.params.id);
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ NEWSLETTER ============
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    db.prepare("INSERT OR IGNORE INTO newsletter_subscribers (email, status) VALUES (?, 'active')").run(email);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/newsletter/unsubscribe', (req, res) => {
  try {
    const { email } = req.body;
    db.prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed' WHERE email = ?").run(email);
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/newsletter/subscribers', authenticateToken, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY createdAt DESC').all();
    res.json(subscribers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ SERVER START ============
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TRQ Server running on http://localhost:${PORT}`);
  console.log('Connected to SQLite database');
});


