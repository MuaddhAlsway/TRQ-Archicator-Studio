import 'dotenv/config';

console.log('URL:', process.env.TURSO_DATABASE_URL);
console.log('Token length:', process.env.TURSO_AUTH_TOKEN?.length);
console.log('Token:', process.env.TURSO_AUTH_TOKEN);
