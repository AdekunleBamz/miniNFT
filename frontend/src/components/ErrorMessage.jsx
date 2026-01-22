function ErrorMessage({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  retryLabel = 'Try Again',
}) {
  return (
    <div className="error-state">
      <span className="error-state-icon">⚠️</span>
      <h3 className="error-state-title">{title}</h3>
      {message && (
        <p className="error-state-message">{message}</p>
      )}
      {onRetry && (
        <button className="error-state-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
