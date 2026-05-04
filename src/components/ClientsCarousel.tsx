import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ClientsCarousel.css';

interface ClientLogo {
  id?: string;
  src: string;
  alt: string;
  isActive?: boolean;
}

interface ClientsCarouselProps {
  logos?: ClientLogo[];
  speed?: number; // seconds for one full loop
}

const defaultLogos: ClientLogo[] = [
  { id: '1', src: '/clientLogos/client1.jpeg', alt: 'Client 1', isActive: true },
  { id: '2', src: '/clientLogos/client2.jpeg', alt: 'Client 2', isActive: true },
  { id: '3', src: '/clientLogos/client3.jpeg', alt: 'Client 3', isActive: true },
  { id: '4', src: '/clientLogos/client4.jpeg', alt: 'Client 4', isActive: true },
  { id: '5', src: '/clientLogos/client1.jpeg', alt: 'Client 5', isActive: true },
  { id: '6', src: '/clientLogos/client2.jpeg', alt: 'Client 6', isActive: true },
];

export function ClientsCarousel({
  logos: propLogos,
  speed = 25,
}: ClientsCarouselProps) {
  const { isRTL, language } = useLanguage();
  const [logos, setLogos] = useState<ClientLogo[]>(propLogos || defaultLogos);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const title = language === 'ar' ? 'عملائنا' : 'Our Clients';

  // Load clients from localStorage (managed by admin)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('trq_clients');
      if (stored) {
        const allClients = JSON.parse(stored);
        // Filter only active clients
        const activeClients = allClients.filter((c: ClientLogo) => c.isActive !== false);
        if (activeClients.length > 0) {
          setLogos(activeClients);
        }
      }
    } catch (err) {
      console.error('Failed to load clients from localStorage:', err);
      setLogos(propLogos || defaultLogos);
    }
  }, [propLogos]);

  // Handle mouse down - pause animation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
    
    if (trackRef.current) {
      // Pause animation
      trackRef.current.style.animationPlayState = 'paused';
      trackRef.current.classList.add('dragging');
    }
  };

  // Handle mouse move - drag the carousel
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    
    const diff = e.clientX - dragStartRef.current;
    const newOffset = currentOffsetRef.current + diff;
    
    // Apply drag offset to track
    trackRef.current.style.transform = `translateX(${newOffset}px)`;
  };

  // Handle mouse up - resume animation smoothly
  const handleMouseUp = () => {
    if (!isDragging || !trackRef.current) return;
    
    setIsDragging(false);
    
    // Get final position from transform
    const transform = trackRef.current.style.transform;
    const match = transform.match(/[\d.-]+/);
    const finalOffset = match ? parseInt(match[0]) : 0;
    currentOffsetRef.current = finalOffset;
    
    // Remove dragging class and resume animation
    trackRef.current.classList.remove('dragging');
    trackRef.current.style.animationPlayState = 'running';
    
    // Smooth transition back to animation
    trackRef.current.style.transition = 'transform 0.5s ease-out';
    
    // Reset transform after transition completes
    setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = '';
        currentOffsetRef.current = 0;
      }
    }, 500);
  };

  // Duplicate logos 12 times for seamless infinite loop
  const loopedLogos = Array.from({ length: 12 }, () => logos).flat();

  return (
    <section className={`bg-black py-12 sm:py-16 overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-wide text-center mb-8 sm:mb-12 text-white">
        {title}
      </h2>

      <div 
        ref={wrapperRef}
        className="clients-carousel-wrapper overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={trackRef}
          className={`clients-carousel-track flex gap-12 sm:gap-16 items-center ${
            isRTL ? 'animate-scroll-rtl' : 'animate-scroll-ltr'
          }`}
          style={{ '--scroll-speed': `${speed}s` } as React.CSSProperties}
        >
          {loopedLogos.map((logo, index) => (
            <div
              key={index}
              className="clients-carousel-item flex-shrink-0 flex items-center justify-center pointer-events-none"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-[60px] w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
