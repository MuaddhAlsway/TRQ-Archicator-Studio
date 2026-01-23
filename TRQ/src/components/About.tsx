import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Star;
};

export function About() {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const [settings, setSettings] = useState({
    aboutHeroTitle: 'ABOUT TRQ',
    aboutHeroParagraph: 'Crafting exceptional spaces through vision, expertise, and dedication',
    aboutWhoWeAreTitle: 'Who We Are',
    aboutWhoWeAreParagraph1: 'TRQ is a luxury and creative interior design studio based in Riyadh, Saudi Arabia. Founded on the principles of excellence, innovation, and client-centric service, we have established ourselves as a premier design partner for discerning clients who demand the best.',
    aboutWhoWeAreParagraph2: 'Our multidisciplinary team brings together expertise in interior design, architecture, furniture design, and project management to deliver comprehensive solutions that exceed expectations.',
    aboutWhoWeAreParagraph3: 'Whether creating intimate residential spaces or grand commercial environments, we approach each project with the same level of dedication, creativity, and attention to detail that has become our hallmark.',
    aboutWhoWeAreImage: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    aboutVisionTitle: 'Our Vision',
    aboutVisionIcon: 'Eye',
    aboutVisionParagraph: 'To be recognized as the leading luxury design studio in Saudi Arabia and beyond, setting new standards for creative excellence and transforming spaces into timeless works of art that inspire and elevate the human experience.',
    aboutMissionTitle: 'Our Mission',
    aboutMissionIcon: 'Target',
    aboutMissionParagraph: 'To deliver exceptional, bespoke design solutions that reflect our clients\' unique vision while exceeding their expectations. We are committed to combining artistic innovation with practical expertise, creating spaces that are both beautiful and functional.',
    aboutValuesTitle: 'Our Values',
    aboutValuesDescription: 'The principles that guide our work and define our approach to design',
    aboutValue1Title: 'Excellence',
    aboutValue1Icon: 'Award',
    aboutValue1Description: 'We pursue the highest standards in every project, ensuring exceptional quality and attention to detail.',
    aboutValue2Title: 'Innovation',
    aboutValue2Icon: 'Lightbulb',
    aboutValue2Description: 'We embrace creativity and push boundaries to deliver unique, forward-thinking design solutions.',
    aboutValue3Title: 'Collaboration',
    aboutValue3Icon: 'Users',
    aboutValue3Description: 'We work closely with our clients, valuing their input and building lasting partnerships.',
    aboutValue4Title: 'Passion',
    aboutValue4Icon: 'Heart',
    aboutValue4Description: 'Our love for design drives us to create spaces that inspire and delight.',
    aboutWhyTitle: 'Why Choose TRQ',
    aboutWhyDescription: 'What sets us apart in the world of luxury interior design',
    aboutWhy1Title: 'Luxury Focus',
    aboutWhy1Description: 'Specializing in high-end residential and commercial projects that demand the finest craftsmanship.',
    aboutWhy2Title: 'Holistic Approach',
    aboutWhy2Description: 'From concept to completion, we manage every aspect of your project with meticulous care.',
    aboutWhy3Title: 'Cultural Sensitivity',
    aboutWhy3Description: 'Deep understanding of Saudi Arabian culture combined with global design perspectives.',
    aboutWhy4Title: 'Proven Track Record',
    aboutWhy4Description: 'Successfully delivered premium projects across residential, commercial, and exhibition sectors.',
    aboutImpactTitle: 'Our Impact on Clients',
    aboutImpactParagraph1: 'We don\'t just design spaces—we transform the way our clients live, work, and experience their environments. Through thoughtful design, meticulous execution, and unwavering commitment to quality, we create spaces that inspire, comfort, and elevate daily life.',
    aboutImpactParagraph2: 'Every project is an opportunity to make a lasting positive impact, and we take this responsibility seriously. Our success is measured not just in completed projects, but in the satisfaction and delight of our clients.',
  });

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  // Translate all texts when language changes
  useEffect(() => {
    if (language === 'ar') {
      const textsToTranslate = Object.values(settings).filter(v => typeof v === 'string' && v.trim());
      translateBatch(textsToTranslate as string[]);
    }
  }, [language, settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const VisionIcon = getIconComponent(settings.aboutVisionIcon);
  const MissionIcon = getIconComponent(settings.aboutMissionIcon);

  const values = [1, 2, 3, 4].map((num) => ({
    icon: getIconComponent((settings as any)[`aboutValue${num}Icon`]),
    title: (settings as any)[`aboutValue${num}Title`],
    description: (settings as any)[`aboutValue${num}Description`],
  }));

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback
          src="/uploads/1.webp"
          alt="About TRQ"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 sm:mb-6">{ts('about.heroTitle')}</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">{ts('about.heroSubtitle')}</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-12 sm:py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          <div className={isRTL ? 'lg:order-2 text-right' : ''}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">{ts('about.whoWeAreTitle')}</h2>
            <p className="text-base sm:text-lg text-black/70 mb-4 sm:mb-6">{ts('about.whoWeAreText1')}</p>
            <p className="text-base sm:text-lg text-black/70 mb-4 sm:mb-6">{ts('about.whoWeAreText2')}</p>
            <p className="text-base sm:text-lg text-black/70">{ts('about.whoWeAreText3')}</p>
          </div>
          <div className={`relative h-[300px] sm:h-[400px] lg:h-[600px] ${isRTL ? 'lg:order-1' : ''}`}>
            <ImageWithFallback src="/uploads/14c.webp" alt="TRQ Studio" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 sm:py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
            <div className={`bg-white p-6 sm:p-8 md:p-12 ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-black flex items-center justify-center mb-4 sm:mb-6 ${isRTL ? 'mr-0 ml-auto md:ml-0 md:mr-0' : ''}`}>
                <VisionIcon className="text-white" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 tracking-wide">{ts('about.visionTitle')}</h2>
              <p className="text-base sm:text-lg text-black/70">{ts('about.visionText')}</p>
            </div>
            <div className={`bg-white p-6 sm:p-8 md:p-12 ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-black flex items-center justify-center mb-4 sm:mb-6 ${isRTL ? 'mr-0 ml-auto md:ml-0 md:mr-0' : ''}`}>
                <MissionIcon className="text-white" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 tracking-wide">{ts('about.missionTitle')}</h2>
              <p className="text-base sm:text-lg text-black/70">{ts('about.missionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{ts('about.valuesTitle')}</h2>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto">{ts('about.valuesSubtitle')}</p>
          </div>
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
            {[
              { icon: getIconComponent(settings.aboutValue1Icon), title: ts('about.value1Title'), desc: ts('about.value1Desc') },
              { icon: getIconComponent(settings.aboutValue2Icon), title: ts('about.value2Title'), desc: ts('about.value2Desc') },
              { icon: getIconComponent(settings.aboutValue3Icon), title: ts('about.value3Title'), desc: ts('about.value3Desc') },
              { icon: getIconComponent(settings.aboutValue4Icon), title: ts('about.value4Title'), desc: ts('about.value4Desc') },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black mx-auto flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 tracking-wide">{value.title}</h3>
                  <p className="text-sm sm:text-base text-black/60">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why TRQ */}
      <section className="py-12 sm:py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-wide">{ts('about.whyChooseTitle')}</h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto">{ts('about.whyChooseSubtitle')}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
            {[
              { title: ts('about.why1Title'), desc: ts('about.why1Desc') },
              { title: ts('about.why2Title'), desc: ts('about.why2Desc') },
              { title: ts('about.why3Title'), desc: ts('about.why3Desc') },
              { title: ts('about.why4Title'), desc: ts('about.why4Desc') },
            ].map((item, num) => (
              <div key={num} className={`border-${isRTL ? 'r' : 'l'}-2 border-white/20 ${isRTL ? 'pr-4 sm:pr-6 md:pr-8 text-right' : 'pl-4 sm:pl-6 md:pl-8'}`}>
                <h3 className="text-xl sm:text-2xl mb-2 sm:mb-4 tracking-wide">{item.title}</h3>
                <p className="text-sm sm:text-base md:text-lg text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide">{ts('about.impactTitle')}</h2>
          <p className="text-base sm:text-lg text-black/70 mb-6 sm:mb-8">{ts('about.impactText1')}</p>
          <p className="text-base sm:text-lg text-black/70">{ts('about.impactText2')}</p>
        </div>
      </section>
    </div>
  );
}
