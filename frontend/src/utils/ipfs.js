/**
 * IPFS utilities for NFT metadata
 */

// IPFS Gateway configurations
export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://w3s.link/ipfs/',
  'https://dweb.link/ipfs/',
];

// Default gateway
export const DEFAULT_GATEWAY = IPFS_GATEWAYS[0];

/**
 * Check if a URI is an IPFS URI
 */
export function isIPFSUri(uri) {
  if (!uri) return false;
  return uri.startsWith('ipfs://') || uri.startsWith('Qm') || uri.startsWith('bafy');
}

/**
 * Extract CID from IPFS URI
 */
export function extractCID(uri) {
  if (!uri) return null;
  
  // Handle ipfs:// protocol
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', '');
  }
  
  // Handle gateway URLs
  for (const gateway of IPFS_GATEWAYS) {
    if (uri.includes(gateway)) {
      return uri.split(gateway)[1];
    }
  }
  
  // Handle direct CID
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return uri;
  }
  
  return null;
}

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(uri, gateway = DEFAULT_GATEWAY) {
  if (!uri) return '';
  
  // Already HTTP
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  const cid = extractCID(uri);
  if (!cid) return uri;
  
  return `${gateway}${cid}`;
}

/**
 * Convert HTTP gateway URL back to IPFS URI
 */
export function httpToIPFS(url) {
  if (!url) return '';
  
  for (const gateway of IPFS_GATEWAYS) {
    if (url.includes(gateway)) {
      const cid = url.split(gateway)[1];
      return `ipfs://${cid}`;
    }
  }
  
  return url;
}

/**
 * Generate metadata URI for token ID
 */
export function getMetadataUri(baseUri, tokenId) {
  if (!baseUri) return '';
  
  // Remove trailing slash if present
  const cleanBase = baseUri.replace(/\/$/, '');
  
  return `${cleanBase}/${tokenId}`;
}

/**
 * Generate image URI from metadata
 */
export function getImageUri(metadata, gateway = DEFAULT_GATEWAY) {
  if (!metadata?.image) return '';
  return ipfsToHttp(metadata.image, gateway);
}

/**
 * Fetch metadata from IPFS with fallback gateways
 */
export async function fetchMetadata(uri, options = {}) {
  const { timeout = 5000, retries = 3 } = options;
  
  // Try each gateway
  for (let i = 0; i < IPFS_GATEWAYS.length && i < retries; i++) {
    const gateway = IPFS_GATEWAYS[i];
    const url = ipfsToHttp(uri, gateway);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error.message);
      continue;
    }
  }
  
  throw new Error(`Failed to fetch metadata from ${uri}`);
}

/**
 * Validate metadata structure
 */
export function validateMetadata(metadata) {
  const errors = [];
  
  if (!metadata) {
    errors.push('Metadata is null or undefined');
    return { valid: false, errors };
  }
  
  if (!metadata.name) {
    errors.push('Missing required field: name');
  }
  
  if (!metadata.image) {
    errors.push('Missing required field: image');
  }
  
  if (metadata.attributes && !Array.isArray(metadata.attributes)) {
    errors.push('Attributes must be an array');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate placeholder metadata
 */
export function generatePlaceholderMetadata(tokenId) {
  return {
    name: `MiniNFT #${tokenId}`,
    description: `A unique MiniNFT from the collection`,
    image: 'ipfs://placeholder',
    attributes: [],
  };
}

/**
 * Pin content to IPFS (requires Pinata API key)
 */
export async function pinToIPFS(content, options = {}) {
  const { apiKey, secretKey, name } = options;
  
  if (!apiKey || !secretKey) {
    throw new Error('Pinata API credentials required');
  }
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: apiKey,
      pinata_secret_api_key: secretKey,
    },
    body: JSON.stringify({
      pinataContent: content,
      pinataMetadata: {
        name: name || 'MiniNFT Metadata',
      },
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to pin to IPFS');
  }
  
  const data = await response.json();
  return {
    cid: data.IpfsHash,
    uri: `ipfs://${data.IpfsHash}`,
    url: `${DEFAULT_GATEWAY}${data.IpfsHash}`,
  };
}

export default {
  IPFS_GATEWAYS,
  DEFAULT_GATEWAY,
  isIPFSUri,
  extractCID,
  ipfsToHttp,
  httpToIPFS,
  getMetadataUri,
  getImageUri,
  fetchMetadata,
  validateMetadata,
  generatePlaceholderMetadata,
  pinToIPFS,
};
