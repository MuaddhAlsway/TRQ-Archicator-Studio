import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const loadingContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

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
            onLoadingComplete?.();
          }
        });

        // Stagger animation for TRQ letters
        const logoLetters = loadingContentRef.current?.querySelectorAll('.loading-letter');
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

        // Top curtain slides up
        tl.to(curtainLeftRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut'
        }, '-=0.2');

        // Bottom curtain slides down (at same time)
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
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay" ref={overlayRef}>
      <div className="loading-curtain left" ref={curtainLeftRef}></div>
      <div className="loading-curtain right" ref={curtainRightRef}></div>
      <div className="loading-content" ref={loadingContentRef}>
        <div className="loading-logo">
          {'TRQ'.split('').map((letter, index) => (
            <span key={index} className="loading-letter">{letter}</span>
          ))}
        </div>
        <div className="loading-bar-wrapper">
          <div
            className="loading-bar"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="loading-text">Loading</div>
      </div>
    </div>
  );
}
