# 🎨 TRQ Studio

> **Modern Portfolio & CMS Platform** | Bilingual • Secure • Production-Ready

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A cutting-edge, bilingual (English/Arabic) portfolio and content management platform with enterprise-grade security, built for modern design studios and creative agencies.

## ✨ Key Features

| Feature | Details |
|---------|---------|
| 🌍 **Bilingual** | Full English/Arabic support with RTL rendering |
| 🔐 **Enterprise Security** | JWT auth, encryption, rate limiting, CORS |
| 📱 **Responsive** | Mobile-first design with Tailwind CSS |
| 🎛️ **Admin CMS** | Projects, blog, services, settings management |
| 🖼️ **Portfolio** | Rich project showcase with filtering |
| 📝 **Blog Engine** | Rich text editor with media support |
| 📧 **Email** | Nodemailer & Resend integration |
| 🗄️ **Database** | SQLite + Turso cloud support |
| ⚡ **Performance** | Vite HMR, optimized builds, lazy loading |
| 🎯 **Analytics** | Built-in contact tracking & statistics |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TRQ Studio Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐          ┌──────────────────────┐     │
│  │   React Frontend │          │   Express Backend    │     │
│  │  (Vite + TS)     │◄────────►│  (Node.js + JWT)     │     │
│  │                  │  REST    │                      │     │
│  │  • Components    │  API     │  • Auth Routes       │     │
│  │  • i18n (EN/AR)  │          │  • CMS Routes        │     │
│  │  • Admin Panel   │          │  • File Upload       │     │
│  └──────────────────┘          └──────────────────────┘     │
│           │                              │                   │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          │                                    │
│                    ┌─────▼──────┐                            │
│                    │  Database  │                            │
│                    │ SQLite/    │                            │
│                    │ Turso      │                            │
│                    └────────────┘                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI Framework | 19.2 |
| Vite | Build Tool | 7.2 |
| TypeScript | Type Safety | 5.0+ |
| Tailwind CSS | Styling | 3.4 |
| Radix UI | Components | Latest |
| i18next | i18n | 25.7 |
| React Hook Form | Forms | 7.54 |
| React Quill | Rich Editor | 3.7 |
| GSAP | Animations | 3.14 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Express.js | Web Framework | 4.21 |
| SQLite/Turso | Database | Latest |
| JWT | Authentication | 9.0 |
| Bcryptjs | Password Hashing | 3.0 |
| Multer | File Upload | 2.0 |
| Nodemailer | Email | 7.0 |
| CORS | Security | 2.8 |

## 📁 Project Structure

```
trq-studio/
├── 📂 src/                          # Frontend source
│   ├── 📂 admin/                    # Admin dashboard components
│   │   ├── Admin.tsx                # Main admin layout
│   │   ├── AdminDashboard.tsx       # Dashboard overview
│   │   ├── AdminProjects.tsx        # Project management
│   │   ├── AdminBlog.tsx            # Blog management
│   │   ├── AdminServices.tsx        # Services management
│   │   ├── AdminSettings.tsx        # Site settings
│   │   └── AdminArabic*.tsx         # Arabic-specific components
│   ├── 📂 components/               # Reusable components
│   │   ├── Home.tsx                 # Landing page
│   │   ├── Portfolio.tsx            # Projects showcase
│   │   ├── Blog.tsx                 # Blog listing
│   │   ├── Services.tsx             # Services page
│   │   ├── Contact.tsx              # Contact form
│   │   └── ui/                      # Radix UI components
│   ├── 📂 context/                  # React Context
│   │   ├── LanguageContext.tsx      # i18n context
│   │   ├── AdminContext.tsx         # Admin state
│   │   └── ProjectsContext.tsx      # Projects state
│   ├── 📂 i18n/                     # Translations
│   │   ├── en.json                  # English strings
│   │   ├── ar.json                  # Arabic strings
│   │   └── index.ts                 # i18next config
│   ├── 📂 hooks/                    # Custom hooks
│   ├── 📂 utils/                    # Utilities
│   ├── 📂 store/                    # State management
│   ├── App.tsx                      # Main app component
│   └── main.jsx                     # Entry point
│
├── 📂 server/                       # Backend source
│   ├── index.js                     # Express server
│   ├── database.js                  # DB configuration
│   ├── routes-arabic.js             # API routes
│   ├── middleware/                  # Auth, validation
│   ├── .env                         # Environment vars
│   ├── .env.example                 # Env template
│   └── package.json                 # Dependencies
│
├── 📂 public/                       # Static assets
│   ├── 📂 uploads/                  # User uploads
│   └── 📂 TRQ STUDIO _ PROJECTS/    # Project images
│
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind config
├── eslint.config.js                 # ESLint rules
├── postcss.config.js                # PostCSS config
├── package.json                     # Frontend deps
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org))
- **npm** or **yarn**
- **Git**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/trq-studio.git
cd trq-studio

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server && npm install && cd ..

# 4. Setup environment
cp server/.env.example server/.env
# Edit server/.env with your configuration
```

