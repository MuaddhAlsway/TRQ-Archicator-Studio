import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface UseGSAPTypingOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
}

export function useGSAPTyping(
  elementRef: React.RefObject<HTMLElement>,
  options: UseGSAPTypingOptions = {}
) {
  const {
    duration = 1.5,
    delay = 0,
    stagger = 0.05,
    onComplete
  } = options;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const text = element.textContent || '';

    if (!text) return;

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Clear the element
    element.textContent = '';

    // Create timeline for typing effect
    const tl = gsap.timeline({
      delay,
      onComplete
    });

    // Type each character
    text.split('').forEach((char, index) => {
      tl.to(
        {},
        {
          duration: stagger,
          onStart: () => {
            element.textContent = text.substring(0, index + 1);
          }
        },
        index === 0 ? 0 : `<+${stagger}`
      );
    });

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [elementRef, duration, delay, stagger, onComplete]);

  return {
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    restart: () => timelineRef.current?.restart()
  };
}
