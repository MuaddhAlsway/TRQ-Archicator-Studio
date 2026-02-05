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
    // Convert params to ensure Turso compatibility
    const convertedParams = params.map(param => {
      // Convert undefined to null
      if (param === undefined) return null;
      // Keep strings, numbers, booleans, and null as-is
      if (typeof param === 'string' || typeof param === 'number' || typeof param === 'boolean' || param === null) {
        return param;
      }
      // Convert objects/arrays to JSON strings
      if (typeof param === 'object') {
        return JSON.stringify(param);
      }
      return param;
    });
    
    await turso.execute({ sql, args: convertedParams });
  } catch (e) {
    console.warn('[TURSO SYNC] Error:', e.message);
  }
}

// Create wrapper for SQLite (fast, primary)
const dbWrapper = {
  prepare: (sql) => {
    const stmt = db.prepare(sql);
    return {
      run: (...params) => {
        try {
          const result = stmt.run(...params);
          // Invalidate cache
          cache.projects = null;
          // Sync to Turso in background (don't wait)
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
          // Check cache for projects
          if (sql.includes('SELECT * FROM projects') && !params.length) {
            if (cache.projects && cache.projectsExpiry > Date.now()) {
              console.log('[CACHE] Returning cached projects');
              return cache.projects;
            }
          }
          
          const result = stmt.all(...params);
          
          // Cache projects
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

// Quick initialization - create tables if they don't exist
(async () => {
  try {
    console.log('Initializing database tables...');
    
    // Create tables in SQLite
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
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
        isActive INTEGER DEFAULT 1,
        subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add migration for missing columns in services table
    try {
      const tableInfo = db.prepare("PRAGMA table_info(services)").all();
      const columnNames = tableInfo.map(col => col.name);
      
      if (!columnNames.includes('title_ar')) {
        console.log('Adding title_ar column to services table...');
        db.exec('ALTER TABLE services ADD COLUMN title_ar TEXT');
      }
      if (!columnNames.includes('description_ar')) {
        console.log('Adding description_ar column to services table...');
        db.exec('ALTER TABLE services ADD COLUMN description_ar TEXT');
      }
      if (!columnNames.includes('features_ar')) {
        console.log('Adding features_ar column to services table...');
        db.exec('ALTER TABLE services ADD COLUMN features_ar TEXT');
      }
    } catch (e) {
      console.warn('Migration check error:', e.message);
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
