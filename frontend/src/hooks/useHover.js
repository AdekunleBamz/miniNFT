import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook to track hover state of an element with optional delay
 * @param {Object} options - Configuration options
 * @param {number} options.enterDelay - Delay before hover becomes true (ms)
 * @param {number} options.leaveDelay - Delay before hover becomes false (ms)
 * @returns {[boolean, Object]} - [isHovered, hoverProps to spread on element]
 */
function useHover({ enterDelay = 0, leaveDelay = 0 } = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const enterTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  const clearTimeouts = useCallback(() => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const handleMouseEnter = useCallback(() => {
    clearTimeouts();
    if (enterDelay > 0) {
      enterTimeoutRef.current = setTimeout(() => setIsHovered(true), enterDelay);
    } else {
      setIsHovered(true);
    }
  }, [enterDelay, clearTimeouts]);

  const handleMouseLeave = useCallback(() => {
    clearTimeouts();
    if (leaveDelay > 0) {
      leaveTimeoutRef.current = setTimeout(() => setIsHovered(false), leaveDelay);
    } else {
      setIsHovered(false);
    }
  }, [leaveDelay, clearTimeouts]);

  const hoverProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return [isHovered, hoverProps];
}

export default useHover;
