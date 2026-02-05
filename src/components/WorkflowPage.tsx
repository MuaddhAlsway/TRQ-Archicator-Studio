import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LoadingScreen } from './LoadingScreen';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Star;
};

export function WorkflowPage() {
  const { td, isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    workflowHeroTitle: 'Our Workflow',
    workflowHeroParagraph: 'From Vision to Reality: A Structured Approach to Exceptional Design',
    workflowHeroImage: 'https://static.paraflowcontent.com/public/resource/image/eedd6672-a725-43e8-9320-8ea80b92c7f1.jpeg',
    workflowStep1Title: 'Discovery & Consultation',
    workflowStep1Description: 'The foundation of exceptional design begins with understanding. We invest time in learning about your lifestyle, preferences, and aspirations to create a design that truly reflects who you are.',
    workflowStep1Features: 'In-depth consultation to understand your vision, lifestyle, and functional requirements|Comprehensive site assessment and spatial analysis|Project scope definition and timeline establishment|Budget framework and investment planning',
    workflowStep2Title: 'Concept & Design Development',
    workflowStep2Description: 'Where creativity meets functionality. We transform your vision into tangible design concepts, exploring innovative solutions while respecting your aesthetic preferences and practical needs.',
    workflowStep2Features: 'Creative design concepts and mood boards|Detailed space planning and layout optimization|Photorealistic 3D visualizations and renderings|Comprehensive design proposals with material palettes',
    workflowStep3Title: 'Approval & Planning',
    workflowStep3Description: 'Refinement through collaboration. We incorporate your feedback and finalize every detail, ensuring technical precision while maintaining design integrity. This stage transforms concepts into actionable plans.',
    workflowStep3Features: 'Incorporating your feedback and design refinements|Technical drawings and construction documentation|Final material selections and sourcing specifications|Contractor coordination and project scheduling',
    workflowStep4Title: 'Execution & Supervision',
    workflowStep4Description: 'Where design becomes reality. We oversee every aspect of construction and installation, ensuring the highest standards of craftsmanship while maintaining clear communication throughout the transformation process.',
    workflowStep4Features: 'Premium material procurement and quality verification|Expert construction coordination and site management|Rigorous quality control and craftsmanship standards|Regular progress updates and milestone communications',
    workflowStep5Title: 'Delivery & Final Handover',
    workflowStep5Description: 'The culmination of our collaborative journey. We complete the final installations and styling touches, conduct a comprehensive walkthrough, and ensure you\'re completely satisfied with your transformed space.',
    workflowStep5Features: 'Final installation of furniture and custom elements|Professional styling and accessory placement|Comprehensive walkthrough and quality inspection|Ongoing post-completion support and maintenance guidance',
    workflowWhyTitle: 'Why Our Process Works',
    workflowWhyDescription: 'Built on years of experience and refined through countless successful projects, our methodology ensures exceptional results through a systematic approach to luxury interior design.',
    workflowWhy1Title: 'Collaborative',
    workflowWhy1Description: 'We work closely with you at every stage, ensuring your vision guides every design decision from concept to completion.',
    workflowWhy1Icon: 'Users',
    workflowWhy2Title: 'Transparent',
    workflowWhy2Description: 'Clear communication and regular updates keep you informed throughout the entire process, with no surprises.',
    workflowWhy2Icon: 'Eye',
    workflowWhy3Title: 'Efficient',
    workflowWhy3Description: 'Streamlined workflows and expert coordination ensure projects are delivered on time without compromising quality.',
    workflowWhy3Icon: 'Zap',
    workflowCtaTitle: 'Our Commitment',
    workflowCtaDescription: 'Built on years of experience and refined through countless successful projects, TRQ STUDIO delivers exceptional design that combines creativity with meticulous execution.',
  });
  const [allSettings, setAllSettings] = useState<any>(null);

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefsArray = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch all settings once on component mount
    api.getSettings().then((data) => {
      setAllSettings(data);
    }).catch((err) => {
      console.error('Failed to fetch settings:', err);
    });

    // Keep loading screen visible for at least 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Update settings when language changes
  useEffect(() => {
    if (!allSettings) return;
    
    const newSettings = { ...settings };
    
    // For each workflow* key in default settings
    Object.keys(newSettings).forEach(key => {
      if (key.startsWith('workflow')) {
        if (language === 'ar') {
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
  }, [language, allSettings]);

  // Helper: Check if mobile
  const isMobile = () => window.innerWidth < 1000;

  // Helper: Debounced resize handler
  const handleResize = () => {
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    resizeTimeoutRef.current = setTimeout(() => {
      ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
    }, 250);
  };

  // Helper: Create 3D flip animation
  const create3DFlip = (element: HTMLElement, index: number) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1.5,
        markers: false,
      },
    });

    tl.fromTo(
      element,
      {
        opacity: 0,
        rotationY: 90,
        z: -100,
      },
      {
        opacity: 1,
        rotationY: 0,
        z: 0,
        duration: 1,
        ease: 'back.out',
      },
      0
    );

    return tl;
  };

  // Helper: Create gap animation with border-radius
  const createGapAnimation = (container: HTMLElement) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
    });

    tl.fromTo(
      container,
      { gap: '8px', borderRadius: '0px' },
      { gap: '24px', borderRadius: '12px', duration: 1 },
      0
    );

    return tl;
  };

  // Main animation setup
  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const heroTitle = heroRef.current.querySelector('h1');
      const heroParagraph = heroRef.current.querySelector('p');

      if (heroTitle) {
        gsap.fromTo(
          heroTitle,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top center',
              end: 'center center',
              scrub: 1.5,
              markers: false,
            },
          }
        );
      }

      if (heroParagraph) {
        gsap.fromTo(
          heroParagraph,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top center',
              end: 'center center',
              scrub: 1.5,
              markers: false,
            },
            delay: 0.2,
          }
        );
      }
    }

    // Values section with gap animation
    if (valuesRef.current) {
      const valueCards = valuesRef.current.querySelectorAll('[data-value-card]');
      const valuesContainer = valuesRef.current.querySelector('[data-values-container]') as HTMLElement;

      // Gap animation
      if (valuesContainer) {
        createGapAnimation(valuesContainer);
      }

      // Card animations with 3D flip
      valueCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.9, rotationX: -20 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            ease: 'back.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
              markers: false,
            },
            delay: index * 0.15,
          }
        );
      });
    }

    // Workflow steps with advanced animations
    if (stepsContainerRef.current) {
      const stepElements = stepsContainerRef.current.querySelectorAll('[data-step]');
      const isResponsive = isMobile();

      stepElements.forEach((el, index) => {
        const stepContent = el.querySelector('[data-step-content]') as HTMLElement;
        const stepNumber = el.querySelector('[data-step-number]') as HTMLElement;
        const stepTitle = el.querySelector('[data-step-title]') as HTMLElement;
        const stepDescription = el.querySelector('[data-step-description]') as HTMLElement;
        const stepList = el.querySelector('[data-step-list]') as HTMLElement;
        const stepBg = el.querySelector('[data-step-bg]') as HTMLElement;

        // Parallax effect on background
        if (stepBg) {
          gsap.to(stepBg, {
            y: 100,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
              markers: false,
            },
            ease: 'none',
          });
        }

        // Pinned section (4x viewport height scrubbing)
        if (stepContent && !isResponsive) {
          gsap.to(stepContent, {
            scrollTrigger: {
              trigger: el,
              start: 'top 20%',
              end: 'bottom 20%',
              pin: true,
              pinSpacing: true,
              scrub: 1,
              markers: false,
            },
          });
        }

        // 3D flip animation for number
        if (stepNumber) {
          create3DFlip(stepNumber, index);
        }

        // Title animation with rotation
        if (stepTitle) {
          gsap.fromTo(
            stepTitle,
            { opacity: 0, x: -80, rotationZ: -5 },
            {
              opacity: 1,
              x: 0,
              rotationZ: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1.5,
                markers: false,
              },
              delay: 0.1,
            }
          );
        }

        // Description with blur effect
        if (stepDescription) {
          gsap.fromTo(
            stepDescription,
            { opacity: 0, y: 40, filter: 'blur(10px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1.5,
                markers: false,
              },
              delay: 0.2,
            }
          );
        }

        // List items with stagger
        if (stepList) {
          const listItems = stepList.querySelectorAll('li');
          gsap.fromTo(
            listItems,
            { opacity: 0, x: -60, y: 20 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: {
                amount: 0.6,
                from: 'start',
              },
              scrollTrigger: {
                trigger: el,
                start: 'top 55%',
                end: 'top 20%',
                scrub: 1.5,
                markers: false,
              },
              delay: 0.3,
            }
          );

          // Hover effects
          listItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
              gsap.to(item, {
                x: 10,
                duration: 0.3,
                ease: 'power2.out',
              });
            });
            item.addEventListener('mouseleave', () => {
              gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out',
              });
            });
          });
        }

        // Progress bar animation
        const progressBar = el.querySelector('[data-progress-bar]') as HTMLElement;
        if (progressBar) {
          gsap.fromTo(
            progressBar,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: 'left center',
              duration: 1,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: el,
                start: 'top 50%',
                end: 'bottom 50%',
                scrub: 1,
                markers: false,
              },
            }
          );
        }
      });
    }

    // CTA section with progress-based animations
    if (ctaRef.current) {
      const ctaTitle = ctaRef.current.querySelector('h2');
      const ctaDescription = ctaRef.current.querySelector('p');
      const ctaButtons = ctaRef.current.querySelectorAll('button');

      if (ctaTitle) {
        gsap.fromTo(
          ctaTitle,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1.5,
              markers: false,
            },
          }
        );
      }

      if (ctaDescription) {
        gsap.fromTo(
          ctaDescription,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1.5,
              markers: false,
            },
            delay: 0.2,
          }
        );
      }

      ctaButtons.forEach((btn, index) => {
        gsap.fromTo(
          btn,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 1.5,
              markers: false,
            },
            delay: 0.4 + index * 0.15,
          }
        );
      });
    }

    // Responsive design with matchMedia
    const mm = gsap.matchMedia();
    mm.add('(max-width: 1000px)', () => {
      // Mobile: disable pinning
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.pin) {
          trigger.pin = false;
        }
      });
    });

    // Resize handler
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = [1, 2, 3, 4, 5].map((num) => ({
    number: `0${num}`,
    title: language === 'ar' ? ((settings as any)[`workflowStep${num}Title_ar`] || (settings as any)[`workflowStep${num}Title`]) : (settings as any)[`workflowStep${num}Title`],
    description: language === 'ar' ? ((settings as any)[`workflowStep${num}Description_ar`] || (settings as any)[`workflowStep${num}Description`]) : (settings as any)[`workflowStep${num}Description`],
    items: (language === 'ar' ? ((settings as any)[`workflowStep${num}Features_ar`] || (settings as any)[`workflowStep${num}Features`]) : (settings as any)[`workflowStep${num}Features`] || '').split('|').filter((f: string) => f.trim()),
    label: language === 'ar' ? ((settings as any)[`workflowStep${num}Label_ar`] || (settings as any)[`workflowStep${num}Label`]) : (settings as any)[`workflowStep${num}Label`],
  }));

  const values = [
    {
      icon: getIconComponent((settings as any).workflowWhy1Icon),
      title: language === 'ar' ? ((settings as any).workflowWhy1Title_ar || (settings as any).workflowWhy1Title) : (settings as any).workflowWhy1Title,
      description: language === 'ar' ? ((settings as any).workflowWhy1Description_ar || (settings as any).workflowWhy1Description) : (settings as any).workflowWhy1Description,
    },
    {
      icon: getIconComponent((settings as any).workflowWhy2Icon),
      title: language === 'ar' ? ((settings as any).workflowWhy2Title_ar || (settings as any).workflowWhy2Title) : (settings as any).workflowWhy2Title,
      description: language === 'ar' ? ((settings as any).workflowWhy2Description_ar || (settings as any).workflowWhy2Description) : (settings as any).workflowWhy2Description,
    },
    {
      icon: getIconComponent((settings as any).workflowWhy3Icon),
      title: language === 'ar' ? ((settings as any).workflowWhy3Title_ar || (settings as any).workflowWhy3Title) : (settings as any).workflowWhy3Title,
      description: language === 'ar' ? ((settings as any).workflowWhy3Description_ar || (settings as any).workflowWhy3Description) : (settings as any).workflowWhy3Description,
    },
  ];

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`} style={{ backgroundColor: '#000' }}>
      <LoadingScreen isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={settings.workflowHeroImage}
          alt="Workflow Hero"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(90%) contrast(105%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60" />
        <div className="relative z-10 text-center max-w-4xl px-12">
          <h1 className="text-7xl font-semibold text-white mb-8">{td(settings.workflowHeroTitle)}</h1>
          <p className="text-2xl font-normal text-white/90">{td(settings.workflowHeroParagraph)}</p>
        </div>
      </section>

      {/* Why Our Process Works Section */}
      <section ref={valuesRef} className="w-full bg-black py-24 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-white mb-8">{td(settings.workflowWhyTitle)}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {td(settings.workflowWhyDescription)}
            </p>
          </div>
          <div data-values-container className="grid grid-cols-3 gap-16 mb-16">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} data-value-card className="text-center p-8 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex justify-center items-center w-16 h-16 mb-6 mx-auto">
                    <Icon className="text-white text-4xl" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{td(value.title)}</h3>
                  <p className="text-xl text-white/70">{td(value.description)}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-xl text-white/60">Most residential projects take 3-6 months</p>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <div ref={stepsContainerRef}>
        {steps.map((step, index) => (
        <section key={index} className="w-full py-32 px-12 bg-white relative overflow-hidden">
          <div data-step-bg className="absolute inset-0 opacity-5 pointer-events-none" />
          <div 
            ref={(el) => {
              if (el) stepRefsArray.current[index] = el;
            }}
            data-step
            className="max-w-4xl mx-auto relative z-10"
          >
            {/* Progress bar */}
            <div data-progress-bar className="absolute -left-12 top-0 w-1 h-full bg-black origin-top" />

            <div data-step-content className="mb-12">
              <div data-step-number className="text-8xl font-light text-black/20 mb-4 leading-none">{step.number}</div>
              <h2 data-step-title className="text-5xl font-semibold text-black mb-8 -mt-6">{td(step.title)}</h2>
              <p data-step-description className="text-xl text-black/70 mb-8 leading-relaxed max-w-2xl">{td(step.description)}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-black mb-6 uppercase tracking-wider text-black/60">
                {td(step.label)}
              </h3>
              <ul data-step-list className="space-y-4">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-4 group cursor-pointer">
                    <div className="shrink-0 w-2 h-2 bg-black rounded-full mt-3 group-hover:scale-150 transition-transform" />
                    <span className="text-lg text-black/70 group-hover:text-black transition-colors">{td(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        ))}
      </div>

      {/* CTA Section */}
      <section ref={ctaRef} className="w-full bg-black py-32 px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-semibold text-white mb-12">{td(settings.workflowCtaTitle)}</h2>
          <p className="text-2xl text-white/90 mb-16 leading-relaxed">{td(settings.workflowCtaDescription)}</p>
          <div className="flex flex-row justify-center items-center gap-6">
            <button className="px-8 py-4 bg-white text-black text-xl font-normal hover:opacity-90 transition-opacity flex items-center gap-2 group">
              Start Your Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white text-white text-xl font-normal hover:bg-white hover:text-black transition-colors flex items-center gap-2 group">
              View Portfolio
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
