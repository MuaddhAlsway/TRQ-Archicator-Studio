import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Gmail API configuration
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, 'gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'gmail-credentials.json');

let auth = null;
let gmail = null;

/**
 * Load or create authorization
 */
async function authorize() {
  if (auth) return auth;

  try {
    // Check if credentials file exists
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error(
        `Gmail credentials file not found at ${CREDENTIALS_PATH}. ` +
        'Please set up OAuth 2.0 credentials and save as gmail-credentials.json'
      );
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have a saved token
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oauth2Client.setCredentials(token);
      auth = oauth2Client;
      gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      return oauth2Client;
    }

    // If no token, we need to get one via OAuth flow
    throw new Error(
      'No Gmail token found. Run: node setup-gmail.js to authenticate'
    );
  } catch (error) {
    console.error('Authorization error:', error.message);
    throw error;
  }
}

/**
 * Encode email message
 */
function encodeMessage(message) {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Create RFC 2822 formatted email
 */
function createMessage(to, subject, html) {
  const message = [
    `From: ${process.env.GMAIL_USER}`,
    `To: ${to}`,
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html,
  ].join('\n');

  return encodeMessage(message);
}

/**
 * Send email via Gmail API
 */
export async function sendEmail({ to, subject, html }) {
  try {
    if (!auth) {
      await authorize();
    }

    if (!gmail) {
      gmail = google.gmail({ version: 'v1', auth });
    }

    const message = createMessage(to, subject, html);

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: message,
      },
    });

    console.log('Email sent successfully:', result.data.id);
    return result.data;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

/**
 * Get authorization URL for OAuth flow
 */
export function getAuthUrl() {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    return authUrl;
  } catch (error) {
    console.error('Error generating auth URL:', error.message);
    throw error;
  }
}

/**
 * Save token from authorization code
 */
export async function saveToken(code) {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('Token saved to', TOKEN_PATH);

    auth = oauth2Client;
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error('Error saving token:', error.message);
    throw error;
  }
}

export default { sendEmail, getAuthUrl, saveToken };
