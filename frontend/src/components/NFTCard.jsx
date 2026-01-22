import FavoriteButton from './FavoriteButton';

function NFTCard({ 
  tokenId, 
  isFavorite, 
  onToggleFavorite,
  onShare,
  onView,
  imageUrl,
  showActions = true,
}) {
  return (
    <div className="nft-card" onClick={() => onView?.(tokenId)}>
      <div className="nft-image-wrapper">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`MiniNFT #${tokenId}`}
            className="nft-image"
            loading="lazy"
          />
        ) : (
          <div className="nft-placeholder">
            <span className="nft-icon">💎</span>
          </div>
        )}
        
        {showActions && (
          <div className="nft-card-actions">
            <FavoriteButton
              tokenId={tokenId}
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
            />
            {onShare && (
              <button
                className="nft-share-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(tokenId);
                }}
                aria-label="Share NFT"
                title="Share"
              >
                📤
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="nft-card-info">
        <span className="nft-number">#{tokenId}</span>
        <span className="nft-name">MiniNFT</span>
      </div>
    </div>
  );
}

export default NFTCard;
