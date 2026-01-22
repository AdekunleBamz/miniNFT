import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdown(targetDate, options = {}) {
  const { onComplete, interval = 1000 } = options;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const intervalRef = useRef(null);

  function calculateTimeLeft(target) {
    const difference = new Date(target) - new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false,
    };
  }

  const updateTimeLeft = useCallback(() => {
    const newTimeLeft = calculateTimeLeft(targetDate);
    setTimeLeft(newTimeLeft);
    
    if (newTimeLeft.isComplete) {
      clearInterval(intervalRef.current);
      onComplete?.();
    }
  }, [targetDate, onComplete]);

  useEffect(() => {
    updateTimeLeft();
    intervalRef.current = setInterval(updateTimeLeft, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimeLeft, interval]);

  const formatted = `${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return {
    ...timeLeft,
    formatted,
  };
}

export default useCountdown;
