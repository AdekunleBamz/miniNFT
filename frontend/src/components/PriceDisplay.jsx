/**
 * PriceDisplay component for ETH and USD prices
 */
import React, { useState, useEffect } from 'react';

export function PriceDisplay({ 
  ethAmount, 
  showUsd = true, 
  showEthIcon = true,
  size = 'medium',
  className = '' 
}) {
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    if (showUsd) {
      fetchEthPrice().then(setEthPrice);
    }
  }, [showUsd]);

  const usdAmount = ethPrice ? (parseFloat(ethAmount) * ethPrice).toFixed(2) : null;

  return (
    <div className={`price-display price-display--${size} ${className}`}>
      <div className="price-display__eth">
        {showEthIcon && <EthIcon />}
        <span className="price-display__amount">{ethAmount}</span>
        <span className="price-display__symbol">ETH</span>
      </div>
      
      {showUsd && usdAmount && (
        <div className="price-display__usd">
          <span className="price-display__usd-amount">${usdAmount}</span>
          <span className="price-display__usd-label">USD</span>
        </div>
      )}
    </div>
  );
}

export function PriceTag({ 
  ethAmount, 
  label, 
  variant = 'default',
  className = '' 
}) {
  return (
    <div className={`price-tag price-tag--${variant} ${className}`}>
      {label && <span className="price-tag__label">{label}</span>}
      <div className="price-tag__value">
        <EthIcon />
        <span>{ethAmount}</span>
      </div>
    </div>
  );
}

export function PriceChange({ 
  currentPrice, 
  previousPrice, 
  showPercentage = true,
  className = '' 
}) {
  const change = currentPrice - previousPrice;
  const percentageChange = previousPrice > 0 
    ? ((change / previousPrice) * 100).toFixed(2) 
    : 0;
  
  const isPositive = change >= 0;
  const direction = isPositive ? 'up' : 'down';

  return (
    <div className={`price-change price-change--${direction} ${className}`}>
      <span className="price-change__icon">
        {isPositive ? '↑' : '↓'}
      </span>
      <span className="price-change__value">
        {isPositive ? '+' : ''}{change.toFixed(5)} ETH
      </span>
      {showPercentage && (
        <span className="price-change__percentage">
          ({isPositive ? '+' : ''}{percentageChange}%)
        </span>
      )}
    </div>
  );
}

export function FloorPrice({ 
  price, 
  collectionName,
  lastUpdated,
  className = '' 
}) {
  return (
    <div className={`floor-price ${className}`}>
      <div className="floor-price__header">
        <span className="floor-price__label">Floor Price</span>
        {collectionName && (
          <span className="floor-price__collection">{collectionName}</span>
        )}
      </div>
      <div className="floor-price__value">
        <EthIcon />
        <span className="floor-price__amount">{price}</span>
        <span className="floor-price__symbol">ETH</span>
      </div>
      {lastUpdated && (
        <span className="floor-price__updated">
          Updated {formatTimeAgo(lastUpdated)}
        </span>
      )}
    </div>
  );
}

async function fetchEthPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum?.usd || null;
  } catch (error) {
    console.error('Failed to fetch ETH price:', error);
    return null;
  }
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function EthIcon() {
  return (
    <svg className="eth-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
    </svg>
  );
}

export default PriceDisplay;
