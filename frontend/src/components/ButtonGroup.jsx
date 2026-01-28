import React, { Children, cloneElement, isValidElement } from 'react';

/**
 * ButtonGroup Component
 * Groups multiple buttons together with consistent styling
 */
function ButtonGroup({
  children,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  attached = false,
  className = '',
  ...props
}) {
  const groupClasses = [
    'button-group',
    `button-group--${orientation}`,
    `button-group--${size}`,
    attached && 'button-group--attached',
    fullWidth && 'button-group--full-width',
    className,
  ].filter(Boolean).join(' ');

  // Clone children to pass group props
  const enhancedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    const isFirst = index === 0;
    const isLast = index === Children.count(children) - 1;
    const isOnly = Children.count(children) === 1;

    return cloneElement(child, {
      'data-position': isOnly ? 'only' : isFirst ? 'first' : isLast ? 'last' : 'middle',
      'data-group-size': size,
      'data-group-variant': variant,
    });
  });

  return (
    <div 
      className={groupClasses} 
      role="group"
      {...props}
    >
      {enhancedChildren}
    </div>
  );
}

export default ButtonGroup;
