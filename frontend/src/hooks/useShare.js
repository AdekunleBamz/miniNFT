import { useCallback } from 'react';
import { CONTRACT_ADDRESS } from '../contract';

export function useShare() {
  const shareNFT = useCallback(async (tokenId) => {
    const shareData = {
      title: `MiniNFT #${tokenId}`,
      text: `Check out my MiniNFT #${tokenId} from the collection of 505 unique NFTs on Base!`,
      url: `https://basescan.org/token/${CONTRACT_ADDRESS}?a=${tokenId}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { success: true };
      } catch (error) {
        if (error.name !== 'AbortError') {
          return { success: false, error };
        }
        return { success: false, cancelled: true };
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        return { success: true, copied: true };
      } catch (error) {
        return { success: false, error };
      }
    }
  }, []);

  const shareCollection = useCallback(async () => {
    const shareData = {
      title: 'MiniNFT Collection',
      text: 'Check out the MiniNFT collection - 505 unique NFTs on Base Chain!',
      url: `https://basescan.org/token/${CONTRACT_ADDRESS}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { success: true };
      } catch (error) {
        if (error.name !== 'AbortError') {
          return { success: false, error };
        }
        return { success: false, cancelled: true };
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        return { success: true, copied: true };
      } catch (error) {
        return { success: false, error };
      }
    }
  }, []);

  const getTwitterShareUrl = useCallback((tokenId) => {
    const text = encodeURIComponent(
      `Just minted MiniNFT #${tokenId}! 🎉💎\n\nCheck out the collection of 505 unique NFTs on Base Chain!`
    );
    const url = encodeURIComponent(`https://basescan.org/token/${CONTRACT_ADDRESS}?a=${tokenId}`);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }, []);

  const getOpenSeaUrl = useCallback((tokenId) => {
    return `https://opensea.io/assets/base/${CONTRACT_ADDRESS}/${tokenId}`;
  }, []);

  return {
    shareNFT,
    shareCollection,
    getTwitterShareUrl,
    getOpenSeaUrl,
  };
}

export default useShare;
