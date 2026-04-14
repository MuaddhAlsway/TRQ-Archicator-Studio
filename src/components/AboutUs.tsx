import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AboutVideoHero } from './AboutVideoHero';
import { LoadingScreen } from './LoadingScreen';
import * as api from '../api';
import { getImageUrl } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { getContentFromSettings } from '../utils/contentHelper';

gsap.registerPlugin(ScrollTrigger);

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Star;
};

export function AboutUs() {
  const { td, isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const visionMissionRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const approachRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    aboutHeroTitle: 'About TRQ Studio',
    aboutHeroDescription: 'We are a luxury interior design studio dedicated to creating timeless, sophisticated spaces that reflect our clients\' refined taste and elevated lifestyle.',
    aboutHeroImage: '/uploads/14.webp',
    aboutVisionTitle: 'Our Vision',
    aboutVisionDescription: 'To redefine luxury living through thoughtful design that transcends trends and creates lasting beauty. We believe in spaces that tell stories, evoke emotions, and stand the test of time.',
    aboutMissionTitle: 'Our Mission',
    aboutMissionDescription: 'We serve discerning clients by transforming their spaces into personal sanctuaries of elegance and functionality. Through meticulous attention to detail and collaborative partnership, we deliver interiors that exceed expectations.',
    aboutApproachTitle: 'Our Approach',
    aboutApproachDescription: 'How we bring your vision to life',
    aboutApproach1Title: 'Thoughtful Direction',
    aboutApproach1Description: 'Every design decision is purposeful, guided by deep understanding of our clients\' lifestyle and aesthetic preferences.',
    aboutApproach1Icon: 'Compass',
    aboutApproach2Title: 'Layered Excellence',
    aboutApproach2Description: 'We build complexity through careful layering of textures, materials, and elements that create depth and visual interest.',
    aboutApproach2Icon: 'Layers',
    aboutApproach3Title: 'Timeless Quality',
    aboutApproach3Description: 'We prioritize enduring beauty over fleeting trends, selecting materials and finishes that age gracefully.',
    aboutApproach3Icon: 'Star',
    aboutApproach4Title: 'Collaborative Partnership',
    aboutApproach4Description: 'We work closely with clients as creative partners, ensuring every space authentically reflects their vision and needs.',
    aboutApproach4Icon: 'Users',
    aboutExpertiseTitle: 'Our Expertise',
    aboutExpertiseDescription: 'What we specialize in',
    aboutExpertise1Title: 'Luxury Residential',
    aboutExpertise1Description: 'Private homes and estates designed with uncompromising attention to comfort, elegance, and personal expression.',
    aboutExpertise1Image: '/uploads/1.webp',
    aboutExpertise2Title: 'Premium Commercial Space',
    aboutExpertise2Description: 'Professional environments that embody brand identity while creating inspiring spaces for work and collaboration.',
    aboutExpertise2Image: '/uploads/2.webp',
    aboutExpertise3Title: 'Custom Furniture',
    aboutExpertise3Description: 'Bespoke pieces designed and crafted to perfectly complement each space and reflect individual style preferences.',
    aboutExpertise3Image: '/uploads/14.webp',
    aboutExpertise4Title: 'Concept Design',
    aboutExpertise4Description: 'Innovative design concepts that transform spaces into stunning visual experiences, blending creativity with functionality.',
    aboutExpertise4Image: '/uploads/11 cave.webp',
    aboutStoryTitle: 'Our Story',
    aboutStoryText1: 'Founded with a passion for creating extraordinary spaces, TRQ Studio emerged from the belief that great design has the power to transform not just rooms, but lives.',
    aboutStoryText2: 'Our journey began with a simple philosophy: luxury isn\'t about excess, it\'s about refinement. Every project we undertake is an opportunity to push creative boundaries while honoring the principles of timeless design.',
    aboutStoryText3: 'Today, we continue to evolve, always seeking new ways to create spaces that inspire and endure.',
    aboutStoryImage: '/uploads/1 copy.webp',
    aboutCtaTitle: 'Ready to Transform Your Space?',
    aboutCtaDescription: 'Let\'s collaborate to create a space that reflects your vision and exceeds your expectations.',
    aboutCtaButton: 'Start Your Project',
  });

  const [allSettings, setAllSettings] = useState<any>(null);
  // Keep original defaults so language switching always has a clean English baseline
  const defaultSettingsRef = useRef(settings);

  useEffect(() => {
    // Fetch all settings once on component mount
    api.getSettings().then((data) => {
      setAllSettings(data);
    }).catch((err) => {
      console.error('Failed to fetch settings:', err);
    });

    // Fetch about videos
    api.getActiveAboutVideos().then((data) => {
      setVideos(data);
    }).catch((err) => {
      console.error('Failed to fetch about videos:', err);
    });
    
    // Keep loading screen visible for at least 4 seconds (3s animation + 1s buffer)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Update settings when language changes — always derive from raw DB data + original defaults
  useEffect(() => {
    if (!allSettings) return;
    
    const defaults = defaultSettingsRef.current;
    const newSettings = { ...defaults };
    
    Object.keys(newSettings).forEach(key => {
      if (key.startsWith('about')) {
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

  // Scroll animations
  useEffect(() => {
    const sections = [heroRef, visionMissionRef, videosRef, approachRef, expertiseRef, ctaRef];
    
    sections.forEach((sectionRef) => {
      if (!sectionRef.current) return;

      // Smooth entrance animation from bottom
      gsap.fromTo(
        sectionRef.current,
        { 
          opacity: 0, 
          y: 60,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1.5,
            markers: false,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'} relative`}>
      <LoadingScreen isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      
      {/* Video Hero Section */}
      <AboutVideoHero />
      
      {/* Vision & Mission Section */}
      <section ref={visionMissionRef} className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl tracking-tight font-light">
                {getContentFromSettings(language, settings, 'aboutVisionTitle')}
              </h2>
              <p className="text-base text-black leading-relaxed">
                {getContentFromSettings(language, settings, 'aboutVisionDescription')}
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl tracking-tight font-light">
                {getContentFromSettings(language, settings, 'aboutMissionTitle')}
              </h2>
              <p className="text-base text-black leading-relaxed">
                {getContentFromSettings(language, settings, 'aboutMissionDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero Image Section */}
      <section ref={heroRef} className="pt-24 pb-24 px-4 md:px-12">
        <div className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="w-full h-[600px]">
            <ImageWithFallback
              src={getImageUrl(getContentFromSettings(language, settings, 'aboutHeroImage'))}
              alt="About TRQ Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Approach Section */}
      <section ref={approachRef} className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl tracking-tight font-light">
                {getContentFromSettings(language, settings, 'aboutApproachTitle')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((num) => {
                const Icon = getIconComponent((settings as any)[`aboutApproach${num}Icon`]);
                return (
                  <div key={num} className="flex flex-col gap-6 p-12 bg-slate-50 rounded">
                    <div className="w-10 h-10 flex items-center justify-center bg-black rounded">
                      <Icon className="text-white" size={20} />
                    </div>
                    <h3 className="text-xl font-medium">
                      {getContentFromSettings(language, settings, `aboutApproach${num}Title`)}
                    </h3>
                    <p className="text-base text-black/70 leading-relaxed">
                      {getContentFromSettings(language, settings, `aboutApproach${num}Description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section ref={expertiseRef} className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl tracking-tight font-light">
                {getContentFromSettings(language, settings, 'aboutExpertiseTitle')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col border border-black/15 rounded overflow-hidden">
                  <ImageWithFallback
                    src={getImageUrl((settings as any)[`aboutExpertise${num}Image`])}
                    alt={(settings as any)[`aboutExpertise${num}Title`]}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="flex flex-col gap-4 p-8">
                    <h3 className="text-2xl tracking-tight">
                      {getContentFromSettings(language, settings, `aboutExpertise${num}Title`)}
                    </h3>
                    <p className="text-base text-black/70 leading-relaxed">
                      {getContentFromSettings(language, settings, `aboutExpertise${num}Description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-12">
          <h2 className="text-4xl tracking-tight font-light">
            {getContentFromSettings(language, settings, 'aboutCtaTitle')}
          </h2>
          <p className="text-xl text-black/70 max-w-2xl leading-relaxed">
            {getContentFromSettings(language, settings, 'aboutCtaDescription')}
          </p>
          <button className="px-12 py-4 bg-[rgb(174,3,1)] text-white text-sm tracking-wide uppercase hover:bg-[rgb(174,3,1)]/90 transition-colors">
            {getContentFromSettings(language, settings, 'aboutCtaButton')}
          </button>
        </div>
      </section>
    </div>
  );
}
