import { createClient } from '@libsql/client';
import 'dotenv/config';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seedDatabase() {
  console.log('🌱 Starting database seed...');
  console.log('URL:', process.env.TURSO_DATABASE_URL);

  try {
    // Create tables one by one
    console.log('Creating tables...');
    
    await turso.execute(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, email TEXT, password TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL, subcategory TEXT, description TEXT, image TEXT, year TEXT, location TEXT, client TEXT, size TEXT, duration TEXT, detailedDescription TEXT, challenge TEXT, solution TEXT, features TEXT, materials TEXT, awards TEXT, team TEXT, gallery TEXT, clientQuote TEXT, clientName TEXT, status TEXT DEFAULT 'draft', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, image TEXT, icon TEXT DEFAULT 'Briefcase', features TEXT, sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS hero_slides (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT NOT NULL, title TEXT NOT NULL, description TEXT, image TEXT, buttonPrimaryText TEXT DEFAULT 'VIEW PORTFOLIO', buttonPrimaryLink TEXT DEFAULT 'portfolio', buttonSecondaryText TEXT DEFAULT 'GET IN TOUCH', buttonSecondaryLink TEXT DEFAULT 'contact', sortOrder INTEGER DEFAULT 0, isActive INTEGER DEFAULT 1, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS blog_articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, excerpt TEXT, content TEXT, image TEXT, author TEXT, date TEXT, readTime TEXT, category TEXT, categorySlug TEXT, tags TEXT, status TEXT DEFAULT 'draft', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT, message TEXT, date TEXT, status TEXT DEFAULT 'new', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS pricing_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT, projectType TEXT, projectSize TEXT, location TEXT, budget TEXT, timeline TEXT, description TEXT, contactMethod TEXT, date TEXT, status TEXT DEFAULT 'new', createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS translations (id INTEGER PRIMARY KEY AUTOINCREMENT, sourceText TEXT NOT NULL, targetLang TEXT NOT NULL, translatedText TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(sourceText, targetLang))`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS password_resets (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, token TEXT UNIQUE NOT NULL, expiresAt DATETIME NOT NULL, used INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await turso.execute(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP, isActive INTEGER DEFAULT 1)`);
    
    console.log('✅ Tables created');

    // Insert admin user
    console.log('Creating admin user...');
    await turso.execute({ sql: 'INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)', args: ['admin', 'admin@trq.design', 'trq2026'] });
    console.log('✅ Admin user created');

    // Insert hero slides
    console.log('Inserting hero slides...');
    const slides = [
      ['TRQ Design Studio', 'Elevating Spaces, Defining Luxury', 'Premium interior design solutions for discerning clients.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1920&q=80', 1],
      ['Residential Design', 'Luxury Living Spaces', 'Creating timeless residential interiors.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 2],
      ['Commercial Design', 'Inspiring Workspaces', 'Transforming commercial environments.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80', 3],
    ];
    for (const s of slides) {
      await turso.execute({ sql: 'INSERT INTO hero_slides (tag, title, description, image, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, 1)', args: s });
    }
    console.log('✅ Hero slides inserted');

    // Insert services
    console.log('Inserting services...');
    const services = [
      ['Residential Interior Design', 'Transform your home into a sanctuary.', 'https://images.unsplash.com/photo-1669387448840-610c588f003d?w=1080', 'Home', '["Custom space planning", "Material selection", "Furniture specification"]', 1],
      ['Commercial Interior Design', 'Create inspiring workspaces.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1080', 'Briefcase', '["Office design", "Brand integration", "Ergonomic solutions"]', 2],
      ['Booth & Exhibition Design', 'Stand out at trade shows.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080', 'Boxes', '["Custom booth design", "Brand storytelling", "Interactive displays"]', 3],
      ['Event Design', 'Create unforgettable experiences.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1080', 'Calendar', '["Concept development", "Space planning", "Décor styling"]', 4],
      ['Furniture Design', 'Bespoke furniture pieces.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1080', 'Armchair', '["Custom design", "Material selection", "Prototype development"]', 5],
    ];
    for (const s of services) {
      await turso.execute({ sql: 'INSERT INTO services (title, description, image, icon, features, sortOrder, isActive) VALUES (?, ?, ?, ?, ?, ?, 1)', args: s });
    }
    console.log('✅ Services inserted');

    // Insert projects
    console.log('Inserting projects...');
    const projects = [
      ['Royal Residence', 'residential', 'Luxury Villa', 'A timeless luxury villa featuring classical elegance.', 'https://images.unsplash.com/photo-1669387448840-610c588f003d?w=1080', '2025', 'Riyadh, Saudi Arabia', 'Private Client', '800 sqm', '8 months', 'published'],
      ['Master Suite Retreat', 'residential', 'Bedroom Design', 'Serene bedroom suite with custom furniture.', 'https://images.unsplash.com/photo-1625579002297-aeebbf69de89?w=1080', '2025', 'Riyadh, Saudi Arabia', 'Private Client', '120 sqm', '3 months', 'published'],
      ['Grand Hotel Lobby', 'commercial', 'Hospitality', 'Breathtaking hotel lobby for luxury hospitality.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1080', '2025', 'Riyadh, Saudi Arabia', 'Luxury Hotels Group', '2000 sqm', '12 months', 'published'],
      ['Tech Startup HQ', 'commercial', 'Office Design', 'Innovative office promoting collaboration.', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1080', '2024', 'Riyadh, Saudi Arabia', 'TechVenture Inc.', '1500 sqm', '6 months', 'published'],
      ['Luxury Boutique', 'commercial', 'Retail Design', 'High-end retail space for luxury products.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1080', '2025', 'Riyadh, Saudi Arabia', 'Maison Elegance', '300 sqm', '5 months', 'published'],
      ['Tech Expo Booth', 'booths', 'Exhibition Stand', 'Eye-catching exhibition booth.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080', '2025', 'Dubai, UAE', 'InnoTech Solutions', '100 sqm', '3 weeks', 'published'],
      ['Gala Evening', 'events', 'Event Design', 'Sophisticated event design.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1080', '2025', 'Riyadh, Saudi Arabia', 'Royal Foundation', '1000 sqm', '2 weeks', 'published'],
      ['Designer Collection', 'furniture', 'Custom Furniture', 'Bespoke furniture pieces.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1080', '2024', 'Riyadh, Saudi Arabia', 'Private Collector', 'N/A', '4 months', 'published'],
    ];
    for (const p of projects) {
      await turso.execute({ sql: `INSERT INTO projects (title, category, subcategory, description, image, year, location, client, size, duration, status, features, materials, awards, team, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]', '[]', '[]')`, args: p });
    }
    console.log('✅ Projects inserted');

    // Insert blog articles
    console.log('Inserting blog articles...');
    const articles = [
      ['The Art of Minimalist Design', 'art-of-minimalist-design', 'Discover how less can truly be more in interior design.', '<p>Minimalist design is about creating spaces that are both functional and beautiful.</p>', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1080', 'Sarah Al-Mutairi', '2025-01-10', '5 min read', 'Design Tips', 'design-tips', '["minimalism", "interior design"]', 'published'],
      ['Interior Design Trends 2025', 'interior-design-trends-2025', 'Explore the latest trends shaping interior design.', '<p>2025 brings exciting new trends in interior design.</p>', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080', 'Ahmed Hassan', '2025-01-05', '7 min read', 'Trends', 'trends', '["trends", "2025"]', 'published'],
    ];
    for (const a of articles) {
      await turso.execute({ sql: 'INSERT INTO blog_articles (title, slug, excerpt, content, image, author, date, readTime, category, categorySlug, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', args: a });
    }
    console.log('✅ Blog articles inserted');

    // Insert settings
    console.log('Inserting settings...');
    const settings = [
      ['servicesTitle', 'Complete Design Solutions'],
      ['servicesDescription', 'From intimate residential spaces to grand commercial projects, TRQ offers a comprehensive suite of design services.'],
      ['homeIntroTitle', 'Creating Timeless Design Solutions'],
      ['homeIntroText1', 'TRQ is a luxury and creative interior design studio based in Riyadh, Saudi Arabia.'],
      ['homeIntroText2', 'Our approach combines artistic vision with practical expertise.'],
    ];
    for (const s of settings) {
      await turso.execute({ sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', args: s });
    }
    console.log('✅ Settings inserted');

    console.log('\n🎉 Database seeded successfully!');
    
    // Verify data
    const projectCount = await turso.execute('SELECT COUNT(*) as count FROM projects');
    const serviceCount = await turso.execute('SELECT COUNT(*) as count FROM services');
    const slideCount = await turso.execute('SELECT COUNT(*) as count FROM hero_slides');
    
    console.log(`\n📊 Data summary:`);
    console.log(`   Projects: ${projectCount.rows[0].count}`);
    console.log(`   Services: ${serviceCount.rows[0].count}`);
    console.log(`   Hero Slides: ${slideCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
