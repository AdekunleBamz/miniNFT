function LoadingDots({ size = 'medium', color = 'primary' }) {
  return (
    <span className={`loading-dots loading-dots-${size} loading-dots-${color}`}>
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </span>
  );
}

export default LoadingDots;
