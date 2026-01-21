import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from './database.js';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
    const projects = db.prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC").all();
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
