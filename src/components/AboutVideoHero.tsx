import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState, useMemo } from 'react';
import * as api from '../api';
import { getVideoUrl } from '../api';

interface AboutVideoHeroProps {
  onNavigate?: (page: string) => void;
}

interface AboutVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  image?: string;
  sortOrder: number;
  isActive: number;
  title_ar?: string;
  description_ar?: string;
  video_url_ar?: string;
}

export function AboutVideoHero({ onNavigate }: AboutVideoHeroProps) {
  const { isRTL, language } = useLanguage();
  const [video, setVideo] = useState<AboutVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      const videos = await api.getActiveAboutVideos();
      if (videos && videos.length > 0) {
        setVideo(videos[0]);
      }
    } catch (error) {
      console.error('Error loading about video:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recalculate slide content when language changes
  const slide = useMemo(() => ({
    title: language === 'ar' && video?.title_ar ? video.title_ar : video?.title || 'TRQ Studio',
    description: language === 'ar' && video?.description_ar ? video.description_ar : video?.description || 'We are a luxury interior design studio dedicated to creating timeless, sophisticated spaces that reflect our clients\' refined taste and elevated lifestyle.',
    buttonPrimaryText: language === 'ar' ? 'عرض المشاريع' : 'VIEW PORTFOLIO',
    buttonPrimaryLink: 'portfolio',
    buttonSecondaryText: language === 'ar' ? 'تواصل معنا' : 'GET IN TOUCH',
    buttonSecondaryLink: 'contact',
  }), [video, language]);

  const videoUrl = useMemo(() => 
    getVideoUrl(language === 'ar' && video?.video_url_ar ? video.video_url_ar : video?.video_url || 'Video2.mp4'),
    [video, language]
  );

  return (
    <section className={`relative h-[50vh] sm:h-[60vh] flex items-center justify-start overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* Content - Left Side */}
      <div className={`relative z-20 text-white px-4 sm:px-6 md:px-8 lg:px-12 max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wider mb-3 sm:mb-4 text-white">
          TRQ Studio
        </h1>
        <p className="text-sm sm:text-base md:text-lg opacity-90 mb-6 sm:mb-8 max-w-xl text-white">
          {slide.description}
        </p>

        {/* Buttons */}
        {(slide.buttonPrimaryText || slide.buttonSecondaryText) && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {slide.buttonPrimaryText && (
              <button
                onClick={() => onNavigate?.(slide.buttonPrimaryLink || 'portfolio')}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black hover:bg-white/90 transition-colors tracking-wider text-xs sm:text-sm"
              >
                {slide.buttonPrimaryText}
              </button>
            )}
            {slide.buttonSecondaryText && (
              <button
                onClick={() => onNavigate?.(slide.buttonSecondaryLink || 'contact')}
                className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-colors tracking-wider text-xs sm:text-sm"
              >
                {slide.buttonSecondaryText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
