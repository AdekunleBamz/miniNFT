/**
 * Collection stats display component
 */
import React from 'react';
import { useNFTContract } from '../hooks';

export function CollectionStats({ layout = 'horizontal', showProgress = true }) {
  const { totalSupply, maxSupply, mintPrice } = useNFTContract();

  const stats = [
    {
      label: 'Total Minted',
      value: totalSupply ?? '---',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      label: 'Max Supply',
      value: maxSupply ?? '505',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: 'Mint Price',
      value: mintPrice ? `${mintPrice} ETH` : '0.00001 ETH',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Remaining',
      value: totalSupply && maxSupply ? maxSupply - totalSupply : '---',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const progress = totalSupply && maxSupply 
    ? ((totalSupply / maxSupply) * 100).toFixed(1) 
    : 0;

  return (
    <div className={`collection-stats collection-stats--${layout}`}>
      <div className="collection-stats__grid">
        {stats.map((stat, index) => (
          <div key={index} className="collection-stats__item">
            <div className="collection-stats__icon">{stat.icon}</div>
            <div className="collection-stats__content">
              <span className="collection-stats__value">{stat.value}</span>
              <span className="collection-stats__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {showProgress && (
        <div className="collection-stats__progress">
          <div className="collection-stats__progress-header">
            <span>Collection Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="collection-stats__progress-bar">
            <div
              className="collection-stats__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function StatCard({ label, value, icon, trend, trendValue, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
}

export function LiveMintFeed({ mints = [] }) {
  return (
    <div className="live-mint-feed">
      <div className="live-mint-feed__header">
        <div className="live-mint-feed__indicator" />
        <span>Live Mints</span>
      </div>
      <div className="live-mint-feed__list">
        {mints.length === 0 ? (
          <div className="live-mint-feed__empty">
            No recent mints
          </div>
        ) : (
          mints.map((mint, index) => (
            <div key={index} className="live-mint-feed__item">
              <div className="live-mint-feed__avatar" style={{ background: generateGradient(mint.minter) }} />
              <div className="live-mint-feed__info">
                <span className="live-mint-feed__minter">
                  {truncateAddress(mint.minter)}
                </span>
                <span className="live-mint-feed__token">
                  minted #{mint.tokenId}
                </span>
              </div>
              <span className="live-mint-feed__time">
                {formatTimeAgo(mint.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function generateGradient(address) {
  const seed = parseInt(address?.slice(2, 10) || '0', 16);
  const hue = seed % 360;
  return `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${(hue + 40) % 360}, 70%, 50%))`;
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default CollectionStats;
