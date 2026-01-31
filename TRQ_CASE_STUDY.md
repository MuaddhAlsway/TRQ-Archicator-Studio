# TRQ Design Studio - Case Study

## Project Overview

**TRQ** is a full-stack luxury interior design studio website with a complete CMS (Content Management System). Built in 3 days, it serves as both a client-facing portfolio website and an admin dashboard for managing all content.

**Target Market:** Saudi Arabia (Riyadh-based design studio)
**Languages:** English + Arabic (RTL support)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS, GSAP animations |
| UI Components | 25+ Radix UI primitives |
| Backend | Express.js, Node.js |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |
| Email | Resend API + Gmail fallback |
| Translation | Google Translate API |

---

## Feature Breakdown

### 1. Hero Slider (Homepage)

**File:** `src/components/HeroSlider.tsx`

**What it does:**
- Animated full-screen carousel with GSAP curtain reveal animation
- Auto-advances every 5 seconds with progress bar
- Each slide has: tag, title, description, image, 2 CTA buttons
- Loading screen with split-curtain animation effect

**Technical highlights:**
- GSAP timeline for curtain open animation
- `requestAnimationFrame` for smooth progress tracking
- Slides fetched from API, falls back to defaults
- All text auto-translates to Arabic

---

### 2. Multilingual System (EN/AR)

**File:** `src/context/LanguageContext.tsx`

**What it does:**
- Toggle between English and Arabic
- RTL (right-to-left) layout support for Arabic
- Real-time translation via Google Translate API
- Translation caching in SQLite to avoid repeated API calls

**Technical highlights:**
- Batch translation with debouncing (300ms)
- `translateBatch()` queues texts, processes in bulk
- Cached translations persist in database
- `isRTL` flag triggers CSS direction changes

---

### 3. Portfolio System

**File:** `src/components/Portfolio.tsx`

**What it does:**
- Grid display of design projects with category filtering
- Deep-linking via URL hash (`#portfolio/123`)
- Project detail view with gallery, specs, client testimonials
- Stats section (150+ projects, 100+ clients, etc.)

**Technical highlights:**
- Hash-based routing without React Router
- Dynamic category filters from admin settings
- Image hover effects with gradient overlays
- Responsive grid (1/2/3 columns)

---

### 4. Services Page

**File:** `src/components/Services.tsx`

**What it does:**
- Displays 7 service offerings (Residential, Commercial, Retail, Hotel, Booths, Events, Furniture)
- Each service has: icon, title, description, image, feature list
- Alternating layout (image left/right)

**Technical highlights:**
- Dynamic icon rendering from Lucide library
- Services fetched from API, fully editable in admin
- Feature lists stored as arrays in database

---

### 5. Blog System

**File:** `src/components/Blog.tsx`

**What it does:**
- Article listing with category filters
- Featured article highlight
- Full article view with rich content
- Newsletter subscription section
- Category exploration grid

**Technical highlights:**
- Articles stored with: title, slug, excerpt, content, image, author, date, readTime, category, tags
- Status-based publishing (draft/published)
- Category-based filtering

---

### 6. Contact Form

**File:** `src/components/Contact.tsx`

**What it does:**
- Contact information display (address, phone, email, WhatsApp)
- Contact form with subject dropdown
- Quick contact buttons (WhatsApp, Email)
- Office hours display
- Google Maps integration

**Technical highlights:**
- Form submission to API → stored in database
- Configurable contact info from admin
- Dynamic icon rendering for contact methods
- Success state with confirmation message

---

### 7. Pricing Request Form

**File:** `src/components/PricingRequest.tsx`

**What it does:**
- Detailed project inquiry form
- Fields: name, company, email, phone, project type, size, location, timeline, budget, description
- Contact method preference (Email/WhatsApp)
- Success page with next steps

**Technical highlights:**
- Multi-section form with validation
- Dropdown options configurable from admin
- Stores requests in database for admin review

---

### 8. Workflow Page

**File:** `src/components/Workflow.tsx`

**What it does:**
- 5-step design process visualization
- Each step: number, icon, title, description, feature list
- "Why Our Process Works" section
- Project timeline information

**Technical highlights:**
- Steps fully configurable from admin
- Alternating layout with background colors
- Feature lists parsed from pipe-separated strings

---

## Admin Panel Features

### 9. Admin Dashboard

**File:** `src/admin/AdminDashboard.tsx`

**What it does:**
- Overview stats: total projects, published, new messages, pricing requests
- Recent contact messages list
- Recent pricing requests list

**Technical highlights:**
- Real-time data from context
- Status badges (new/read/replied)
- Responsive grid layout

---

### 10. Project Management

**File:** `src/admin/AdminProjects.tsx`

**What it does:**
- List all projects with search and category filter
- Create/Edit/Delete projects
- Toggle publish status
- Desktop table view + mobile card view

**Project fields:**
- Title, category, subcategory, description
- Image, year, location, client, size, duration
- Detailed description, challenge, solution
- Features, materials, awards, team
- Gallery images, client quote

---

### 11. Contact Management

