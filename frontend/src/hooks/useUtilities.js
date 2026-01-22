import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing async operations with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
};

/**
 * Hook for previous value tracking
 */
export const usePrevious = (value) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(null);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
};

/**
 * Hook for toggling boolean state
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, toggle, { setTrue, setFalse, setValue }];
};

/**
 * Hook for handling hover state
 */
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  
  return [isHovered, hoverProps];
};

/**
 * Hook for handling focus state
 */
export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  
  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
  
  return [isFocused, focusProps];
};

/**
 * Hook for checking if component is mounted
 */
export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  return isMounted;
};

/**
 * Hook for handling online/offline status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

export default {
  useAsync,
  usePrevious,
  useToggle,
  useHover,
  useFocus,
  useIsMounted,
  useOnlineStatus
};
