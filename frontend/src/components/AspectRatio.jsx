/**
 * AspectRatio container component
 */
function AspectRatio({ 
  ratio = '1/1', 
  children, 
  className = '',
  maxWidth,
  ...props 
}) {
  const style = {
    aspectRatio: ratio,
    ...(maxWidth && { maxWidth }),
  };

  return (
    <div className={`aspect-ratio-container ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

export default AspectRatio;
