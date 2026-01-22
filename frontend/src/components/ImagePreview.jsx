/**
 * ImagePreview component for NFT image display with zoom
 */
import React, { useState, useRef } from 'react';

export function ImagePreview({ 
  src, 
  alt,
  fallback = '/placeholder-nft.png',
  enableZoom = true,
  enableFullscreen = true,
  className = '' 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!enableZoom || !isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const toggleFullscreen = () => {
    if (!enableFullscreen) return;

    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const imageSrc = hasError ? fallback : src;

  return (
    <>
      <div
        ref={containerRef}
        className={`image-preview ${isZoomed ? 'image-preview--zoomed' : ''} ${className}`}
        onMouseEnter={() => enableZoom && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {!isLoaded && (
          <div className="image-preview__skeleton">
            <div className="image-preview__skeleton-shimmer" />
          </div>
        )}

        <img
          src={imageSrc}
          alt={alt}
          className={`image-preview__image ${isLoaded ? 'image-preview__image--loaded' : ''}`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
          onLoad={handleLoad}
          onError={handleError}
        />

        <div className="image-preview__controls">
          {enableZoom && (
            <button
              className="image-preview__btn"
              onClick={() => setIsZoomed(!isZoomed)}
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
            </button>
          )}
          {enableFullscreen && (
            <button
              className="image-preview__btn"
              onClick={toggleFullscreen}
              title="Fullscreen"
            >
              <FullscreenIcon />
            </button>
          )}
        </div>
      </div>

      {isFullscreen && (
        <div className="image-preview__fullscreen" onClick={toggleFullscreen}>
          <img src={imageSrc} alt={alt} />
          <button className="image-preview__close" onClick={toggleFullscreen}>
            <CloseIcon />
          </button>
        </div>
      )}
    </>
  );
}

export function ImageGallery({ images = [], onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    onSelect?.(images[index], index);
  };

  return (
    <div className="image-gallery">
      <div className="image-gallery__main">
        <ImagePreview
          src={images[selectedIndex]?.src}
          alt={images[selectedIndex]?.alt || `Image ${selectedIndex + 1}`}
        />
      </div>
      
      {images.length > 1 && (
        <div className="image-gallery__thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`image-gallery__thumb ${selectedIndex === index ? 'image-gallery__thumb--active' : ''}`}
              onClick={() => handleSelect(index)}
            >
              <img src={image.src} alt={image.alt || `Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default ImagePreview;
