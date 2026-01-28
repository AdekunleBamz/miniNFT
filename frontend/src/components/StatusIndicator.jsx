import React from 'react';

/**
 * StatusIndicator Component
 * Shows connection/status with animated indicator
 */
function StatusIndicator({
  status = 'offline',
  label,
  showLabel = true,
  size = 'medium',
  pulse = true,
  className = '',
  ...props
}) {
  const statusClasses = [
    'status-indicator',
    `status-indicator--${status}`,
    `status-indicator--${size}`,
    pulse && status !== 'offline' && 'status-indicator--pulse',
    className,
  ].filter(Boolean).join(' ');

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    away: 'Away',
    busy: 'Busy',
    connecting: 'Connecting',
  };

  return (
    <div className={statusClasses} {...props}>
      <span className="status-indicator__dot" aria-hidden="true" />
      {showLabel && (
        <span className="status-indicator__label">
          {label || statusLabels[status] || status}
        </span>
      )}
    </div>
  );
}

export default StatusIndicator;
