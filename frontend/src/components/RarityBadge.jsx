/**
 * RarityBadge component to display NFT rarity tier
 */
import React from 'react';

const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: '#9ca3af',
    bgColor: 'rgba(156, 163, 175, 0.1)',
    icon: '●',
  },
  uncommon: {
    label: 'Uncommon',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    icon: '◆',
  },
  rare: {
    label: 'Rare',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: '★',
  },
  epic: {
    label: 'Epic',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    icon: '✦',
  },
  legendary: {
    label: 'Legendary',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '✧',
  },
};

export function RarityBadge({ rarity = 'common', size = 'medium', showIcon = true, className = '' }) {
  const config = RARITY_CONFIG[rarity.toLowerCase()] || RARITY_CONFIG.common;

  return (
    <span
      className={`rarity-badge rarity-badge--${size} rarity-badge--${rarity.toLowerCase()} ${className}`}
      style={{
        '--rarity-color': config.color,
        '--rarity-bg': config.bgColor,
      }}
    >
      {showIcon && <span className="rarity-badge__icon">{config.icon}</span>}
      <span className="rarity-badge__label">{config.label}</span>
    </span>
  );
}

export function RarityIndicator({ rarity = 'common', size = 16 }) {
  const config = RARITY_CONFIG[rarity.toLowerCase()] || RARITY_CONFIG.common;

  return (
    <div
      className="rarity-indicator"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${config.color}, ${config.color}88)`,
        boxShadow: `0 0 ${size / 2}px ${config.color}66`,
      }}
      title={config.label}
    />
  );
}

export function RarityProgress({ distribution = {} }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="rarity-progress">
      <div className="rarity-progress__bar">
        {Object.entries(RARITY_CONFIG).map(([key, config]) => {
          const count = distribution[key] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div
              key={key}
              className="rarity-progress__segment"
              style={{
                width: `${percentage}%`,
                background: config.color,
              }}
              title={`${config.label}: ${count} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="rarity-progress__legend">
        {Object.entries(RARITY_CONFIG).map(([key, config]) => (
          <div key={key} className="rarity-progress__legend-item">
            <span
              className="rarity-progress__legend-dot"
              style={{ background: config.color }}
            />
            <span className="rarity-progress__legend-label">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RarityBadge;
