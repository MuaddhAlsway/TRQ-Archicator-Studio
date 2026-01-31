import nodemailer from 'nodemailer';

// Create transporter using Gmail with app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  pool: {
    maxConnections: 1,
    maxMessages: 5,
    rateDelta: 2000,
    rateLimit: 5
  },
  connectionTimeout: 10000,
  socketTimeout: 10000
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Gmail connection error:', error);
  } else {
    console.log('Gmail service ready:', success);
  }
});

// Modern email template wrapper
const emailTemplate = (content, title = 'TRQ Studio') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
      border-bottom: 3px solid #808080;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 300;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 15px;
    }
    
    .intro-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 25px;
      line-height: 1.8;
    }
    
    .message-box {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-left: 4px solid #808080;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    
    .message-box p {
      font-size: 15px;
      color: #333;
      line-height: 1.8;
      margin-bottom: 10px;
    }
    
    .message-box p:last-child {
      margin-bottom: 0;
    }
    
    .cta-button {
      display: inline-block;
      background: #f0f0f0;
      color: #333;
      padding: 14px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin: 20px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid #d0d0d0;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      background: #e8e8e8;
      color: #1a1a1a;
    }
    
    .closing {
      font-size: 15px;
      color: #333;
      margin-top: 25px;
      line-height: 1.8;
    }
    
    .signature {
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 10px;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #ddd, transparent);
      margin: 30px 0;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 25px 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    
    .footer-text {
      font-size: 12px;
      color: #999;
      margin-bottom: 10px;
    }
    
    .footer-links {
      font-size: 12px;
    }
    
    .footer-links a {
      color: #666;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      color: #1a1a1a;
      text-decoration: underline;
    }
    
    .badge {
      display: inline-block;
      background: #808080;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .highlight {
      color: #808080;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`;

export async function sendContactReply(contactEmail, contactName, subject, message) {
  try {
    // Fetch dynamic settings
    const settings = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/settings`).then(r => r.json()).catch(() => ({}));
    
    const whatsappNumber = settings.emailQuickLinksWhatsapp || '966XXXXXXXXX';
    const companyProfileUrl = settings.emailQuickLinksCompanyProfile || 'https://publuu.com/flip-book/829640/2262213';
    const customLinks = settings.emailQuickLinksCustom ? JSON.parse(settings.emailQuickLinksCustom) : [];

    // Build quick links HTML
    let quickLinksHtml = `
      <a href="https://wa.me/${whatsappNumber}" class="cta-button" style="display: inline-block; color: #000">Chat on WhatsApp</a>
      <a href="${companyProfileUrl}" class="cta-button" style="display: inline-block; color: #000">View Company Profile</a>
    `;
    
    // Add custom links
    customLinks.forEach(link => {
      quickLinksHtml += `<a href="${link.url}" class="cta-button" style="display: inline-block; color: #000">${link.label}</a>`;
    });

    const htmlContent = emailTemplate(`
      <div class="header">
        <h1>TRQ STUDIO</h1>
        <p>Professional Design & Architecture</p>
      </div>
      
      <div class="content">
        <div class="greeting">Hello <span class="highlight">${contactName}</span>,</div>
        
        <p class="intro-text">
          Thank you for reaching out to TRQ Studio. We truly appreciate your interest and have carefully reviewed your message. Here's our response:
        </p>
        
        <div class="message-box">
          ${message.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
        </div>
        
        <p class="closing">
          We're excited to discuss your project further and explore how we can bring your vision to life.
        </p>
        
        <p class="closing">
          Best regards,<br>
          <span class="signature">TRQ Studio Team</span>
        </p>
        
        <div class="divider"></div>
        
        <div style="text-align: center; margin-top: 20px; background: #fafafa; padding: 30px 40px; border-radius: 8px;">
          <p style="font-size: 16px; font-weight: 600; color: #808080; margin-bottom: 25px;">Quick Links:</p>
          <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; padding: 35px; ">
            ${quickLinksHtml}
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="footer">
        <p class="footer-text">© 2026 TRQ Studio. All rights reserved.</p>
        <div class="footer-links">
          <a href="https://trq-studio.pages.dev">Visit Website</a> | 
          <a href="mailto:${process.env.GMAIL_USER}">Contact Us</a> |
          <a href="https://wa.me/${whatsappNumber}">WhatsApp</a>
        </div>
      </div>
    `, 'Re: ' + subject);

    const mailOptions = {
      from: `TRQ Studio <${process.env.GMAIL_USER}>`,
      to: contactEmail,
      subject: `Re: ${subject}`,
      html: htmlContent
    };

    const info = await sendMailWithRetry(mailOptions);
    console.log('Contact reply sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendPricingReply(email, name, subject, message) {
  try {
    // Fetch dynamic settings
    const settings = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/settings`).then(r => r.json()).catch(() => ({}));
    
    const whatsappNumber = settings.emailQuickLinksWhatsapp || '966XXXXXXXXX';
    const companyProfileUrl = settings.emailQuickLinksCompanyProfile || 'https://publuu.com/flip-book/829640/2262213';
    const customLinks = settings.emailQuickLinksCustom ? JSON.parse(settings.emailQuickLinksCustom) : [];

    // Build quick links HTML
    let quickLinksHtml = `
      <a href="https://wa.me/${whatsappNumber}" class="cta-button" style="display: inline-block; color: #000">Chat on WhatsApp</a>
      <a href="${companyProfileUrl}" class="cta-button" style="display: inline-block; color: #000">View Company Profile</a>
    `;
    
    // Add custom links
    customLinks.forEach(link => {
      quickLinksHtml += `<a href="${link.url}" class="cta-button" style="display: inline-block; color: #000">${link.label}</a>`;
    });

    const htmlContent = emailTemplate(`
      <div class="header">
        <h1>TRQ STUDIO</h1>
        <p>Pricing Inquiry Response</p>
      </div>
      
      <div class="content">
        <div class="badge">PRICING RESPONSE</div>
        
        <div class="greeting">Hello <span class="highlight">${name}</span>,</div>
        
        <p class="intro-text">
          Thank you for your interest in our services. We've reviewed your project requirements and prepared a detailed response to your pricing inquiry:
        </p>
        
        <div class="message-box">
          ${message.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('')}
        </div>
        
        <p class="closing">
          We're confident that we can deliver exceptional results for your project. Let's schedule a call to discuss the details further.
        </p>
        
        <p class="closing">
          Looking forward to collaborating with you,<br>
          <span class="signature">TRQ Studio Team</span>
        </p>
        
        <div class="divider"></div>
        
        <div style="text-align: center; margin-top: 20px; background: #fafafa; padding: 30px 20px; border-radius: 8px;">
          <p style="font-size: 16px; font-weight: 600; color: #808080; margin-bottom: 25px;">Quick Links:</p>
          <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; padding: 15px;">
            ${quickLinksHtml}
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="footer">
        <p class="footer-text">© 2026 TRQ Studio. All rights reserved.</p>
        <div class="footer-links">
          <a href="https://trq-studio.pages.dev">Visit Website</a> | 
          <a href="mailto:${process.env.GMAIL_USER}">Contact Us</a> |
          <a href="https://wa.me/${whatsappNumber}">WhatsApp</a>
        </div>
      </div>
    `, 'Re: ' + subject);

    const mailOptions = {
      from: `TRQ Studio <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Re: ${subject}`,
      html: htmlContent
    };

    const info = await sendMailWithRetry(mailOptions);
    console.log('Pricing reply sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendNotificationEmail(toEmail, subject, htmlContent) {
  try {
    const mailOptions = {
      from: `TRQ Studio <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: emailTemplate(htmlContent)
    };

    const info = await sendMailWithRetry(mailOptions);
    console.log('Notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export default transporter;

// Retry helper for transient network errors
async function sendMailWithRetry(mailOptions, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      lastError = error;
      
      // Check if it's a transient error worth retrying
      const isTransient = error.code === 'ESOCKET' || 
                         error.code === 'ECONNRESET' || 
                         error.code === 'ETIMEDOUT' ||
                         error.code === 'ECONNREFUSED';
      
      if (!isTransient || attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Email send attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
