# TECHNICAL REFERENCE - TRQ DESIGN STUDIO 2026

## SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│              https://trq-studio.pages.dev                   │
│  - Admin Panel: /#/admin                                    │
│  - Public Site: / (home, about, services, portfolio, etc)   │
│  - Language: English (en) / Arabic (ar)                     │
│  - Deployment: Cloudflare Pages                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │ JWT Authentication
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              BACKEND API (Cloudflare Workers)               │
│    https://trq-api-prod.muaddhalsway.workers.dev/api        │
│  - Authentication: /auth/*                                  │
│  - Projects: /projects/*                                    │
│  - Services: /services/*                                    │
│  - Slides: /slides/*                                        │
│  - Settings: /settings/*                                    │
│  - Blog: /articles/*                                        │
│  - Upload: /upload/*                                        │
│  - Contacts: /contacts/*                                    │
│  - Pricing: /pricing/*                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DATABASE LAYER                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SQLite (Local) - Primary Database                 │   │
│  │  server/trq.db                                      │   │
│  │  - Fast local access                               │   │
│  │  - Development & testing                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                     │
│                       │ Background Sync                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Turso (Cloud) - Replica Database                  │   │
│  │  libsql://trq-database-muaddhalsway.aws-ap-south-1 │   │
│  │  - Cloud backup                                     │   │
│  │  - Production access                               │   │
│  │  - Automatic sync                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## FILE STRUCTURE

```
trq-studio/
├── src/
│   ├── admin/                          # Admin panel components
│   │   ├── Admin.tsx                   # Main admin entry
│   │   ├── AdminContext.tsx            # Global state
│   │   ├── AdminLayout.tsx             # Sidebar navigation
│   │   ├── AdminLogin.tsx              # Login page
│   │   ├── AdminDashboard.tsx          # Dashboard
│   │   ├── AdminProjects.tsx           # English projects
│   │   ├── AdminArabicProjects.tsx     # Arabic projects
│   │   ├── AdminServices.tsx           # English services
│   │   ├── AdminArabicServices.tsx     # Arabic services
│   │   ├── AdminSlides.tsx             # English slides
│   │   ├── AdminArabicSlides.tsx       # Arabic slides
│   │   ├── AdminBlog.tsx               # English blog
│   │   ├── AdminArabicBlog.tsx         # Arabic blog
│   │   ├── AdminSettings.tsx           # English settings
│   │   ├── AdminSettingsArabic.tsx     # Arabic settings
│   │   ├── ProjectEditor.tsx           # Project editor
│   │   ├── ProjectEditorArabic.tsx     # Arabic project editor
│   │   ├── ArticleEditor.tsx           # Article editor
│   │   ├── ArticleEditorArabic.tsx     # Arabic article editor
│   │   ├── ImageUpload.tsx             # Image upload
│   │   ├── ConfirmModal.tsx            # Confirmation dialog
│   │   └── types.ts                    # TypeScript types
│   │
│   ├── components/                     # Frontend components
│   │   ├── Home.tsx                    # Homepage
│   │   ├── AboutUs.tsx                 # About page
│   │   ├── Services.tsx                # Services page
│   │   ├── Portfolio.tsx               # Portfolio page
│   │   ├── Blog.tsx                    # Blog page
│   │   ├── Contact.tsx                 # Contact form
│   │   ├── PricingRequest.tsx          # Pricing form
│   │   ├── ProjectDetail.tsx           # Project detail
│   │   ├── BlogArticle.tsx             # Article detail
│   │   ├── LanguageSwitcher.tsx        # Language switcher
│   │   └── ...
│   │
│   ├── context/
│   │   └── LanguageContext.tsx         # Language management
│   │
│   ├── api/
│   │   └── index.ts                    # API client
│   │
│   ├── i18n/                           # Internationalization
│   │   ├── en.json                     # English translations
│   │   ├── ar.json                     # Arabic translations
│   │   └── index.ts                    # i18n config
│   │
│   ├── utils/
│   │   ├── contentHelper.ts            # Content utilities
│   │   └── ...
│   │
│   ├── App.tsx                         # Main app component
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles
│
├── server/
│   ├── index.js                        # Express server
│   ├── database.js                     # Database wrapper
│   ├── upload-handler.js               # File upload
│   ├── email-service.js                # Email sending
│   ├── auth-service.js                 # Authentication
│   ├── worker.js                       # Cloudflare Worker
│   ├── trq.db                          # SQLite database
│   ├── package.json                    # Server dependencies
│   └── .env                            # Server env vars
│
├── public/
│   ├── uploads/                        # Uploaded files
│   ├── LOGO.png                        # Logo
│   ├── Video.mp4                       # Video
│   └── ...
│
├── dist/                               # Build output
├── node_modules/                       # Dependencies
├── package.json                        # Frontend dependencies
├── vite.config.js                      # Vite config
├── wrangler.toml                       # Cloudflare Pages config
├── wrangler-workers.toml               # Cloudflare Workers config
├── tailwind.config.js                  # Tailwind config
├── postcss.config.js                   # PostCSS config
├── .env.development                    # Dev env vars
├── .env.production                     # Prod env vars
└── README.md                           # Documentation
```

---

## DATABASE SCHEMA

### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  -- English fields
  title TEXT,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  image TEXT,
  year TEXT,
  location TEXT,
  client TEXT,
  size TEXT,
  duration TEXT,
  detailedDescription TEXT,
  challenge TEXT,
  solution TEXT,
  features TEXT,           -- JSON array
  materials TEXT,          -- JSON array
  awards TEXT,             -- JSON array
  team TEXT,               -- JSON array
  gallery TEXT,            -- JSON array
  clientQuote TEXT,
  clientName TEXT,
  -- Arabic fields
  title_ar TEXT,
  category_ar TEXT,
  subcategory_ar TEXT,
  description_ar TEXT,
  location_ar TEXT,
  client_ar TEXT,
  size_ar TEXT,
  duration_ar TEXT,
  detailedDescription_ar TEXT,
  challenge_ar TEXT,
  solution_ar TEXT,
  features_ar TEXT,        -- JSON array
  materials_ar TEXT,       -- JSON array
  awards_ar TEXT,          -- JSON array
  team_ar TEXT,            -- JSON array
  clientQuote_ar TEXT,
  clientName_ar TEXT,
  -- Status
  status TEXT,             -- 'published' or 'draft'
  sortOrder INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Hero Slides Table
```sql
CREATE TABLE hero_slides (
  id INTEGER PRIMARY KEY,
  -- English fields
  tag TEXT,
  title TEXT,
  description TEXT,
  buttonPrimaryText TEXT,
  buttonSecondaryText TEXT,
  -- Arabic fields
  tag_ar TEXT,
  title_ar TEXT,
  description_ar TEXT,
  buttonPrimaryText_ar TEXT,
  buttonSecondaryText_ar TEXT,
  -- Media
  image TEXT,
  video TEXT,
  video_2 TEXT,
  video_3 TEXT,
  image_ar TEXT,
  video_ar TEXT,
  -- Status
  sortOrder INTEGER,
  isActive INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Services Table
```sql
CREATE TABLE services (
  id INTEGER PRIMARY KEY,
  -- English fields
  title TEXT,
  description TEXT,
  features TEXT,           -- JSON array
  -- Arabic fields
  title_ar TEXT,
  description_ar TEXT,
  features_ar TEXT,        -- JSON array
  -- Display
  icon TEXT,
  image TEXT,
  sortOrder INTEGER,
  isActive INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Example keys:
-- homeIntroTitle / homeIntroTitle_ar
-- homeIntroText1 / homeIntroText1_ar
-- homeIntroImage / homeIntroImage_ar
-- blogHidden / blogHidden_ar
-- portfolioCategories / portfolioCategories_ar
```

### Blog Articles Table
```sql
CREATE TABLE blog_articles (
  id INTEGER PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT,
  date TEXT,
  readTime INTEGER,
  category TEXT,
  tags TEXT,               -- JSON array
  status TEXT,             -- 'published' or 'draft'
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT,             -- 'new', 'read', 'replied'
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,           -- bcrypt hash
  email TEXT,
  role TEXT,               -- 'admin', 'editor'
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## API ENDPOINTS

### Authentication
```
POST   /api/auth/login              # Login
POST   /api/auth/refresh            # Refresh token
GET    /api/auth/verify             # Verify token
POST   /api/auth/logout             # Logout
```

### Projects
```
GET    /api/projects                # All projects
GET    /api/projects/published      # Published only
GET    /api/projects/:id            # Single project
POST   /api/projects                # Create (auth required)
PUT    /api/projects/:id            # Update (auth required)
DELETE /api/projects/:id            # Delete (auth required)
```

### Services
```
GET    /api/services                # All services
GET    /api/services/active         # Active only
POST   /api/services                # Create (auth required)
PUT    /api/services/:id            # Update (auth required)
DELETE /api/services/:id            # Delete (auth required)
```

### Hero Slides
```
GET    /api/slides                  # All slides
GET    /api/slides/active           # Active only
POST   /api/slides                  # Create (auth required)
PUT    /api/slides/:id              # Update (auth required)
DELETE /api/slides/:id              # Delete (auth required)
```

### Settings
```
GET    /api/settings                # All settings
PUT    /api/settings                # Update (auth required)
```

### Blog Articles
```
GET    /api/articles/published      # Published articles
GET    /api/articles/slug/:slug     # Single article
POST   /api/articles                # Create (auth required)
PUT    /api/articles/:id            # Update (auth required)
DELETE /api/articles/:id            # Delete (auth required)
```

### File Upload
```
POST   /api/upload                  # Upload file (auth required)
DELETE /api/upload/:filename        # Delete file (auth required)
```

### Contacts
```
GET    /api/contacts                # All contacts (auth required)
POST   /api/contacts                # Submit contact form
PUT    /api/contacts/:id/status     # Update status (auth required)
POST   /api/contacts/:id/reply      # Send reply (auth required)
```

### Pricing Requests
```
GET    /api/pricing                 # All requests (auth required)
POST   /api/pricing                 # Submit request
PUT    /api/pricing/:id/status      # Update status (auth required)
```

---

## AUTHENTICATION FLOW

### Login
```
1. User enters username/password
2. POST /api/auth/login
3. Server validates credentials
4. Server generates JWT token
5. Server returns accessToken + refreshToken
6. Client stores tokens in localStorage
7. Client redirects to admin dashboard
```

### Token Refresh
```
1. Client checks token expiry
2. If expiring in < 2 minutes:
   - POST /api/auth/refresh with refreshToken
   - Server validates refreshToken
   - Server generates new accessToken
   - Client updates localStorage
3. Request proceeds with new token
```

### Protected Requests
```
1. Client adds Authorization header:
   Authorization: Bearer <accessToken>
2. Server verifies token
3. If valid: Request proceeds
4. If invalid: Return 401 Unauthorized
5. Client clears tokens and redirects to login
```

---

## BILINGUAL CONTENT FLOW

### English Content
```
1. Admin edits English project
2. Saves to database (title, description, etc.)
3. API returns English fields
4. Frontend displays in English
5. User sees English content
```

### Arabic Content
```
1. Admin edits Arabic project
2. Saves to database (title_ar, description_ar, etc.)
3. API returns Arabic fields
4. Frontend displays in Arabic (RTL)
5. User sees Arabic content
```

### Language Switching
```
1. User clicks language switcher
2. LanguageContext updates language state
3. localStorage saves preference
4. Frontend re-renders with new language
5. getContent() helper returns correct field
6. Layout switches to RTL (Arabic) or LTR (English)
```

---

## DEPLOYMENT PROCESS

### Frontend Deployment (Cloudflare Pages)
```bash
# Build
npm run build

# Deploy to production
npm run deploy:prod

# Process:
# 1. Vite builds React app to dist/
# 2. Wrangler uploads dist/ to Cloudflare Pages
# 3. Cloudflare deploys to CDN
# 4. Available at https://trq-studio.pages.dev
```

### Backend Deployment (Cloudflare Workers)
```bash
# Deploy to production
npm run deploy:worker:prod

# Process:
# 1. Wrangler packages server/worker.js
# 2. Uploads to Cloudflare Workers
# 3. Binds environment variables
# 4. Available at https://trq-api-prod.muaddhalsway.workers.dev/api
```

### Database Sync
```
1. Local SQLite database updated
2. Background sync to Turso triggered
3. Turso database updated
4. Both databases in sync
5. No manual action needed
```

---

## ENVIRONMENT VARIABLES

### Frontend (.env.development)
```
VITE_API_URL=http://localhost:4242/api
```

### Frontend (.env.production)
```
VITE_API_URL=https://trq-api-prod.muaddhalsway.workers.dev/api
```

### Backend (server/.env)
```
PORT=4242
JWT_SECRET=trq-design-studio-secret-key-2026
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGINS=http://localhost:5173,https://trq-studio.pages.dev
```

### Cloudflare Workers (wrangler-workers.toml)
```
TURSO_DATABASE_URL=libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=<token>
JWT_SECRET=trq-design-studio-secret-key-2026
JWT_EXPIRY=1h
CORS_ORIGINS=https://trq-studio.pages.dev
```

---

## CACHING STRATEGY

### HTTP Cache Headers
```
GET /api/projects
  Cache-Control: public, max-age=30
  (30 second cache)

GET /api/projects/published
  Cache-Control: public, max-age=60
  (60 second cache)

GET /api/projects/:id
  Cache-Control: no-cache, no-store, must-revalidate
  (No cache - always fresh)
```

### In-Memory Cache
```
- Projects list cached for 30 seconds
- Cache invalidated on INSERT/UPDATE/DELETE
- Reduces database queries
- Improves response time
```

---

## ERROR HANDLING

### API Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

### HTTP Status Codes
```
200 OK              - Request successful
201 Created         - Resource created
400 Bad Request     - Invalid input
401 Unauthorized    - Authentication required
403 Forbidden       - Permission denied
404 Not Found       - Resource not found
500 Server Error    - Internal error
```

### Retry Logic
```
- Max retries: 3
- Initial delay: 1 second
- Backoff multiplier: 2x
- Max delay: 5 seconds
- Timeout: 15 seconds per request
```

---

## PERFORMANCE OPTIMIZATION

### Frontend
- Code splitting (vendor, ui chunks)
- Image optimization
- Lazy loading
- Compression (gzip)
- Minification

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Response compression
- Caching strategy

### Database
- SQLite for fast local access
- Turso for cloud backup
- Background sync (non-blocking)
- In-memory cache

---

## SECURITY MEASURES

### Authentication
- JWT tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Secure token storage
- Automatic logout on expiry

### Authorization
- Protected endpoints
- Token verification middleware
- Role-based access control

### Data Protection
- CORS configuration
- Input validation
- File upload validation
- Directory traversal prevention
- SQL injection prevention (parameterized queries)

### HTTPS
- All production URLs use HTTPS
- Cloudflare SSL/TLS
- Secure cookies

---

## MONITORING & DEBUGGING

### Logs
```
Frontend: Browser console (F12)
Backend: Server console output
Database: SQLite logs
```

### Health Check
```
GET /api/health
Response: { "status": "ok", "timestamp": "..." }
```

### Common Issues
```
401 Unauthorized    - Token expired, login again
404 Not Found       - Resource doesn't exist
500 Server Error    - Check server logs
Network Error       - Check API URL, CORS
```

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
# Terminal 1: Frontend
npm run dev
# Runs on http://localhost:5173

# Terminal 2: Backend
cd server && npm run dev
# Runs on http://localhost:4242

# Terminal 3: Database
# SQLite runs automatically with backend
```

### Testing
```bash
# Frontend build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

### Deployment
```bash
# Frontend
npm run deploy:prod

# Backend
npm run deploy:worker:prod
```

---

## USEFUL COMMANDS

### Frontend
```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter
npm run deploy           # Deploy to staging
npm run deploy:prod      # Deploy to production
```

### Backend
```bash
cd server
npm install              # Install dependencies
npm run dev              # Start dev server with watch
npm run start            # Start server
npm run seed             # Seed database
npm run deploy:worker    # Deploy to staging
npm run deploy:worker:prod # Deploy to production
```

---

## SUPPORT & RESOURCES

### Documentation
- System Verification Report: `SYSTEM_VERIFICATION_REPORT_2026.md`
- Admin Quick Start: `ADMIN_PANEL_QUICK_START_2026.md`
- This file: `TECHNICAL_REFERENCE_2026.md`

### URLs
- Frontend: https://trq-studio.pages.dev
- Admin Panel: https://trq-studio.pages.dev/#/admin
- API: https://trq-api-prod.muaddhalsway.workers.dev/api

### Contact
- For issues: Check browser console and server logs
- For deployment: Use npm scripts
- For database: Check Turso dashboard

---

**Last Updated:** February 28, 2026  
**Status:** Production Ready ✅
