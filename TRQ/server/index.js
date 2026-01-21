import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './database.js';
import upload, { handleUploadError, getFileUrl, extractFilenameFromUrl, deleteUploadedFile } from './upload-handler.js';

const app = express();
const PORT = 3001;

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

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ============ AUTH MIDDLEWARE ============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  req.authenticated = true;
  next();
};

// ============ PROJECTS ============
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/published', (req, res) => {
  try {
    // First try to get published projects
    let projects = db.prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC").all();
    
    // If no published projects, return all projects (fallback for development)
    if (projects.length === 0) {
      projects = db.prepare("SELECT * FROM projects ORDER BY id DESC").all();
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
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

app.listen(PORT, () => {
  console.log(`TRQ Server running on http://localhost:${PORT}`);
  console.log('Connected to SQLite database');
});

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple auth - in production use proper JWT
    if (username === 'admin' && password === 'trq2026') {
      const token = 'demo-token-' + Date.now();
      res.json({ 
        success: true, 
        token,
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
    const { tag, title, description, image, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive } = req.body;
    
    const result = db.prepare(`INSERT INTO hero_slides (tag, title, description, image, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(tag, title, description, image, buttonPrimaryText || 'VIEW PORTFOLIO', buttonPrimaryLink || 'portfolio', buttonSecondaryText || 'GET IN TOUCH', buttonSecondaryLink || 'contact', sortOrder || 0, isActive !== undefined ? isActive : 1);
    
    const newSlide = db.prepare('SELECT * FROM hero_slides WHERE id = ?').get(result.lastInsertRowid);
    res.json(newSlide);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/slides/:id', authenticateToken, (req, res) => {
  try {
    const { tag, title, description, image, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive } = req.body;
    
    db.prepare(`UPDATE hero_slides SET tag=?, title=?, description=?, image=?, buttonPrimaryText=?, buttonPrimaryLink=?, buttonSecondaryText=?, buttonSecondaryLink=?, sortOrder=?, isActive=? WHERE id=?`).run(tag, title, description, image, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive, req.params.id);
    
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

// ============ ADMIN - SERVICES ============
app.post('/api/services', authenticateToken, (req, res) => {
  try {
    const { title, description, image, icon, features, sortOrder, isActive } = req.body;
    
    const result = db.prepare(`INSERT INTO services (title, description, image, icon, features, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(title, description, image, icon || 'Briefcase', JSON.stringify(features || []), sortOrder || 0, isActive !== undefined ? isActive : 1);
    
    const newService = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.json(newService);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  try {
    const { title, description, image, icon, features, sortOrder, isActive } = req.body;
    
    db.prepare(`UPDATE services SET title=?, description=?, image=?, icon=?, features=?, sortOrder=?, isActive=? WHERE id=?`).run(title, description, image, icon, JSON.stringify(features || []), sortOrder, isActive, req.params.id);
    
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
