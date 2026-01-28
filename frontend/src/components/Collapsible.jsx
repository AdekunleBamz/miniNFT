import React, { useState, useRef, useEffect } from 'react';

/**
 * Collapsible Component
 * Expandable/collapsible content section with transition
 */
function Collapsible({
  title,
  children,
  defaultOpen = false,
  className = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, children]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`collapsible ${isOpen ? 'collapsible--open' : ''} ${className}`} {...props}>
      <button
        type="button"
        className="collapsible__header"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="collapsible__title">{title}</span>
        <span className="collapsible__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div 
        className="collapsible__content-wrapper"
        style={{ height }}
        aria-hidden={!isOpen}
      >
        <div className="collapsible__content" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Collapsible;
