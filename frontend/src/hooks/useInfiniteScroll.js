import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for infinite scrolling
 * @param {Function} fetchMore - Function to fetch more items
 * @param {Object} options - Options
 * @returns {Object} Infinite scroll state and handlers
 */
export function useInfiniteScroll(fetchMore, options = {}) {
  const {
    threshold = 0.8,
    rootMargin = '100px',
    enabled = true,
    initialPage = 1
  } = options;

  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || !enabled) return;
    
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchMore(page);
      
      if (result.hasMore !== undefined) {
        setHasMore(result.hasMore);
      }
      
      if (result.hasMore !== false) {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err);
      console.error('Failed to load more:', err);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [fetchMore, page, hasMore, enabled]);

  useEffect(() => {
    if (!sentinelRef.current || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading, threshold, rootMargin, enabled]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    loadingRef.current = false;
  }, [initialPage]);

  return {
    sentinelRef,
    isLoading,
    hasMore,
    error,
    page,
    loadMore,
    reset
  };
}

/**
 * Hook for virtual scrolling with large lists
 * @param {Object} options - Configuration options
 * @returns {Object} Virtual scroll state and handlers
 */
export function useVirtualScroll(options = {}) {
  const {
    itemCount = 0,
    itemHeight = 50,
    containerHeight = 400,
    overscan = 5
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      style: {
        position: 'absolute',
        top: i * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    });
  }

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  const totalHeight = itemCount * itemHeight;

  return {
    containerRef,
    handleScroll,
    visibleItems,
    totalHeight,
    scrollToIndex,
    startIndex,
    endIndex
  };
}

/**
 * Hook for scroll restoration
 */
export function useScrollRestoration(key, containerRef = null) {
  const scrollPositions = useRef(new Map());

  const savePosition = useCallback(() => {
    const element = containerRef?.current || window;
    const position = element === window 
      ? window.scrollY 
      : element.scrollTop;
    
    scrollPositions.current.set(key, position);
    
    try {
      sessionStorage.setItem(
        `scroll-${key}`,
        JSON.stringify(position)
      );
    } catch (e) {
      // Session storage might be full or disabled
    }
  }, [key, containerRef]);

  const restorePosition = useCallback(() => {
    let position = scrollPositions.current.get(key);
    
    if (position === undefined) {
      try {
        const stored = sessionStorage.getItem(`scroll-${key}`);
        position = stored ? JSON.parse(stored) : 0;
      } catch {
        position = 0;
      }
    }

    const element = containerRef?.current || window;
    
    requestAnimationFrame(() => {
      if (element === window) {
        window.scrollTo(0, position);
      } else {
        element.scrollTop = position;
      }
    });
  }, [key, containerRef]);

  useEffect(() => {
    return () => savePosition();
  }, [savePosition]);

  return {
    savePosition,
    restorePosition
  };
}

/**
 * Hook for scroll lock (prevent body scrolling)
 */
export function useScrollLock(isLocked = false) {
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (isLocked) {
      scrollPosition.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition.current);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isLocked]);

  const lock = useCallback(() => {
    scrollPosition.current = window.scrollY;
    document.body.style.overflow = 'hidden';
  }, []);

  const unlock = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  return { lock, unlock };
}

/**
 * Hook for scroll direction detection
 */
export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState('none');
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      
      if (Math.abs(diff) >= threshold) {
        setDirection(diff > 0 ? 'down' : 'up');
        lastScrollY.current = currentScrollY;
      }

      setIsAtTop(currentScrollY <= 0);
      setIsAtBottom(
        currentScrollY + window.innerHeight >= document.documentElement.scrollHeight - 10
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return {
    direction,
    isScrollingUp: direction === 'up',
    isScrollingDown: direction === 'down',
    isAtTop,
    isAtBottom
  };
}

export default useInfiniteScroll;
