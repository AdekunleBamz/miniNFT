/**
 * Container component for consistent page width and padding
 */
function Container({ 
  children, 
  size = 'default',
  centered = true,
  padding = true,
  className = '',
  as: Component = 'div',
  ...props 
}) {
  return (
    <Component 
      className={`container container-${size} ${centered ? 'container-centered' : ''} ${padding ? 'container-padded' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
