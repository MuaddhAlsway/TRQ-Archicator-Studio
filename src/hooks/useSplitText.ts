import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface UseSplitTextOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
}

export function useSplitText(
  elementRef: React.RefObject<HTMLElement>,
  options: UseSplitTextOptions = {}
) {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0.05,
    onComplete
  } = options;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasRunRef.current) return;

    const element = elementRef.current;
    const text = element.textContent || '';

    if (!text) return;

    hasRunRef.current = true;

    // Split text into characters and wrap them
    element.innerHTML = '';
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
      return span;
    });

    // Create timeline for split text animation
    const tl = gsap.timeline({
      delay,
      onComplete
    });

    // Animate each character
    chars.forEach((char, index) => {
      tl.to(
        char,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        },
        index * stagger
      );
    });

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return {
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    restart: () => timelineRef.current?.restart()
  };
}
