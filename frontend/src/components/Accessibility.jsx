import { useState, useRef, useEffect } from 'react';

/**
 * Accessible skip link for keyboard navigation
 */
export const SkipLink = ({ targetId = 'main-content', children = 'Skip to main content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-link">
      {children}
    </a>
  );
};

/**
 * Visually hidden text for screen readers
 */
export const VisuallyHidden = ({ children, as: Component = 'span' }) => {
  return (
    <Component className="visually-hidden">
      {children}
    </Component>
  );
};

/**
 * Focus trap for modals and dialogs
 */
export const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
  
  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};

/**
 * Announce content to screen readers
 */
export const LiveRegion = ({ message, politeness = 'polite', children }) => {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    if (message) {
      setAnnouncement('');
      setTimeout(() => setAnnouncement(message), 100);
    }
  }, [message]);
  
  return (
    <>
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="visually-hidden"
      >
        {announcement}
      </div>
      {children}
    </>
  );
};

/**
 * Keyboard accessible icon button
 */
export const IconButton = ({ 
  icon, 
  label, 
  onClick, 
  disabled = false,
  className = '' 
}) => {
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
};

export default {
  SkipLink,
  VisuallyHidden,
  FocusTrap,
  LiveRegion,
  IconButton
};
