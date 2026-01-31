import { useRef, ReactNode } from 'react';
import { useParallaxBatch } from '../hooks/useParallax';

interface ParallaxContainerProps {
  children: ReactNode;
  selector?: string;
  speed?: number;
  scrub?: boolean | number;
  markers?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxContainer Component
 * Applies parallax effect to all child elements with .parallax class
 * 
 * Usage:
 * <ParallaxContainer speed={0.5}>
 *   <div className="parallax" data-speed="0.3">Background</div>
 *   <div className="parallax" data-speed="0.7">Foreground</div>
 * </ParallaxContainer>
 */
export function ParallaxContainer({
  children,
  selector = '.parallax',
  speed = 0.5,
  scrub = 1,
  markers = false,
  className = '',
  style
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useParallaxBatch(containerRef, selector, {
    speed,
    scrub,
    markers
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
