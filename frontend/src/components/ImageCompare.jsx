import React, { useState, useRef, useEffect } from 'react';

/**
 * ImageCompare Component
 * Comparison slider for two images (before/after)
 */
function ImageCompare({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initialPosition = 50,
  className = '',
  ...props
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = () => setIsResizing(true);
  const handleTouchStart = () => setIsResizing(true);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    const newPosition = Math.max(0, Math.min(100, (x / width) * 100));
    
    setPosition(newPosition);
  };

  const handleMouseMove = (e) => {
    if (isResizing) handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (isResizing) handleMove(e.touches[0].clientX);
  };

  const stopResizing = () => setIsResizing(false);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mouseup', stopResizing);
      window.addEventListener('touchend', stopResizing);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchend', stopResizing);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isResizing]);

  return (
    <div 
      className={`image-compare ${className}`} 
      ref={containerRef}
      role="slider"
      aria-valuenow={position}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Image comparison slider"
      {...props}
    >
      <div className="image-compare__image image-compare__image--after">
        <img src={after} alt={afterLabel} />
        {afterLabel && <span className="image-compare__label image-compare__label--after">{afterLabel}</span>}
      </div>
      
      <div 
        className="image-compare__image image-compare__image--before"
        style={{ width: `${position}%` }}
      >
        <img src={before} alt={beforeLabel} />
        {beforeLabel && <span className="image-compare__label image-compare__label--before">{beforeLabel}</span>}
      </div>
      
      <div 
        className="image-compare__handle"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="image-compare__handle-line" />
        <div className="image-compare__handle-button">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.41 7.41L17 6l-6 6 6 6 1.41-1.41L13.83 12zm-12.82 0L7 6l6 6-6 6-1.41-1.41L10.17 12z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ImageCompare;
