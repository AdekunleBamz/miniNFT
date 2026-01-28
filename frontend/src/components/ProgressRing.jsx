import React from 'react';

/**
 * ProgressRing Component
 * Displays circular progress with optional label.
 */
function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 10,
  label = 'Progress',
  showValue = true,
  className = '',
  ...props
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={`progress-ring ${className}`} {...props}>
      <svg
        className="progress-ring__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label} ${clampedValue}%`}
      >
        <circle
          className="progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring__indicator"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="progress-ring__content">
        {showValue && (
          <span className="progress-ring__value">{clampedValue}%</span>
        )}
        {label && <span className="progress-ring__label">{label}</span>}
      </div>
    </div>
  );
}

export default ProgressRing;
