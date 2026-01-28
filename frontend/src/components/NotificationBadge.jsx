import { useState, useEffect } from 'react';

function NotificationBadge({ count = 0, max = 99, pulse = true, color = 'error', size = 'medium', showZero = false }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count > prevCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span 
      className={`notification-badge notification-badge-${size} notification-badge-${color} ${pulse && count > 0 ? 'pulse' : ''} ${isAnimating ? 'pop' : ''}`}
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  );
}

export function BadgeWrapper({ children, count, position = 'top-right', ...props }) {
  return (
    <span className="badge-wrapper">
      {children}
      <NotificationBadge count={count} {...props} />
      <style>{`
        .badge-wrapper { position: relative; display: inline-flex; }
        .badge-wrapper .notification-badge {
          position: absolute;
          ${position.includes('top') ? 'top: -8px;' : 'bottom: -8px;'}
          ${position.includes('right') ? 'right: -8px;' : 'left: -8px;'}
        }
      `}</style>
    </span>
  );
}

export default NotificationBadge;
