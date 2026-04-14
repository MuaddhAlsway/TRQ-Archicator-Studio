import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const { language } = useLanguage();
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);
  const loadingContentRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    // TIMING: 2.5s bar fill + 1.5s pause = 4s total (consistent across all pages)
    const barDuration = 2500; // 2.5 seconds for bar to fill
    const pauseDuration = 1500; // 1.5 seconds pause after bar completes
    const startTime = Date.now();

    // Start progress immediately
    setLoadingProgress(0);

    const animateLoading = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / barDuration) * 100, 100);
      setLoadingProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animateLoading);
      } else {
        // Bar is complete - wait for pause duration before opening curtain
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              onLoadingComplete?.();
            }
          });

          // HORIZONTAL SPLIT EFFECT - CONSISTENT FOR ALL PAGES
          // Top overlay slides up
          tl.to(overlayTopRef.current, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut'
          }, 0);

          // Bottom overlay slides down (at same time)
          tl.to(overlayBottomRef.current, {
            yPercent: 100,
            duration: 1,
            ease: 'power4.inOut'
          }, 0);

          // Fade out loading content
          tl.to(loadingContentRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: 'power2.inOut'
          }, '+=0.2');
        }, pauseDuration); // Wait for pause duration after bar completes
      }
    };

    // Start animation immediately
    animateLoading();
  }, [isLoading, onLoadingComplete, language]);

  if (!isLoading) return null;

  return (
    <>
      <div className="loading-overlay-top" ref={overlayTopRef}></div>
      <div className="loading-overlay-bottom" ref={overlayBottomRef}></div>
      <div className="loading-content" ref={loadingContentRef}>
        <div className="loading-logo" dir="ltr" style={{ direction: 'ltr' }}>
          <img src="/barlogo.png" alt="TRQ Loading" className="loading-logo-img" />
        </div>
        <div className="loading-bar-wrapper">
          <div
            className="loading-bar"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="loading-text" dir="ltr" style={{ direction: 'ltr' }}>Loading</div>
      </div>
    </>
  );
}
