import { useRef, useEffect } from 'react';
import { useGSAPTyping } from '../hooks/useGSAPTyping';

interface TypingTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  trigger?: boolean;
}

export function TypingText({
  children,
  className = '',
  duration = 1.5,
  delay = 0,
  stagger = 0.05,
  onComplete,
  trigger = true
}: TypingTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  // Set initial text content when trigger becomes true
  useEffect(() => {
    if (elementRef.current && trigger) {
      elementRef.current.textContent = children;
    }
  }, [trigger, children]);

  useGSAPTyping(elementRef, {
    duration,
    delay,
    stagger,
    onComplete
  });

  return (
    <span ref={elementRef} className={className} />
  );
}
