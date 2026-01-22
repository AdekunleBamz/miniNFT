/**
 * Web3 utility functions for blockchain interactions
 */
import { parseEther, formatEther, isAddress, getAddress } from 'viem';

/**
 * Check if a string is a valid Ethereum address
 */
export function isValidAddress(address) {
  if (!address) return false;
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Normalize an Ethereum address to checksum format
 */
export function normalizeAddress(address) {
  if (!isValidAddress(address)) return null;
  try {
    return getAddress(address);
  } catch {
    return null;
  }
}

/**
 * Convert ETH string to Wei
 */
export function toWei(ethAmount) {
  try {
    return parseEther(String(ethAmount));
  } catch {
    return null;
  }
}

/**
 * Convert Wei to ETH string
 */
export function fromWei(weiAmount) {
  try {
    return formatEther(weiAmount);
  } catch {
    return '0';
  }
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(txHash, chainId = 8453) {
  const explorers = {
    1: 'https://etherscan.io/tx/',
    8453: 'https://basescan.org/tx/',
    84532: 'https://sepolia.basescan.org/tx/',
    11155111: 'https://sepolia.etherscan.io/tx/',
  };
  return `${explorers[chainId] || explorers[8453]}${txHash}`;
}

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(address, chainId = 8453) {
  const explorers = {
    1: 'https://etherscan.io/address/',
    8453: 'https://basescan.org/address/',
    84532: 'https://sepolia.basescan.org/address/',
    11155111: 'https://sepolia.etherscan.io/address/',
  };
  return `${explorers[chainId] || explorers[8453]}${address}`;
}

/**
 * Get explorer URL for a token
 */
export function getExplorerTokenUrl(contractAddress, tokenId, chainId = 8453) {
  const explorers = {
    1: 'https://etherscan.io/token/',
    8453: 'https://basescan.org/token/',
    84532: 'https://sepolia.basescan.org/token/',
    11155111: 'https://sepolia.etherscan.io/token/',
  };
  return `${explorers[chainId] || explorers[8453]}${contractAddress}?a=${tokenId}`;
}

/**
 * Get OpenSea URL for an NFT
 */
export function getOpenSeaUrl(contractAddress, tokenId, chainId = 8453) {
  const chainSlug = {
    1: 'ethereum',
    8453: 'base',
    84532: 'base-sepolia',
  };
  const slug = chainSlug[chainId] || 'base';
  return `https://opensea.io/assets/${slug}/${contractAddress}/${tokenId}`;
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPrice) {
  if (!gasPrice) return '0';
  const gwei = Number(gasPrice) / 1e9;
  return gwei.toFixed(2);
}

/**
 * Estimate gas cost in ETH
 */
export function estimateGasCost(gasLimit, gasPrice) {
  if (!gasLimit || !gasPrice) return '0';
  const costWei = BigInt(gasLimit) * BigInt(gasPrice);
  return fromWei(costWei);
}

/**
 * Parse contract error message
 */
export function parseContractError(error) {
  const message = error?.message || error?.toString() || 'Unknown error';
  
  // Common error patterns
  const errorPatterns = [
    { pattern: /insufficient funds/i, message: 'Insufficient funds for transaction' },
    { pattern: /user rejected/i, message: 'Transaction was rejected' },
    { pattern: /user denied/i, message: 'Transaction was denied' },
    { pattern: /already minted/i, message: 'This NFT has already been minted' },
    { pattern: /max supply/i, message: 'Maximum supply reached' },
    { pattern: /sold out/i, message: 'Collection is sold out' },
    { pattern: /not enough eth/i, message: 'Insufficient ETH for mint' },
    { pattern: /execution reverted/i, message: 'Transaction failed' },
    { pattern: /nonce too low/i, message: 'Transaction nonce is too low' },
    { pattern: /gas too low/i, message: 'Gas limit is too low' },
  ];

  for (const { pattern, message: friendlyMessage } of errorPatterns) {
    if (pattern.test(message)) {
      return friendlyMessage;
    }
  }

  // Extract revert reason if present
  const revertMatch = message.match(/reason="([^"]+)"/);
  if (revertMatch) {
    return revertMatch[1];
  }

  // Return truncated message
  return message.length > 100 ? message.slice(0, 100) + '...' : message;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(publicClient, hash, confirmations = 1) {
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
  });
  return receipt;
}

/**
 * Check if connected to the correct network
 */
export function isCorrectNetwork(chainId, expectedChainId = 8453) {
  return chainId === expectedChainId;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId) {
  const networks = {
    1: 'Ethereum',
    8453: 'Base',
    84532: 'Base Sepolia',
    11155111: 'Sepolia',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
  };
  return networks[chainId] || `Chain ${chainId}`;
}

/**
 * Get network icon color
 */
export function getNetworkColor(chainId) {
  const colors = {
    1: '#627EEA',
    8453: '#0052FF',
    84532: '#0052FF',
    11155111: '#627EEA',
    137: '#8247E5',
    42161: '#28A0F0',
    10: '#FF0420',
  };
  return colors[chainId] || '#888888';
}

export default {
  isValidAddress,
  normalizeAddress,
  toWei,
  fromWei,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getExplorerTokenUrl,
  getOpenSeaUrl,
  formatGasPrice,
  estimateGasCost,
  parseContractError,
  waitForTransaction,
  isCorrectNetwork,
  getNetworkName,
  getNetworkColor,
};
