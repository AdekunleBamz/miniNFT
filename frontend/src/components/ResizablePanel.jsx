import React, { useState, useRef, useEffect } from 'react';

/**
 * ResizablePanel Component
 * Split view with draggable divider
 */
function ResizablePanel({
  left,
  right,
  initialLeftWidth = '50%',
  minLeftWidth = 20,
  maxLeftWidth = 80,
  className = '',
  ...props
}) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const startResize = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const stopResize = () => {
    setIsDragging(false);
  };

  const resize = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
      setLeftWidth(`${newLeftWidth}%`);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isDragging]);

  return (
    <div 
      className={`resizable-panel ${className}`} 
      ref={containerRef}
      onMouseUp={stopResize}
      {...props}
    >
      <div 
        className="resizable-panel__pane resizable-panel__pane--left"
        style={{ width: leftWidth }}
      >
        {left}
      </div>
      
      <div 
        className={`resizable-panel__handle ${isDragging ? 'resizable-panel__handle--dragging' : ''}`}
        onMouseDown={startResize}
      >
        <div className="resizable-panel__handle-bar" />
      </div>
      
      <div 
        className="resizable-panel__pane resizable-panel__pane--right"
        style={{ width: `calc(100% - ${leftWidth})` }}
      >
        {right}
      </div>
    </div>
  );
}

export default ResizablePanel;
