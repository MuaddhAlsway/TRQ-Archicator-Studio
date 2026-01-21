import Database from 'better-sqlite3';

const db = new Database(':memory:');

console.log('Testing CREATE TABLE statements...');
try {
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
`);
  console.log('✓ CREATE TABLE statements executed');
  
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`✓ Created ${tables.length} tables:`, tables.map(t => t.name));
} catch (e) {
  console.error('✗ Error:', e.message);
}

db.close();
