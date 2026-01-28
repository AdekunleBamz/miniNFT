import React, { useRef, useEffect, useState } from 'react';

/**
 * Slider Component
 * Range input slider with custom styling
 */
function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showValue = false,
  className = '',
  ...props
}) {
  const [localValue, setLocalValue] = useState(value || min);
  const trackRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const percentage = ((localValue - min) / (max - min)) * 100;

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`slider-container ${disabled ? 'slider--disabled' : ''} ${className}`}>
      <div className="slider">
        <div 
          className="slider__track"
          ref={trackRef}
        >
          <div 
            className="slider__fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="slider__input"
          {...props}
        />
        <div 
          className="slider__thumb" 
          style={{ left: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="slider__value">{localValue}</span>
      )}
    </div>
  );
}

export default Slider;
