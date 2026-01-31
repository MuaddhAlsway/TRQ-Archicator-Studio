import { useRef, useEffect } from 'react';
import { useSplitText } from '../hooks/useSplitText';

interface SplitTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  trigger?: boolean;
}

export function SplitText({
  children,
  className = '',
  duration = 0.8,
  delay = 0,
  stagger = 0.05,
  onComplete,
  trigger = true
}: SplitTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  // Initialize text content
  useEffect(() => {
    if (elementRef.current && trigger) {
      elementRef.current.textContent = children;
    }
  }, [children, trigger]);

  useSplitText(elementRef, {
    duration,
    delay,
    stagger,
    onComplete
  });

  return (
    <span ref={elementRef} className={className} />
  );
}
