import { useRef, ReactNode } from 'react';
import { useParallax } from '../hooks/useParallax';

interface ParallaxElementProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  style?: React.CSSProperties;
}

/**
 * ParallaxElement Component
 * Wraps content with parallax scrolling effect
 * 
 * Usage:
 * <ParallaxElement speed={0.5} className="parallax">
 *   <img src="image.jpg" alt="parallax"  loading="lazy" />
 * </ParallaxElement>
 */
export function ParallaxElement({
  children,
  speed = 0.5,
  className = 'parallax',
  trigger = 'self',
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1,
  markers = false,
  style
}: ParallaxElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useParallax(elementRef, {
    speed,
    trigger,
    start,
    end,
    scrub,
    markers
  });

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  );
}
