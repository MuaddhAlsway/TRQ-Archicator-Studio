import db from './database.js';

// Helper to authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  req.authenticated = true;
  next();
};

// ============ HERO SLIDES ARABIC ============
export function setupArabicSlidesRoutes(app) {
  app.get('/api/arabic/heroSlides', authenticateToken, (req, res) => {
    try {
      const slides = db.prepare('SELECT * FROM hero_slides ORDER BY id DESC').all();
      
      const slidesWithArabic = slides.map(slide => ({
        id: slide.id,
        englishTitle: slide.title,
        arabicTitle: slide.title,
        englishDescription: slide.description,
        arabicDescription: slide.description,
      }));

      res.json({ success: true, data: slidesWithArabic });
    } catch (error) {
      console.error('Error fetching Arabic slides:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch slides' });
    }
  });

  app.put('/api/arabic/heroSlides/:id', authenticateToken, (req, res) => {
    const { arabicTitle, arabicDescription } = req.body;
    const slideId = req.params.id;

    try {
      db.prepare('UPDATE hero_slides SET title = ? WHERE id = ?').run(arabicTitle, slideId);
      res.json({ success: true, message: 'Slide updated successfully' });
    } catch (error) {
      console.error('Error updating Arabic slide:', error);
      res.status(500).json({ success: false, message: 'Failed to update slide' });
    }
  });
}

// ============ PROJECTS ARABIC ============
export function setupArabicProjectsRoutes(app, db) {
  app.get('/api/arabic/projects', authenticateToken, async (req, res) => {
    try {
      const projects = await db.all('SELECT * FROM projects ORDER BY id DESC');
      
      const projectsWithArabic = projects.map(project => ({
        id: project.id,
        englishTitle: project.title,
        arabicTitle: project.title_ar || '',
        englishDescription: project.description,
        arabicDescription: project.description_ar || '',
      }));

      res.json({ success: true, data: projectsWithArabic });
    } catch (error) {
      console.error('Error fetching Arabic projects:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
  });

  app.put('/api/arabic/projects/:id', authenticateToken, async (req, res) => {
    const { arabicTitle, arabicDescription } = req.body;
    const projectId = req.params.id;

    try {
      await db.run(
        'UPDATE projects SET title_ar = ?, description_ar = ? WHERE id = ?',
        [arabicTitle, arabicDescription, projectId]
      );

      res.json({ success: true, message: 'Project Arabic content updated' });
    } catch (error) {
      console.error('Error updating Arabic project:', error);
      res.status(500).json({ success: false, message: 'Failed to update project' });
    }
  });
}

// ============ SERVICES ARABIC ============
export function setupArabicServicesRoutes(app, db) {
  app.get('/api/arabic/services', authenticateToken, async (req, res) => {
    try {
      const services = await db.all('SELECT * FROM services ORDER BY sortOrder ASC');
      
      const servicesWithArabic = services.map(service => ({
        id: service.id,
        englishTitle: service.title,
        arabicTitle: service.title,
        englishDescription: service.description,
        arabicDescription: service.description,
      }));

      res.json({ success: true, data: servicesWithArabic });
    } catch (error) {
      console.error('Error fetching Arabic services:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
  });

  app.put('/api/arabic/services/:id', authenticateToken, async (req, res) => {
    const { arabicTitle, arabicDescription } = req.body;
    const serviceId = req.params.id;

    try {
      await db.run(
        'UPDATE services SET title = ? WHERE id = ?',
        [arabicTitle, serviceId]
      );

      res.json({ success: true, message: 'Service Arabic content updated' });
    } catch (error) {
      console.error('Error updating Arabic service:', error);
      res.status(500).json({ success: false, message: 'Failed to update service' });
    }
  });
}

// ============ BLOG ARTICLES ARABIC ============
export function setupArabicBlogRoutes(app, db) {
  app.get('/api/arabic/blog', authenticateToken, async (req, res) => {
    try {
      const articles = await db.all('SELECT * FROM blog_articles ORDER BY id DESC');
      
      const articlesWithArabic = articles.map(article => ({
        id: article.id,
        englishTitle: article.title,
        arabicTitle: article.title,
        englishDescription: article.excerpt,
        arabicDescription: article.excerpt,
      }));

      res.json({ success: true, data: articlesWithArabic });
    } catch (error) {
      console.error('Error fetching Arabic blog articles:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch articles' });
    }
  });

  app.put('/api/arabic/blog/:id', authenticateToken, async (req, res) => {
    const { arabicTitle, arabicDescription } = req.body;
    const articleId = req.params.id;

    try {
      await db.run(
        'UPDATE blog_articles SET title = ?, excerpt = ? WHERE id = ?',
        [arabicTitle, arabicDescription, articleId]
      );

      res.json({ success: true, message: 'Article Arabic content updated' });
    } catch (error) {
      console.error('Error updating Arabic article:', error);
      res.status(500).json({ success: false, message: 'Failed to update article' });
    }
  });
}

// ============ SITE SETTINGS ARABIC ============
export function setupArabicSettingsRoutes(app, db) {
  app.get('/api/arabic/settings', authenticateToken, async (req, res) => {
    try {
      const settings = await db.all(`
        SELECT key, value FROM settings WHERE key LIKE '%_ar'
        ORDER BY key ASC
      `);

      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error fetching Arabic settings:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
  });

  app.put('/api/arabic/settings/:key', authenticateToken, async (req, res) => {
    const { value } = req.body;
    const key = req.params.key;

    try {
      await db.run(
        'INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, value]
      );

      res.json({ success: true, message: 'Setting updated successfully' });
    } catch (error) {
      console.error('Error updating Arabic setting:', error);
      res.status(500).json({ success: false, message: 'Failed to update setting' });
    }
  });
}

// Setup all Arabic routes
export function setupArabicRoutes(app, db) {
  setupArabicSlidesRoutes(app, db);
  setupArabicProjectsRoutes(app, db);
  setupArabicServicesRoutes(app, db);
  setupArabicBlogRoutes(app, db);
  setupArabicSettingsRoutes(app, db);
}
