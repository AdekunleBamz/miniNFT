import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that triggers callback when clicking outside the referenced element
 * @param {Function} callback - Function to call on outside click
 * @param {Object} options - Configuration options
 * @returns {React.RefObject} - Ref to attach to the element
 */
function useOnClickOutside(callback, { enabled = true, ignoreRefs = [] } = {}) {
  const ref = useRef(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleClick = useCallback((event) => {
    if (!ref.current) return;
    
    // Check if click is inside the main ref
    if (ref.current.contains(event.target)) return;
    
    // Check if click is inside any of the ignored refs
    for (const ignoreRef of ignoreRefs) {
      if (ignoreRef.current?.contains(event.target)) return;
    }
    
    callbackRef.current(event);
  }, [ignoreRefs]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [enabled, handleClick]);

  return ref;
}

export default useOnClickOutside;
