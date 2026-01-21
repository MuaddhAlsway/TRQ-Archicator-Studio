import { createClient } from '@libsql/client';
import 'dotenv/config';

// Create Turso client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Helper to run queries (compatible with better-sqlite3 API)
const dbWrapper = {
  prepare: (sql) => ({
    run: async (...params) => {
      const result = await db.execute({ sql, args: params });
      return { lastInsertRowid: result.lastInsertRowid, changes: result.rowsAffected };
    },
    get: async (...params) => {
      const result = await db.execute({ sql, args: params });
      return result.rows[0] || null;
    },
    all: async (...params) => {
      const result = await db.execute({ sql, args: params });
      return result.rows;
    },
  }),
  exec: async (sql) => {
    await db.executeMultiple(sql);
  },
};

// Initialize tables
async function initDatabase() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sourceText TEXT NOT NULL,
      targetLang TEXT NOT NULL,
      translatedText TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(sourceText, targetLang)
    );

    CREATE TABLE IF NOT EXISTS blog_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      author TEXT,
      date TEXT,
      readTime TEXT,
      category TEXT,
      categorySlug TEXT,
      tags TEXT,
      status TEXT DEFAULT 'draft',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      icon TEXT DEFAULT 'Briefcase',
      features TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      description TEXT,
      image TEXT,
      year TEXT,
      location TEXT,
      client TEXT,
      size TEXT,
      duration TEXT,
      detailedDescription TEXT,
      challenge TEXT,
      solution TEXT,
      features TEXT,
      materials TEXT,
      awards TEXT,
      team TEXT,
      gallery TEXT,
      clientQuote TEXT,
      clientName TEXT,
      status TEXT DEFAULT 'draft',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT,
      date TEXT,
      status TEXT DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pricing_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      projectType TEXT,
      projectSize TEXT,
      location TEXT,
      budget TEXT,
      timeline TEXT,
      description TEXT,
      contactMethod TEXT,
      date TEXT,
      status TEXT DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expiresAt DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      buttonPrimaryText TEXT DEFAULT 'VIEW PORTFOLIO',
      buttonPrimaryLink TEXT DEFAULT 'portfolio',
      buttonSecondaryText TEXT DEFAULT 'GET IN TOUCH',
      buttonSecondaryLink TEXT DEFAULT 'contact',
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      isActive INTEGER DEFAULT 1
    );
  `);

  // Insert default admin if not exists
  const adminExists = await db.execute("SELECT id FROM users WHERE username = 'admin'");
  if (adminExists.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      args: ['admin', 'admin@trq.design', 'trq2026']
    });
  }

  console.log('Turso database initialized successfully');
}

// Export for use
export { db, dbWrapper, initDatabase };
export default dbWrapper;
