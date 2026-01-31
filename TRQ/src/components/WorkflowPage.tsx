import { useState, useEffect, useRef } from 'react';
import { Users, Eye, Zap, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function WorkflowPage() {
  const { ts, td, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    workflowHeroTitle: 'Our Workflow',
    workflowHeroParagraph: 'From Vision to Reality: A Structured Approach to Exceptional Design',
    workflowHeroImage: 'https://static.paraflowcontent.com/public/resource/image/eedd6672-a725-43e8-9320-8ea80b92c7f1.jpeg',
    workflowCtaTitle: 'Our Commitment',
    workflowCtaDescription: 'Built on years of experience and refined through countless successful projects, TRQ STUDIO delivers exceptional design that combines creativity with meticulous execution.',
  });

  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefsArray = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getSettings().then((data) => setSettings(prev => ({ ...prev, ...data }))).catch(() => {});
  }, []);

  // Comprehensive scroll animations
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

    // Values section animations
    if (valuesRef.current) {
      const valueCards = valuesRef.current.querySelectorAll('[data-value-card]');
      valueCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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

    // Workflow steps - Advanced animations
    if (stepsContainerRef.current) {
      const stepElements = stepsContainerRef.current.querySelectorAll('[data-step]');

      stepElements.forEach((el, index) => {
        const stepContent = el.querySelector('[data-step-content]') as HTMLElement;
        const stepNumber = el.querySelector('[data-step-number]') as HTMLElement;
        const stepTitle = el.querySelector('[data-step-title]') as HTMLElement;
        const stepDescription = el.querySelector('[data-step-description]') as HTMLElement;
        const stepList = el.querySelector('[data-step-list]') as HTMLElement;
        const stepBg = el.querySelector('[data-step-bg]') as HTMLElement;

        // 1. PARALLAX EFFECT on background
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

        // 2. PINNED SECTION - Pin step while content reveals
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

        // 3. REVEAL ON SCROLL - Number slides in
        if (stepNumber) {
          gsap.fromTo(
            stepNumber,
            { opacity: 0, x: -100, scale: 0.5 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1,
              ease: 'elastic.out(1, 0.5)',
              scrollTrigger: {
                trigger: el,
                start: 'top 60%',
                end: 'top 30%',
                scrub: 1.5,
                markers: false,
              },
            }
          );
        }

        // 4. SCROLL-DRIVEN ANIMATION - Title with stagger
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

        // 5. DESCRIPTION - Fade and slide with parallax feel
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

        // 6. LIST ITEMS - Staggered reveal with scroll storytelling
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

          // Add individual item hover effects
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

        // 7. SCROLL STORYTELLING - Removed background color transition

        // 8. PROGRESS INDICATOR - Visual progress through steps
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

    // CTA section - Entrance animation
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Discovery & Consultation',
      description: 'The foundation of exceptional design begins with understanding. We invest time in learning about your lifestyle, preferences, and aspirations to create a design that truly reflects who you are.',
      items: [
        'In-depth consultation to understand your vision, lifestyle, and functional requirements',
        'Comprehensive site assessment and spatial analysis',
        'Project scope definition and timeline establishment',
        'Budget framework and investment planning',
      ],
    },
    {
      number: '02',
      title: 'Concept & Design Development',
      description: 'Where creativity meets functionality. We transform your vision into tangible design concepts, exploring innovative solutions while respecting your aesthetic preferences and practical needs.',
      items: [
        'Creative design concepts and mood boards',
        'Detailed space planning and layout optimization',
        'Photorealistic 3D visualizations and renderings',
        'Comprehensive design proposals with material palettes',
      ],
    },
    {
      number: '03',
      title: 'Approval & Planning',
      description: 'Refinement through collaboration. We incorporate your feedback and finalize every detail, ensuring technical precision while maintaining design integrity. This stage transforms concepts into actionable plans.',
      items: [
        'Incorporating your feedback and design refinements',
        'Technical drawings and construction documentation',
        'Final material selections and sourcing specifications',
        'Contractor coordination and project scheduling',
      ],
    },
    {
      number: '04',
      title: 'Execution & Supervision',
      description: 'Where design becomes reality. We oversee every aspect of construction and installation, ensuring the highest standards of craftsmanship while maintaining clear communication throughout the transformation process.',
      items: [
        'Premium material procurement and quality verification',
        'Expert construction coordination and site management',
        'Rigorous quality control and craftsmanship standards',
        'Regular progress updates and milestone communications',
      ],
    },
    {
      number: '05',
      title: 'Delivery & Final Handover',
      description: 'The culmination of our collaborative journey. We complete the final installations and styling touches, conduct a comprehensive walkthrough, and ensure you\'re completely satisfied with your transformed space.',
      items: [
        'Final installation of furniture and custom elements',
        'Professional styling and accessory placement',
        'Comprehensive walkthrough and quality inspection',
        'Ongoing post-completion support and maintenance guidance',
      ],
    },
  ];

  const values = [
    {
      icon: Users,
      title: 'Collaborative',
      description: 'We work closely with you at every stage, ensuring your vision guides every design decision from concept to completion.',
    },
    {
      icon: Eye,
      title: 'Transparent',
      description: 'Clear communication and regular updates keep you informed throughout the entire process, with no surprises.',
    },
    {
      icon: Zap,
      title: 'Efficient',
      description: 'Streamlined workflows and expert coordination ensure projects are delivered on time without compromising quality.',
    },
  ];

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
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
            <h2 className="text-5xl font-semibold text-white mb-8">Why Our Process Works</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built on years of experience and refined through countless successful projects, our methodology ensures exceptional results through a systematic approach to luxury interior design.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-16 mb-16">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} data-value-card className="text-center p-8 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex justify-center items-center w-16 h-16 mb-6 mx-auto">
                    <Icon className="text-white text-4xl" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-xl text-white/70">{value.description}</p>
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
              <h2 data-step-title className="text-5xl font-semibold text-black mb-8 -mt-6">{step.title}</h2>
              <p data-step-description className="text-xl text-black/70 mb-8 leading-relaxed max-w-2xl">{step.description}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-black mb-6 uppercase tracking-wider text-black/60">
                {index === 0 && 'Key Activities'}
                {index === 1 && 'Key Deliverables'}
                {index === 2 && 'Process Highlights'}
                {index === 3 && 'Our Commitment'}
                {index === 4 && 'Final Touches'}
              </h3>
              <ul data-step-list className="space-y-4">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-4 group cursor-pointer">
                    <div className="shrink-0 w-2 h-2 bg-black rounded-full mt-3 group-hover:scale-150 transition-transform" />
                    <span className="text-lg text-black/70 group-hover:text-black transition-colors">{item}</span>
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
