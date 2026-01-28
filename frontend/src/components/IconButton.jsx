import { forwardRef } from 'react';

/**
 * IconButton component for icon-only buttons with tooltip
 */
const IconButton = forwardRef(function IconButton({
  icon,
  label,
  size = 'medium',
  variant = 'ghost',
  color = 'default',
  disabled = false,
  loading = false,
  className = '',
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`icon-button icon-button-${size} icon-button-${variant} icon-button-${color} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ${className}`}
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      {...props}
    >
      {loading ? (
        <span className="icon-button-spinner" />
      ) : (
        icon
      )}
    </button>
  );
});

export default IconButton;
