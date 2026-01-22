import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for intersection observer (lazy loading, visibility detection)
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);

  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
        
        if (triggerOnce && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting, entry };
};

/**
 * Hook for window resize
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

/**
 * Hook for element size
 */
export const useElementSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, ...size };
};

/**
 * Hook for click outside detection
 */
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
};

/**
 * Hook for keyboard shortcuts
 */
export const useKeyboard = (keyBindings = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const withModifiers = [
        event.ctrlKey && 'ctrl',
        event.shiftKey && 'shift',
        event.altKey && 'alt',
        event.metaKey && 'meta',
        key
      ].filter(Boolean).join('+');

      if (keyBindings[withModifiers]) {
        event.preventDefault();
        keyBindings[withModifiers](event);
      } else if (keyBindings[key]) {
        keyBindings[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyBindings]);
};

export default {
  useIntersectionObserver,
  useWindowSize,
  useElementSize,
  useClickOutside,
  useKeyboard
};
