/**
 * MintButton component with enhanced minting UI and states
 */
import React, { useState } from 'react';
import { useNFTContract } from '../hooks';
import Spinner from './Spinner';

export function MintButton({ 
  quantity = 1, 
  onSuccess, 
  onError,
  disabled = false,
  size = 'large',
  variant = 'primary',
  showPrice = true,
  className = '' 
}) {
  const { mint, mintPrice, isConnected, isPending } = useNFTContract();
  const [isHovered, setIsHovered] = useState(false);

  const handleMint = async () => {
    try {
      const result = await mint?.(quantity);
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }
  };

  const totalPrice = mintPrice ? (parseFloat(mintPrice) * quantity).toFixed(5) : '0.00001';
  const isDisabled = disabled || !isConnected || isPending;

  return (
    <button
      className={`mint-button mint-button--${size} mint-button--${variant} ${isPending ? 'mint-button--loading' : ''} ${className}`}
      onClick={handleMint}
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mint-button__content">
        {isPending ? (
          <>
            <Spinner size="small" />
            <span>Minting...</span>
          </>
        ) : (
          <>
            <MintIcon animated={isHovered} />
            <span>{quantity > 1 ? `Mint ${quantity} NFTs` : 'Mint NFT'}</span>
          </>
        )}
      </div>
      
      {showPrice && !isPending && (
        <div className="mint-button__price">
          <EthIcon />
          <span>{totalPrice} ETH</span>
        </div>
      )}
    </button>
  );
}

export function BatchMintButton({ 
  maxQuantity = 10, 
  onSuccess, 
  onError,
  className = '' 
}) {
  const [quantity, setQuantity] = useState(1);
  const { mint, mintPrice, isConnected, isPending, maxSupply, totalSupply } = useNFTContract();

  const remaining = maxSupply && totalSupply ? maxSupply - totalSupply : maxQuantity;
  const maxMint = Math.min(maxQuantity, remaining);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(maxMint, prev + delta)));
  };

  const handleMint = async () => {
    try {
      const result = await mint?.(quantity);
      onSuccess?.(result);
    } catch (error) {
      onError?.(error);
    }
  };

  const totalPrice = mintPrice ? (parseFloat(mintPrice) * quantity).toFixed(5) : (0.00001 * quantity).toFixed(5);

  return (
    <div className={`batch-mint ${className}`}>
      <div className="batch-mint__quantity">
        <button
          className="batch-mint__btn"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <MinusIcon />
        </button>
        
        <div className="batch-mint__value">
          <span className="batch-mint__number">{quantity}</span>
          <span className="batch-mint__label">NFT{quantity > 1 ? 's' : ''}</span>
        </div>

        <button
          className="batch-mint__btn"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= maxMint}
        >
          <PlusIcon />
        </button>
      </div>

      <button
        className={`batch-mint__submit ${isPending ? 'batch-mint__submit--loading' : ''}`}
        onClick={handleMint}
        disabled={!isConnected || isPending}
      >
        {isPending ? (
          <>
            <Spinner size="small" />
            <span>Minting...</span>
          </>
        ) : (
          <>
            <span>Mint for {totalPrice} ETH</span>
          </>
        )}
      </button>
    </div>
  );
}

function MintIcon({ animated = false }) {
  return (
    <svg 
      className={`mint-button__icon ${animated ? 'mint-button__icon--animated' : ''}`}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function EthIcon() {
  return (
    <svg className="mint-button__eth-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default MintButton;
