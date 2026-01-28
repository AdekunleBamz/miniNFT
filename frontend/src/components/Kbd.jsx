import React from 'react';

/**
 * Kbd Component
 * Visual representation of keyboard input key
 */
function Kbd({
  children,
  size = 'medium',
  className = '',
  ...props
}) {
  const kbdClasses = [
    'kbd',
    `kbd--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <kbd className={kbdClasses} {...props}>
      {children}
    </kbd>
  );
}

/**
 * Shortcut Component
 * Group of keys representing a shortcut (e.g., Ctrl + C)
 */
export function Shortcut({ 
  keys = [], 
  separator = '+',
  className = '',
  ...props 
}) {
  return (
    <span className={`shortcut ${className}`} {...props}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Kbd>{key}</Kbd>
          {index < keys.length - 1 && (
            <span className="shortcut__separator">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

Kbd.Shortcut = Shortcut;

export default Kbd;
