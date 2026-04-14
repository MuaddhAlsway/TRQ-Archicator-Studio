import { useRef, useEffect } from 'react';
import { useGSAPParallax, useImageParallax, useSlideAnimation } from '../hooks/useGSAPParallax';
import '../styles/workflow-parallax.css';
import { getImageUrl } from '../api';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
}

interface WorkflowParallaxProps {
  steps: WorkflowStep[];
  children?: React.ReactNode;
}

/**
 * WorkflowParallax Component
 * Implements GSAP ScrollSmoother + ScrollTrigger parallax effects
 * Based on gsap-scrolltrigger-parallaxing-with-scrollsmoother
 */
export function WorkflowParallax({ steps, children }: WorkflowParallaxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP ScrollSmoother
  useGSAPParallax(wrapperRef, {
    smooth: 2,
    effects: true,
    smoothTouch: 0.1
  });

  // Initialize image parallax
  useImageParallax(contentRef, '.col__image-wrap');

  // Initialize slide animations
  useSlideAnimation(contentRef, '.slide');

  return (
    <div ref={wrapperRef} className="smooth-wrapper">
      <div ref={contentRef} className="smooth-content" data-smooth-content>
        {children}

        {/* Workflow Steps */}
        <div className="workflow-slides">
          {steps.map((step, index) => (
            <section
              key={step.id}
              className={`slide slide--${index}`}
              id={`slide-${index}`}
            >
              <div className="col col--1">
                <div className={`col__content col__content--${index + 1}`}>
                  <h2 className="col__content-title">
                    <span className="line__inner">{step.title}</span>
                  </h2>
                  <div className="col__content-wrap">
                    <p className="col__content-txt">{step.description}</p>
                    <p className="col__content-txt">{step.content}</p>
                    <a href="#" className="slide-link">
                      <div className="slide-link__circ"></div>
                      <div className="slide-link__line"></div>
                    </a>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <a href={`#slide-${index + 1}`} className="slide__scroll-link">
                    <div className="slide__scroll-line"></div>
                  </a>
                )}
              </div>
              <div className="col col--2">
                <div className="col__image-wrap">
                  <img
                    className="img img--1"
                    src={step.image ? getImageUrl(step.image) : ''}
                    alt={step.title}
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
