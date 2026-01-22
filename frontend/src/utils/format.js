/**
 * Format utilities for the NFT app
 */

/**
 * Format a number to a compact string (1K, 1M, etc.)
 */
export const formatCompactNumber = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

/**
 * Format ETH value with proper decimals
 */
export const formatEth = (value, decimals = 6) => {
  if (!value) return '0';
  const num = parseFloat(value);
  if (num === 0) return '0';
  if (num < 0.000001) return '<0.000001';
  return num.toFixed(decimals).replace(/\.?0+$/, '');
};

/**
 * Format USD value
 */
export const formatUsd = (value) => {
  if (!value) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Truncate address with custom lengths
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format a date to relative time
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString();
};

/**
 * Format bytes to human readable size
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format token ID with padding
 */
export const formatTokenId = (id, totalSupply = 505) => {
  const digits = String(totalSupply).length;
  return String(id).padStart(digits, '0');
};

export default {
  formatCompactNumber,
  formatEth,
  formatUsd,
  truncateAddress,
  formatRelativeTime,
  formatBytes,
  formatPercentage,
  formatTokenId
};
