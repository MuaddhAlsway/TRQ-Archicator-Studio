import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'trq.db');

console.log('Initializing SQLite database (primary)...');
console.log('Database path:', dbPath);
const db = new Database(dbPath);
console.log('✓ SQLite database connected');

// Turso for cloud sync
let turso = null;
try {
  console.log('Connecting to Turso for cloud sync...');
  turso = createClient({
    url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNTIzOTgsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.wuqV4gMDURz9fkb2sfbjxwZQ55dyteRTTQUUVOf9jjykLuyFWcDH5OMQ9luAii5bwsH5HVIuMXiR4mhVahLcAQ',
  });
  console.log('✓ Turso connected for cloud sync');
} catch (e) {
  console.warn('⚠ Turso sync unavailable:', e.message);
}

// Simple in-memory cache
const cache = {
  projects: null,
  projectsExpiry: 0,
};

const CACHE_TTL = 30 * 1000; // 30 seconds

// Sync to Turso in background (non-blocking)
async function syncToTurso(sql, params) {
  if (!turso) return;
  try {
    const convertedParams = params.map(param => {
      if (param === undefined) return null;
      if (typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean' || param === null) {
        return param;
      }
      if (typeof param === 'object') return JSON.stringify(param);
      return param;
    });
    await turso.execute({ sql, args: convertedParams });
  } catch (e) {
    if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
      console.warn('[TURSO SYNC] Error:', e.message);
    }
  }
}

// Migrate Turso schema — adds missing columns and tables silently
async function migrateTursoSchema() {
  if (!turso) return;

  // ── hero_slides columns ──────────────────────────────────────────────────
  const heroColumns = [
    'video', 'video_2', 'video_3',
    'video_text', 'video_2_text', 'video_3_text',
    'image_2', 'image_3',
    'tag_ar', 'title_ar', 'description_ar',
    'video_ar', 'video_2_ar', 'video_3_ar',
    'video_text_ar', 'video_2_text_ar', 'video_3_text_ar',
    'buttonPrimaryText_ar', 'buttonSecondaryText_ar',
  ];

  for (const col of heroColumns) {
    try {
      await turso.execute({ sql: `ALTER TABLE hero_slides ADD COLUMN ${col} TEXT` });
    } catch (_) { /* already exists — ignore */ }
  }

  // ── newsletter_subscribers table ─────────────────────────────────────────
  try {
    await turso.execute({
      sql: `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    });
  } catch (_) { /* already exists — ignore */ }

  // ── about_videos table ───────────────────────────────────────────────────
  try {
    await turso.execute({
      sql: `CREATE TABLE IF NOT EXISTS about_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        image TEXT,
        sortOrder INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        title_ar TEXT,
        description_ar TEXT,
        video_url_ar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    });
  } catch (_) { /* already exists — ignore */ }

  // ── blog_articles table ──────────────────────────────────────────────────
  try {
    await turso.execute({
      sql: `CREATE TABLE IF NOT EXISTS blog_articles (
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
      )`,
    });
  } catch (_) { /* already exists — ignore */ }
}

// Run migration on startup (non-blocking, errors suppressed)
migrateTursoSchema().catch(() => {});

// Create wrapper for SQLite (fast, primary)
const dbWrapper = {
  prepare: (sql) => {
    const stmt = db.prepare(sql);
    return {
      run: (...params) => {
        try {
          const result = stmt.run(...params);
          cache.projects = null; // invalidate cache
          if (turso && (sql.includes('INSERT') || sql.includes('UPDATE') || sql.includes('DELETE'))) {
            syncToTurso(sql, params).catch(() => {});
          }
          return { lastInsertRowid: result.lastInsertRowid, changes: result.changes };
        } catch (error) {
          console.error('[DB] Run error:', error.message);
          throw error;
        }
      },
      get: (...params) => {
        try {
          return stmt.get(...params) || null;
        } catch (error) {
          console.error('[DB] Get error:', error.message);
          throw error;
        }
      },
      all: (...params) => {
        try {
          if (sql.includes('SELECT * FROM projects') && !params.length) {
            if (cache.projects && cache.projectsExpiry > Date.now()) {
              console.log('[CACHE] Returning cached projects');
              return cache.projects;
            }
          }
          const result = stmt.all(...params);
          if (sql.includes('SELECT * FROM projects') && !params.length) {
            cache.projects = result || [];
            cache.projectsExpiry = Date.now() + CACHE_TTL;
          }
          return result || [];
        } catch (error) {
          console.error('[DB] All error:', error.message);
          throw error;
        }
      },
    };
  },
  exec: (sql) => {
    try {
      db.exec(sql);
    } catch (error) {
      console.error('Database exec error:', error);
      throw error;
    }
  },
};

