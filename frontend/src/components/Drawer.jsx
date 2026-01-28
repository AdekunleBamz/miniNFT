import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import IconButton from './IconButton';

/**
 * Drawer Component
 * Offcanvas panel that slides in from screen edge
 */
function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'medium',
  title,
  children,
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
  ...props
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const drawerContent = (
    <div className="drawer-container" role="dialog" aria-modal="true">
      <div 
        className={`drawer-overlay ${overlayClassName}`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      <div 
        className={`drawer drawer--${position} drawer--${size} ${className}`}
        {...props}
      >
        <div className="drawer__header">
          {title && <h3 className="drawer__title">{title}</h3>}
          <button 
            type="button" 
            className="drawer__close" 
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="drawer__content">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

export default Drawer;
