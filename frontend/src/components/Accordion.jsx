import { useState } from 'react';

const Accordion = ({ items = [], allowMultiple = false, defaultOpen = [] }) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));
  
  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`accordion-item ${openItems.has(index) ? 'open' : ''}`}
        >
          <button
            className="accordion-header"
            onClick={() => toggleItem(index)}
            aria-expanded={openItems.has(index)}
            aria-controls={`accordion-panel-${index}`}
          >
            <span className="accordion-title">{item.title}</span>
            <span className="accordion-icon" aria-hidden="true">
              {openItems.has(index) ? '−' : '+'}
            </span>
          </button>
          <div
            id={`accordion-panel-${index}`}
            className="accordion-panel"
            role="region"
            hidden={!openItems.has(index)}
          >
            <div className="accordion-content">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button
        className="accordion-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div className="accordion-panel" hidden={!isOpen}>
        <div className="accordion-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
