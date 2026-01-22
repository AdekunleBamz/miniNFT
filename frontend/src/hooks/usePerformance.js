/**
 * Performance hooks for optimizing React components
 */

import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

/**
 * useThrottle - Throttle a value update
 */
export function useThrottle(value, limit = 100) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

/**
 * useThrottledCallback - Throttle a callback function
 */
export function useThrottledCallback(callback, limit = 100) {
  const lastRan = useRef(Date.now());
  const lastCallback = useRef(null);
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    lastCallback.current = () => callback(...args);
    
    if (Date.now() - lastRan.current >= limit) {
      lastCallback.current();
      lastRan.current = Date.now();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastCallback.current();
        lastRan.current = Date.now();
      }, limit - (Date.now() - lastRan.current));
    }
  }, [callback, limit]);
}

/**
 * usePrevious - Get previous value of a prop/state
 */
export function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * useWhyDidYouUpdate - Debug re-renders (dev only)
 */
export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef({});

  useEffect(() => {
    if (import.meta.env.DEV) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
      
      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }
    
    previousProps.current = props;
  });
}

/**
 * useDeepMemo - Deep comparison memo
 */
export function useDeepMemo(factory, deps) {
  const ref = useRef();
  
  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = { value: factory(), deps };
  }
  
  return ref.current.value;
}

/**
 * Deep equality check
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every((key) => deepEqual(a[key], b[key]));
}

/**
 * useLazyLoad - Lazy load a component/resource
 */
export function useLazyLoad(importFn) {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (component) return component;
    
    setLoading(true);
    setError(null);
    
    try {
      const module = await importFn();
      const loaded = module.default || module;
      setComponent(loaded);
      return loaded;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [importFn, component]);

  return { component, loading, error, load };
}

/**
 * useIdleCallback - Execute callback when browser is idle
 */
export function useIdleCallback(callback, options = {}) {
  const { timeout = 1000 } = options;
  
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback, { timeout });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 1);
      return () => clearTimeout(id);
    }
  }, [callback, timeout]);
}

/**
 * useRenderCount - Track component render count (dev only)
 */
export function useRenderCount(componentName) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  if (import.meta.env.DEV) {
    console.log(`${componentName} rendered ${renderCount.current} times`);
  }
  
  return renderCount.current;
}

/**
 * useStableCallback - Stable callback reference
 */
export function useStableCallback(callback) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
}

/**
 * useDeferredValue - Polyfill for React.useDeferredValue
 */
export function useDeferredValue(value, delay = 300) {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return deferredValue;
}

/**
 * useTransition - Simple transition state hook
 */
export function useTransition() {
  const [isPending, setIsPending] = useState(false);
  
  const startTransition = useCallback((callback) => {
    setIsPending(true);
    
    // Use microtask to defer state update
    queueMicrotask(() => {
      callback();
      setIsPending(false);
    });
  }, []);
  
  return [isPending, startTransition];
}

/**
 * useBatchUpdate - Batch multiple state updates
 */
export function useBatchUpdate() {
  const updates = useRef([]);
  const timeoutRef = useRef(null);
  
  const queueUpdate = useCallback((updateFn) => {
    updates.current.push(updateFn);
    
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        const batch = updates.current;
        updates.current = [];
        timeoutRef.current = null;
        
        batch.forEach((fn) => fn());
      }, 0);
    }
  }, []);
  
  return queueUpdate;
}

/**
 * Performance measurement utility
 */
export function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (import.meta.env.DEV) {
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * usePerformanceMark - Create performance marks
 */
export function usePerformanceMark(markName) {
  useEffect(() => {
    performance.mark(`${markName}-start`);
    
    return () => {
      performance.mark(`${markName}-end`);
      performance.measure(markName, `${markName}-start`, `${markName}-end`);
      
      if (import.meta.env.DEV) {
        const measures = performance.getEntriesByName(markName);
        const lastMeasure = measures[measures.length - 1];
        console.log(`⏱️ ${markName}: ${lastMeasure.duration.toFixed(2)}ms`);
      }
    };
  }, [markName]);
}

export default {
  useThrottle,
  useThrottledCallback,
  usePrevious,
  useWhyDidYouUpdate,
  useDeepMemo,
  useLazyLoad,
  useIdleCallback,
  useRenderCount,
  useStableCallback,
  useDeferredValue,
  useTransition,
  useBatchUpdate,
  measurePerformance,
  usePerformanceMark,
};
