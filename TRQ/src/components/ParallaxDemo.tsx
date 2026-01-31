import { useRef } from 'react';
import { ParallaxElement } from './ParallaxElement';
import { ParallaxContainer } from './ParallaxContainer';
import '../styles/parallax.css';

/**
 * ParallaxDemo Component
 * Demonstrates various parallax scrolling techniques
 */
export function ParallaxDemo() {
  const triggerRef = useRef(null);

  return (
    <div className="parallax-demo">
      {/* Hero Section with Single Parallax Element */}
      <section className="parallax-section" style={{ background: '#000' }}>
        <ParallaxElement speed={0.3} className="parallax-bg">
          <div
            style={{
              width: '100%',
              height: '120%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <h1 className="parallax-text">Parallax Scrolling</h1>
          </div>
        </ParallaxElement>
      </section>

      {/* Content Section */}
      <section style={{ padding: '100px 20px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>
          Scroll to see parallax effects
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
          Parallax scrolling is a technique where background elements move slower than
          foreground elements, creating a sense of depth and immersion. This demo showcases
          various ways to implement parallax effects using GSAP and ScrollTrigger.
        </p>
      </section>

      {/* Multi-Layer Parallax Section */}
      <section style={{ padding: '100px 20px', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Multi-Layer Parallax</h2>
        <ParallaxContainer speed={0.5}>
          <div
            className="parallax"
            data-speed="0.2"
            style={{
              height: '300px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              marginBottom: '20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            Layer 1 - Slow (0.2)
          </div>
          <div
            className="parallax"
            data-speed="0.5"
            style={{
              height: '300px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              marginBottom: '20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            Layer 2 - Medium (0.5)
          </div>
          <div
            className="parallax"
            data-speed="0.8"
            style={{
              height: '300px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            Layer 3 - Fast (0.8)
          </div>
        </ParallaxContainer>
      </section>

      {/* Individual Parallax Elements */}
      <section style={{ padding: '100px 20px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Individual Elements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <ParallaxElement speed={0.3}>
            <div
              style={{
                height: '300px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Card 1 - Speed 0.3
            </div>
          </ParallaxElement>

          <ParallaxElement speed={0.5}>
            <div
              style={{
                height: '300px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Card 2 - Speed 0.5
            </div>
          </ParallaxElement>

          <ParallaxElement speed={0.7}>
            <div
              style={{
                height: '300px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Card 3 - Speed 0.7
            </div>
          </ParallaxElement>
        </div>
      </section>

      {/* Footer */}
      <section style={{ padding: '100px 20px', background: '#000', color: '#fff', textAlign: 'center' }}>
        <h2>Keep Scrolling</h2>
        <p>Parallax effects enhance user experience and create engaging interactions</p>
      </section>
    </div>
  );
}
