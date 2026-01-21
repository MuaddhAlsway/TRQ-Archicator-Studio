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
TRQ/
├── src/
│   ├── admin/              # Admin dashboard components
│   ├── components/         # Reusable UI components
│   ├── context/            # React context (Language, Admin, Projects)
│   ├── i18n/               # Internationalization files (en.json, ar.json)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── store/              # State management
│   ├── Styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.jsx            # Entry point
├── server/
│   ├── index.js            # Express server setup
│   ├── database.js         # Database configuration
│   ├── routes-arabic.js    # API routes
│   ├── .env                # Environment variables
│   └── package.json        # Server dependencies
├── public/                 # Static assets
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/trq-studio.git
cd trq-studio
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install server dependencies**
```bash
cd server
npm install
cd ..
```

4. **Setup environment variables**
```bash
# Create .env in server directory
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:
```env
PORT=5000
DATABASE_URL=./trq.db
JWT_SECRET=your_jwt_secret_key
TURSO_CONNECTION_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
```

### Development

1. **Start the development server** (from root directory)
```bash
npm run dev
```

2. **Start the backend server** (in another terminal)
```bash
cd server
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:5000`

### Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

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
