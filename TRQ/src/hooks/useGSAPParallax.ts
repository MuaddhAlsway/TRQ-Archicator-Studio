import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface UseGSAPParallaxOptions {
  smooth?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
  smoothTouch?: number;
}

export function useGSAPParallax(
  wrapperRef: React.RefObject<HTMLElement>,
  options: UseGSAPParallaxOptions = {}
) {
  const {
    smooth = 2,
    effects = true,
    normalizeScroll = false,
    smoothTouch = 0.1
  } = options;

  const smootherRef = useRef<any>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Create ScrollSmoother instance
    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: wrapperRef.current.querySelector('[data-smooth-content]'),
      smooth: smooth,
      effects: effects,
      normalizeScroll: normalizeScroll,
      smoothTouch: smoothTouch,
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, [smooth, effects, normalizeScroll, smoothTouch]);

  return {
    refresh: () => ScrollTrigger.refresh(),
    getSmoother: () => smootherRef.current
  };
}

// Parallax animation for image wrappers
export function useImageParallax(
  containerRef: React.RefObject<HTMLElement>,
  selector: string = '.col__image-wrap'
) {
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const imageWrappers = containerRef.current.querySelectorAll(selector);

    // Kill existing animations
    animationsRef.current.forEach(anim => anim.kill());
    animationsRef.current = [];

    // Create parallax animations for each image wrapper
    imageWrappers.forEach((wrapper: Element) => {
      const animation = gsap.fromTo(
        wrapper,
        {
          y: '-30vh'
        },
        {
          y: '30vh',
          scrollTrigger: {
            trigger: wrapper.closest('.slide'),
            scrub: true,
            start: 'top bottom',
            snap: {
              snapTo: 0.5,
              duration: 1,
              ease: 'power4.inOut'
            }
          },
          ease: 'none'
        }
      );

      animationsRef.current.push(animation);
    });

    ScrollTrigger.refresh();

    return () => {
      animationsRef.current.forEach(anim => anim.kill());
    };
  }, [containerRef, selector]);

  return {
    refresh: () => ScrollTrigger.refresh(),
    killAll: () => {
      animationsRef.current.forEach(anim => anim.kill());
    }
  };
}

// Slide animation on scroll
export function useSlideAnimation(
  containerRef: React.RefObject<HTMLElement>,
  selector: string = '.slide'
) {
  const animationsRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const slides = containerRef.current.querySelectorAll(selector);

    // Kill existing animations
    animationsRef.current.forEach(tl => tl.kill());
    animationsRef.current = [];

    // Create animations for each slide
    slides.forEach((slide: Element) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slide,
          start: '40% 50%'
        }
      });

      tl.from(slide.querySelectorAll('.col__content-title'), {
        ease: 'power4',
        y: '+=5vh',
        duration: 2.5
      })
        .from(
          slide.querySelectorAll('.line__inner'),
          {
            y: 200,
            duration: 2,
            ease: 'power4',
            stagger: 0.1
          },
          0
        )
        .from(
          slide.querySelectorAll('.col__content-txt'),
          {
            x: 100,
            y: 50,
            opacity: 0,
            duration: 2,
            ease: 'power4'
          },
          0.4
        )
        .from(
          slide.querySelectorAll('.slide-link'),
          {
            x: -100,
            y: 100,
            opacity: 0,
            duration: 2,
            ease: 'power4'
          },
          0.3
        )
        .from(
          slide.querySelectorAll('.slide__scroll-link'),
          {
            y: 200,
            duration: 3,
            ease: 'power4'
          },
          0.4
        )
        .to(
          slide.querySelectorAll('.slide__scroll-line'),
          {
            scaleY: 0.6,
            transformOrigin: 'bottom left',
            duration: 2.5,
            ease: 'elastic(1,0.5)'
          },
          1.4
        );

      animationsRef.current.push(tl);
    });

    ScrollTrigger.refresh();

    return () => {
      animationsRef.current.forEach(tl => tl.kill());
    };
  }, [containerRef, selector]);

  return {
    refresh: () => ScrollTrigger.refresh(),
    killAll: () => {
      animationsRef.current.forEach(tl => tl.kill());
    }
  };
}
