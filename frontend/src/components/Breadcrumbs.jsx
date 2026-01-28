import React, { Children } from 'react';

/**
 * Breadcrumbs Component
 * Displays navigation hierarchy with customizable separator
 */
function Breadcrumbs({
  children,
  separator = '/',
  maxItems,
  collapseText = '...',
  className = '',
  ...props
}) {
  const childrenArray = Children.toArray(children).filter(child => {
    return React.isValidElement(child) || typeof child === 'string';
  });

  const count = childrenArray.length;
  
  let items = childrenArray;

  // Handle collapsing logic
  if (maxItems && count > maxItems) {
    const startItems = 1;
    const endItems = 1;
    
    // Ensure we show at least start + end items
    if (maxItems >= startItems + endItems) {
      items = [
        ...childrenArray.slice(0, startItems),
        <span key="collapse" className="breadcrumbs__collapse">
          {collapseText}
        </span>,
        ...childrenArray.slice(count - endItems),
      ];
    }
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`breadcrumbs ${className}`}
      {...props}
    >
      <ol className="breadcrumbs__list">
        {items.map((child, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li 
              key={child.key || index} 
              className={`breadcrumbs__item ${isLast ? 'breadcrumbs__item--active' : ''}`}
            >
              {child}
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
