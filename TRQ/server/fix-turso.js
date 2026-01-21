import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to Turso
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Connect to local SQLite
const localDb = new Database(join(__dirname, 'trq.db'));

async function migrateData() {
  console.log('🔄 Migrating data from local SQLite to Turso...\n');

  try {
    // Clear all existing data in Turso
    console.log('🗑️  Clearing existing Turso data...');
    await turso.execute('DELETE FROM projects');
    await turso.execute('DELETE FROM services');
    await turso.execute('DELETE FROM hero_slides');
    await turso.execute('DELETE FROM blog_articles');
    await turso.execute('DELETE FROM settings');
    await turso.execute('DELETE FROM contacts');
    await turso.execute('DELETE FROM pricing_requests');
    await turso.execute('DELETE FROM translations');
    await turso.execute('DELETE FROM users');
    console.log('✅ Turso data cleared\n');

    // Migrate Users
    console.log('👤 Migrating users...');
    const users = localDb.prepare('SELECT * FROM users').all();
    for (const user of users) {
      await turso.execute({
        sql: 'INSERT INTO users (id, username, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
        args: [user.id, user.username, user.email, user.password, user.createdAt]
      });
    }
    console.log(`   ✅ ${users.length} users migrated`);

    // Migrate Projects
    console.log('📁 Migrating projects...');
    const projects = localDb.prepare('SELECT * FROM projects').all();
    for (const p of projects) {
      await turso.execute({
        sql: `INSERT INTO projects (id, title, category, subcategory, description, image, year, location, client, size, duration, detailedDescription, challenge, solution, features, materials, awards, team, gallery, clientQuote, clientName, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [p.id, p.title, p.category, p.subcategory, p.description, p.image, p.year, p.location, p.client, p.size, p.duration, p.detailedDescription, p.challenge, p.solution, p.features, p.materials, p.awards, p.team, p.gallery, p.clientQuote, p.clientName, p.status, p.createdAt]
      });
    }
    console.log(`   ✅ ${projects.length} projects migrated`);

    // Migrate Services
    console.log('🛠️  Migrating services...');
    const services = localDb.prepare('SELECT * FROM services').all();
    for (const s of services) {
      await turso.execute({
        sql: 'INSERT INTO services (id, title, description, image, icon, features, sortOrder, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [s.id, s.title, s.description, s.image, s.icon, s.features, s.sortOrder, s.isActive, s.createdAt]
      });
    }
    console.log(`   ✅ ${services.length} services migrated`);

    // Migrate Hero Slides
    console.log('🖼️  Migrating hero slides...');
    const slides = localDb.prepare('SELECT * FROM hero_slides').all();
    for (const s of slides) {
      await turso.execute({
        sql: 'INSERT INTO hero_slides (id, tag, title, description, image, buttonPrimaryText, buttonPrimaryLink, buttonSecondaryText, buttonSecondaryLink, sortOrder, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [s.id, s.tag, s.title, s.description, s.image, s.buttonPrimaryText, s.buttonPrimaryLink, s.buttonSecondaryText, s.buttonSecondaryLink, s.sortOrder, s.isActive, s.createdAt]
      });
    }
    console.log(`   ✅ ${slides.length} hero slides migrated`);

    // Migrate Blog Articles
    console.log('📝 Migrating blog articles...');
    const articles = localDb.prepare('SELECT * FROM blog_articles').all();
    for (const a of articles) {
      await turso.execute({
        sql: 'INSERT INTO blog_articles (id, title, slug, excerpt, content, image, author, date, readTime, category, categorySlug, tags, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [a.id, a.title, a.slug, a.excerpt, a.content, a.image, a.author, a.date, a.readTime, a.category, a.categorySlug, a.tags, a.status, a.createdAt]
      });
    }
    console.log(`   ✅ ${articles.length} blog articles migrated`);

    // Migrate Settings
    console.log('⚙️  Migrating settings...');
    const settings = localDb.prepare('SELECT * FROM settings').all();
    for (const s of settings) {
      await turso.execute({
        sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)',
        args: [s.key, s.value, s.updatedAt]
      });
    }
    console.log(`   ✅ ${settings.length} settings migrated`);

    // Migrate Contacts
    console.log('📧 Migrating contacts...');
    const contacts = localDb.prepare('SELECT * FROM contacts').all();
    for (const c of contacts) {
      await turso.execute({
        sql: 'INSERT INTO contacts (id, name, email, phone, subject, message, date, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [c.id, c.name, c.email, c.phone, c.subject, c.message, c.date, c.status, c.createdAt]
      });
    }
    console.log(`   ✅ ${contacts.length} contacts migrated`);

    // Migrate Pricing Requests
    console.log('💰 Migrating pricing requests...');
    const pricing = localDb.prepare('SELECT * FROM pricing_requests').all();
    for (const p of pricing) {
      await turso.execute({
        sql: 'INSERT INTO pricing_requests (id, name, email, phone, company, projectType, projectSize, location, budget, timeline, description, contactMethod, date, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [p.id, p.name, p.email, p.phone, p.company, p.projectType, p.projectSize, p.location, p.budget, p.timeline, p.description, p.contactMethod, p.date, p.status, p.createdAt]
      });
    }
    console.log(`   ✅ ${pricing.length} pricing requests migrated`);

    console.log('\n🎉 Migration complete!\n');

    // Verify
    const pCount = await turso.execute('SELECT COUNT(*) as c FROM projects');
    const sCount = await turso.execute('SELECT COUNT(*) as c FROM services');
    const hCount = await turso.execute('SELECT COUNT(*) as c FROM hero_slides');
    const aCount = await turso.execute('SELECT COUNT(*) as c FROM blog_articles');

    console.log('📊 Turso Database Summary:');
    console.log(`   Projects: ${pCount.rows[0].c}`);
    console.log(`   Services: ${sCount.rows[0].c}`);
    console.log(`   Hero Slides: ${hCount.rows[0].c}`);
    console.log(`   Blog Articles: ${aCount.rows[0].c}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

migrateData();
