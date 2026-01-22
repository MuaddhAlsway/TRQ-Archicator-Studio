import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Home } from './components/Home';
import { About } from './components/About';
import { Services } from './components/Services';
import { Workflow } from './components/Workflow';
import { Contact } from './components/Contact';
import { Portfolio } from './components/Portfolio';
import { Blog } from './components/Blog';
import { Admin } from './admin/Admin';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './context/LanguageContext';
import * as api from './api';

type Page = 'home' | 'about' | 'services' | 'workflow' | 'portfolio' | 'blog' | 'contact' | 'pricing' | 'admin';

// Get page from URL hash
const getPageFromHash = (): Page => {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  
  // Handle portfolio/id pattern
  if (hash.startsWith('portfolio')) {
    return 'portfolio';
  }
  
  // Handle blog/slug pattern
  if (hash.startsWith('blog')) {
    return 'blog';
  }
  
  const validPages: Page[] = ['home', 'about', 'services', 'workflow', 'portfolio', 'blog', 'contact', 'pricing', 'admin'];
  if (validPages.includes(hash as Page)) {
    return hash as Page;
  }
  return 'home';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogHidden, setBlogHidden] = useState(true);
  const [settingsRefresh, setSettingsRefresh] = useState(0);
  // ts = static translation (i18next for UI), td = dynamic (API for database content)
  const { ts, isRTL } = useLanguage();

  // Fetch settings to check if blog is hidden
  useEffect(() => {
    api.getSettings().then((data) => {
      if (data.blogHidden === 'true') {
        setBlogHidden(true);
      } else {
        setBlogHidden(false);
      }
    }).catch(() => {
      // Default to hiding blog if settings fetch fails
      setBlogHidden(true);
    });
  }, [settingsRefresh]);

  // Listen for settings update events
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettingsRefresh(prev => prev + 1);
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage]);

  // Handle hash changes (browser back/forward, manual URL change)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation items with i18n keys
  const navigation = [
    { key: 'nav.home', id: 'home' as Page },
    { key: 'nav.about', id: 'about' as Page },
    { key: 'nav.services', id: 'services' as Page },
    { key: 'nav.workflow', id: 'workflow' as Page },
    { key: 'nav.portfolio', id: 'portfolio' as Page },
    ...(blogHidden ? [] : [{ key: 'nav.blog', id: 'blog' as Page }]),
    { key: 'nav.contact', id: 'contact' as Page },
  ];

  const handleNavClick = (page: Page) => {
    if (page === 'pricing') {
      window.open('https://form.typeform.com/to/aTxRPmXX', '_blank');
      return;
    }
    window.location.hash = page === 'home' ? '' : `#${page}`;
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  // Render Admin page separately (no header/footer)
  if (currentPage === 'admin') {
    return <Admin />;
  }

  // Redirect to home if blog is hidden and user tries to access it
  const pageToRender = blogHidden && currentPage === 'blog' ? 'home' : currentPage;

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-16 sm:h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="text-xl sm:text-2xl tracking-[0.2em] hover:opacity-70 transition-opacity"
            >
              TRQ
            </button>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-6 xl:space-x-8' : 'space-x-6 xl:space-x-8'}`}>
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm tracking-wider transition-opacity hover:opacity-70 ${
                    currentPage === item.id ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {ts(item.key)}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('pricing')}
                className="px-4 xl:px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-black/80 transition-colors"
              >
                {ts('nav.pricing')}
              </button>
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <div className={`lg:hidden flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-black/5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full ${isRTL ? 'text-right' : 'text-left'} text-sm tracking-wider py-3 px-2 rounded ${
                    currentPage === item.id ? 'opacity-100 bg-black/5' : 'opacity-60'
                  }`}
                >
                  {ts(item.key)}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('pricing')}
                className="w-full px-6 py-3 bg-black text-white text-sm tracking-wider mt-4"
              >
                {ts('nav.pricing')}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20">
        {pageToRender === 'home' && <Home onNavigate={handleNavClick} />}
        {pageToRender === 'about' && <About />}
        {pageToRender === 'services' && <Services />}
        {pageToRender === 'workflow' && <Workflow />}
        {pageToRender === 'portfolio' && <Portfolio />}
        {pageToRender === 'blog' && !blogHidden && <Blog />}
        {pageToRender === 'contact' && <Contact />}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 ${isRTL ? 'text-right' : ''}`}>
            {/* Logo & Description */}
            <div className="sm:col-span-2">
              <h3 className="text-xl sm:text-2xl tracking-[0.2em] mb-3 sm:mb-4">TRQ</h3>
              <p className="text-sm sm:text-base text-white/60 max-w-md">
                {ts('footer.tagline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">{ts('footer.quickLinks')}</h4>
              <div className="space-y-1 sm:space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block text-xs sm:text-sm text-white/60 hover:text-white transition-colors ${isRTL ? 'w-full text-right' : ''}`}
                  >
                    {ts(item.key)}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">{ts('footer.contactInfo')}</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <p>Riyadh, Saudi Arabia</p>
                <p>info@trq.design</p>
                <p>+966 XX XXX XXXX</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t border-white/10 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-white/40 gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <p>{ts('footer.copyright')}</p>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4 sm:space-x-6' : 'space-x-4 sm:space-x-6'}`}>
              <button className="hover:text-white transition-colors">{ts('footer.quickLinks')}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
