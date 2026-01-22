import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing animation state
 * @param {boolean} trigger - Whether animation should play
 * @param {Object} options - Animation options
 * @returns {Object} Animation state
 */
export function useAnimation(trigger, options = {}) {
  const {
    duration = 300,
    delay = 0,
    onComplete,
    onStart
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (trigger && !hasAnimated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
        onStart?.();

        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setHasAnimated(true);
          onComplete?.();
        }, duration);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trigger, hasAnimated, duration, delay, onComplete, onStart]);

  const reset = useCallback(() => {
    setIsAnimating(false);
    setHasAnimated(false);
  }, []);

  const replay = useCallback(() => {
    setHasAnimated(false);
  }, []);

  return {
    isAnimating,
    hasAnimated,
    reset,
    replay
  };
}

/**
 * Hook for enter/exit animations
 */
export function usePresence(isVisible, options = {}) {
  const {
    enterDuration = 300,
    exitDuration = 300,
    enterDelay = 0,
    exitDelay = 0
  } = options;

  const [isPresent, setIsPresent] = useState(isVisible);
  const [phase, setPhase] = useState(isVisible ? 'entered' : 'exited');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isVisible) {
      setIsPresent(true);
      
      timeoutRef.current = setTimeout(() => {
        setPhase('entering');
        
        timeoutRef.current = setTimeout(() => {
          setPhase('entered');
        }, enterDuration);
      }, enterDelay);
    } else {
      setPhase('exiting');
      
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = setTimeout(() => {
          setPhase('exited');
          setIsPresent(false);
        }, exitDuration);
      }, exitDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, enterDuration, exitDuration, enterDelay, exitDelay]);

  return {
    isPresent,
    phase,
    isEntering: phase === 'entering',
    isEntered: phase === 'entered',
    isExiting: phase === 'exiting',
    isExited: phase === 'exited'
  };
}

/**
 * Hook for staggered animations
 */
export function useStaggered(items, options = {}) {
  const {
    staggerDelay = 100,
    initialDelay = 0,
    enabled = true
  } = options;

  const [visibleItems, setVisibleItems] = useState([]);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    // Clear existing timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    if (!enabled) {
      setVisibleItems(items.map((_, i) => i));
      return;
    }

    setVisibleItems([]);

    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, initialDelay + (index * staggerDelay));
      
      timeoutsRef.current.push(timeout);
    });

    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, [items.length, staggerDelay, initialDelay, enabled]);

  const isVisible = useCallback((index) => {
    return visibleItems.includes(index);
  }, [visibleItems]);

  const getDelay = useCallback((index) => {
    return initialDelay + (index * staggerDelay);
  }, [initialDelay, staggerDelay]);

  return {
    visibleItems,
    isVisible,
    getDelay,
    allVisible: visibleItems.length === items.length
  };
}

/**
 * Hook for spring physics animation
 */
export function useSpring(targetValue, options = {}) {
  const {
    stiffness = 100,
    damping = 10,
    mass = 1,
    precision = 0.01
  } = options;

  const [value, setValue] = useState(targetValue);
  const velocityRef = useRef(0);
  const rafRef = useRef(null);
  const prevTimeRef = useRef(null);

  useEffect(() => {
    if (Math.abs(value - targetValue) < precision && Math.abs(velocityRef.current) < precision) {
      setValue(targetValue);
      return;
    }

    const animate = (time) => {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = time;
      }

      const deltaTime = Math.min((time - prevTimeRef.current) / 1000, 0.064);
      prevTimeRef.current = time;

      const displacement = value - targetValue;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocityRef.current;
      const acceleration = (springForce + dampingForce) / mass;

      velocityRef.current += acceleration * deltaTime;
      const newValue = value + velocityRef.current * deltaTime;

      if (Math.abs(newValue - targetValue) < precision && Math.abs(velocityRef.current) < precision) {
        setValue(targetValue);
        velocityRef.current = 0;
      } else {
        setValue(newValue);
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, value, stiffness, damping, mass, precision]);

  const set = useCallback((newValue) => {
    prevTimeRef.current = null;
    velocityRef.current = 0;
    setValue(newValue);
  }, []);

  return [value, set];
}

/**
 * Hook for typewriter effect
 */
export function useTypewriter(text, options = {}) {
  const {
    speed = 50,
    delay = 0,
    loop = false,
    onComplete
  } = options;

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDisplayText('');
    indexRef.current = 0;
    setIsComplete(false);

    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
      
      const type = () => {
        if (indexRef.current < text.length) {
          setDisplayText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();

          if (loop) {
            timeoutRef.current = setTimeout(() => {
              setDisplayText('');
              indexRef.current = 0;
              setIsComplete(false);
              timeoutRef.current = setTimeout(type, speed);
            }, 1000);
          }
        }
      };

      type();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, delay, loop, onComplete]);

  return {
    displayText,
    isTyping,
    isComplete,
    cursor: isTyping ? '|' : ''
  };
}

export default useAnimation;
