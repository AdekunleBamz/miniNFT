import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { ButtonSpinner, Tooltip } from './index';
import { MININFT_ABI, CONTRACT_ADDRESS, MINT_PRICE } from '../contract';

function MintCard({ 
  isConnected, 
  remaining, 
  writeContract, 
  isPending, 
  isConfirming, 
  isSuccess, 
  hash, 
  writeError 
}) {
  const [mintQuantity, setMintQuantity] = useState(1);

  const handleMint = () => {
    const value = parseEther(MINT_PRICE) * BigInt(mintQuantity);
    
    if (mintQuantity === 1) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MININFT_ABI,
        functionName: 'mint',
        value,
      });
    } else {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MININFT_ABI,
        functionName: 'mintBatch',
        args: [mintQuantity],
        value,
      });
    }
  };

  return (
    <div className="mint-card" id="mint">
      <h2 className="mint-title">Mint Your NFT</h2>
      
      {!isConnected ? (
        <div className="connect-prompt">
          <p>Connect your wallet to mint</p>
          <ConnectButton />
        </div>
      ) : remaining === 0 ? (
        <div className="sold-out">
          <span className="sold-out-icon">🎉</span>
          <p>Sold Out!</p>
        </div>
      ) : (
        <>
          <div className="quantity-selector">
            <Tooltip content="Minimum 1 NFT" position="top">
              <button 
                className="quantity-btn"
                onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
                disabled={mintQuantity <= 1}
              >
                −
              </button>
            </Tooltip>
            <span className="quantity-value">{mintQuantity}</span>
            <Tooltip content="Maximum 10 NFTs per batch" position="top">
              <button 
                className="quantity-btn"
                onClick={() => setMintQuantity(Math.min(10, mintQuantity + 1, remaining))}
                disabled={mintQuantity >= 10 || mintQuantity >= remaining}
              >
                +
              </button>
            </Tooltip>
          </div>

          <div className="total-price">
            Total: <span className="price-value">{(parseFloat(MINT_PRICE) * mintQuantity).toFixed(5)} ETH</span>
          </div>

          <button 
            className="mint-btn"
            onClick={handleMint}
            disabled={isPending || isConfirming}
          >
            {isPending && (
              <>
                Confirm in Wallet <ButtonSpinner />
              </>
            )}
            {isConfirming && !isPending && (
              <>
                Minting... <ButtonSpinner />
              </>
            )}
            {!isPending && !isConfirming && `🎨 Mint ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}`}
          </button>

          {isSuccess && (
            <div className="success-message">
              ✅ Successfully minted! 
              <a 
                href={`https://basescan.org/tx/${hash}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on BaseScan →
              </a>
            </div>
          )}

          {writeError && (
            <div className="error-message">
              ❌ {writeError.shortMessage || writeError.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MintCard;
