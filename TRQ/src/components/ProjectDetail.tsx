import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Ruler, Award, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import gsap from 'gsap';

interface Project {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  year: string;
  location?: string;
  client?: string;
  size?: string;
  duration?: string;
  detailedDescription?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  materials?: string[];
  awards?: string[];
  team?: string[];
  gallery?: string[];
  clientQuote?: string;
  clientName?: string;
  // Arabic fields
  title_ar?: string;
  category_ar?: string;
  subcategory_ar?: string;
  description_ar?: string;
  location_ar?: string;
  client_ar?: string;
  size_ar?: string;
  duration_ar?: string;
  detailedDescription_ar?: string;
  challenge_ar?: string;
  solution_ar?: string;
  features_ar?: string[];
  materials_ar?: string[];
  awards_ar?: string[];
  team_ar?: string[];
  clientQuote_ar?: string;
  clientName_ar?: string;
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  // Helper to parse array fields (they may be JSON strings from database)
  const parseArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const projectData = {
    ...project,
    title: language === 'ar' ? (project.title_ar || project.title) : project.title,
    category: language === 'ar' ? (project.category_ar || project.category) : project.category,
    subcategory: language === 'ar' ? (project.subcategory_ar || project.subcategory) : project.subcategory,
    description: language === 'ar' ? (project.description_ar || project.description) : project.description,
    location: language === 'ar' ? (project.location_ar || project.location || 'Riyadh, Saudi Arabia') : (project.location || 'Riyadh, Saudi Arabia'),
    client: language === 'ar' ? (project.client_ar || project.client || 'Private Client') : (project.client || 'Private Client'),
    size: language === 'ar' ? (project.size_ar || project.size || '500 sqm') : (project.size || '500 sqm'),
    duration: language === 'ar' ? (project.duration_ar || project.duration || '6 months') : (project.duration || '6 months'),
    detailedDescription: language === 'ar' ? (project.detailedDescription_ar || project.detailedDescription || `This exceptional ${project.subcategory.toLowerCase()} project represents the pinnacle of luxury interior design.`) : (project.detailedDescription || `This exceptional ${project.subcategory.toLowerCase()} project represents the pinnacle of luxury interior design.`),
    challenge: language === 'ar' ? (project.challenge_ar || project.challenge || 'The primary challenge was to create a space that balanced contemporary design with timeless elegance.') : (project.challenge || 'The primary challenge was to create a space that balanced contemporary design with timeless elegance.'),
    solution: language === 'ar' ? (project.solution_ar || project.solution || 'We developed a comprehensive design strategy that incorporated premium materials and custom-designed elements.') : (project.solution || 'We developed a comprehensive design strategy that incorporated premium materials and custom-designed elements.'),
    features: parseArray(language === 'ar' ? (project.features_ar || project.features) : project.features),
    materials: parseArray(language === 'ar' ? (project.materials_ar || project.materials) : project.materials),
    awards: parseArray(language === 'ar' ? (project.awards_ar || project.awards) : project.awards),
    team: parseArray(language === 'ar' ? (project.team_ar || project.team) : project.team),
    clientQuote: language === 'ar' ? (project.clientQuote_ar || project.clientQuote) : project.clientQuote,
    clientName: language === 'ar' ? (project.clientName_ar || project.clientName) : project.clientName,
    gallery: parseArray(project.gallery) || [project.image],
  };

