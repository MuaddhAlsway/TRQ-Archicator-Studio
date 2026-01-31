import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HeroSlider.css';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { SplitText } from './SplitText';

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  buttonPrimaryText: string;
  buttonPrimaryLink: string;
  buttonSecondaryText: string;
  buttonSecondaryLink: string;
  title_ar?: string;
  description_ar?: string;
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
  },
];

const SLIDE_DURATION = 5000;

export function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [typingKey, setTypingKey] = useState(0);
  const { td, translateBatch, language, isRTL } = useLanguage();

  const progressRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const loadingContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const slidesData = await api.getActiveSlides();
        
        // Fetch settings for Arabic content
        const settingsResponse = await fetch('http://localhost:4242/api/settings');
        const settingsData = await settingsResponse.json();
        
        if (slidesData && slidesData.length > 0) {
          // Merge Arabic content from settings
          const slidesWithArabic = slidesData.map((slide: any) => ({
            ...slide,
            title_ar: settingsData[`slide_${slide.id}_title_ar`] || slide.title,
            description_ar: settingsData[`slide_${slide.id}_desc_ar`] || slide.description,
          }));
          setSlides(slidesWithArabic);
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

  // Loading screen - 3 seconds with curtain animation
  useEffect(() => {
    const duration = 3000;
    const startTime = Date.now();

    const animateLoading = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setLoadingProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animateLoading);
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            setLoading(false);
            setIsPaused(false);
            setTypingKey(prev => prev + 1);
          }
        });

        // Stagger animation for TRQ letters
        const logoLetters = loadingContentRef.current?.querySelectorAll('.hero-loading-letter');
        if (logoLetters && logoLetters.length > 0) {
          tl.fromTo(
            logoLetters,
            { opacity: 0, y: 20, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: 'back.out(1.7)'
            },
            0
          );
        }

        // Fade out loading content
        tl.to(loadingContentRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: 'power2.inOut'
        }, '+=1.5');

        // Left curtain slides left
        tl.to(curtainLeftRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut'
        }, '-=0.2');

        // Right curtain slides right (at same time)
        tl.to(curtainRightRef.current, {
          yPercent: 100,
          duration: 1.2,
          ease: 'power4.inOut'
        }, '<');

        // Fade out overlay
        tl.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.3');
      }
    };

    requestAnimationFrame(animateLoading);
  }, []);

  // Slide progress animation
  useEffect(() => {
    if (isPaused || loading) return;

    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        setActiveSlide(prev => (prev + 1) % slides.length);
        setProgress(0);
        setTypingKey(prev => prev + 1);
        startTimeRef.current = Date.now();
      }

      progressRef.current = requestAnimationFrame(animate);
    };

    progressRef.current = requestAnimationFrame(animate);

    return () => {
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, [isPaused, activeSlide, loading, progress]);

  return (
    <div className="hero-slider">
      {/* Loading Overlay with Two Curtains */}
      {loading && (
        <div className="hero-loading-overlay" ref={overlayRef}>
          <div className="hero-curtain left" ref={curtainLeftRef}></div>
          <div className="hero-curtain right" ref={curtainRightRef}></div>
          <div className="hero-loading-content" ref={loadingContentRef}>
            <div className="hero-loading-logo">
              {'TRQ'.split('').map((letter, index) => (
                <span key={index} className="hero-loading-letter">{letter}</span>
              ))}
            </div>
            <div className="hero-loading-bar-wrapper">
              <div
                className="hero-loading-bar"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Slider */}
      <div
        className="hero-slider-container"
        style={{ transform: `translateX(${isRTL ? '' : '-'}${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${activeSlide === index ? 'active' : ''}`}
          >
            <div
              className="hero-slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-slide-overlay" />
            <div className={`hero-slide-content ${isRTL ? 'hero-slide-content-rtl' : ''}`}>
              <span className="hero-slide-tag">
                {td(slide.tag)}
              </span>
              <h1 className="hero-slide-title">
                {td(language === 'ar' ? (slide.title_ar || slide.title) : slide.title)}
              </h1>
              <p className="hero-slide-description">
                <SplitText
                  key={`desc-${activeSlide}-${typingKey}`}
                  duration={0.8}
                  delay={0}
                  stagger={0.05}
                  trigger={activeSlide === index}
                >
                  {td(language === 'ar' ? (slide.description_ar || slide.description) : slide.description)}
                </SplitText>
              </p>
              <div className={`hero-slide-buttons ${isRTL ? 'hero-slide-buttons-rtl' : ''}`}>
                <button
                  onClick={() => onNavigate(slide.buttonPrimaryLink as any)}
                  className="hero-btn-primary"
                >
                  {td(slide.buttonPrimaryText)}
                </button>
                <button
                  onClick={() => onNavigate(slide.buttonSecondaryLink as any)}
                  className="hero-btn-secondary"
                >
                  <span className="btn-side-left"></span>
                  <span className="btn-side-right"></span>
                  {td(slide.buttonSecondaryText)}
                </button>
              </div>
            </div>
          </div>
        ))}
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
