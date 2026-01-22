const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  onClose,
  showIcon = true 
}) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  return (
    <div className={`alert alert-${type}`} role="alert">
      {showIcon && (
        <span className="alert-icon" aria-hidden="true">
          {icons[type]}
        </span>
      )}
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const AlertBanner = ({ 
  type = 'info', 
  children, 
  action,
  onClose 
}) => {
  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <div className="alert-banner-content">
        {children}
      </div>
      {action && (
        <button className="alert-banner-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onClose && (
        <button className="alert-banner-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
