/**
 * Application-wide constants
 */

// Contract Configuration
export const CONTRACT_CONFIG = {
  address: '0x...',  // Will be imported from contract.js
  chainId: 8453,
  chainName: 'Base',
  maxSupply: 505,
  mintPrice: 0.00001,
  maxPerWallet: 10,
  maxBatchMint: 5
};

// API Endpoints
export const API_ENDPOINTS = {
  metadata: '/api/metadata',
  holders: '/api/holders',
  stats: '/api/stats'
};

// External URLs
export const EXTERNAL_URLS = {
  baseScan: 'https://basescan.org',
  openSea: 'https://opensea.io',
  twitter: 'https://twitter.com',
  discord: 'https://discord.gg',
  github: 'https://github.com'
};

// UI Constants
export const UI = {
  animationDuration: 300,
  toastDuration: 5000,
  debounceDelay: 300,
  itemsPerPage: 12,
  maxRecentMints: 10
};

// Breakpoints
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Error Messages
export const ERROR_MESSAGES = {
  walletNotConnected: 'Please connect your wallet to continue',
  wrongNetwork: 'Please switch to Base network',
  insufficientFunds: 'Insufficient funds for this transaction',
  mintFailed: 'Minting failed. Please try again',
  transferFailed: 'Transfer failed. Please try again',
  userRejected: 'Transaction was rejected',
  unknown: 'An unexpected error occurred'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  mintSuccess: 'NFT minted successfully! 🎉',
  transferSuccess: 'NFT transferred successfully!',
  copied: 'Copied to clipboard!',
  favoriteAdded: 'Added to favorites',
  favoriteRemoved: 'Removed from favorites'
};

// Theme Colors
export const COLORS = {
  primary: '#7b3fe4',
  primaryDark: '#5c2eb3',
  primaryLight: '#9d6aef',
  secondary: '#00d4ff',
  success: '#00ff88',
  error: '#ff4757',
  warning: '#ffa502'
};

// Storage Keys
export const STORAGE_KEYS = {
  theme: 'theme',
  favorites: 'favorites',
  sound: 'soundEnabled',
  recentSearches: 'recentSearches',
  viewMode: 'viewMode'
};

// Rarity Tiers
export const RARITY_TIERS = {
  common: { name: 'Common', color: '#9ca3af' },
  uncommon: { name: 'Uncommon', color: '#22c55e' },
  rare: { name: 'Rare', color: '#3b82f6' },
  epic: { name: 'Epic', color: '#a855f7' },
  legendary: { name: 'Legendary', color: '#f97316' }
};

// Transaction States
export const TX_STATES = {
  idle: 'idle',
  pending: 'pending',
  confirming: 'confirming',
  success: 'success',
  error: 'error'
};

export default {
  CONTRACT_CONFIG,
  API_ENDPOINTS,
  EXTERNAL_URLS,
  UI,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLORS,
  STORAGE_KEYS,
  RARITY_TIERS,
  TX_STATES
};
