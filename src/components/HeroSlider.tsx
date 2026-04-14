import { useState, useEffect, useRef } from 'react';
import './HeroSlider.css';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { SplitText } from './SplitText';
import { getVideoUrl, getImageUrl } from '../api';

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  video_2?: string;
  video_3?: string;
  video_text?: string;
  video_2_text?: string;
  video_3_text?: string;
  buttonPrimaryText: string;
  buttonPrimaryLink: string;
  buttonSecondaryText: string;
  buttonSecondaryLink: string;
  tag_ar?: string;
  title_ar?: string;
  description_ar?: string;
  buttonPrimaryText_ar?: string;
  buttonSecondaryText_ar?: string;
  video_ar?: string;
  video_2_ar?: string;
  video_3_ar?: string;
  video_text_ar?: string;
  video_2_text_ar?: string;
  video_3_text_ar?: string;
  sortOrder?: number;
}

interface HeroItem {
  type: 'video' | 'slide';
  videoUrl?: string;
  videoText?: string;
  videoText_ar?: string;
  slide?: Slide;
}

interface HeroSliderProps {
  onNavigate: (page: 'home' | 'about' | 'services' | 'workflow' | 'portfolio' | 'contact' | 'pricing') => void;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    tag: 'TRQ Design Studio',
    title: 'Elevating Spaces, Defining Luxury',
    description: 'Premium interior design solutions for discerning clients who demand excellence.',
    image: '/uploads/14.webp',
    buttonPrimaryText: 'VIEW PORTFOLIO',
    buttonPrimaryLink: 'portfolio',
    buttonSecondaryText: 'GET IN TOUCH',
    buttonSecondaryLink: 'contact',
    tag_ar: 'استوديو TRQ للتصميم',
    title_ar: 'رفع المساحات، تحديد الفخامة',
    description_ar: 'حلول تصميم داخلي فاخرة للعملاء الذين يطالبون بالتميز.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
];

// Duration constants
const IMAGE_DURATION = 5000; // 5 seconds for images
const DEFAULT_VIDEO_DURATION = 10000; // 10 seconds per video

// Store video durations
const videoDurations: { [key: string]: number } = {};

// Get all videos for a slide
const getSlideVideos = (slide: Slide): string[] => {
  const videos: string[] = [];
  if (slide.video && slide.video.trim().length > 0 && slide.video.trim() !== 'null') {
    videos.push(slide.video);
  }
  if (slide.video_2 && slide.video_2.trim().length > 0 && slide.video_2.trim() !== 'null') {
    videos.push(slide.video_2);
  }
  if (slide.video_3 && slide.video_3.trim().length > 0 && slide.video_3.trim() !== 'null') {
    videos.push(slide.video_3);
  }
  return videos;
};

// Get actual video duration or use default
const getVideoDuration = (videoUrl: string): number => {
  // If we have cached duration, use it
  if (videoDurations[videoUrl]) {
    return videoDurations[videoUrl];
  }
  // Otherwise use default
  return DEFAULT_VIDEO_DURATION;
};

// Get duration based on slide content (dynamic based on actual video duration)
const getSlideDuration = (slide: Slide): number => {
  const videos = getSlideVideos(slide);
  
  if (videos.length > 0) {
    // Sum up actual durations of all videos in the slide
    const totalDuration = videos.reduce((sum, videoUrl) => {
      return sum + getVideoDuration(videoUrl);
    }, 0);
    return totalDuration;
  }
  return IMAGE_DURATION; // Image = 5 seconds
};

