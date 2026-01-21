function LoadingSkeleton({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius,
        background: 'linear-gradient(90deg, rgba(123, 63, 228, 0.1) 25%, rgba(123, 63, 228, 0.2) 50%, rgba(123, 63, 228, 0.1) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }}
    />
  );
}

export function StatsSkeleton() {
  return (
    <div className="stats-container">
      {[1, 2, 3].map((i) => (
        <div key={i} className="stat-card">
          <LoadingSkeleton height="40px" width="80px" className="mx-auto" />
          <LoadingSkeleton height="16px" width="60px" className="mx-auto mt-2" />
        </div>
      ))}
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="gallery-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="nft-card">
          <LoadingSkeleton height="200px" borderRadius="12px" />
          <div style={{ padding: '1rem' }}>
            <LoadingSkeleton height="20px" width="60%" />
            <LoadingSkeleton height="16px" width="40%" className="mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MintCardSkeleton() {
  return (
    <div className="mint-card">
      <LoadingSkeleton height="32px" width="50%" className="mx-auto" />
      <LoadingSkeleton height="24px" width="80%" className="mx-auto mt-4" />
      <LoadingSkeleton height="48px" width="100%" className="mt-4" borderRadius="12px" />
    </div>
  );
}

export default LoadingSkeleton;
