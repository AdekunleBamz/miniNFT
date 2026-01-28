/**
 * Chip/Tag component for labels and selections
 */
function Chip({ 
  children,
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  icon,
  onDelete,
  onClick,
  disabled = false,
  className = ''
}) {
  const isClickable = !!onClick && !disabled;
  const isDeletable = !!onDelete && !disabled;

  return (
    <span 
      className={`chip chip-${variant} chip-${color} chip-${size} ${isClickable ? 'clickable' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{children}</span>
      {isDeletable && (
        <button 
          className="chip-delete" 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Remove"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </span>
  );
}

export function ChipGroup({ children, className = '' }) {
  return <div className={`chip-group ${className}`}>{children}</div>;
}

export default Chip;
