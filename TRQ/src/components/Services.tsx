import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

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

  useEffect(() => {
    api.getActiveServices().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setServices(data);
      }
    }).catch((error) => {
      console.error('Error loading services:', error);
    });
  }, []);

  useEffect(() => {
    api.getSettings().then((data) => {
      if (!data) return;
      
      // Use Arabic settings if language is Arabic, otherwise use English
      const settingsToUse = language === 'ar' 
        ? {
            servicesHeroTitle: data.servicesHeroTitle_ar || data.servicesHeroTitle || 'خدماتنا',
            servicesHeroParagraph: data.servicesHeroParagraph_ar || data.servicesHeroParagraph || 'حلول تصميم شاملة مخصصة لرؤيتك الفريدة',
            servicesTitle: data.servicesTitle_ar || data.servicesTitle || 'حلول تصميم كاملة',
            servicesDescription: data.servicesDescription_ar || data.servicesDescription || 'من المساحات السكنية الحميمة إلى المشاريع التجارية الكبرى',
            servicesHighlightsTitle: data.servicesHighlightsTitle_ar || data.servicesHighlightsTitle || 'مميزات الخدمة',
            servicesHighlightsDescription: data.servicesHighlightsDescription_ar || data.servicesHighlightsDescription || 'ما يمكنك توقعه عند العمل مع TRQ',
            servicesHighlight1Title: data.servicesHighlight1Title_ar || data.servicesHighlight1Title || 'حلول مخصصة',
            servicesHighlight1Description: data.servicesHighlight1Description_ar || data.servicesHighlight1Description || 'كل مشروع فريد من نوعه',
            servicesHighlight2Title: data.servicesHighlight2Title_ar || data.servicesHighlight2Title || 'خدمة شاملة',
            servicesHighlight2Description: data.servicesHighlight2Description_ar || data.servicesHighlight2Description || 'من الاستشارة الأولية إلى التثبيت النهائي',
            servicesHighlight3Title: data.servicesHighlight3Title_ar || data.servicesHighlight3Title || 'جودة عالية',
            servicesHighlight3Description: data.servicesHighlight3Description_ar || data.servicesHighlight3Description || 'نستخدم أفضل المواد والحرفيين',
            servicesCtaTitle: data.servicesCtaTitle_ar || data.servicesCtaTitle || 'هل أنت مستعد للبدء؟',
            servicesCtaDescription: data.servicesCtaDescription_ar || data.servicesCtaDescription || 'دعنا نناقش مشروعك',
            servicesCtaButton1Text: data.servicesCtaButton1Text_ar || data.servicesCtaButton1Text || 'طلب التسعير',
            servicesCtaButton1Page: data.servicesCtaButton1Page_ar || data.servicesCtaButton1Page || 'pricing',
            servicesCtaButton2Text: data.servicesCtaButton2Text_ar || data.servicesCtaButton2Text || 'اتصل بنا',
            servicesCtaButton2Page: data.servicesCtaButton2Page_ar || data.servicesCtaButton2Page || 'contact',
          }
        : {
            servicesHeroTitle: data.servicesHeroTitle || 'OUR SERVICES',
            servicesHeroParagraph: data.servicesHeroParagraph || 'Comprehensive design solutions tailored to your unique vision',
            servicesTitle: data.servicesTitle || 'Complete Design Solutions',
            servicesDescription: data.servicesDescription || 'From intimate residential spaces to grand commercial projects',
            servicesHighlightsTitle: data.servicesHighlightsTitle || 'Service Highlights',
            servicesHighlightsDescription: data.servicesHighlightsDescription || 'What you can expect when working with TRQ',
            servicesHighlight1Title: data.servicesHighlight1Title || 'Tailored Solutions',
            servicesHighlight1Description: data.servicesHighlight1Description || 'Every project is unique',
            servicesHighlight2Title: data.servicesHighlight2Title || 'End-to-End Service',
            servicesHighlight2Description: data.servicesHighlight2Description || 'From initial consultation to final installation',
            servicesHighlight3Title: data.servicesHighlight3Title || 'Premium Quality',
            servicesHighlight3Description: data.servicesHighlight3Description || 'We source the finest materials',
            servicesCtaTitle: data.servicesCtaTitle || 'Ready to Get Started?',
            servicesCtaDescription: data.servicesCtaDescription || 'Let us discuss your project',
            servicesCtaButton1Text: data.servicesCtaButton1Text || 'REQUEST PRICING',
            servicesCtaButton1Page: data.servicesCtaButton1Page || 'pricing',
            servicesCtaButton2Text: data.servicesCtaButton2Text || 'CONTACT US',
            servicesCtaButton2Page: data.servicesCtaButton2Page || 'contact',
          };
      setSettings(prev => ({ ...prev, ...settingsToUse }));
    }).catch((error) => {
      console.error('Error loading settings:', error);
    });
  }, [language]);

  // Translate dynamic content from database (services)
  useEffect(() => {
    if (language === 'ar' && services.length > 0) {
      const serviceTexts = services.flatMap(s => [s.title, s.description, ...(s.features || [])]);
      translateBatch(serviceTexts.filter(Boolean));
    }
  }, [language, services]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src={settings.servicesHeroImage || '/uploads/5.webp'} alt="Our Services" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl tracking-wider mb-6">{settings.servicesHeroTitle}</h1>
          <p className="text-xl opacity-90">{settings.servicesHeroParagraph}</p>
        </div>
      </section>
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{settings.servicesTitle}</h2>
        <p className="text-lg text-black/70">{settings.servicesDescription}</p>
      </section>
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {services && services.length > 0 ? (
            services.map((service, index) => {
              const Icon = getIconComponent(service?.icon || 'Briefcase');
              const isEven = index % 2 === 0;
              const imageFirst = isRTL ? !isEven : isEven;
              const serviceTitle = service?.title || 'Service';
              const serviceDescription = service?.description || '';
              const serviceImage = service?.image || 'https://images.unsplash.com/photo-1669387448840-610c588f003d?w=1080';
              
              return (
                <div key={service?.id || index} className={`mb-24 last:mb-0 ${index % 2 === 1 ? 'bg-neutral-50' : ''}`}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 ${index % 2 === 1 ? 'max-w-7xl mx-auto px-4' : ''}`}>
                    <div className={`relative h-[500px] ${!imageFirst ? 'lg:order-2' : ''}`}>
                      <ImageWithFallback src={serviceImage} alt={serviceTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className={`${!imageFirst ? 'lg:order-1' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`w-16 h-16 bg-black flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto lg:ml-0 lg:mr-0' : ''}`}>
                        <Icon className="text-white" size={32} />
                      </div>
                      <h3 className="text-3xl md:text-4xl mb-4 tracking-wide" dir={isRTL ? 'rtl' : 'ltr'}>{td(serviceTitle)}</h3>
                      <p className="text-lg text-black/70 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>{td(serviceDescription)}</p>
                      {(() => {
                        const features = parseFeatures(service?.features);
                        return features && features.length > 0 && (
                          <div className="space-y-3">
                            {features.map((feature, idx) => (
                              <div key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2.5 flex-shrink-0" />
                                <p className="text-black/70" style={{ textAlign: isRTL ? 'right' : 'left' }}>{td(feature)}</p>
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
            <h2 className="text-4xl md:text-5xl mb-4 tracking-wide">{settings.servicesHighlightsTitle}</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{settings.servicesHighlightsDescription}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
            {[
              { title: settings.servicesHighlight1Title, desc: settings.servicesHighlight1Description },
              { title: settings.servicesHighlight2Title, desc: settings.servicesHighlight2Description },
              { title: settings.servicesHighlight3Title, desc: settings.servicesHighlight3Description },
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
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{settings.servicesCtaTitle}</h2>
          <p className="text-lg text-black/60 mb-12">{settings.servicesCtaDescription}</p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href="https://form.typeform.com/to/aTxRPmXX" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider inline-block">{settings.servicesCtaButton1Text}</a>
            <a href={`#${settings.servicesCtaButton2Page || 'contact'}`} className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block">{settings.servicesCtaButton2Text}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
