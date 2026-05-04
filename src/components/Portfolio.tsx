import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectDetail } from './ProjectDetail';
import { ClientsCarousel } from './ClientsCarousel';
import * as api from '../api';
import { getImageUrl } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { getContentFromSettings } from '../utils/contentHelper';
import { applyPortfolioProtection } from '../utils/contentProtection';

const PROJECTS_PER_PAGE = 6;

interface Project {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  year: string;
  status?: string;
  location?: string;
  client?: string;
  size?: string;
  duration?: string;
  detailedDescription?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  materials?: string[];
  awards?: string[];
  team?: string[];
  gallery?: string[];
  clientQuote?: string;
  clientName?: string;
  sortOrder?: number;
  // Arabic fields
  title_ar?: string;
  category_ar?: string;
  subcategory_ar?: string;
  description_ar?: string;
  location_ar?: string;
  client_ar?: string;
  size_ar?: string;
  duration_ar?: string;
  detailedDescription_ar?: string;
  challenge_ar?: string;
  solution_ar?: string;
  features_ar?: string[];
  materials_ar?: string[];
  awards_ar?: string[];
  team_ar?: string[];
  clientQuote_ar?: string;
  clientName_ar?: string;
}

const getProjectIdFromHash = (): number | null => {
  const hash = window.location.hash;
  const match = hash.match(/#portfolio\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

export function Portfolio() {
  const { ts, td, toArabicNum, translateBatch, isRTL, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    portfolioHeroTitle: 'PORTFOLIO',
    portfolioHeroTitle_ar: 'المحفظة',
    portfolioHeroParagraph: 'Explore our collection of exceptional design projects',
    portfolioHeroParagraph_ar: 'استكشف مجموعتنا من مشاريع التصميم الاستثنائية',
    portfolioHeroImage: '/TRQ STUDIO _ PROJECTS/A Fusion of Art and Elegance  Living room/14.webp',
    portfolioIntroParagraph: 'Each project represents our commitment to excellence, creativity, and attention to detail.',
    portfolioIntroParagraph_ar: 'يمثل كل مشروع التزامنا بالتميز والإبداع والاهتمام بالتفاصيل',
    portfolioCategories: JSON.stringify([
      { id: 'all', label: 'All Projects' },
      { id: 'interior-design', label: 'Interior Design' },
      { id: 'event-design', label: 'Event Design' },
      { id: 'booths', label: 'Booths & Exhibitions' },
      { id: 'custom-design', label: 'Custom Design' },
    ]),
    portfolioCategories_ar: JSON.stringify([
      { id: 'all', label: 'جميع المشاريع' },
      { id: 'interior-design', label: 'تصميم داخلي' },
      { id: 'event-design', label: 'تصميم الأحداث' },
      { id: 'booths', label: 'الأكشاك والمعارض' },
      { id: 'custom-design', label: 'تصميم مخصص' },
    ]),
    portfolioStat1Value: '150+',
    portfolioStat1Label: 'PROJECTS COMPLETED',
    portfolioStat1Label_ar: 'مشاريع مكتملة',
    portfolioStat2Value: '100+',
    portfolioStat2Label: 'HAPPY CLIENTS',
    portfolioStat2Label_ar: 'عملاء سعداء',
    portfolioStat3Value: '15+',
    portfolioStat3Label: 'AWARDS WON',
    portfolioStat3Label_ar: 'جوائز فازت',
    portfolioStat4Value: '8+',
    portfolioStat4Label: 'YEARS EXPERIENCE',
    portfolioStat4Label_ar: 'سنوات الخبرة',
    portfolioCtaTitle: 'Let\'s Create Your Project',
    portfolioCtaTitle_ar: 'دعنا ننشئ مشروعك',
    portfolioCtaDescription: 'Ready to start your own design journey? Get in touch with our team.',
    portfolioCtaDescription_ar: 'هل أنت مستعد لبدء رحلة التصميم الخاصة بك؟ تواصل مع فريقنا.',
    portfolioCtaButton1Text: 'REQUEST PRICING',
    portfolioCtaButton1Page: 'pricing',
    portfolioCtaButton2Text: 'CONTACT US',
    portfolioCtaButton2Page: 'contact',
  });

  const [allSettings, setAllSettings] = useState<any>(null);
  const defaultSettingsRef = useRef(settings);

  // Helper to normalize image paths — always strips domain, returns root-relative
  const normalizeImagePath = (imagePath: string): string => {
    if (!imagePath) return '';
    return getImageUrl(imagePath);
  };

  const getProjectData = (project: Project): Project => {
    if (language === 'ar') {
      return {
        ...project,
        // ALWAYS keep English title - never replace with Arabic
        title: project.title,
        category: project.category_ar || project.category,
        subcategory: project.subcategory_ar || project.subcategory,
        description: project.description_ar || project.description,
        location: project.location_ar || project.location,
        client: project.client_ar || project.client,
        size: project.size_ar || project.size,
        duration: project.duration_ar || project.duration,
        detailedDescription: project.detailedDescription_ar || project.detailedDescription,
        challenge: project.challenge_ar || project.challenge,
        solution: project.solution_ar || project.solution,
        features: project.features_ar || project.features,
        materials: project.materials_ar || project.materials,
        awards: project.awards_ar || project.awards,
        team: project.team_ar || project.team,
        clientQuote: project.clientQuote_ar || project.clientQuote,
        clientName: project.clientName_ar || project.clientName,
      };
    }
    return project;
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.getPublishedProjects();
        console.log('Loaded projects:', data);
        const projectsArray = Array.isArray(data) ? data : [];
        // Deduplicate by ID in case API returns duplicates
        const unique = Array.from(new Map(projectsArray.map((p: Project) => [p.id, p])).values());
        setProjects(unique);
        setError(null);
        
        // Check if we need to load a specific project from hash
        const projectId = getProjectIdFromHash();
        if (projectId && projectsArray.length > 0) {
          const project = projectsArray.find((p: Project) => p.id === projectId);
          if (project) {
            console.log('Found project from hash:', project.title);
            setSelectedProject(getProjectData(project));
          }
        }
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects. Please try refreshing the page.');
        setProjects([]);
      }
      setLoading(false);
    };
    loadProjects();
    api.getSettings().then((data) => {
      setAllSettings(data);
      const defaults = defaultSettingsRef.current;
      const newSettings = { ...defaults };
      Object.keys(newSettings).forEach(key => {
        if (language === 'ar') {
          newSettings[key] = data[`${key}_ar`] || data[key] || defaults[key];
        } else {
          newSettings[key] = data[key] || defaults[key];
        }
      });
      setSettings(newSettings);
    }).catch(() => {});

    // Apply content protection
    applyPortfolioProtection();
  }, []);

  // Translate dynamic content from database
  useEffect(() => {
    if (language === 'ar' && projects.length > 0) {
      const projectTexts = projects.flatMap(p => [p.title, p.category, p.subcategory, p.description]);
      translateBatch(projectTexts.filter(Boolean));
    }
  }, [language, projects]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-derive settings when language changes
  useEffect(() => {
    if (!allSettings) return;
    const defaults = defaultSettingsRef.current;
    const newSettings = { ...defaults };

    // EN keys that are known to be corrupted in Turso with Arabic text — always use defaults
    const alwaysUseDefault = new Set([
      'portfolioCategories',
      'portfolioHeroTitle',
      'portfolioHeroParagraph',
      'portfolioIntroParagraph',
      'portfolioStat1Label',
      'portfolioStat2Label',
      'portfolioStat3Label',
      'portfolioStat4Label',
      'portfolioCtaTitle',
      'portfolioCtaDescription',
      'portfolioCtaButton1Text',
      'portfolioCtaButton2Text',
    ]);

    Object.keys(newSettings).forEach(key => {
      if (key.endsWith('_ar')) {
        // Always load _ar keys from DB
        newSettings[key] = allSettings[key] || defaults[key];
      } else if (language === 'ar') {
        // In AR mode: prefer _ar value, fall back to EN DB value, then default
        newSettings[key] = allSettings[`${key}_ar`] || allSettings[key] || defaults[key];
      } else {
        // In EN mode: if key is known-corrupted, always use default
        if (alwaysUseDefault.has(key)) {
          newSettings[key] = defaults[key];
        } else {
          // Only use DB value if it doesn't contain Arabic characters
          const dbVal = allSettings[key];
          const hasArabic = dbVal && /[\u0600-\u06FF]/.test(String(dbVal));
          newSettings[key] = hasArabic ? defaults[key] : (dbVal || defaults[key]);
        }
      }
    });
    setSettings(newSettings);
  }, [language, allSettings]);

  useEffect(() => {
    const handleHashChange = () => {
      const projectId = getProjectIdFromHash();
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) setSelectedProject(getProjectData(project));
      } else if (window.location.hash === '#portfolio') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [projects, isRTL]);

  // Update selected project when language changes
  useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(getProjectData(updatedProject));
      }
    }
  }, [isRTL]);

  const handleSelectProject = (project: Project) => {
    window.location.hash = `portfolio/${project.id}`;
    setSelectedProject(getProjectData(project));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToPortfolio = () => {
    window.location.hash = 'portfolio';
    setSelectedProject(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  let categories: { id: string; label: string }[] = [];
  try {
    // Always use the EN categories as base — never let AR values overwrite them
    const enCats = JSON.parse(allSettings?.portfolioCategories || settings.portfolioCategories || '[]');
    const arCats = JSON.parse(allSettings?.portfolioCategories_ar || settings.portfolioCategories_ar || '[]');

    if (language === 'ar' && arCats.length > 0) {
      categories = arCats.filter((cat: any) => cat.id && cat.label);
    } else {
      // EN: always use the hardcoded EN defaults merged with any EN-only DB value
      const parsed = enCats.filter((cat: any) => cat.id && cat.label);
      // If DB returned Arabic text in the EN key (corrupted), fall back to defaults
      const hasArabic = parsed.some((c: any) => /[\u0600-\u06FF]/.test(c.label));
      categories = hasArabic ? defaultSettingsRef.current.portfolioCategories
        ? JSON.parse(defaultSettingsRef.current.portfolioCategories)
        : [] : parsed;
    }
    if (categories.length === 0) throw new Error('empty');
  } catch {
    categories = language === 'ar'
      ? [
          { id: 'all', label: 'جميع المشاريع' },
          { id: 'interior-design', label: 'تصميم داخلي' },
          { id: 'event-design', label: 'تصميم الأحداث' },
          { id: 'booths', label: 'الأكشاك والمعارض' },
          { id: 'custom-design', label: 'تصميم مخصص' },
        ]
      : [
          { id: 'all', label: 'All Projects' },
          { id: 'interior-design', label: 'Interior Design' },
          { id: 'event-design', label: 'Event Design' },
          { id: 'booths', label: 'Booths & Exhibitions' },
          { id: 'custom-design', label: 'Custom Design' },
        ];
  }

  // Derive filtered projects directly — no intermediate state, no stale cache
  const filteredProjects: Project[] = activeCategory === 'all'
    ? [...projects].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : [...projects]
        .filter(p => p.category === activeCategory)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={handleBackToPortfolio} />;
  }

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src={getImageUrl(getContentFromSettings(language, settings, 'portfolioHeroImage') || 'TRQ STUDIO _ PROJECTS/A Fusion of Art and Elegance  Living room/14.webp')} alt="Our Portfolio" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 sm:mb-6">{getContentFromSettings(language, settings, 'portfolioHeroTitle')}</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">{getContentFromSettings(language, settings, 'portfolioHeroParagraph')}</p>
        </div>
      </section>
      <section className="py-8 sm:py-12 md:py-16 px-4 max-w-4xl mx-auto text-center">
        <p className="text-base sm:text-lg text-black/70">{getContentFromSettings(language, settings, 'portfolioIntroParagraph')}</p>
      </section>
      <section className="py-4 sm:py-6 md:py-8 px-4 max-w-7xl mx-auto">
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 tracking-wider transition-colors text-xs sm:text-sm ${activeCategory === category.id ? 'bg-black text-white' : 'border-2 border-black/20 text-black hover:border-black'}`}>
              {category.label}
            </button>
          ))}
        </div>
      </section>
      <section className="py-8 sm:py-10 md:py-12 px-4 max-w-7xl mx-auto pb-16 sm:pb-20 md:pb-24">
        {loading ? (
          <div className="text-center py-12 sm:py-16"><p className="text-base sm:text-lg text-black/60">{ts('common.loading')}</p></div>
        ) : error ? (
          <div className="text-center py-12 sm:py-16"><p className="text-base sm:text-lg text-red-600">{error}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredProjects.map((project) => {
              const displayProject = getProjectData(project);
              const imageUrl = normalizeImagePath(project.image);
              return (
                <div key={`${project.id}`} onClick={() => handleSelectProject(project)} className={`group cursor-pointer overflow-hidden bg-white ${isRTL ? 'text-right' : ''}`}>
                  <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
                    <ImageWithFallback src={imageUrl} alt={displayProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-xs sm:text-sm tracking-widest opacity-90 mb-1 sm:mb-2">{td(displayProject.subcategory)}</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 tracking-wide">{td(displayProject.title)}</h3>
                      <p className="text-xs sm:text-sm opacity-80 line-clamp-2">{td(displayProject.description)}</p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 border-t border-black/5">
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl mb-1 tracking-wide">{project.title}</h3>
                        <p className="text-xs sm:text-sm text-black/60">{td(displayProject.subcategory)}</p>
                      </div>
                      <span className="text-xs sm:text-sm text-black/40">{project.year}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12 sm:py-16"><p className="text-base sm:text-lg text-black/60">{ts('portfolio.noProjects')}</p></div>
        )}
        
      </section>

      {/* Clients Carousel */}
      <ClientsCarousel />

      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">{getContentFromSettings(language, settings, 'portfolioCtaTitle') || ts('portfolio.ctaTitle')}</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-12">{getContentFromSettings(language, settings, 'portfolioCtaDescription') || ts('portfolio.ctaText')}</p>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href={`#${getContentFromSettings(language, settings, 'portfolioCtaButton1Page')}`} className="px-6 sm:px-8 py-3 sm:py-4 bg-[rgb(174,3,1)] text-white hover:bg-[rgb(174,3,1)]/80 transition-colors tracking-wider inline-block text-sm sm:text-base">{ts('common.requestPricing')}</a>
            <a href={`#${getContentFromSettings(language, settings, 'portfolioCtaButton2Page')}`} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block text-sm sm:text-base">{ts('common.contactUs')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
