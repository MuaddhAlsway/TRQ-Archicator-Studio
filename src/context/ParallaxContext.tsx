import { createContext, useContext, ReactNode } from 'react';
import { useGlobalParallax } from '../hooks/useParallax';

interface ParallaxContextType {
  refresh: () => void;
  killAll: () => void;
}

const ParallaxContext = createContext<ParallaxContextType | undefined>(undefined);

export function ParallaxProvider({ children }: { children: ReactNode }) {
  const parallax = useGlobalParallax();

  return (
    <ParallaxContext.Provider value={parallax}>
      {children}
    </ParallaxContext.Provider>
  );
}

export function useParallaxContext() {
  const context = useContext(ParallaxContext);
  if (!context) {
    throw new Error('useParallaxContext must be used within ParallaxProvider');
  }
  return context;
}
