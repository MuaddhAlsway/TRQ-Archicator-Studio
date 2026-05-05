-- TRQ Database Schema for Cloudflare D1
-- Run this migration to initialize the database

-- Projects Table
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

-- Hero Slides Table
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

-- Services Table
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

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog Articles Table
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

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_sortorder ON projects(sortOrder);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(isActive);
CREATE INDEX IF NOT EXISTS idx_hero_slides_sortorder ON hero_slides(sortOrder);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(isActive);
CREATE INDEX IF NOT EXISTS idx_services_sortorder ON services(sortOrder);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_articles(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_articles(slug);
