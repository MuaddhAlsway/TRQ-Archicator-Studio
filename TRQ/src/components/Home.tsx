import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import * as api from '../api';
import { HeroSlider } from './HeroSlider';
import { useLanguage } from '../context/LanguageContext';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
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
  const { ts, td, toArabicNum, translateBatch, language, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    homeIntroImage:'/uploads/5.webp',
    homeIntroLinkPage: 'about',
    homeFeaturedProjects: '',
    homeWorkflowLinkPage: 'workflow',
    homeCtaButton1Page: 'pricing',
    homeCtaButton2Page: 'contact',
  });

  // Translate dynamic content (database) when language changes
  useEffect(() => {
    // Only translate database content (services, projects)
    const dynamicTexts = [
      ...services.map(s => s.title),
      ...services.map(s => s.description),
      ...featuredProjects.map(p => p.title),
      ...featuredProjects.map(p => p.category),
    ];
    translateBatch(dynamicTexts.filter(Boolean));
  }, [language, services, featuredProjects, translateBatch]);

  useEffect(() => {
    // First get settings to know which projects to feature
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
      
      // Load featured projects based on settings
      if (data.homeFeaturedProjects) {
        const ids = data.homeFeaturedProjects.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        if (ids.length > 0) {
          Promise.all(ids.map((id: number) => api.getProject(id).catch(() => null)))
            .then((projects) => {
              setFeaturedProjects(projects.filter(Boolean));
            });
        } else {
          api.getPublishedProjects().then((data) => {
            setFeaturedProjects(data.slice(0, 2));
          }).catch(() => setFeaturedProjects([]));
        }
      } else {
        api.getPublishedProjects().then((data) => {
          setFeaturedProjects(data.slice(0, 2));
        }).catch(() => setFeaturedProjects([]));
      }
    }).catch(() => {
      api.getPublishedProjects().then((data) => {
        setFeaturedProjects(data.slice(0, 2));
      }).catch(() => setFeaturedProjects([]));
    });

    // Load services with Arabic translations
    Promise.all([api.getActiveServices(), api.getSettings()]).then(([servicesData, settingsData]) => {
      const servicesWithArabic = servicesData.map((service: any) => ({
        ...service,
        title_ar: settingsData[`service_${service.id}_title_ar`] || service.title,
        description_ar: settingsData[`service_${service.id}_description_ar`] || service.description,
      }));
      setServices(servicesWithArabic);
    }).catch(() => {
      setServices([]);
    });
  }, []);

  const handleProjectClick = (projectId: number) => {
    window.location.hash = `portfolio/${projectId}`;
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Slider Section */}
      <HeroSlider onNavigate={onNavigate} />

      {/* Introduction - Static text from i18next */}
      <section className="py-12 sm:py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          <div className={isRTL ? 'lg:order-2 text-right' : 'text-left'}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
              {ts('home.introTitle')}
            </h2>
            <p className={`text-base sm:text-lg text-black/60 mb-4 sm:mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              {ts('home.introText1')}
            </p>
            <p className={`text-base sm:text-lg text-black/60 mb-6 sm:mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {ts('home.introText2')}
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
              src={'/uploads/5.webp'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => {
              const Icon = getIconComponent(service.icon);
              return (
                <div
                  key={service.id}
                  className={`group relative overflow-hidden bg-white cursor-pointer ${isRTL ? 'text-right' : ''}`}
                  onClick={() => onNavigate('services')}
                >
                  <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className={`flex items-start gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white" size={20} />
                      </div>
                      <div>
                        {/* Dynamic content from database - use Arabic if available */}
                        <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 tracking-wide">
                          {isRTL && service.title_ar ? service.title_ar : td(service.title)}
                        </h3>
                        <p className="text-sm sm:text-base text-black/60 mb-3 sm:mb-4 line-clamp-2">
                          {isRTL && service.description_ar ? service.description_ar : td(service.description)}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{ts('home.featuredProjects')}</h2>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto px-4">
              {ts('home.featuredSubtitle')}
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white ${isRTL ? 'text-right' : ''}`}>
                      {/* Dynamic content from database */}
                      <p className="text-xs sm:text-sm tracking-widest opacity-80 mb-1 sm:mb-2">{td(project.category)}</p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4 tracking-wide">{td(project.title)}</h3>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{ts('home.howWeWork')}</h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
              {ts('home.howWeWorkSubtitle')}
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

      {/* CTA Section - All static text */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">
            {ts('home.ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg text-black/60 mb-8 sm:mb-12 max-w-2xl mx-auto">
            {ts('home.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => onNavigate(settings.homeCtaButton1Page as any)}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider text-sm sm:text-base"
            >
              {ts('common.requestPricing')}
            </button>
            <button
              onClick={() => onNavigate(settings.homeCtaButton2Page as any)}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm sm:text-base"
            >
              {ts('common.contactUs')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
