import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { MININFT_ABI, CONTRACT_ADDRESS } from '../contract';
import { GallerySkeleton } from './LoadingSkeleton';

function Gallery({ address, userBalance }) {
  const [userTokens, setUserTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Get user's tokens
  useEffect(() => {
    const fetchTokens = async () => {
      if (!address || !userBalance || Number(userBalance) === 0) {
        setUserTokens([]);
        return;
      }

      try {
        setIsLoading(true);
        const balance = Number(userBalance);
        const tokenIds = await Promise.all(
          Array.from({ length: balance }, (_, index) =>
            publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: MININFT_ABI,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, BigInt(index)],
            })
          )
        );

        setUserTokens(tokenIds.map((id) => Number(id)));
      } catch (error) {
        setUserTokens([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [address, userBalance, publicClient]);

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
      {isLoading ? (
        <GallerySkeleton />
      ) : (
        <div className="gallery-grid">
          {userTokens.map((tokenId) => (
            <div key={tokenId} className="nft-card">
              <div className="nft-placeholder">
                <span className="nft-icon">💎</span>
                <span className="nft-number">#{tokenId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
