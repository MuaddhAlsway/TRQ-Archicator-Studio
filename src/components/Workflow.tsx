import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Search;
};

export function Workflow() {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
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
    workflowWhy1Title: 'Collaborative', workflowWhy1Description: 'We work closely with you at every stage, ensuring your vision guides the entire process.',
    workflowWhy2Title: 'Transparent', workflowWhy2Description: 'Clear communication, regular updates, and complete transparency throughout the project.',
    workflowWhy3Title: 'Efficient', workflowWhy3Description: 'Streamlined workflows and experienced project management ensure projects are completed on time.',
    workflowTimelineTitle: 'Project Timeline',
    workflowTimelineParagraph1: 'While every project is unique, most projects follow a similar timeline. Residential projects typically take 3-6 months.',
    workflowTimelineParagraph2: 'During our initial consultation, we\'ll provide you with a detailed timeline specific to your project.',
    workflowCtaTitle: 'Ready to Begin Your Journey?',
    workflowCtaDescription: 'Let\'s start with a consultation to discuss your project.',
    workflowCtaButton1Text: 'REQUEST PRICING', workflowCtaButton1Page: 'pricing',
    workflowCtaButton2Text: 'SCHEDULE CONSULTATION', workflowCtaButton2Page: 'contact',
  });

  const [allSettings, setAllSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch all settings once on component mount
    api.getSettings().then((data) => {
      setAllSettings(data);
      
      // Initialize settings immediately when data is loaded
      const newSettings = { ...settings };
      Object.keys(newSettings).forEach(key => {
        if (key.startsWith('workflow')) {
          if (isRTL) {
            const arabicKey = `${key}_ar`;
            newSettings[key] = data[arabicKey] || data[key] || newSettings[key];
          } else {
            newSettings[key] = data[key] || newSettings[key];
          }
        }
      });
      setSettings(newSettings);
    }).catch(() => {});
  }, []);

  // Update settings when language changes (after initial load)
  useEffect(() => {
    if (!allSettings) return;
    
    const newSettings = { ...settings };
    
    // For each workflow* key in default settings
    Object.keys(newSettings).forEach(key => {
      if (key.startsWith('workflow')) {
        if (isRTL) {
          // Arabic mode: use _ar suffixed key if it exists, otherwise use English
          const arabicKey = `${key}_ar`;
          newSettings[key] = allSettings[arabicKey] || allSettings[key] || newSettings[key];
        } else {
          // English mode: use regular key
          newSettings[key] = allSettings[key] || newSettings[key];
        }
      }
    });
    
    setSettings(newSettings);
  }, [isRTL, allSettings]);

  // GSAP Animations - Optimized for smooth page performance
  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector('h1'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
      gsap.fromTo(
        heroRef.current.querySelector('p'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
    }

    // Steps section with smooth parallax and entrance animations
    if (stepsContainerRef.current) {
      const stepElements = stepsContainerRef.current.querySelectorAll('[data-step]');
      
      stepElements.forEach((el, index) => {
        const imageWrapper = el.querySelector('[data-step-image]') as HTMLElement;
        const content = el.querySelector('[data-step-content]') as HTMLElement;
        
        // Parallax effect on image - smooth continuous scroll
        if (imageWrapper) {
          gsap.to(imageWrapper, {
            y: 80,
            scrollTrigger: {
              trigger: el,
              start: 'top 70%',
              end: 'bottom 10%',
              scrub: 1.5,
              markers: false,
            },
            ease: 'none'
          });
        }

        // Content entrance animation (staggered)
        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 70%',
                end: 'top 45%',
                scrub: false,
                markers: false,
              },
            }
          );
        }

        // Image entrance animation
        if (imageWrapper) {
          gsap.fromTo(
            imageWrapper,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 70%',
                end: 'top 45%',
                scrub: false,
                markers: false,
              },
            }
          );
        }
      });
    }

    // Why section animation with stagger
    if (whyRef.current) {
      const whyCards = whyRef.current.querySelectorAll('[data-why-card]');
      whyCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: false,
              markers: false,
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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
    title: isRTL ? ((settings as any)[`workflowStep${num}Title_ar`] || (settings as any)[`workflowStep${num}Title`]) : (settings as any)[`workflowStep${num}Title`],
    description: isRTL ? ((settings as any)[`workflowStep${num}Description_ar`] || (settings as any)[`workflowStep${num}Description`]) : (settings as any)[`workflowStep${num}Description`],
    details: (isRTL ? ((settings as any)[`workflowStep${num}Features_ar`] || (settings as any)[`workflowStep${num}Features`]) : (settings as any)[`workflowStep${num}Features`] || '').split('|').filter((f: string) => f.trim()),
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
        <ImageWithFallback src="/uploads/3.webp" alt="Our Workflow" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl tracking-wider mb-6">{td(settings.workflowHeroTitle)}</h1>
          <p className="text-xl opacity-90">{td(settings.workflowHeroParagraph)}</p>
        </div>
      </section>

      {/* Intro Section - No Animation */}
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{td(settings.workflowIntroTitle)}</h2>
        <p className="text-lg text-black/70">{td(settings.workflowIntroParagraph)}</p>
      </section>

      {/* Workflow Steps with Parallax */}
      <section ref={stepsContainerRef} className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            const imageFirst = isRTL ? !isEven : isEven;
            return (
              <div key={index} data-step className={`mb-32 last:mb-0 ${index % 2 === 1 ? 'bg-neutral-50 -mx-4 px-4 py-16 md:-mx-8 md:px-8' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                  <div data-step-image className={`relative h-[500px] overflow-hidden rounded-lg ${!imageFirst ? 'lg:order-2' : ''}`}>
                    <ImageWithFallback src={stepImages[index]} alt={step.title} className="w-full h-full object-cover" />
                    <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} bg-black text-white px-6 py-3 z-10`}>
                      <span className="text-4xl font-light tracking-wider" style={{ direction: 'ltr' }}>{step.number}</span>
                    </div>
                  </div>
                  <div data-step-content className={`${!imageFirst ? 'lg:order-1' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`w-16 h-16 bg-black flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto lg:ml-0 lg:mr-0' : ''}`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-3xl md:text-4xl mb-3 tracking-wide">{td(step.title)}</h3>
                    <p className="text-xl text-black/60 mb-8">{td(step.description)}</p>
                    <div className="space-y-4">
                      {step.details.map((detail: string, idx: number) => (
                        <div key={idx} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-2 h-2 bg-black rounded-full mt-2.5 flex-shrink-0" />
                          <p className="text-black/70">{td(detail)}</p>
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

      {/* Why Section */}
      <section ref={whyRef} className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 tracking-wide">{ts('workflow.whyTitle')}</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{ts('workflow.whySubtitle')}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
            {[1, 2, 3].map((num) => (
              <div key={num} data-why-card className="text-center">
                <h3 className="text-2xl mb-4 tracking-wide">{td((settings as any)[`workflowWhy${num}Title`])}</h3>
                <p className="text-white/60">{td((settings as any)[`workflowWhy${num}Description`])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('workflow.timelineTitle')}</h2>
          <p className="text-lg text-black/70 mb-8">{ts('workflow.timelineText1')}</p>
          <p className="text-lg text-black/70">{ts('workflow.timelineText2')}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('workflow.ctaTitle')}</h2>
          <p className="text-lg text-black/60 mb-12">{ts('workflow.ctaText')}</p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <a href="#pricing" className="px-8 py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider inline-block">{ts('common.requestPricing')}</a>
            <a href={`#${settings.workflowCtaButton2Page}`} className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-block">{ts('common.scheduleConsultation')}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
