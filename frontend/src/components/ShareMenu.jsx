function ShareMenu({ tokenId, onClose, getTwitterUrl, getOpenSeaUrl, onNativeShare }) {
  const handleShare = async (type) => {
    switch (type) {
      case 'twitter':
        window.open(getTwitterUrl(tokenId), '_blank', 'noopener,noreferrer');
        break;
      case 'opensea':
        window.open(getOpenSeaUrl(tokenId), '_blank', 'noopener,noreferrer');
        break;
      case 'native':
        await onNativeShare(tokenId);
        break;
      default:
        break;
    }
    onClose?.();
  };

  return (
    <div className="share-menu">
      <div className="share-menu-header">
        <h4>Share NFT #{tokenId}</h4>
        <button className="share-menu-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      
      <div className="share-menu-options">
        <button 
          className="share-option"
          onClick={() => handleShare('twitter')}
        >
          <span className="share-option-icon">🐦</span>
          <span className="share-option-label">Share on X</span>
        </button>
        
        <button 
          className="share-option"
          onClick={() => handleShare('opensea')}
        >
          <span className="share-option-icon">🌊</span>
          <span className="share-option-label">View on OpenSea</span>
        </button>
        
        <button 
          className="share-option"
          onClick={() => handleShare('native')}
        >
          <span className="share-option-icon">📤</span>
          <span className="share-option-label">Share Link</span>
        </button>
      </div>
    </div>
  );
}

export default ShareMenu;
