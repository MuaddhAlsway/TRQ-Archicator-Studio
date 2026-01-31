import { useState, useEffect } from 'react';
import { Compass, Layers, Star, Users, Instagram, Linkedin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

export function AboutUs() {
  const { ts, td, isRTL } = useLanguage();
  const [settings, setSettings] = useState({
    aboutHeroTitle: 'About TRQ Studio',
    aboutHeroDescription: 'We are a luxury interior design studio dedicated to creating timeless, sophisticated spaces that reflect our clients\' refined taste and elevated lifestyle.',
    aboutHeroImage: '/uploads/14.webp',
    aboutVisionTitle: 'Our Vision',
    aboutVisionDescription: 'To redefine luxury living through thoughtful design that transcends trends and creates lasting beauty. We believe in spaces that tell stories, evoke emotions, and stand the test of time.',
    aboutMissionTitle: 'Our Mission',
    aboutMissionDescription: 'We serve discerning clients by transforming their spaces into personal sanctuaries of elegance and functionality. Through meticulous attention to detail and collaborative partnership, we deliver interiors that exceed expectations.',
    aboutApproachTitle: 'Our Approach',
    aboutExpertiseTitle: 'Our Expertise',
    aboutStoryTitle: 'Our Story',
    aboutStoryText1: 'Founded with a passion for creating extraordinary spaces, TRQ Studio emerged from the belief that great design has the power to transform not just rooms, but lives.',
    aboutStoryText2: 'Our journey began with a simple philosophy: luxury isn\'t about excess, it\'s about refinement. Every project we undertake is an opportunity to push creative boundaries while honoring the principles of timeless design.',
    aboutStoryText3: 'Today, we continue to evolve, always seeking new ways to create spaces that inspire and endure.',
    aboutStoryImage: '/uploads/1 copy.webp',
    aboutCtaTitle: 'Ready to Transform Your Space?',
    aboutCtaDescription: 'Let\'s collaborate to create a space that reflects your vision and exceeds your expectations.',
    aboutCtaButton: 'Start Your Project',
  });

  useEffect(() => {
    api.getSettings().then((data) => setSettings(prev => ({ ...prev, ...data }))).catch(() => {});
  }, []);

  const approaches = [
    {
      icon: Compass,
      title: 'Thoughtful Direction',
      description: 'Every design decision is purposeful, guided by deep understanding of our clients\' lifestyle and aesthetic preferences.',
    },
    {
      icon: Layers,
      title: 'Layered Excellence',
      description: 'We build complexity through careful layering of textures, materials, and elements that create depth and visual interest.',
    },
    {
      icon: Star,
      title: 'Timeless Quality',
      description: 'We prioritize enduring beauty over fleeting trends, selecting materials and finishes that age gracefully.',
    },
    {
      icon: Users,
      title: 'Collaborative Partnership',
      description: 'We work closely with clients as creative partners, ensuring every space authentically reflects their vision and needs.',
    },
  ];

  const expertise = [
    {
      image: '/uploads/1.webp',
      title: 'Luxury Residential',
      description: 'Private homes and estates designed with uncompromising attention to comfort, elegance, and personal expression.',
      category: 'HOMES & ESTATES',
    },
    {
      image: '/uploads/2.webp',
      title: 'Commercial Spaces',
      description: 'Professional environments that embody brand identity while creating inspiring spaces for work and collaboration.',
      category: 'OFFICES & RETAIL',
    },
    {
      image: '/uploads/14.webp',
      title: 'Custom Furniture',
      description: 'Bespoke pieces designed and crafted to perfectly complement each space and reflect individual style preferences.',
      category: 'FURNITURE & STYLING',
    },
    {
      image: '/uploads/11 cave.webp',
      title: 'Concept Design',
      description: 'Innovative design concepts that transform spaces into stunning visual experiences, blending creativity with functionality.',
      category: 'DESIGN & CONCEPTS',
    },
  ];

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="pt-24 pb-24 px-4 md:px-12">
        <div className="flex flex-col gap-16 max-w-7xl mx-auto">
          <div className="max-w-5xl">
            <h1 className="text-5xl md:text-6xl tracking-tight mb-8 font-light" style={{ fontFamily: 'Georgia, serif' }}>
              {td(settings.aboutHeroTitle)}
            </h1>
            <p className="text-xl text-black/70 max-w-2xl leading-relaxed font-normal">
              {td(settings.aboutHeroDescription)}
            </p>
          </div>
          <div className="w-full h-[600px]">
            <ImageWithFallback
              src={settings.aboutHeroImage}
              alt="About TRQ Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
                {td(settings.aboutVisionTitle)}
              </h2>
              <p className="text-base text-black leading-relaxed">
                {td(settings.aboutVisionDescription)}
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
                {td(settings.aboutMissionTitle)}
              </h2>
              <p className="text-base text-black leading-relaxed">
                {td(settings.aboutMissionDescription)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-16">
            <h2 className="text-3xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
              {td(settings.aboutApproachTitle)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {approaches.map((approach, index) => {
                const Icon = approach.icon;
                return (
                  <div key={index} className="flex flex-col gap-6 p-12 bg-slate-50">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Icon className="text-2xl text-black" />
                    </div>
                    <h3 className="text-xl font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                      {approach.title}
                    </h3>
                    <p className="text-base text-black/70 leading-relaxed">
                      {approach.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-16">
            <h2 className="text-3xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
              {td(settings.aboutExpertiseTitle)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {expertise.map((item, index) => (
                <div key={index} className="flex flex-col border border-black/15">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="flex flex-col gap-4 p-8">
                    <h3 className="text-2xl tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-base text-black/70 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-sm tracking-wide uppercase text-black/50">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
                {td(settings.aboutStoryTitle)}
              </h2>
              <div className="flex flex-col gap-6">
                <p className="text-base text-black leading-relaxed">
                  {td(settings.aboutStoryText1)}
                </p>
                <p className="text-base text-black/70 leading-relaxed">
                  {td(settings.aboutStoryText2)}
                </p>
                <p className="text-base text-black/70 leading-relaxed">
                  {td(settings.aboutStoryText3)}
                </p>
              </div>
            </div>
            <div className="w-full h-[500px]">
              <ImageWithFallback
                src={settings.aboutStoryImage}
                alt="TRQ Studio Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-24 pb-24 px-4 md:px-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-12">
          <h2 className="text-4xl tracking-tight font-light" style={{ fontFamily: 'Georgia, serif' }}>
            {td(settings.aboutCtaTitle)}
          </h2>
          <p className="text-xl text-black/70 max-w-2xl leading-relaxed">
            {td(settings.aboutCtaDescription)}
          </p>
          <button className="px-12 py-4 bg-black text-white text-sm tracking-wide uppercase hover:bg-black/90 transition-colors">
            {td(settings.aboutCtaButton)}
          </button>
        </div>
      </section>

      {/* Footer */}
   
    </div>
  );
}
