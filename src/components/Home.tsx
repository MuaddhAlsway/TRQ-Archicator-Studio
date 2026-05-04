import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';
import * as api from '../api';
import { getImageUrl } from '../api';
import { HeroSlider } from './HeroSlider';
import { useLanguage } from '../context/LanguageContext';
import { ParallaxContainer } from './ParallaxContainer';
import { getContentFromSettings } from '../utils/contentHelper';
import { ClientsCarousel } from './ClientsCarousel';
import { gsap } from 'gsap';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  title_ar?: string;
  category_ar?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  title_ar?: string;
  description_ar?: string;
}

interface HomeProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'workflow' | 'portfolio' | 'contact' | 'pricing') => void;
}

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Briefcase;
};

export function Home({ onNavigate }: HomeProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  // ts = static translation (i18next), td = dynamic translation (API), toArabicNum = convert numbers
  const { ts, td, toArabicNum, language, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    homeIntroImage:'/uploads/5.webp',
    homeIntroLinkPage: 'about',
    homeFeaturedProjects: '',
    homeWorkflowLinkPage: 'workflow',
    homeCtaButton1Page: 'pricing',
    homeCtaButton2Page: 'contact',
    // Add missing text settings
    homeIntroTitle: 'Creating Timeless Design Solutions',
    homeIntroText1: 'TRQ STUDIO is an interior design studio that crafts luxurious spaces embodying elegance through a holistic approach that harmoniously balances aesthetics, functionality, and sensory experience.',
    homeIntroText2: 'The studio delivers fully integrated design solutions that respect context and identity, executed to the highest standards across high-end residential, commercial, and distinguished institutional projects.',
    homeFeaturedTitle: 'Featured Projects',
    homeFeaturedDescription: 'A glimpse into our recent work and design excellence',
    homeWorkflowTitle: 'How We Work',
    homeWorkflowDescription: 'A seamless process designed to bring your vision to life',
    homeCtaTitle: 'Ready to Transform Your Space?',
    homeCtaDescription: 'Let\'s discuss your project and create something extraordinary together. Get in touch with our team today.',
    homeCtaButton1Text: 'REQUEST PRICING',
    homeCtaButton2Text: 'CONTACT US',
  });

  const [allSettings, setAllSettings] = useState<any>(null);
  const defaultSettingsRef = useRef(settings);

  // Re-derive settings when language changes
  useEffect(() => {
    if (!allSettings) return;
    const defaults = defaultSettingsRef.current;
    const newSettings = { ...defaults };
    Object.keys(newSettings).forEach(key => {
      if (language === 'ar') {
        newSettings[key] = allSettings[`${key}_ar`] || allSettings[key] || defaults[key];
      } else {
        newSettings[key] = allSettings[key] || defaults[key];
      }
    });
    setSettings(newSettings);
  }, [language, allSettings]);

  useEffect(() => {
    // First get settings to know which projects to feature
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
      
      // Load featured projects based on language
      const projectsKey = language === 'ar' ? 'homeFeaturedProjects_ar' : 'homeFeaturedProjects';
      const projectsString = data[projectsKey];
      
      if (projectsString) {
        const ids = projectsString.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (ids.length > 0) {
          Promise.all(ids.map((id: number) => api.getProject(id).catch(() => null)))
            .then((projects) => {
              const projectsWithImages = projects.filter(Boolean).map((p: any) => ({
                ...p,
                image: getImageUrl(p.image)
              }));
              setFeaturedProjects(projectsWithImages);
            });
        } else {
          api.getPublishedProjects().then((data) => {
            const projectsWithImages = data.slice(0, 2).map((p: any) => ({
              ...p,
              image: getImageUrl(p.image)
            }));
            setFeaturedProjects(projectsWithImages);
          }).catch(() => setFeaturedProjects([]));
        }
      } else {
        api.getPublishedProjects().then((data) => {
          const projectsWithImages = data.slice(0, 2).map((p: any) => ({
            ...p,
            image: getImageUrl(p.image)
          }));
          setFeaturedProjects(projectsWithImages);
        }).catch(() => setFeaturedProjects([]));
      }
    }).catch(() => {
      api.getPublishedProjects().then((data) => {
        const projectsWithImages = data.slice(0, 2).map((p: any) => ({
          ...p,
          image: getImageUrl(p.image)
        }));
        setFeaturedProjects(projectsWithImages);
      }).catch(() => setFeaturedProjects([]));
    });

    // Load services with Arabic translations
    Promise.all([api.getActiveServices(), api.getSettings()]).then(([servicesData, settingsData]) => {
      const servicesWithArabic = servicesData.map((service: any) => ({
        ...service,
        image: getImageUrl(service.image),
        title_ar: settingsData[`service_${service.id}_title_ar`] || service.title,
        description_ar: settingsData[`service_${service.id}_description_ar`] || service.description,
      }));
      setServices(servicesWithArabic);
    }).catch(() => {
      setServices([]);
    });
  }, [language]);

  const handleProjectClick = (projectId: number) => {
    window.location.hash = `portfolio/${projectId}`;
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'} relative`}>
      {/* Hero Slider Section - NO loading screen here, use global one */}
      <HeroSlider onNavigate={onNavigate} />

      {/* Introduction - Static text from i18next */}
      <section className="relative z-10 py-12 sm:py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          <div className={isRTL ? 'lg:order-2 text-right' : 'text-left'}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
              {getContentFromSettings(language, settings, 'homeIntroTitle')}
            </h2>
            <p className={`text-base sm:text-lg text-black/60 mb-4 sm:mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              {getContentFromSettings(language, settings, 'homeIntroText1')}
            </p>
            <p className={`text-base sm:text-lg text-black/60 mb-6 sm:mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {getContentFromSettings(language, settings, 'homeIntroText2')}
            </p>
            <button
              onClick={() => onNavigate(settings.homeIntroLinkPage as any)}
              className={`inline-flex items-center gap-2 text-black hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="tracking-wider text-sm sm:text-base">{ts('home.learnMoreAboutTrq')}</span>
              <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
            </button>
          </div>
          <div className={`relative h-[300px] sm:h-[400px] lg:h-[500px] ${isRTL ? 'lg:order-1' : ''}`}>
            <ImageWithFallback
              src={getImageUrl(getContentFromSettings(language, settings, 'homeIntroImage'))}
              alt="TRQ design work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Preview - Static labels, dynamic service content */}
      <section className="py-12 sm:py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{ts('home.ourServices')}</h2>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto px-4">
              {ts('home.servicesSubtitle')}
            </p>
          </div>

          <ParallaxContainer speed={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {services.map((service, index) => {
                const Icon = getIconComponent(service.icon);
                return (
                  <div
                    key={service.id}
                    className={`parallax group relative overflow-hidden bg-white cursor-pointer ${isRTL ? 'text-right' : ''}`}
                    data-speed="0.4"
                    onClick={() => onNavigate('services')}
                    style={{
                      animation: `zoomIn 0.6s ease-out ${index * 0.1}s both`,
                      transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 0.95,
                        duration: 0.8,
                        ease: 'power2.inOut'
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.inOut'
                      });
                    }}
                  >
                    <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    </div>
                    <div className="p-6 sm:p-8 md:p-10">
                      <div className={`flex items-start gap-4 sm:gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black flex items-center justify-center flex-shrink-0">
                          <Icon className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          {/* Dynamic content from database - use Arabic if available */}
                          <h3 className="text-xl sm:text-2xl mb-3 sm:mb-4 tracking-wide">
                            {language === 'ar' && service.title_ar ? service.title_ar : td(service.title)}
                          </h3>
                          <p className="text-sm sm:text-base text-black/60 mb-4 sm:mb-5 line-clamp-2">
                            {language === 'ar' && service.description_ar ? service.description_ar : td(service.description)}
                          </p>
                          {/* Static UI text - use ts() */}
                          <span className={`inline-flex items-center gap-2 text-xs sm:text-sm tracking-wider group-hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {ts('common.exploreService')}
                            <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ParallaxContainer>

          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => onNavigate('services')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider text-sm sm:text-base"
            >
              {ts('common.viewAllServices')}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Projects - Static labels, dynamic project content */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{getContentFromSettings(language, settings, 'homeFeaturedTitle')}</h2>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto px-4">
              {getContentFromSettings(language, settings, 'homeFeaturedDescription')}
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden cursor-pointer animate-zoom-in"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white ${isRTL ? 'text-right' : ''}`}>
                      {/* Category in Arabic when in Arabic mode */}
                      <p className="text-xs sm:text-sm tracking-widest opacity-80 mb-1 sm:mb-2">
                        {language === 'ar' && project.category_ar ? project.category_ar : project.category}
                      </p>
                      {/* Project title always in English */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4 tracking-wide text-left">
                        {project.title}
                      </h3>
                      {/* Static UI text */}
                      <span className={`inline-flex items-center gap-2 text-xs sm:text-sm tracking-wider group-hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {ts('common.viewProject')}
                        <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-black/60">{ts('common.loading')}</p>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm sm:text-base"
            >
              {ts('common.viewAllProjects')}
            </button>
          </div>
        </div>
      </section>

      {/* Workflow Preview - All static text */}
      <section className="py-12 sm:py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{getContentFromSettings(language, settings, 'homeWorkflowTitle')}</h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
              {getContentFromSettings(language, settings, 'homeWorkflowDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 text-white/20">{toArabicNum(`0${step}`)}</div>
                <h3 className="text-sm sm:text-lg md:text-xl mb-1 sm:mb-2 tracking-wide">{ts(`home.step${step}Title`)}</h3>
                <p className="text-xs sm:text-sm text-white/60 hidden sm:block">{ts(`home.step${step}Desc`)}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => onNavigate(settings.homeWorkflowLinkPage as any)}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-colors tracking-wider text-sm sm:text-base"
            >
              {ts('common.learnMore')}
            </button>
          </div>
        </div>
      </section>

      {/* Clients Carousel */}
      <ClientsCarousel />

      {/* CTA Section - Ready to Transform Your Space? */}
      <section className="py-12 sm:py-16 md:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">
            {getContentFromSettings(language, settings, 'homeCtaTitle')}
          </h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-12 max-w-2xl mx-auto">
            {getContentFromSettings(language, settings, 'homeCtaDescription')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => onNavigate(settings.homeCtaButton1Page as any)}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider text-sm sm:text-base"
            >
              {getContentFromSettings(language, settings, 'homeCtaButton1Text')}
            </button>
            <button
              onClick={() => onNavigate(settings.homeCtaButton2Page as any)}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm sm:text-base"
            >
              {getContentFromSettings(language, settings, 'homeCtaButton2Text')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
