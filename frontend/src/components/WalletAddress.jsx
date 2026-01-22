import { useState } from 'react';

function WalletAddress({ address, truncate = true, showCopyButton = true }) {
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate 
    ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
    : address;

  const handleCopy = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!address) return null;

  return (
    <div className="wallet-address">
      <span className="wallet-address-text" title={address}>
        {displayAddress}
      </span>
      {showCopyButton && (
        <button 
          className="wallet-address-copy"
          onClick={handleCopy}
          aria-label="Copy address"
        >
          {copied ? '✓' : '📋'}
        </button>
      )}
    </div>
  );
}

export default WalletAddress;