export function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [typingKey, setTypingKey] = useState(0);
  const { td, translateBatch, language, isRTL } = useLanguage();

  const animationRef = useRef<number | null>(null);
  const slideStartTimeRef = useRef<number>(Date.now());
  const currentSlideDurationRef = useRef<number>(IMAGE_DURATION);
  const videoStartTimeRef = useRef<number>(0);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const slidesData = await api.getActiveSlides();
        console.log('Fetched slides:', slidesData);
        
        if (slidesData && slidesData.length > 0) {
          const sortedSlides = slidesData.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
          setSlides(sortedSlides);
          
          sortedSlides.forEach((slide: any, idx: number) => {
            const videos = getSlideVideos(slide);
            const duration = getSlideDuration(slide);
            const type = videos.length > 0 ? 'VIDEO' : 'IMAGE';
            const videoCount = videos.length > 0 ? ` (${videos.length} videos)` : '';
            const durationLabel = type === 'VIDEO' ? `${(duration / 1000).toFixed(0)}s` : '5s';
            console.log(`✓ Slide ${idx + 1}: ${type}${videoCount} - "${slide.title}" (${durationLabel})`);
          });
          
          // Preload all videos
          sortedSlides.forEach((slide: any) => {
            const videos = getSlideVideos(slide);
            videos.forEach((videoUrl: string) => {
              const video = document.createElement('video');
              video.src = videoUrl;
              video.preload = 'auto';
            });
          });
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };
    fetchSlides();
  }, []);

  // Translate slides when language changes
  useEffect(() => {
    const textsToTranslate = slides.flatMap(slide => [
      slide.tag,
      slide.title,
      slide.description,
      slide.buttonPrimaryText,
      slide.buttonSecondaryText,
    ]).filter(Boolean);
    translateBatch(textsToTranslate);
  }, [language, slides, translateBatch]);

  // Handle video playback when active slide or video index changes
  useEffect(() => {
    const videos = document.querySelectorAll('.hero-slide-video') as NodeListOf<HTMLVideoElement>;
    videos.forEach((video, slideIndex) => {
      if (slideIndex === activeSlide) {
        // Get all videos for this slide
        const slide = slides[activeSlide];
        const slideVideos = getSlideVideos(slide);
        
        if (slideVideos.length > 0) {
          // Play the active video
          video.play().catch(err => console.warn('Video play error:', err));
        } else {
          // No videos, pause
          video.pause();
          video.currentTime = 0;
        }
      } else {
        // Pause other videos
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeSlide, activeVideoIndex, slides]);

  // Main animation loop - handles both slide transitions and video cycling
  useEffect(() => {
    const currentSlide = slides[activeSlide];
    if (!currentSlide) return;

    const slideVideos = getSlideVideos(currentSlide);
    const slideDuration = getSlideDuration(currentSlide);
    currentSlideDurationRef.current = slideDuration;
    slideStartTimeRef.current = Date.now();
    videoStartTimeRef.current = Date.now();

    const videoLabel = slideVideos.length > 0 ? `VIDEO (${slideVideos.length} total)` : 'IMAGE';
    console.log(`🎬 Slide ${activeSlide + 1}: ${videoLabel} - Duration: ${slideDuration}ms (${slideDuration / 1000}s)`);

    const animate = () => {
      const elapsed = Date.now() - slideStartTimeRef.current;
      const newProgress = Math.min((elapsed / currentSlideDurationRef.current) * 100, 100);

      setProgress(newProgress);

      // When slide duration is complete, move to next slide
      if (newProgress >= 100) {
        console.log(`✓ Slide ${activeSlide + 1} complete - Moving to next slide`);
        setActiveSlide(prev => (prev + 1) % slides.length);
        setActiveVideoIndex(0);
        setProgress(0);
        setTypingKey(prev => prev + 1);
        return; // Exit animation loop, useEffect will restart with new slide
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSlide, slides]);

  return (
    <div className="hero-slider">
      {/* Horizontal Slider */}
      <div
        className="hero-slider-container"
        style={{ transform: `translateX(${isRTL ? '' : '-'}${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = activeSlide === index;
          const slideVideos = getSlideVideos(slide);
          const shouldShowVideo = slideVideos.length > 0;
          
          return (
            <div
              key={slide.id}
              className={`hero-slide ${isActive ? 'active' : ''}`}
            >
              {shouldShowVideo ? (
                <video
                  className="hero-slide-video"
                  autoPlay={isActive}
                  muted
                  loop
                  playsInline
                  poster={getImageUrl(slide.image)}
                  preload="metadata"
                  key={`video-${slide.id}`}
                >
                  <source src={getVideoUrl(slideVideos[0])} type="video/mp4" />
                </video>
              ) : (
                <>
                  <div
                    className="hero-slide-bg"
                    style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
                  />
                  {/* Fallback image tag for better loading */}
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="hero-slide-bg-img"
                    style={{ display: 'none' }}
                  />
                </>
              )}
              <div className="hero-slide-overlay" />
              <div className={`hero-slide-content ${isRTL ? 'hero-slide-content-rtl' : ''}`}>
                <span className="hero-slide-tag">
                  {td(language === 'ar' ? (slide.tag_ar || slide.tag) : slide.tag)}
                </span>
                <h1 className="hero-slide-title">
                  {td(language === 'ar' ? (slide.title_ar || slide.title) : slide.title)}
                </h1>
                <p className="hero-slide-description">
                  {isRTL ? (
                    // Arabic: render plain — SplitText splits per character which breaks Arabic ligatures
                    <span key={`desc-${activeSlide}-${typingKey}`}>
                      {slide.description_ar || slide.description}
                    </span>
                  ) : (
                    <SplitText
                      key={`desc-${activeSlide}-${typingKey}`}
                      duration={0.8}
                      delay={0}
                      stagger={0.05}
                      trigger={isActive}
                    >
                      {slide.description}
                    </SplitText>
                  )}
                </p>
                <div className={`hero-slide-buttons ${isRTL ? 'hero-slide-buttons-rtl' : ''}`}>
                  <button
                    onClick={() => onNavigate(slide.buttonPrimaryLink as any)}
                    className="hero-btn-primary"
                  >
                    {td(language === 'ar' ? (slide.buttonPrimaryText_ar || slide.buttonPrimaryText) : slide.buttonPrimaryText)}
                  </button>
                  <button
                    onClick={() => onNavigate(slide.buttonSecondaryLink as any)}
                    className="hero-btn-secondary"
                  >
                    <span className="btn-side-left"></span>
                    <span className="btn-side-right"></span>
                    {td(language === 'ar' ? (slide.buttonSecondaryText_ar || slide.buttonSecondaryText) : slide.buttonSecondaryText)}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className={`hero-progress-container ${isRTL ? 'hero-progress-container-rtl' : ''}`}>
        <div className="hero-progress-bar-wrapper">
          <div
            className="hero-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="hero-progress-count">
          {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