  // Translate dynamic content from database
  useEffect(() => {
    if (language === 'ar') {
      const projectTexts = [
        project.title, project.description, project.subcategory, project.category,
        projectData.detailedDescription, projectData.challenge, projectData.solution,
        projectData.location, projectData.client,
        ...(projectData.features || []), ...(projectData.materials || []),
        ...(projectData.awards || []), ...(projectData.team || []),
        project.clientQuote || '', project.clientName || ''
      ];
      translateBatch(projectTexts.filter(Boolean));
    }
  }, [language, project]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle fullscreen gallery navigation
  const handleNextImage = () => {
    if (fullscreenIndex === null) return;
    const nextIndex = isRTL 
      ? (fullscreenIndex - 1 + projectData.gallery.length) % projectData.gallery.length
      : (fullscreenIndex + 1) % projectData.gallery.length;
    setFullscreenIndex(nextIndex);
  };

  const handlePrevImage = () => {
    if (fullscreenIndex === null) return;
    const prevIndex = isRTL
      ? (fullscreenIndex + 1) % projectData.gallery.length
      : (fullscreenIndex - 1 + projectData.gallery.length) % projectData.gallery.length;
    setFullscreenIndex(prevIndex);
  };

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (isRTL) {
        diff > 0 ? handlePrevImage() : handleNextImage();
      } else {
        diff > 0 ? handleNextImage() : handlePrevImage();
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenIndex(null);
      if (e.key === 'ArrowRight') isRTL ? handlePrevImage() : handleNextImage();
      if (e.key === 'ArrowLeft') isRTL ? handleNextImage() : handlePrevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex, isRTL]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll animation - only if 4+ images
  const shouldInfiniteScroll = projectData.gallery.length >= 4;

  useEffect(() => {
    if (!galleryTrackRef.current || !shouldInfiniteScroll) return;

    const track = galleryTrackRef.current;
    const totalWidth = track.scrollWidth / 2; // Half because we duplicated

    // Set initial position
    gsap.set(track, { x: 0 });

    // Create infinite scroll animation - direction based on RTL
    const direction = isRTL ? 1 : -1; // RTL scrolls right, LTR scrolls left
    animationRef.current = gsap.to(track, {
      x: direction * totalWidth,
      duration: projectData.gallery.length * 8, // 8 seconds per image
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        gsap.set(track, { x: 0 });
      }
    });

    return () => {
      animationRef.current?.kill();
    };
  }, [projectData.gallery, shouldInfiniteScroll, isRTL]);

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-white border-b border-black/5 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={onBack} className={`inline-flex items-center gap-2 text-black hover:opacity-70 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
            <span className="tracking-wider">{ts('projectDetail.backToPortfolio')}</span>
          </button>
        </div>
      </div>

      <section className="relative h-[70vh] overflow-hidden">
        <ImageWithFallback src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className={`absolute bottom-0 left-0 right-0 text-white p-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <p className="text-sm tracking-widest opacity-90 mb-2">{td(projectData.subcategory)}</p>
            <h1 className="text-5xl md:text-6xl tracking-wider mb-4">{td(project.title)}</h1>
            <p className="text-xl opacity-90 max-w-3xl">{td(project.description)}</p>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: ts('projectDetail.year'), value: projectData.year },
              { icon: MapPin, label: ts('projectDetail.location'), value: td(projectData.location) },
              { icon: Ruler, label: ts('projectDetail.size'), value: projectData.size },
              { icon: Users, label: ts('projectDetail.client'), value: td(projectData.client) },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <item.icon size={24} className="text-white/60" />
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-sm text-white/60">{item.label}</p>
                  <p className="tracking-wider">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className={isRTL ? 'text-right' : 'text-left'} dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className="text-4xl mb-6 tracking-wide">{ts('projectDetail.projectOverview')}</h2>
            <p className={`text-lg text-black/70 mb-8 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>{td(projectData.detailedDescription)}</p>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl mb-3 tracking-wide">{ts('projectDetail.theChallenge')}</h3>
                <p className={`text-black/70 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>{td(projectData.challenge)}</p>
              </div>
              <div>
                <h3 className="text-2xl mb-3 tracking-wide">{ts('projectDetail.ourSolution')}</h3>
                <p className={`text-black/70 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>{td(projectData.solution)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-neutral-50 p-8">
              <h3 className="text-2xl mb-6 tracking-wide">{ts('projectDetail.keyFeatures')}</h3>
              <div className="space-y-3">
                {projectData.features.map((feature, index) => (
                  <div key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <CheckCircle size={20} className="text-black mt-0.5 flex-shrink-0" />
                    <p className="text-black/70">{td(feature)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-black/10 p-8">
              <h3 className="text-2xl mb-6 tracking-wide">{ts('projectDetail.projectDetails')}</h3>
              <div className="space-y-4">
                {[
                  { label: ts('projectDetail.duration'), value: projectData.duration },
                  { label: ts('projectDetail.category'), value: td(projectData.subcategory) },
                  { label: ts('projectDetail.projectType'), value: td(project.category) },
                ].map((item, idx) => (
                  <div key={idx} className={`flex justify-between border-b border-black/10 pb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-black/60">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-black/60">{ts('projectDetail.status')}</span>
                  <span className="font-medium text-green-600">{ts('projectDetail.completed')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scroll Gallery */}
      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className={`text-4xl tracking-wide ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>{ts('projectDetail.projectGallery')}</h2>
        </div>
        
        {shouldInfiniteScroll ? (
          /* Infinite Scroll Track - 4+ images */
          <div 
            ref={galleryRef}
            className="relative w-full overflow-hidden"
          >
            <div 
              ref={galleryTrackRef}
              className="flex gap-6"
              style={{ width: 'fit-content' }}
            >
              {/* Original images */}
              {projectData.gallery.map((image, index) => (
                <div 
                  key={`original-${index}`} 
                  className="relative w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] flex-shrink-0 overflow-hidden group cursor-pointer"
                  onClick={() => setFullscreenIndex(index)}
                >
                  <ImageWithFallback 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
              {/* Duplicated images for seamless loop */}
              {projectData.gallery.map((image, index) => (
                <div 
                  key={`duplicate-${index}`} 
                  className="relative w-[400px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[400px] flex-shrink-0 overflow-hidden group cursor-pointer"
                  onClick={() => setFullscreenIndex(index)}
                >
                  <ImageWithFallback 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Static Grid - Less than 4 images */
          <div className="max-w-7xl mx-auto px-4">
            <div className={`grid gap-6 ${projectData.gallery.length === 1 ? 'grid-cols-1' : projectData.gallery.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {projectData.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className="relative h-[300px] md:h-[400px] overflow-hidden group cursor-pointer"
                  onClick={() => setFullscreenIndex(index)}
                >
                  <ImageWithFallback 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Gallery Modal */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setFullscreenIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-6 right-6 z-50 text-white hover:opacity-70 transition-opacity"
            aria-label="Close gallery"
          >
            <X size={32} />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center px-4">
            <ImageWithFallback
              src={projectData.gallery[fullscreenIndex]}
              alt={`${project.title} - Image ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className={`absolute top-1/2 -translate-y-1/2 z-50 text-white hover:opacity-70 transition-opacity p-2 ${isRTL ? 'right-6' : 'left-6'}`}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className={`absolute top-1/2 -translate-y-1/2 z-50 text-white hover:opacity-70 transition-opacity p-2 ${isRTL ? 'left-6' : 'right-6'}`}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm tracking-wider bg-black/50 px-4 py-2 rounded">
            {fullscreenIndex + 1} / {projectData.gallery.length}
          </div>
        </div>
      )}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl mb-8 tracking-wide">{ts('projectDetail.materialsFinishes')}</h2>
              <div className="space-y-4">
                {projectData.materials.map((material, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 bg-neutral-50 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <span className="text-lg">{td(material)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-4xl mb-8 tracking-wide">{ts('projectDetail.projectTeam')}</h2>
              <div className="space-y-4">
                {projectData.team.map((member, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 border-2 border-black/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <Users size={24} className="text-black/40" />
                    <span className="text-lg">{td(member)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {projectData.awards.length > 0 && (
        <section className="py-24 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl mb-12 tracking-wide">{ts('projectDetail.awardsRecognition')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {projectData.awards.map((award, index) => (
                <div key={index} className={`flex items-center justify-center gap-4 p-6 border-2 border-white/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Award size={32} className="text-white/60" />
                  <span className="text-xl tracking-wide">{td(award)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl text-black/10 mb-4">"</div>
          <p className="text-2xl text-black/70 mb-8 italic">{td(project.clientQuote || ts('projectDetail.defaultQuote'))}</p>
          <div className="text-sm tracking-widest text-black/60">— {td(project.clientName || ts('projectDetail.projectClient'))}</div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('projectDetail.interestedSimilar')}</h2>
          <p className="text-lg text-black/60 mb-12">{ts('projectDetail.letDiscuss')}</p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button className="px-8 py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider">{ts('projectDetail.requestPricing')}</button>
            <button className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider">{ts('projectDetail.contactUs')}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
