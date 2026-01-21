import { useState, useEffect, useRef, useCallback } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectDetail } from './ProjectDetail';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

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
  const [settings, setSettings] = useState({
    portfolioHeroTitle: 'OUR PORTFOLIO',
    portfolioHeroParagraph: 'Explore our collection of exceptional design projects',
    portfolioIntroParagraph: 'Each project represents our commitment to excellence, creativity, and attention to detail.',
    portfolioCategories: JSON.stringify([
      { id: 'all', label: 'All Projects' },
      { id: 'residential', label: 'Residential' },
      { id: 'commercial', label: 'Commercial' },
      { id: 'booths', label: 'Booths & Exhibitions' },
      { id: 'events', label: 'Events' },
      { id: 'furniture', label: 'Furniture' },
    ]),
    portfolioStat1Value: '150+',
    portfolioStat1Label: 'PROJECTS COMPLETED',
    portfolioStat2Value: '100+',
    portfolioStat2Label: 'HAPPY CLIENTS',
    portfolioStat3Value: '15+',
    portfolioStat3Label: 'AWARDS WON',
    portfolioStat4Value: '8+',
    portfolioStat4Label: 'YEARS EXPERIENCE',
    portfolioCtaTitle: 'Let\'s Create Your Project',
    portfolioCtaDescription: 'Ready to start your own design journey? Get in touch with our team.',
    portfolioCtaButton1Text: 'REQUEST PRICING',
    portfolioCtaButton1Page: 'pricing',
    portfolioCtaButton2Text: 'CONTACT US',
    portfolioCtaButton2Page: 'contact',
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.getPublishedProjects();
        setProjects(data);
        const projectId = getProjectIdFromHash();
        if (projectId) {
          const project = data.find((p: Project) => p.id === projectId);
          if (project) setSelectedProject(getProjectData(project));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
      setLoading(false);
    };
    loadProjects();
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, [language]);

  // Translate dynamic content from database
  useEffect(() => {
    if (language === 'ar' && projects.length > 0) {
      const projectTexts = projects.flatMap(p => [p.title, p.category, p.subcategory, p.description]);
      translateBatch(projectTexts.filter(Boolean));
    }
  }, [language, projects]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [projects, language]);

  const getProjectData = (project: Project): Project => {
    if (language === 'ar') {
      return {
        ...project,
        title: project.title_ar || project.title,
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

  // Infinite scroll state - loops continuously
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loopCountRef = useRef(1);

  let categories: { id: string; label: string }[] = [];
  try {
    categories = JSON.parse(settings.portfolioCategories || '[]');
    categories = categories.filter(cat => cat.id && cat.label);
  } catch { categories = [{ id: 'all', label: 'All Projects' }]; }

  const filteredProjects = activeCategory === 'all' ? projects : projects.filter(project => project.category === activeCategory);

  // Reset displayed projects when category changes or projects load
  useEffect(() => {
    loopCountRef.current = 1;
    if (filteredProjects.length > 0) {
      setDisplayedProjects([...filteredProjects.slice(0, PROJECTS_PER_PAGE)]);
    } else {
      setDisplayedProjects([]);
    }
  }, [activeCategory, projects]);

  // Infinite scroll observer - loops back to start
  const loadMore = useCallback(() => {
    if (loadingMore || filteredProjects.length === 0) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayedProjects(prev => {
        const currentLength = prev.length;
        const startIndex = currentLength % filteredProjects.length;
        const nextProjects: Project[] = [];
        
        for (let i = 0; i < PROJECTS_PER_PAGE; i++) {
          const index = (startIndex + i) % filteredProjects.length;
          // Add unique key by appending loop count
          const project = { 
            ...filteredProjects[index], 
            _loopKey: `${filteredProjects[index].id}-${loopCountRef.current}-${i}` 
          };
          nextProjects.push(project as Project);
        }
        
        if (startIndex + PROJECTS_PER_PAGE >= filteredProjects.length) {
          loopCountRef.current++;
        }
        
        return [...prev, ...nextProjects];
      });
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, filteredProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && filteredProjects.length > 0) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadingMore, loadMore, filteredProjects.length]);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={handleBackToPortfolio} />;
  }

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1080" alt="Our Portfolio" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 sm:mb-6">{ts('portfolio.heroTitle')}</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">{ts('portfolio.heroSubtitle')}</p>
        </div>
      </section>
      <section className="py-8 sm:py-12 md:py-16 px-4 max-w-4xl mx-auto text-center">
        <p className="text-base sm:text-lg text-black/70">{ts('portfolio.introText')}</p>
      </section>
      <section className="py-4 sm:py-6 md:py-8 px-4 max-w-7xl mx-auto">
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {[
            { id: 'all', label: ts('portfolio.allProjects') },
            { id: 'residential', label: ts('portfolio.residential') },
            { id: 'commercial', label: ts('portfolio.commercial') },
            { id: 'booths', label: ts('portfolio.booths') },
            { id: 'events', label: ts('portfolio.events') },
            { id: 'furniture', label: ts('portfolio.furniture') },
          ].map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 tracking-wider transition-colors text-xs sm:text-sm ${activeCategory === category.id ? 'bg-black text-white' : 'border-2 border-black/20 text-black hover:border-black'}`}>
              {category.label}
            </button>
          ))}
        </div>
      </section>
      <section className="py-8 sm:py-10 md:py-12 px-4 max-w-7xl mx-auto pb-16 sm:pb-20 md:pb-24">
        {loading ? (
          <div className="text-center py-12 sm:py-16"><p className="text-base sm:text-lg text-black/60">{ts('common.loading')}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {displayedProjects.map((project, index) => {
              const displayProject = getProjectData(project);
              return (
              <div key={(project as any)._loopKey || `${project.id}-${index}`} onClick={() => handleSelectProject(project)} className={`group cursor-pointer overflow-hidden bg-white ${isRTL ? 'text-right' : ''}`}>
                <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
                  <ImageWithFallback src={project.image} alt={displayProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                      <h3 className="text-base sm:text-lg md:text-xl mb-1 tracking-wide">{td(displayProject.title)}</h3>
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
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12 sm:py-16"><p className="text-base sm:text-lg text-black/60">{ts('portfolio.noProjects')}</p></div>
        )}
        
        {/* Infinite scroll trigger - always active for continuous loop */}
        {filteredProjects.length > 0 && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loadingMore && (
              <div className="flex items-center gap-2 text-black/60">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                <span className="text-sm tracking-wider">{ts('common.loading')}</span>
              </div>
            )}
          </div>
        )}
      </section>
      <section className="py-12 sm:py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { value: settings.portfolioStat1Value, label: ts('portfolio.stat1Label') },
              { value: settings.portfolioStat2Value, label: ts('portfolio.stat2Label') },
              { value: settings.portfolioStat3Value, label: ts('portfolio.stat3Label') },
              { value: settings.portfolioStat4Value, label: ts('portfolio.stat4Label') },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-1 sm:mb-2">{toArabicNum(stat.value)}</div>
                <p className="text-xs sm:text-sm text-white/60 tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">{ts('portfolio.ctaTitle')}</h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-12">{ts('portfolio.ctaText')}</p>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href={`#${settings.portfolioCtaButton1Page}`} className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider inline-block text-sm sm:text-base">{ts('common.requestPricing')}</a>
            <a href={`#${settings.portfolioCtaButton2Page}`} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block text-sm sm:text-base">{ts('common.contactUs')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
