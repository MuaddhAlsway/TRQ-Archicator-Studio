import { createClient } from '@libsql/client';
import 'dotenv/config';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function check() {
  const projects = await db.execute('SELECT COUNT(*) as c FROM projects');
  const services = await db.execute('SELECT COUNT(*) as c FROM services');
  const slides = await db.execute('SELECT COUNT(*) as c FROM hero_slides');
  const users = await db.execute('SELECT COUNT(*) as c FROM users');
  const articles = await db.execute('SELECT COUNT(*) as c FROM blog_articles');
  
  console.log('📊 Turso Database Summary:');
  console.log('   Projects:', projects.rows[0].c);
  console.log('   Services:', services.rows[0].c);
  console.log('   Hero Slides:', slides.rows[0].c);
  console.log('   Users:', users.rows[0].c);
  console.log('   Articles:', articles.rows[0].c);
}

check();
