import React, { useState } from 'react';

/**
 * Rating Component
 * Star rating input/display component
 */
function Rating({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  size = 'medium',
  className = '',
  ...props
}) {
  const [hoverValue, setHoverValue] = useState(null);
  const currentValue = hoverValue !== null ? hoverValue : value;

  const handleMouseEnter = (index) => {
    if (!readOnly) {
      setHoverValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };

  const handleClick = (index) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div 
      className={`rating rating--${size} ${readOnly ? 'rating--readonly' : ''} ${className}`}
      onMouseLeave={handleMouseLeave}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of ${max} stars`}
      {...props}
    >
      {[...Array(max)].map((_, index) => {
        const isFilled = index < currentValue;
        const isHovered = index < hoverValue;
        
        return (
          <button
            key={index}
            type="button"
            className={`rating__star ${isFilled ? 'rating__star--filled' : ''} ${isHovered ? 'rating__star--hover' : ''}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={readOnly}
            aria-checked={index + 1 === value}
            aria-label={`${index + 1} stars`}
            role={readOnly ? 'presentation' : 'radio'}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill={isFilled ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default Rating;
