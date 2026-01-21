function Spinner({ size = 'medium', color = 'primary', className = '' }) {
  const sizes = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg'
  };

  const colors = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  return (
    <div className={`spinner ${sizes[size]} ${colors[color]} ${className}`}>
      <div className="spinner-ring"></div>
    </div>
  );
}

export function LoadingOverlay({ isLoading, children, text = 'Loading...' }) {
  if (!isLoading) return children;

  return (
    <div className="loading-overlay-container">
      {children}
      <div className="loading-overlay">
        <Spinner size="large" />
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
}

export function ButtonSpinner() {
  return <Spinner size="small" color="white" className="button-spinner" />;
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <span className="page-loader-icon">💎</span>
        <Spinner size="large" />
        <p>Loading MiniNFT...</p>
      </div>
    </div>
  );
}

export default Spinner;