### Development

```bash
# Terminal 1: Start frontend (http://localhost:5173)
npm run dev

# Terminal 2: Start backend (http://localhost:5000)
cd server && npm run dev
```

### Production Build

```bash
# Build frontend
npm run build

# Start backend
cd server && npm start
```

## 🔐 Security & Data Protection

### 🛡️ Authentication & Authorization

#### JWT Token System
```javascript
// Token Structure
{
  "sub": "user_id",
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490  // 1 hour expiry
}
```

**Implementation:**
- ✅ Tokens stored in HTTP-only cookies (not localStorage)
- ✅ Automatic token refresh mechanism
- ✅ Token expiration: 1 hour (configurable)
- ✅ Refresh token rotation on each use
- ✅ Logout invalidates all tokens

```bash
# .env Configuration
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800
```

#### Password Security
```javascript
// Bcryptjs Configuration
const saltRounds = 12;  // OWASP recommended
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

**Requirements:**
- ✅ Minimum 12 characters
- ✅ Must include uppercase, lowercase, numbers, symbols
- ✅ Bcryptjs with 12 salt rounds
- ✅ Never stored in plain text
- ✅ Password reset via secure email link

### 🔒 Data Encryption

#### Database Encryption
```javascript
// Sensitive fields encrypted at rest
const encryptedFields = [
  'email',
  'phone',
  'password_hash',
  'api_keys'
];

// Encryption algorithm: AES-256-GCM
const algorithm = 'aes-256-gcm';
const keyLength = 32;  // 256 bits
```

#### API Request/Response Encryption
```javascript
// HTTPS/TLS 1.3 enforced
// All data in transit encrypted
// Certificate pinning recommended for mobile
```

### 🚫 Input Validation & Sanitization

```javascript
// Validation Rules
const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9+\-\s()]{10,}$/,
  url: /^https?:\/\/.+/,
  maxLength: 5000,
  minLength: 1
};

// Sanitization
const sanitize = (input) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title']
  });
};
```

**Protection Against:**
- ✅ SQL Injection (parameterized queries)
- ✅ XSS (HTML sanitization)
- ✅ CSRF (CSRF tokens)
- ✅ NoSQL Injection (schema validation)

### 🔄 CORS & CSRF Protection

```javascript
// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
};

// CSRF Token
app.use(csrf({ cookie: false }));
```

**Allowed Origins (Production):**
```env
ALLOWED_ORIGINS=https://trq.design,https://www.trq.design
```

### 📊 Rate Limiting

```javascript
// Rate Limiting Configuration
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
```

### 🔑 API Key Management

```javascript
// API Key Security
const apiKeyRules = {
  length: 32,
  algorithm: 'sha256',
  rotationPeriod: 90,  // days
  storage: 'hashed_only'
};

// Usage
const apiKey = crypto.randomBytes(16).toString('hex');
const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
```

### 📁 File Upload Security

```javascript
// Upload Configuration
const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024,  // 10MB
  allowedMimes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  allowedExtensions: ['.jpg', '.png', '.webp', '.pdf'],
  scanForViruses: true,  // ClamAV integration
  quarantineFolder: './uploads/quarantine'
};

// Validation
const validateUpload = (file) => {
  if (file.size > uploadConfig.maxFileSize) throw new Error('File too large');
  if (!uploadConfig.allowedMimes.includes(file.mimetype)) throw new Error('Invalid type');
  if (!uploadConfig.allowedExtensions.includes(path.extname(file.originalname))) throw new Error('Invalid extension');
};
```

**Security Measures:**
- ✅ File type validation (MIME + extension)
- ✅ File size limits (10MB max)
- ✅ Virus scanning (ClamAV)
- ✅ Renamed with random hash
- ✅ Stored outside web root
- ✅ Served via CDN with headers

### 🔍 Logging & Monitoring

```javascript
// Security Logging
const securityLogger = {
  loginAttempts: true,
  failedAuth: true,
  dataAccess: true,
  fileUploads: true,
  apiErrors: true,
  retention: 90  // days
};

