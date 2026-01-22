import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  closeOnClick = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };
  
  return (
    <div className="dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`dropdown-content align-${align}`}
          onClick={handleContentClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ 
  icon, 
  children, 
  onClick, 
  disabled = false,
  danger = false 
}) => {
  return (
    <button
      className={`dropdown-item ${danger ? 'danger' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      <span className="dropdown-item-text">{children}</span>
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="dropdown-divider" />;
};

export const DropdownHeader = ({ children }) => {
  return <div className="dropdown-header">{children}</div>;
};

export default Dropdown;
