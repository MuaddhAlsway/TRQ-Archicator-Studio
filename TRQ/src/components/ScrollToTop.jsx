import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, hash]);

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