// Log Format
{
  timestamp: '2024-01-21T10:30:00Z',
  level: 'WARN',
  event: 'failed_login',
  userId: 'user_123',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  details: 'Invalid password attempt'
}
```

### 🛡️ HTTP Security Headers

```javascript
// Helmet.js Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.example.com']
    }
  },
  hsts: {
    maxAge: 31536000,  // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));
```

**Headers Applied:**
- ✅ Content-Security-Policy (CSP)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security (HSTS)
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### 🔐 Database Security

```javascript
// Database Configuration
const dbConfig = {
  encryption: 'AES-256-GCM',
  backupEncryption: true,
  backupFrequency: 'daily',
  backupRetention: 30,  // days
  accessControl: 'role_based',
  auditLogging: true,
  connectionPooling: true,
  maxConnections: 10,
  connectionTimeout: 5000
};
```

**Best Practices:**
- ✅ Encrypted backups stored separately
- ✅ Daily automated backups
- ✅ Connection pooling enabled
- ✅ Read replicas for scaling
- ✅ Audit trail for all changes
- ✅ Row-level security (RLS)

### 🌐 Environment Variables

```bash
# .env.example - NEVER commit actual values
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=file:./trq.db
TURSO_CONNECTION_URL=libsql://...
TURSO_AUTH_TOKEN=***

# Security
JWT_SECRET=min_32_character_random_string
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800

# CORS
ALLOWED_ORIGINS=https://trq.design,https://www.trq.design

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=app_specific_password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info
```

### ✅ Security Checklist

- [ ] All environment variables configured
- [ ] JWT secrets are strong (32+ chars, random)
- [ ] HTTPS/TLS enabled in production
- [ ] CORS origins whitelisted
- [ ] Rate limiting enabled
- [ ] Database backups automated
- [ ] File uploads validated
- [ ] Logging and monitoring active
- [ ] Security headers configured
- [ ] Dependencies updated (`npm audit`)
- [ ] Admin credentials changed from defaults
- [ ] Database encrypted at rest
- [ ] API keys rotated regularly
- [ ] Penetration testing completed
- [ ] GDPR/Privacy compliance reviewed

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🌐 Internationalization

The project supports English and Arabic with full RTL support.

### Translation Files
- `src/i18n/en.json` - English translations
- `src/i18n/ar.json` - Arabic translations

### Adding New Translations
1. Add key-value pairs to both `en.json` and `ar.json`
2. Use in components with `useLanguage()` hook:
```tsx
const { ts } = useLanguage();
<h1>{ts('key.path')}</h1>
```

## 🔐 Admin Panel

Access the admin dashboard at `/#/admin`

### Default Admin Credentials
- Username: admin
- Password: (set during initial setup)

### Admin Features
- **Dashboard**: Overview and statistics
- **Projects**: Create, edit, delete projects with images
- **Blog**: Write and manage articles
- **Services**: Customize service offerings
- **Settings**: Site-wide configuration
- **Arabic Content**: Separate management for Arabic content
- **Contacts**: View and manage contact submissions

## 🗄️ Database

### SQLite (Development)
Database file: `server/trq.db`

### Turso (Production)
For production deployment, configure Turso:
1. Create a Turso account at https://turso.tech
2. Set `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` in `.env`

## 📧 Email Configuration

### Nodemailer (SMTP)
Configure in `server/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Resend (Alternative)
```env
RESEND_API_KEY=your_resend_api_key
```

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Colors
- Typography
- Spacing
- Breakpoints

### Component Styling
UI components use Radix UI primitives with Tailwind CSS. Customize in `src/components/ui/`

## 📱 Responsive Design

The design is mobile-first with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variable protection
- Input validation and sanitization

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy server/ directory
npm start
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Muaddh Alsway**
- Email: muaddhalsway@gmail.com
- GitHub: [@muaddhalsway](https://github.com/muaddhalsway)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email muaddhalsway@gmail.com or open an issue on GitHub.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI library
- [i18next](https://www.i18next.com/) - Internationalization

---

**Last Updated**: January 2026
