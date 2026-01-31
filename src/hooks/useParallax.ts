import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface UseParallaxOptions {
  speed?: number;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

export function useParallax(
  elementRef: React.RefObject<HTMLElement>,
  options: UseParallaxOptions = {}
) {
  const {
    speed = 0.5,
    trigger = 'self',
    start = 'top bottom',
    end = 'bottom top',
    scrub = 1,
    markers = false
  } = options;

  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const dataSpeed = parseFloat(element.getAttribute('data-speed') || String(speed));

    // Kill previous animation if exists
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Create parallax animation using yPercent for better performance
    animationRef.current = gsap.to(element, {
      yPercent: dataSpeed * 100,
      scrollTrigger: {
        trigger: trigger === 'self' ? element : trigger,
        start: start,
        end: end,
        scrub: scrub,
        markers: markers,
        invalidateOnRefresh: true
      },
      ease: 'none'
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [speed, trigger, start, end, scrub, markers]);

  // Refresh ScrollTrigger on window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    refresh: () => ScrollTrigger.refresh(),
    kill: () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    }
  };
}

// Batch parallax initialization for multiple elements
export function useParallaxBatch(
  containerRef: React.RefObject<HTMLElement>,
  selector: string = '.parallax',
  options: UseParallaxOptions = {}
) {
  const {
    speed = 0.5,
    scrub = 1,
    markers = false
  } = options;

  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);

    // Kill existing animations
    animationsRef.current.forEach(anim => anim.kill());
    animationsRef.current = [];

    // Create animations for each element
    elements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const dataSpeed = parseFloat(htmlElement.getAttribute('data-speed') || String(speed));

      const animation = gsap.to(htmlElement, {
        yPercent: dataSpeed * 100,
        scrollTrigger: {
          trigger: htmlElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrub,
          markers: markers,
          invalidateOnRefresh: true
        },
        ease: 'none'
      });

      animationsRef.current.push(animation);
    });

    // Refresh all triggers
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      animationsRef.current.forEach(anim => anim.kill());
    };
  }, [containerRef, selector, speed, scrub, markers]);

  // Refresh on window resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    refresh: () => ScrollTrigger.refresh(),
    killAll: () => {
      animationsRef.current.forEach(anim => anim.kill());
    }
  };
}

// Global parallax manager for route changes
export function useGlobalParallax() {
  useEffect(() => {
    // Refresh ScrollTrigger on route change
    const handleRouteChange = () => {
      ScrollTrigger.refresh();
    };

    // Listen for route changes (works with React Router)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return {
    refresh: () => ScrollTrigger.refresh(),
    killAll: () => ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  };
}
