/**
 * NFT metadata and IPFS utilities
 */

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

/**
 * Convert IPFS URI to HTTP URL
 */
export const ipfsToHttp = (uri, gatewayIndex = 0) => {
  if (!uri) return null;
  
  // Already HTTP
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  // IPFS protocol
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    return IPFS_GATEWAYS[gatewayIndex] + cid;
  }
  
  // Raw CID
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return IPFS_GATEWAYS[gatewayIndex] + uri;
  }
  
  return uri;
};

/**
 * Fetch NFT metadata from URI
 */
export const fetchMetadata = async (tokenUri) => {
  const httpUri = ipfsToHttp(tokenUri);
  if (!httpUri) return null;
  
  try {
    const response = await fetch(httpUri);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    
    const metadata = await response.json();
    
    // Convert image to HTTP if needed
    if (metadata.image) {
      metadata.image = ipfsToHttp(metadata.image);
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

/**
 * Generate placeholder image URL
 */
export const getPlaceholderImage = (tokenId, size = 400) => {
  return `https://picsum.photos/seed/${tokenId}/${size}/${size}`;
};

/**
 * Generate gradient avatar based on address
 */
export const getAddressGradient = (address) => {
  if (!address) return 'linear-gradient(135deg, #7b3fe4, #00d4ff)';
  
  const hash = address.slice(2, 14);
  const hue1 = parseInt(hash.slice(0, 4), 16) % 360;
  const hue2 = (hue1 + 60) % 360;
  
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`;
};

/**
 * Parse NFT attributes from metadata
 */
export const parseAttributes = (attributes) => {
  if (!Array.isArray(attributes)) return {};
  
  return attributes.reduce((acc, attr) => {
    if (attr.trait_type && attr.value !== undefined) {
      acc[attr.trait_type] = attr.value;
    }
    return acc;
  }, {});
};

/**
 * Calculate rarity score based on attributes
 */
export const calculateRarity = (attributes, totalSupply = 505) => {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    return { score: 0, rank: 'Common' };
  }
  
  // Simplified rarity calculation
  const traitCount = attributes.length;
  const baseScore = traitCount * 10;
  
  let rank = 'Common';
  if (baseScore >= 80) rank = 'Legendary';
  else if (baseScore >= 60) rank = 'Epic';
  else if (baseScore >= 40) rank = 'Rare';
  else if (baseScore >= 20) rank = 'Uncommon';
  
  return { score: baseScore, rank };
};

/**
 * Get OpenSea URL for NFT
 */
export const getOpenSeaUrl = (contractAddress, tokenId, chainId = 8453) => {
  const baseUrl = chainId === 1 
    ? 'https://opensea.io' 
    : 'https://opensea.io/assets/base';
  return `${baseUrl}/${contractAddress}/${tokenId}`;
};

/**
 * Get BaseScan URL for transaction
 */
export const getBaseScanUrl = (hash, type = 'tx') => {
  const base = 'https://basescan.org';
  return `${base}/${type}/${hash}`;
};

export default {
  ipfsToHttp,
  fetchMetadata,
  getPlaceholderImage,
  getAddressGradient,
  parseAttributes,
  calculateRarity,
  getOpenSeaUrl,
  getBaseScanUrl,
  IPFS_GATEWAYS
};
