/**
 * Network configuration for supported chains
 */

export const NETWORKS = {
  // Base Mainnet
  base: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://mainnet.base.org',
      public: 'https://mainnet.base.org',
      infura: 'https://base-mainnet.infura.io/v3/',
      alchemy: 'https://base-mainnet.g.alchemy.com/v2/',
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://basescan.org',
        apiUrl: 'https://api.basescan.org/api',
      },
    },
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 5022,
      },
    },
    testnet: false,
  },

  // Base Sepolia Testnet
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://sepolia.base.org',
      public: 'https://sepolia.base.org',
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://sepolia.basescan.org',
        apiUrl: 'https://api-sepolia.basescan.org/api',
      },
    },
    testnet: true,
    faucets: [
      'https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet',
    ],
  },
};

/**
 * Get network by chain ID
 */
export function getNetworkById(chainId) {
  return Object.values(NETWORKS).find((network) => network.id === chainId);
}

/**
 * Get network by name
 */
export function getNetworkByName(name) {
  return NETWORKS[name] || null;
}

/**
 * Check if chain ID is supported
 */
export function isSupportedChain(chainId) {
  return Object.values(NETWORKS).some((network) => network.id === chainId);
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerTxUrl(chainId, txHash) {
  const network = getNetworkById(chainId);
  if (!network) return null;
  return `${network.blockExplorers.default.url}/tx/${txHash}`;
}

/**
 * Get explorer URL for address
 */
export function getExplorerAddressUrl(chainId, address) {
  const network = getNetworkById(chainId);
  if (!network) return null;
  return `${network.blockExplorers.default.url}/address/${address}`;
}

/**
 * Get explorer URL for token
 */
export function getExplorerTokenUrl(chainId, tokenAddress, tokenId) {
  const network = getNetworkById(chainId);
  if (!network) return null;
  return `${network.blockExplorers.default.url}/token/${tokenAddress}?a=${tokenId}`;
}

/**
 * Get explorer URL for NFT
 */
export function getExplorerNFTUrl(chainId, contractAddress, tokenId) {
  const network = getNetworkById(chainId);
  if (!network) return null;
  return `${network.blockExplorers.default.url}/nft/${contractAddress}/${tokenId}`;
}

/**
 * Get RPC URL for chain
 */
export function getRpcUrl(chainId, provider = 'default') {
  const network = getNetworkById(chainId);
  if (!network) return null;
  return network.rpcUrls[provider] || network.rpcUrls.default;
}

/**
 * Default supported chain IDs
 */
export const SUPPORTED_CHAIN_IDS = Object.values(NETWORKS).map((n) => n.id);

/**
 * Default chain ID (Base mainnet)
 */
export const DEFAULT_CHAIN_ID = 8453;

/**
 * Production chain ID
 */
export const PRODUCTION_CHAIN_ID = 8453;

/**
 * Test chain ID
 */
export const TEST_CHAIN_ID = 84532;

export default NETWORKS;