**File:** `src/admin/AdminContacts.tsx`

**What it does:**
- View all contact submissions
- Filter by status (new/read/replied)
- View full message details
- Reply via email directly from admin

**Technical highlights:**
- Email sending via Resend API
- Status tracking and updates
- Toast notifications for success/error

---

### 12. Pricing Request Management

**File:** `src/admin/AdminPricing.tsx`

**What it does:**
- View all pricing requests
- Filter by status (new/reviewed/quoted/closed)
- View full request details
- Send custom quotes via email

---

### 13. Services Management

**File:** `src/admin/AdminServices.tsx`

**What it does:**
- CRUD for services
- Icon picker (28 Lucide icons)
- Feature list editor
- Sort order and active toggle
- Reset to defaults option

**Technical highlights:**
- Modal-based editor
- Live preview while editing
- Drag-and-drop ready structure

---

### 14. Hero Slides Management

**File:** `src/admin/AdminSlides.tsx`

**What it does:**
- CRUD for homepage hero slides
- Configure: tag, title, description, image
- Primary and secondary button configuration
- Sort order and active toggle

---

### 15. Blog Management

**File:** `src/admin/AdminBlog.tsx` + `ArticleEditor.tsx`

**What it does:**
- Create/Edit/Delete blog articles
- Rich text content editing
- Category and tag management
- Publish/Draft status

---

### 16. Site Settings

**File:** `src/admin/AdminSettings.tsx`

**What it does:**
- Configure ALL text content across the website
- 11 tabs covering every page section
- Featured projects selector
- Portfolio categories editor
- Contact info configuration
- Form field customization

**Configurable sections:**
- Home: Intro, Featured Projects, Workflow Preview, CTA
- About: Hero, Who We Are, Vision, Mission, Values, Why Choose Us
- Services: Hero, Intro, Highlights, CTA
- Workflow: Hero, Intro, 5 Steps, Why It Works, Timeline, CTA
- Portfolio: Hero, Intro, Categories, Stats, CTA
- Contact: Hero, Contact Info, Form, Quick Contact, Office Hours, Map
- Pricing: Hero, Form Fields, Options, Success Messages
- Blog: Hero, Categories, Newsletter, Article Settings

---

### 17. Account Management

**File:** `src/admin/AdminAccount.tsx`

**What it does:**
- View/update admin email
- Change password
- Session management

---

### 18. Authentication System

**Files:** `src/admin/AdminLogin.tsx`, `server/index.js`

**What it does:**
- Username/password login
- JWT token-based sessions (24h expiry)
- Forgot password flow (email reset link)
- Password reset with token validation

**Technical highlights:**
- bcrypt password hashing
- Secure token generation
- Email-based password recovery

---

## Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Admin login |
| `/api/auth/verify` | GET | Verify JWT token |
| `/api/auth/forgot-password` | POST | Send reset email |
| `/api/auth/reset-password` | POST | Reset password |
| `/api/projects` | GET/POST | List/Create projects |
| `/api/projects/:id` | GET/PUT/DELETE | Single project CRUD |
| `/api/contacts` | GET/POST | Contact submissions |
| `/api/contacts/:id/reply` | POST | Reply via email |
| `/api/pricing` | GET/POST | Pricing requests |
| `/api/pricing/:id/send-quote` | POST | Send quote email |
| `/api/services` | GET/POST | Services CRUD |
| `/api/slides` | GET/POST | Hero slides CRUD |
| `/api/articles` | GET/POST | Blog articles CRUD |
| `/api/settings` | GET/PUT | Site settings |
| `/api/translate` | POST | Batch translation |

---

## Database Schema

**10 Tables:**
1. `users` - Admin accounts
2. `projects` - Portfolio projects
3. `services` - Service offerings
4. `hero_slides` - Homepage carousel
5. `blog_articles` - Blog posts
6. `contacts` - Contact form submissions
7. `pricing_requests` - Pricing inquiries
8. `settings` - Key-value site configuration
9. `translations` - Translation cache
10. `password_resets` - Reset tokens

---

## Key Technical Patterns

### 1. API Layer Abstraction
All API calls centralized in `src/api/index.ts` with auth header injection.

### 2. Context-Based State
- `LanguageContext` - Translation and RTL
- `AdminContext` - Admin data and actions
- `ProjectsContext` - Public project data

### 3. Responsive Design
- Mobile-first Tailwind classes
- Breakpoints: `sm:`, `md:`, `lg:`
- Mobile hamburger menu
- Table → Card view switching

### 4. Translation Strategy
- Batch texts → API → Cache in DB
- Debounced requests (300ms)
- Fallback to original text

### 5. Email Dual Provider
- Primary: Resend API
- Fallback: Gmail/Nodemailer
- Configurable via environment

---

## Summary

TRQ demonstrates a complete, production-ready web application with:
- **18 admin components** for full content management
- **10 database tables** for structured data
- **Bilingual support** with RTL
- **Email integration** for notifications
- **Responsive design** across all pages
- **Clean architecture** with separation of concerns

Built in 3 days — a testament to efficient development practices and modern tooling.
