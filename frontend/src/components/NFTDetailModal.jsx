import { useState } from 'react';
import Modal from './Modal';

function NFTDetailModal({ 
  tokenId, 
  isOpen, 
  onClose, 
  imageUrl,
  isFavorite,
  onToggleFavorite,
  onShare,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="nft-detail-modal">
        <div className="nft-detail-image-section">
          {imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="nft-detail-image-placeholder skeleton" />
              )}
              <img
                src={imageUrl}
                alt={`MiniNFT #${tokenId}`}
                className={`nft-detail-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="nft-detail-placeholder">
              <span className="nft-detail-icon">💎</span>
            </div>
          )}
        </div>
        
        <div className="nft-detail-info-section">
          <h2 className="nft-detail-title">MiniNFT #{tokenId}</h2>
          
          <div className="nft-detail-meta">
            <div className="nft-detail-meta-item">
              <span className="meta-label">Collection</span>
              <span className="meta-value">MiniNFT</span>
            </div>
            <div className="nft-detail-meta-item">
              <span className="meta-label">Token ID</span>
              <span className="meta-value">#{tokenId}</span>
            </div>
            <div className="nft-detail-meta-item">
              <span className="meta-label">Chain</span>
              <span className="meta-value">Base</span>
            </div>
          </div>
          
          <div className="nft-detail-actions">
            <button 
              className={`nft-action-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(tokenId)}
            >
              {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
            </button>
            
            <button 
              className="nft-action-btn"
              onClick={() => onShare?.(tokenId)}
            >
              📤 Share
            </button>
          </div>
          
          <div className="nft-detail-links">
            <a 
              href={`https://basescan.org/nft/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nft-external-link"
            >
              View on BaseScan →
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default NFTDetailModal;
