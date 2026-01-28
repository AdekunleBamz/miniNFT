import { forwardRef } from 'react';

const AnimatedSwitch = forwardRef(function AnimatedSwitch({
  checked = false,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  labelPosition = 'right',
  color = 'primary',
  className = '',
  ...props
}, ref) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onChange?.(!checked);
    }
  };

  return (
    <label className={`switch-wrapper switch-${size} switch-label-${labelPosition} ${disabled ? 'disabled' : ''} ${className}`}>
      {label && labelPosition === 'left' && <span className="switch-label">{label}</span>}
      <div
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`animated-switch switch-${color} ${checked ? 'checked' : ''}`}
        onClick={() => !disabled && onChange?.(!checked)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className="switch-track" />
        <span className="switch-thumb">
          {checked && (
            <svg viewBox="0 0 24 24" className="switch-icon check">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
            </svg>
          )}
        </span>
      </div>
      {label && labelPosition === 'right' && <span className="switch-label">{label}</span>}
    </label>
  );
});

export default AnimatedSwitch;
