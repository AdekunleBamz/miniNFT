const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}) => {
  const getStyle = () => {
    const style = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };
  
  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={getStyle()}
      aria-hidden="true"
    />
  );
};

export const SkeletonText = ({ lines = 3, lastLineWidth = '60%' }) => {
  return (
    <div className="skeleton-text">
      {[...Array(lines)].map((_, index) => (
        <Skeleton 
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <Skeleton variant="rectangular" height={200} />
      <div className="skeleton-card-content">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <div className="skeleton-card-footer">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={100} />
        </div>
      </div>
    </div>
  );
};

export const NFTCardSkeleton = () => {
  return (
    <div className="nft-card-skeleton">
      <Skeleton variant="rectangular" height={250} className="nft-skeleton-image" />
      <div className="nft-skeleton-content">
        <Skeleton variant="text" width="70%" height={20} />
        <div className="nft-skeleton-row">
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="30%" height={16} />
        </div>
        <Skeleton variant="rectangular" height={40} className="nft-skeleton-button" />
      </div>
    </div>
  );
};

export default Skeleton;
