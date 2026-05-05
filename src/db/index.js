/**
 * Database Utilities - D1 Query Helpers
 */

export class Database {
  constructor(db) {
    this.db = db;
  }

  async query(sql, params = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).all();
      return result.results || [];
    } catch (err) {
      console.error('Query error:', err, { sql, params });
      throw err;
    }
  }

  async queryOne(sql, params = []) {
    const results = await this.query(sql, params);
    return results[0] || null;
  }

  async execute(sql, params = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).run();
      return result;
    } catch (err) {
      console.error('Execute error:', err, { sql, params });
      throw err;
    }
  }

  async transaction(callback) {
    try {
      await this.execute('BEGIN TRANSACTION');
      const result = await callback(this);
      await this.execute('COMMIT');
      return result;
    } catch (err) {
      await this.execute('ROLLBACK');
      throw err;
    }
  }
}

export async function initializeDatabase(db) {
  const database = new Database(db);
  
  // Create tables if they don't exist
  await database.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_ar TEXT,
      category TEXT,
      category_ar TEXT,
      subcategory TEXT,
      subcategory_ar TEXT,
      description TEXT,
      description_ar TEXT,
      image TEXT,
      year INTEGER,
      location TEXT,
      location_ar TEXT,
      client TEXT,
      client_ar TEXT,
      size TEXT,
      size_ar TEXT,
      duration TEXT,
      duration_ar TEXT,
      detailedDescription TEXT,
      detailedDescription_ar TEXT,
      challenge TEXT,
      challenge_ar TEXT,
      solution TEXT,
      solution_ar TEXT,
      features TEXT,
      features_ar TEXT,
      materials TEXT,
      materials_ar TEXT,
      awards TEXT,
      awards_ar TEXT,
      team TEXT,
      team_ar TEXT,
      gallery TEXT,
      clientQuote TEXT,
      clientQuote_ar TEXT,
      clientName TEXT,
      clientName_ar TEXT,
      status TEXT DEFAULT 'draft',
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT,
      tag_ar TEXT,
      title TEXT NOT NULL,
      title_ar TEXT,
      description TEXT,
      description_ar TEXT,
      image TEXT,
      video TEXT,
      video_ar TEXT,
      video_2 TEXT,
      video_2_ar TEXT,
      video_3 TEXT,
      video_3_ar TEXT,
      video_text TEXT,
      video_text_ar TEXT,
      video_2_text TEXT,
      video_2_text_ar TEXT,
      video_3_text TEXT,
      video_3_text_ar TEXT,
      buttonPrimaryText TEXT DEFAULT 'VIEW PORTFOLIO',
      buttonPrimaryText_ar TEXT,
      buttonPrimaryLink TEXT DEFAULT 'portfolio',
      buttonSecondaryText TEXT DEFAULT 'GET IN TOUCH',
      buttonSecondaryText_ar TEXT,
      buttonSecondaryLink TEXT DEFAULT 'contact',
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_ar TEXT,
      description TEXT,
      description_ar TEXT,
      icon TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS blog_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      author TEXT,
      date TEXT,
      readTime INTEGER,
      category TEXT,
      categorySlug TEXT,
      tags TEXT,
      status TEXT DEFAULT 'draft',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for performance
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_projects_sortorder ON projects(sortOrder);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(isActive);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_hero_slides_sortorder ON hero_slides(sortOrder);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_services_active ON services(isActive);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_services_sortorder ON services(sortOrder);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_articles(status);`);
  await database.execute(`CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_articles(slug);`);

  return database;
}
