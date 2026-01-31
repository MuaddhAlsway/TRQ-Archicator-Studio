import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('Testing Gmail credentials...\n');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD?.length);
console.log('GMAIL_APP_PASSWORD (first 5 chars):', process.env.GMAIL_APP_PASSWORD?.substring(0, 5) + '***');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('\n❌ Gmail connection FAILED:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('\nTroubleshooting:');
    console.error('1. Check that 2FA is enabled: https://myaccount.google.com/security');
    console.error('2. Generate new app password: https://myaccount.google.com/apppasswords');
    console.error('3. Make sure to remove spaces from the password');
    console.error('4. Verify email address is correct');
    process.exit(1);
  } else {
    console.log('\n✅ Gmail connection SUCCESS!');
    console.log('Ready to send emails from:', process.env.GMAIL_USER);
    process.exit(0);
  }
});
