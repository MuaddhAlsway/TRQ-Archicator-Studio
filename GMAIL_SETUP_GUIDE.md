# Gmail Integration Setup Guide

## Overview
Your TRQ Studio backend now uses Gmail with App Password for sending email replies to contacts and pricing inquiries. This replaces Resend/Nodemailer with a direct Gmail integration.

## Setup Steps

### 1. Enable 2-Factor Authentication (if not already enabled)
- Go to https://myaccount.google.com/security
- Find "2-Step Verification" and enable it
- Follow Google's verification process

### 2. Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" from the dropdown
- Select "Windows Computer" (or your device type)
- Google will generate a 16-character password
- Copy this password (it will have spaces like: `fbxw zpqr byeh vsmi`)

### 3. Update Environment Variables
In `TRQ/server/.env`, set:
```
GMAIL_USER=muaddhaslway@gmail.com
GMAIL_APP_PASSWORD=fbxwzpqrbyehvsmi
```

**Note:** Remove spaces from the app password when pasting it.

### 4. Verify Connection
Start your server:
```bash
npm run dev
```

You should see in the console:
```
Gmail service ready: true
```

## API Endpoints

### Send Reply to Contact
```
POST /api/contacts/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Thank you for your inquiry. Here's our response..."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "<email-message-id>"
}
```

### Send Reply to Pricing Request
```
POST /api/pricing/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Thank you for your pricing inquiry. Here's our quote..."
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "<email-message-id>"
}
```

## Features

✅ Sends professional HTML emails with TRQ branding
✅ Automatically updates contact/pricing status to "replied"
✅ Includes sender name and subject in reply
✅ Error handling and logging
✅ No third-party email service required

## Troubleshooting

### "Gmail connection error"
- Verify 2FA is enabled
- Check app password is correct (no spaces)
- Ensure GMAIL_USER matches your Gmail address

### "Invalid login credentials"
- App password must be 16 characters (without spaces)
- Verify you copied the entire password
- Try generating a new app password

### "Less secure app access"
- Not needed with app passwords
- App passwords work with 2FA enabled

## File Structure

- `TRQ/server/email-service.js` - Email sending functions
- `TRQ/server/index.js` - API endpoints for replies
- `TRQ/server/.env` - Gmail credentials

## Next Steps

1. Update your admin panel to include reply functionality
2. Add email templates for different message types
3. Set up email logging/history in the database
