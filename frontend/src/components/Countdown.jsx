import { useState, useEffect } from 'react';

function Countdown({ targetDate, label, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    
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

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.isComplete) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isComplete) {
    return (
      <div className="countdown countdown-complete">
        <span className="countdown-label">{label || 'Event Started!'}</span>
      </div>
    );
  }

  return (
    <div className="countdown">
      {label && <span className="countdown-label">{label}</span>}
      <div className="countdown-timer">
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Days</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Hours</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Mins</span>
        </div>
        <span className="countdown-separator">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-unit-label">Secs</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