// ── SQLite table creation & local migrations ─────────────────────────────────
(async () => {
  try {
    console.log('Initializing database tables...');

    db.exec(`
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
        title_ar TEXT,
        description_ar TEXT,
        features_ar TEXT,
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
        title_ar TEXT,
        category_ar TEXT,
        subcategory_ar TEXT,
        description_ar TEXT,
        location_ar TEXT,
        client_ar TEXT,
        size_ar TEXT,
        duration_ar TEXT,
        detailedDescription_ar TEXT,
        challenge_ar TEXT,
        solution_ar TEXT,
        features_ar TEXT,
        materials_ar TEXT,
        awards_ar TEXT,
        team_ar TEXT,
        clientQuote_ar TEXT,
        clientName_ar TEXT,
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
        isActive INTEGER DEFAULT 1,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expiresAt DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        refresh_token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        refresh_expires_at DATETIME NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS hero_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        image_2 TEXT,
        image_3 TEXT,
        video TEXT,
        video_2 TEXT,
        video_3 TEXT,
        video_text TEXT,
        video_2_text TEXT,
        video_3_text TEXT,
        buttonPrimaryText TEXT DEFAULT 'VIEW PORTFOLIO',
        buttonPrimaryLink TEXT DEFAULT 'portfolio',
        buttonSecondaryText TEXT DEFAULT 'GET IN TOUCH',
        buttonSecondaryLink TEXT DEFAULT 'contact',
        sortOrder INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        tag_ar TEXT,
        title_ar TEXT,
        description_ar TEXT,
        buttonPrimaryText_ar TEXT,
        buttonSecondaryText_ar TEXT,
        video_ar TEXT,
        video_2_ar TEXT,
        video_3_ar TEXT,
        video_text_ar TEXT,
        video_2_text_ar TEXT,
        video_3_text_ar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        image TEXT,
        sortOrder INTEGER DEFAULT 0,
        isActive INTEGER DEFAULT 1,
        title_ar TEXT,
        description_ar TEXT,
        video_url_ar TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS company_profile_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(language)
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ── Local SQLite migrations (add missing columns to existing tables) ──
    const addColumnIfMissing = (table, column, type = 'TEXT') => {
      try {
        const info = db.prepare(`PRAGMA table_info(${table})`).all();
        if (!info.find(c => c.name === column)) {
          db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
          console.log(`✓ Added ${column} to ${table}`);
        }
      } catch (e) {
        if (!e.message.includes('duplicate')) console.warn(`Migration ${table}.${column}:`, e.message);
      }
    };

    // hero_slides
    const heroSlidesCols = [
      'video', 'video_2', 'video_3',
      'video_text', 'video_2_text', 'video_3_text',
      'image_2', 'image_3',
      'tag_ar', 'title_ar', 'description_ar',
      'video_ar', 'video_2_ar', 'video_3_ar',
      'video_text_ar', 'video_2_text_ar', 'video_3_text_ar',
      'buttonPrimaryText_ar', 'buttonSecondaryText_ar',
    ];
    heroSlidesCols.forEach(col => addColumnIfMissing('hero_slides', col));

    // services
    ['title_ar', 'description_ar', 'features_ar'].forEach(col => addColumnIfMissing('services', col));

    // newsletter_subscribers — migrate old isActive column to status if needed
    try {
      const nlInfo = db.prepare('PRAGMA table_info(newsletter_subscribers)').all();
      const hasIsActive = nlInfo.find(c => c.name === 'isActive');
      const hasStatus   = nlInfo.find(c => c.name === 'status');
      if (hasIsActive && !hasStatus) {
        db.exec(`ALTER TABLE newsletter_subscribers ADD COLUMN status TEXT DEFAULT 'active'`);
        db.exec(`UPDATE newsletter_subscribers SET status = CASE WHEN isActive = 1 THEN 'active' ELSE 'unsubscribed' END`);
        console.log('✓ Migrated newsletter_subscribers isActive → status');
      }
    } catch (e) {
      if (!e.message.includes('duplicate')) console.warn('Newsletter migration:', e.message);
    }

    console.log('✓ Database tables ready');
    console.log('✓ Database initialization complete');
  } catch (e) {
    if (!e.message.includes('already exists')) {
      console.error('Database initialization error:', e.message);
    }
  }
})();

export default dbWrapper;
