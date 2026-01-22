/**
 * Validation utilities for the NFT app
 */

/**
 * Check if a string is a valid Ethereum address
 */
export const isValidAddress = (address) => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Check if an address is a contract (basic check)
 */
export const isContractAddress = async (address, provider) => {
  if (!isValidAddress(address) || !provider) return false;
  try {
    const code = await provider.getBytecode({ address });
    return code && code !== '0x';
  } catch {
    return false;
  }
};

/**
 * Check if a string is a valid transaction hash
 */
export const isValidTxHash = (hash) => {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

/**
 * Validate token ID is within range
 */
export const isValidTokenId = (tokenId, maxSupply = 505) => {
  const id = parseInt(tokenId, 10);
  return !isNaN(id) && id >= 1 && id <= maxSupply;
};

/**
 * Validate ETH amount
 */
export const isValidEthAmount = (amount) => {
  if (!amount) return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num < 1000000;
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if URL is an IPFS URL
 */
export const isIpfsUrl = (url) => {
  if (!url) return false;
  return url.startsWith('ipfs://') || url.includes('/ipfs/');
};

/**
 * Check if user is connected to correct network
 */
export const isCorrectNetwork = (chainId, expectedChainId = 8453) => {
  return chainId === expectedChainId;
};

/**
 * Validate image file
 */
export const isValidImageFile = (file, maxSizeMb = 10) => {
  if (!file) return { valid: false, error: 'No file provided' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use JPG, PNG, GIF, or WebP' };
  }
  
  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File too large. Max size is ${maxSizeMb}MB` };
  }
  
  return { valid: true, error: null };
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export default {
  isValidAddress,
  isContractAddress,
  isValidTxHash,
  isValidTokenId,
  isValidEthAmount,
  isValidUrl,
  isIpfsUrl,
  isCorrectNetwork,
  isValidImageFile,
  isEmpty
};
