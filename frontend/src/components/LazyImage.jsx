import { useState, useRef, useEffect } from 'react';

/**
 * LazyImage component with intersection observer and placeholder
 */
function LazyImage({ 
  src, 
  alt = '', 
  placeholder,
  fallback = '/placeholder.svg',
  className = '',
  aspectRatio,
  blur = true,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const style = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-wrapper ${isLoaded ? 'loaded' : ''} ${className}`}
      style={style}
    >
      {placeholder && !isLoaded && (
        <div className="lazy-image-placeholder">{placeholder}</div>
      )}
      {isInView && (
        <img
          src={hasError ? fallback : src}
          alt={alt}
          className={`lazy-image ${blur && !isLoaded ? 'blur' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}

export default LazyImage;
