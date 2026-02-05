import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  useCurtainEffect?: boolean;
}

export function LoadingScreen({ isLoading, onLoadingComplete, useCurtainEffect = false }: LoadingScreenProps) {
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const loadingContentRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const duration = 2500; // Slightly shorter for better UX
    const startTime = Date.now();

    const animateLoading = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setLoadingProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animateLoading);
      } else {
        // Small delay before animation starts
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              onLoadingComplete?.();
            }
          });

          if (useCurtainEffect) {
            // BLACK CURTAIN SPLIT EFFECT
            // 1. Fade out the loading content (TRQ logo + loading text)
            tl.to(loadingContentRef.current, {
              opacity: 0,
              scale: 0.8,
              duration: 0.5
            });

            // 2. Left curtain slides LEFT (off screen)
            tl.to(curtainLeftRef.current, {
              xPercent: -100,  // Moves 100% to the left
              duration: 1.2,
              ease: 'power4.inOut'
            }, '-=0.2');

            // 3. Right curtain slides RIGHT (off screen) - at the same time
            tl.to(curtainRightRef.current, {
              xPercent: 100,   // Moves 100% to the right
              duration: 1.2,
              ease: 'power4.inOut'
            }, '<');  // '<' means start at same time as previous

            // 4. Fade out the overlay
            tl.to(overlayRef.current, {
              opacity: 0,
              duration: 0.3
            }, '-=0.3');
          } else {
            // ORIGINAL HORIZONTAL SPLIT EFFECT
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

            // Stagger animation for TRQ letters (during split)
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
                0.2
              );
            }

            // Fade out loading content
            tl.to(loadingContentRef.current, {
              opacity: 0,
              scale: 0.8,
              duration: 0.5,
              ease: 'power2.inOut'
            }, '+=0.6');
          }
        }, 300); // Wait 300ms after bar completes
      }
    };

    requestAnimationFrame(animateLoading);
  }, [isLoading, onLoadingComplete, useCurtainEffect]);

  if (!isLoading) return null;

  return (
    <>
      {useCurtainEffect ? (
        // BLACK CURTAIN EFFECT
        <>
          <div className="loading-overlay" ref={overlayRef}></div>
          <div className="hero-curtain left" ref={curtainLeftRef}></div>
          <div className="hero-curtain right" ref={curtainRightRef}></div>
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
        </>
      ) : (
        // ORIGINAL HORIZONTAL SPLIT EFFECT
        <>
          <div className="loading-overlay-top" ref={overlayTopRef}></div>
          <div className="loading-overlay-bottom" ref={overlayBottomRef}></div>
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
        </>
      )}
    </>
  );
}
