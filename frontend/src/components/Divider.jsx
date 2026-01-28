/**
 * Divider component for separating content
 */
function Divider({ 
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  spacing = 'medium',
  children,
  className = ''
}) {
  const hasContent = !!children;

  return (
    <div 
      className={`divider divider-${orientation} divider-${variant} divider-${color} divider-spacing-${spacing} ${hasContent ? 'divider-with-content' : ''} ${className}`}
      role="separator"
      aria-orientation={orientation}
    >
      {hasContent && (
        <>
          <span className="divider-line" />
          <span className="divider-content">{children}</span>
          <span className="divider-line" />
        </>
      )}
    </div>
  );
}

export default Divider;
