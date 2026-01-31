import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AnimatedBorderButton.css';

interface AnimatedBorderButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export function AnimatedBorderButton({
  text = 'Get in touch',
  onClick,
  className = ''
}: AnimatedBorderButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;

    if (!button || !svg || !path) return;

    // Get button dimensions
    const updateSVGPath = () => {
      const rect = button.getBoundingClientRect();
      const width = button.offsetWidth;
      const height = button.offsetHeight;
      const padding = 8;

      // Create rounded rectangle path
      const pathData = `
        M ${padding},${padding}
        L ${width - padding},${padding}
        Q ${width - padding},${padding} ${width - padding},${padding}
        L ${width - padding},${height - padding}
        Q ${width - padding},${height - padding} ${width - padding},${height - padding}
        L ${padding},${height - padding}
        Q ${padding},${height - padding} ${padding},${height - padding}
        L ${padding},${padding}
        Q ${padding},${padding} ${padding},${padding}
      `;

      path.setAttribute('d', pathData);
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
    };

    updateSVGPath();

    // Get total path length
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength.toString();
    path.style.strokeDashoffset = pathLength.toString();

    // Create hover animation timeline
    const createHoverTimeline = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      timelineRef.current = gsap.timeline({ paused: true });

      // Draw border animation
      timelineRef.current.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        },
        0
      );

      // Glow effect on stroke
      timelineRef.current.to(
        path,
        {
          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
          duration: 0.8,
          ease: 'power2.inOut'
        },
        0
      );
    };

    createHoverTimeline();

    // Mouse enter handler
    const handleMouseEnter = () => {
      if (timelineRef.current) {
        timelineRef.current.play();
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      if (timelineRef.current) {
        timelineRef.current.reverse();
      }
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    // Handle window resize
    const handleResize = () => {
      updateSVGPath();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`animated-border-button ${className}`}
    >
      <svg
        ref={svgRef}
        className="animated-border-svg"
        viewBox="0 0 0 0"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className="animated-border-path"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="button-text">{text}</span>
    </button>
  );
}
