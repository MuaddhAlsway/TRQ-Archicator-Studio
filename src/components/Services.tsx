import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { getImageUrl } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { getContentFromSettings } from '../utils/contentHelper';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Briefcase;
};

// Helper to safely parse features array from JSON string
const parseFeatures = (features: any): string[] => {
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export function Services() {
  const { td, translateBatch, isRTL, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    // Hero Section
    servicesHeroTitle: 'OUR SERVICES',
    servicesHeroParagraph: 'Comprehensive design solutions tailored to your unique vision',
    servicesHeroImage: '/uploads/5.webp',
    
    // Introduction Section
    servicesTitle: 'Complete Design Solutions',
    servicesDescription: 'From intimate residential spaces to grand commercial projects, from exhibition booths to custom furniture, TRQ offers a comprehensive suite of design services.',
    
    // Highlights Section
    servicesHighlightsTitle: 'Service Highlights',
    servicesHighlightsDescription: 'What you can expect when working with TRQ',
    servicesHighlight1Title: 'Tailored Solutions',
    servicesHighlight1Description: 'Every project is unique. We create bespoke designs that reflect your specific needs.',
    servicesHighlight2Title: 'End-to-End Service',
    servicesHighlight2Description: 'From initial consultation to final installation, we manage every detail.',
    servicesHighlight3Title: 'Premium Quality',
    servicesHighlight3Description: 'We source the finest materials and work with skilled craftsmen.',
    
    // CTA Section
    servicesCtaTitle: 'Ready to Get Started?',
    servicesCtaDescription: 'Let us discuss your project and explore how our services can bring your vision to life.',
    servicesCtaButton1Text: 'REQUEST PRICING',
    servicesCtaButton1Page: 'pricing',
    servicesCtaButton2Text: 'CONTACT US',
    servicesCtaButton2Page: 'contact',
  });

  const [allSettings, setAllSettings] = useState<any>(null);
  // Keep original defaults so language switching always has a clean English baseline
  const defaultSettingsRef = useRef(settings);

  useEffect(() => {
    api.getActiveServices().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setServices(data);
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Error loading services:', error);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    // Fetch all settings once on component mount
    api.getSettings().then((data) => {
      setAllSettings(data);
      
      // Initialize settings immediately when data is loaded — use defaults as base
      const defaults = defaultSettingsRef.current;
      const newSettings = { ...defaults };
      Object.keys(newSettings).forEach(key => {
        if (key.startsWith('services')) {
          if (language === 'ar') {
            const arabicKey = `${key}_ar`;
            newSettings[key] = data[arabicKey] || data[key] || defaults[key];
          } else {
            newSettings[key] = data[key] || defaults[key];
          }
        }
      });
      setSettings(newSettings);
    }).catch((error) => {
      console.error('Error loading settings:', error);
    });
  }, []);

  // Update settings when language changes — always derive from raw DB data + original defaults
  useEffect(() => {
    if (!allSettings) return;
    
    const defaults = defaultSettingsRef.current;
    const newSettings = { ...defaults };
    
    Object.keys(newSettings).forEach(key => {
      if (key.startsWith('services')) {
        if (language === 'ar') {
          const arabicKey = `${key}_ar`;
          newSettings[key] = allSettings[arabicKey] || allSettings[key] || defaults[key];
        } else {
          newSettings[key] = allSettings[key] || defaults[key];
        }
      }
    });
    
    setSettings(newSettings);
  }, [language, allSettings]);

  // Translate dynamic content from database (services)
  useEffect(() => {
    if (isRTL && services.length > 0) {
      const serviceTexts = services.flatMap(s => [s.title, s.description, ...(s.features || [])]);
      translateBatch(serviceTexts.filter(Boolean));
    }
  }, [isRTL, services]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle loading screen timing - wait for data to load
  useEffect(() => {
    if (services.length > 0 && allSettings) {
      // Data loaded, loading screen will auto-hide after 4s
    }
  }, [services, allSettings]);

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src={getImageUrl(getContentFromSettings(language, settings, 'servicesHeroImage') || '/uploads/5.webp')} alt="Our Services" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl tracking-wider mb-6">{getContentFromSettings(language, settings, 'servicesHeroTitle')}</h1>
          <p className="text-xl opacity-90">{getContentFromSettings(language, settings, 'servicesHeroParagraph')}</p>
        </div>
      </section>
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{getContentFromSettings(language, settings, 'servicesTitle')}</h2>
        <p className="text-lg text-black/70">{getContentFromSettings(language, settings, 'servicesDescription')}</p>
      </section>
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {services && services.length > 0 ? (
            services.map((service, index) => {
              const Icon = getIconComponent(service?.icon || 'Briefcase');
              
              // Use Arabic content if available and in RTL mode, otherwise use English
              const serviceTitle = isRTL && (service as any)?.title_ar 
                ? (service as any).title_ar 
                : service?.title || 'Service';
              const serviceDescription = isRTL && (service as any)?.description_ar 
                ? (service as any).description_ar 
                : service?.description || '';
              const serviceFeatures = isRTL && (service as any)?.features_ar 
                ? (service as any).features_ar 
                : service?.features || [];
              const serviceImage = getImageUrl(service?.image || '');
              
              // Alternate layout: image left, text right (always)
              const imageOnLeft = true;
              
              return (
                <div key={service?.id || index} className={`mb-12 last:mb-0 py-12 lg:py-16`}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto px-4 lg:px-0 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Image - Always on left in LTR, right in RTL */}
                    <div className={`relative h-[400px] sm:h-[500px] overflow-hidden rounded-lg ${isRTL ? 'lg:order-2' : ''}`}>
                      <ImageWithFallback 
                        src={serviceImage} 
                        alt={serviceTitle} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                      />
                    </div>
                    
                    {/* Text Content - Always on right in LTR, left in RTL */}
                    <div className={`${isRTL ? 'lg:order-1 text-right' : 'text-left'}`}>
                      <div className={`w-16 h-16 bg-black flex items-center justify-center mb-6 ${isRTL ? 'ml-auto' : ''}`}>
                        <Icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-3xl md:text-4xl mb-4 tracking-wide">{serviceTitle}</h3>
                      <p className="text-lg text-black/70 mb-8">{serviceDescription}</p>
                      {(() => {
                        const features = parseFeatures(serviceFeatures);
                        return features && features.length > 0 && (
                          <div className="space-y-3">
                            {features.map((feature, idx) => (
                              <div key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 flex-shrink-0" />
                                <p className="text-black/70">{feature}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-black/60">Loading services...</p>
            </div>
          )}
        </div>
      </section>
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 tracking-wide">{getContentFromSettings(language, settings, 'servicesHighlightsTitle')}</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{getContentFromSettings(language, settings, 'servicesHighlightsDescription')}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
            {[
              { title: getContentFromSettings(language, settings, 'servicesHighlight1Title'), desc: getContentFromSettings(language, settings, 'servicesHighlight1Description') },
              { title: getContentFromSettings(language, settings, 'servicesHighlight2Title'), desc: getContentFromSettings(language, settings, 'servicesHighlight2Description') },
              { title: getContentFromSettings(language, settings, 'servicesHighlight3Title'), desc: getContentFromSettings(language, settings, 'servicesHighlight3Description') },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8">
                <h3 className="text-2xl mb-4 tracking-wide">{item.title}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{getContentFromSettings(language, settings, 'servicesCtaTitle')}</h2>
          <p className="text-lg text-black/60 mb-12">{getContentFromSettings(language, settings, 'servicesCtaDescription')}</p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href="#pricing" className="px-8 py-4 bg-[rgb(174,3,1)] text-white hover:bg-[rgb(174,3,1)]/80 transition-colors tracking-wider inline-block">{getContentFromSettings(language, settings, 'servicesCtaButton1Text')}</a>
            <a href={`#${getContentFromSettings(language, settings, 'servicesCtaButton2Page') || 'contact'}`} className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block">{getContentFromSettings(language, settings, 'servicesCtaButton2Text')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
