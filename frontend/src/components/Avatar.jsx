const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback,
  address,
  showBorder = false,
  status
}) => {
  const getInitials = (text) => {
    if (!text) return '?';
    return text.slice(0, 2).toUpperCase();
  };
  
  const generateColorFromAddress = (addr) => {
    if (!addr) return 'var(--primary)';
    const hash = addr.slice(2, 8);
    const hue = parseInt(hash, 16) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };
  
  const sizeClasses = {
    xs: 'avatar-xs',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl'
  };
  
  const renderContent = () => {
    if (src) {
      return <img src={src} alt={alt} className="avatar-image" />;
    }
    
    if (address) {
      return (
        <div 
          className="avatar-address"
          style={{ background: generateColorFromAddress(address) }}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
      );
    }
    
    if (fallback) {
      return <div className="avatar-fallback">{getInitials(fallback)}</div>;
    }
    
    return <div className="avatar-placeholder">👤</div>;
  };
  
  return (
    <div className={`avatar ${sizeClasses[size]} ${showBorder ? 'bordered' : ''}`}>
      {renderContent()}
      {status && (
        <span className={`avatar-status ${status}`} aria-label={status} />
      )}
    </div>
  );
};

export const AvatarGroup = ({ avatars = [], max = 4, size = 'md' }) => {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  
  return (
    <div className="avatar-group">
      {visible.map((avatar, index) => (
        <Avatar key={index} {...avatar} size={size} showBorder />
      ))}
      {remaining > 0 && (
        <div className={`avatar avatar-${size} avatar-remaining`}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;
