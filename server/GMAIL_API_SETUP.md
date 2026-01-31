# Gmail API Setup Guide

This guide walks you through setting up Gmail API for sending emails from your TRQ application.

## Prerequisites

- A Google Cloud Project
- Gmail account
- Node.js installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: `TRQ Studio`
5. Click "CREATE"
6. Wait for the project to be created

## Step 2: Enable Gmail API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Gmail API"
3. Click on "Gmail API"
4. Click the "ENABLE" button
5. Wait for it to enable

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, click "CONFIGURE CONSENT SCREEN" first:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, etc.)
   - Add your email as a test user
   - Save and continue
4. Back to credentials, click "CREATE CREDENTIALS" > "OAuth client ID"
5. Select "Desktop application" as the application type
6. Click "CREATE"
7. Click the download icon to download the JSON file
8. Save it as `TRQ/server/gmail-credentials.json`

## Step 4: Install Dependencies

```bash
cd TRQ/server
npm install
```

This will install the `googleapis` package needed for Gmail API.

## Step 5: Set Up Environment Variables

1. Copy `.env.example` to `.env` (if not already done)
2. Update the `GMAIL_USER` variable with your Gmail address:

```env
GMAIL_USER=your-email@gmail.com
```

## Step 6: Authenticate with Gmail

Run the setup script to authorize the application:

```bash
npm run setup-gmail
```

This will:
1. Display an authorization URL
2. Open your browser (or copy the URL manually)
3. Grant permission to the application
4. Provide an authorization code
5. Paste the code back into the terminal
6. Save the token as `gmail-token.json`

## Step 7: Test Email Sending

You can now use the email sending functionality in your application. The `sendEmail` function is available from `gmail-service.js`:

```javascript
import { sendEmail } from './gmail-service.js';

await sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Email',
  html: '<h1>Hello!</h1><p>This is a test email.</p>'
});
```

## Troubleshooting

### "Gmail credentials file not found"
- Make sure you downloaded the credentials JSON file
- Save it as `TRQ/server/gmail-credentials.json`
- Restart the server

### "No Gmail token found"
- Run `npm run setup-gmail` to authenticate
- Follow the authorization flow
- Make sure to paste the authorization code correctly

### "Failed to send email: 403 Forbidden"
- The Gmail API might not be enabled
- Go to Google Cloud Console > APIs & Services > Library
- Search for "Gmail API" and enable it
- Wait a few minutes for changes to propagate

### "Invalid credentials"
- Delete `gmail-token.json`
- Run `npm run setup-gmail` again
- Make sure you're using the correct Google account

## Security Notes

- **Never commit** `gmail-credentials.json` or `gmail-token.json` to version control
- Add these files to `.gitignore`:
  ```
  gmail-credentials.json
  gmail-token.json
  ```
- Keep your credentials file secure
- The token has limited scope (only send emails, no read access)

## Rate Limits

Gmail API has the following rate limits:
- 1,000 emails per day per user
- 100 emails per second per user

For higher volumes, consider using a transactional email service like SendGrid or Mailgun.

## Revoking Access

To revoke the application's access to your Gmail account:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll to "Your apps and sites"
3. Click "Manage all projects"
4. Find "TRQ Studio"
5. Click it and select "Remove access"

## Additional Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api/guides)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
