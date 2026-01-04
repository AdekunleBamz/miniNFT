import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { MININFT_ABI, CONTRACT_ADDRESS } from '../contract';

function Gallery({ address, userBalance }) {
  const [userTokens, setUserTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);

  // Get user's tokens
  useEffect(() => {
    const fetchTokens = async () => {
      if (!address || !userBalance || userBalance === 0) {
        setUserTokens([]);
        return;
      }
      // Token IDs will be fetched via events or enumeration
    };
    fetchTokens();
  }, [address, userBalance]);

  if (!address) return null;
  if (!userBalance || Number(userBalance) === 0) {
    return (
      <div className="gallery-section" id="gallery">
        <h2 className="section-title">Your Collection</h2>
        <div className="empty-gallery">
          <p>You don't own any MiniNFTs yet</p>
          <a href="#mint" className="mint-link">Mint your first NFT →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-section" id="gallery">
      <h2 className="section-title">Your Collection</h2>
      <p className="gallery-count">You own {Number(userBalance)} MiniNFT{Number(userBalance) > 1 ? 's' : ''}</p>
      <div className="gallery-grid">
        {Array.from({ length: Number(userBalance) }, (_, i) => (
          <div key={i} className="nft-card">
            <div className="nft-placeholder">
              <span className="nft-icon">��</span>
              <span className="nft-number">#{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
