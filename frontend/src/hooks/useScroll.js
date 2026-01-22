import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for window scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: null
  });
  const previousY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollPosition({
        x: window.scrollX,
        y: currentY,
        direction: currentY > previousY.current ? 'down' : 'up'
      });
      previousY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * Hook for scroll to element
 */
export const useScrollTo = () => {
  const scrollTo = useCallback((elementId, options = {}) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }, []);

  return { scrollTo, scrollToTop, scrollToBottom };
};

/**
 * Hook for detecting when user scrolls past a threshold
 */
export const useScrollThreshold = (threshold = 100) => {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isPastThreshold;
};

/**
 * Hook for infinite scroll
 */
export const useInfiniteScroll = (callback, options = {}) => {
  const { threshold = 200, enabled = true } = options;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = async () => {
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - threshold;

      if (scrolledToBottom && !isLoading) {
        setIsLoading(true);
        try {
          await callback();
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, threshold, enabled, isLoading]);

  return isLoading;
};

/**
 * Hook for lock/unlock body scroll
 */
export const useScrollLock = () => {
  const lock = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return { lock, unlock };
};

export default {
  useScrollPosition,
  useScrollTo,
  useScrollThreshold,
  useInfiniteScroll,
  useScrollLock
};
