import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ClientsCarousel } from './ClientsCarousel';
import * as api from '../api';
import { getImageUrl } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { getContentFromSettings } from '../utils/contentHelper';

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Search;
};

export function Workflow() {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState({
    workflowHeroTitle: 'HOW WE WORK',
    workflowHeroParagraph: 'A seamless process designed to bring your vision to life',
    workflowHeroImage: '/uploads/14c.webp',
    workflowIntroTitle: 'Our Proven Process',
    workflowIntroParagraph: 'At TRQ, we believe that exceptional design requires a structured yet flexible approach.',
    workflowStep1Title: 'Discovery & Consultation', workflowStep1Icon: 'Search', workflowStep1Description: 'Understanding your vision and requirements', workflowStep1Features: 'Initial consultation|Site visit and assessment|Discussion of project goals|Review of inspiration materials|Preliminary scope definition',
    workflowStep2Title: 'Concept & Design Development', workflowStep2Icon: 'Lightbulb', workflowStep2Description: 'Bringing your vision to life through creative design', workflowStep2Features: 'Development of initial design concepts|Space planning and layout options|Selection of color palettes|3D visualizations|Presentation of design proposals',
    workflowStep3Title: 'Approval & Planning', workflowStep3Icon: 'CheckCircle', workflowStep3Description: 'Refinement and detailed planning', workflowStep3Features: 'Incorporating your feedback|Preparation of technical drawings|Finalization of material selections|Budget confirmation|Coordination with contractors',
    workflowStep4Title: 'Execution & Supervision', workflowStep4Icon: 'Hammer', workflowStep4Description: 'Bringing the design to reality', workflowStep4Features: 'Procurement of materials|Coordination of construction work|Quality control inspections|Problem-solving adjustments|Regular progress updates',
    workflowStep5Title: 'Delivery & Final Handover', workflowStep5Icon: 'Home', workflowStep5Description: 'Completing your perfect space', workflowStep5Features: 'Final installation|Styling and finishing touches|Comprehensive walk-through|Documentation of project|Post-completion support',
    workflowWhyTitle: 'Why Our Process Works',
    workflowWhyDescription: 'Built on years of experience and refined through countless successful projects',
    workflowWhy1Title: 'Collaborative', workflowWhy1Icon: 'Users', workflowWhy1Description: 'Your vision guides every decision. We partner closely throughout the design journey.',
    workflowWhy2Title: 'Transparent', workflowWhy2Icon: 'Eye', workflowWhy2Description: 'Clear communication and honest timelines. No surprises, just results.',
    workflowWhy3Title: 'Efficient', workflowWhy3Icon: 'Zap', workflowWhy3Description: 'Expert coordination and meticulous execution. On-time delivery, always.',
    workflowTimelineTitle: 'Project Timeline',
    workflowTimelineParagraph1: 'While every project is unique, most projects follow a similar timeline. Residential projects typically take 3-6 months.',
    workflowTimelineParagraph2: 'During our initial consultation, we\'ll provide you with a detailed timeline specific to your project.',
    workflowCtaTitle: 'Ready to Begin Your Journey?',
    workflowCtaDescription: 'Let\'s start with a consultation to discuss your project.',
    workflowCtaButton1Text: 'REQUEST PRICING', workflowCtaButton1Page: 'pricing',
    workflowCtaButton2Text: 'SCHEDULE CONSULTATION', workflowCtaButton2Page: 'contact',
  });

  const [allSettings, setAllSettings] = useState<any>(null);
  // Keep original defaults so language switching always has a clean English baseline
  const defaultSettingsRef = useRef(settings);

  useEffect(() => {
    // Fetch all settings once on component mount
    api.getSettings().then((data) => {
      setAllSettings(data);
      
      // Initialize settings immediately when data is loaded — use defaults as base
      const defaults = defaultSettingsRef.current;
      const newSettings = { ...defaults };
      Object.keys(newSettings).forEach(key => {
        if (key.startsWith('workflow')) {
          if (isRTL) {
            const arabicKey = `${key}_ar`;
            newSettings[key] = data[arabicKey] || data[key] || defaults[key];
          } else {
            newSettings[key] = data[key] || defaults[key];
          }
        }
      });
      setSettings(newSettings);
    }).catch(() => {});
  }, []);

  // Update settings when language changes — always derive from raw DB data + original defaults
  useEffect(() => {
    if (!allSettings) return;
    
    const defaults = defaultSettingsRef.current;
    const newSettings = { ...defaults };
    
    Object.keys(newSettings).forEach(key => {
      if (key.startsWith('workflow')) {
        if (isRTL) {
          const arabicKey = `${key}_ar`;
          newSettings[key] = allSettings[arabicKey] || allSettings[key] || defaults[key];
        } else {
          newSettings[key] = allSettings[key] || defaults[key];
        }
      }
    });
    
    setSettings(newSettings);
  }, [isRTL, allSettings]);

  // Translate dynamic content from database
  useEffect(() => {
    if (language === 'ar') {
      const dynamicTexts = [
        settings.workflowHeroTitle,
        settings.workflowHeroParagraph,
        settings.workflowIntroTitle,
        settings.workflowIntroParagraph,
      ];
      for (let i = 1; i <= 5; i++) {
        dynamicTexts.push((settings as any)[`workflowStep${i}Title_ar`] || (settings as any)[`workflowStep${i}Title`]);
        dynamicTexts.push((settings as any)[`workflowStep${i}Description_ar`] || (settings as any)[`workflowStep${i}Description`]);
        const features = ((settings as any)[`workflowStep${i}Features_ar`] || (settings as any)[`workflowStep${i}Features`] || '').split('|');
        dynamicTexts.push(...features);
      }
      for (let i = 1; i <= 3; i++) {
        dynamicTexts.push((settings as any)[`workflowWhy${i}Title_ar`] || (settings as any)[`workflowWhy${i}Title`]);
        dynamicTexts.push((settings as any)[`workflowWhy${i}Description_ar`] || (settings as any)[`workflowWhy${i}Description`]);
      }
      translateBatch(dynamicTexts.filter(Boolean));
    }
  }, [language, settings]);

  const steps = [1, 2, 3, 4, 5].map((num) => ({
    number: `0${num}`,
    icon: getIconComponent((settings as any)[`workflowStep${num}Icon`]),
    title: getContentFromSettings(language, settings, `workflowStep${num}Title`),
    description: getContentFromSettings(language, settings, `workflowStep${num}Description`),
    details: getContentFromSettings(language, settings, `workflowStep${num}Features`).split('|').filter((f: string) => f.trim()),
  }));

  const stepImages = [
    '/uploads/3.webp',
    '/uploads/1.webp',
    '/uploads/Event Gate A.webp',
    '/uploads/14c.webp',
    '/uploads/5.webp',
  ];

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src={getImageUrl('/uploads/3.webp')} alt="Our Workflow" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl tracking-wider mb-6">{getContentFromSettings(language, settings, 'workflowHeroTitle')}</h1>
          <p className="text-xl opacity-90">{getContentFromSettings(language, settings, 'workflowHeroParagraph')}</p>
        </div>
      </section>

      {/* Why Section */}
      <section ref={whyRef} className="w-full bg-black py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-8">{getContentFromSettings(language, settings, 'workflowWhyTitle')}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">{getContentFromSettings(language, settings, 'workflowWhyDescription')}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-16 ${isRTL ? 'direction-rtl' : ''}`}>
            {[1, 2, 3].map((num) => {
              const Icon = getIconComponent((settings as any)[`workflowWhy${num}Icon`]);
              return (
                <div key={num} data-why-card className="text-center p-8 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex justify-center items-center w-16 h-16 mb-6 mx-auto bg-black rounded">
                    <Icon className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{getContentFromSettings(language, settings, `workflowWhy${num}Title`)}</h3>
                  <p className="text-xl text-white/70">{getContentFromSettings(language, settings, `workflowWhy${num}Description`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Intro Section - No Animation */}
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{getContentFromSettings(language, settings, 'workflowIntroTitle')}</h2>
        <p className="text-lg text-black/70">{getContentFromSettings(language, settings, 'workflowIntroParagraph')}</p>
      </section>

      {/* Workflow Steps with Parallax */}
      <section ref={stepsContainerRef} className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} data-step className={`mb-32 last:mb-0`}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image - Always on left in LTR, right in RTL */}
                  <div data-step-image className={`relative h-[400px] sm:h-[500px] overflow-hidden rounded-lg ${isRTL ? 'lg:order-2' : ''}`}>
                    <ImageWithFallback src={getImageUrl(stepImages[index])} alt={step.title} className="w-full h-full object-cover" />
                    <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} bg-black text-white px-6 py-3 z-10`}>
                      <span className="text-4xl font-light tracking-wider" style={{ direction: 'ltr' }}>{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Text Content - Always on right in LTR, left in RTL */}
                  <div data-step-content className={`${isRTL ? 'lg:order-1 text-right' : 'text-left'}`}>
                    <div className={`w-16 h-16 bg-black flex items-center justify-center mb-6 ${isRTL ? 'ml-auto' : ''}`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-3xl md:text-4xl mb-3 tracking-wide">{step.title}</h3>
                    <p className="text-xl text-black/60 mb-8">{step.description}</p>
                    <div className="space-y-4">
                      {step.details.map((detail: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                          <div className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                          <p className="text-black/70">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide text-white">{getContentFromSettings(language, settings, 'workflowTimelineTitle')}</h2>
          <p className="text-lg text-white/70 mb-8">{getContentFromSettings(language, settings, 'workflowTimelineParagraph1')}</p>
          <p className="text-lg text-white/70">{getContentFromSettings(language, settings, 'workflowTimelineParagraph2')}</p>
        </div>
      </section>

      {/* Clients Carousel */}
      <ClientsCarousel />

      {/* CTA Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{getContentFromSettings(language, settings, 'workflowCtaTitle')}</h2>
          <p className="text-lg text-black/60 mb-12">{getContentFromSettings(language, settings, 'workflowCtaDescription')}</p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href={`#${getContentFromSettings(language, settings, 'workflowCtaButton1Page')}`} className="px-8 py-4 bg-[rgb(174,3,1)] text-white hover:bg-[rgb(174,3,1)]/80 transition-colors tracking-wider inline-block">{getContentFromSettings(language, settings, 'workflowCtaButton1Text')}</a>
            <a href={`#${getContentFromSettings(language, settings, 'workflowCtaButton2Page')}`} className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block">{getContentFromSettings(language, settings, 'workflowCtaButton2Text')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
