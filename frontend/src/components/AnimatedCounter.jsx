import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter that smoothly transitions between numbers
 */
function AnimatedCounter({ 
  value, 
  duration = 1000, 
  delay = 0,
  formatValue = (val) => Math.round(val).toLocaleString(),
  prefix = '',
  suffix = '',
  className = '',
  onComplete
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const startAnimation = () => {
      startValueRef.current = displayValue;
      startTimeRef.current = null;

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = startValueRef.current + (value - startValueRef.current) * easeOut;
        
        setDisplayValue(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, delay]);

  return (
    <span className={`animated-counter ${className}`}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}

export default AnimatedCounter;
