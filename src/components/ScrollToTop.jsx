import { useEffect } from 'react';

export function ScrollToTop() {
  useEffect(() => {
    // Scroll to top on hash change
    const handleHashChange = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}

// Hook for manual scroll to top (can be used with buttons)
export function useScrollToTop() {
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  };

  return scrollToTop;
}
