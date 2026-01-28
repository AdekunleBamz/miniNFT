import { useState, forwardRef } from 'react';

const FloatingLabelInput = forwardRef(function FloatingLabelInput({ 
  label, 
  type = 'text', 
  error, 
  success,
  helperText,
  startIcon,
  endIcon,
  className = '',
  ...props 
}, ref) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value !== undefined ? props.value !== '' : false;
  const isFloating = focused || hasValue;

  const stateClass = error ? 'error' : success ? 'success' : '';

  return (
    <div className={`floating-input-wrapper ${stateClass} ${className}`}>
      {startIcon && <span className="floating-input-icon start">{startIcon}</span>}
      <input
        ref={ref}
        type={type}
        className={`floating-input ${isFloating ? 'has-value' : ''} ${startIcon ? 'has-start-icon' : ''} ${endIcon ? 'has-end-icon' : ''}`}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholder=" "
        {...props}
      />
      <label className={`floating-label ${isFloating ? 'floating' : ''}`}>
        {label}
      </label>
      {endIcon && <span className="floating-input-icon end">{endIcon}</span>}
      {(helperText || error) && (
        <span className="floating-input-helper">{error || helperText}</span>
      )}
    </div>
  );
});

export default FloatingLabelInput;
