/**
 * Contract Constants
 * 
 * Centralized constants for the MiniNFT smart contract.
 * Includes addresses, ABIs, function selectors, and configuration.
 */

import { parseEther } from 'viem';

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  8453: '0x0000000000000000000000000000000000000000', // To be updated after deployment
  
  // Base Sepolia Testnet
  84532: '0x0000000000000000000000000000000000000000', // To be updated after deployment
  
  // Local development (Anvil)
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
};

// Get contract address for a given chain ID
export function getContractAddress(chainId) {
  return CONTRACT_ADDRESSES[chainId] || null;
}

// Contract configuration
export const CONTRACT_CONFIG = {
  // Collection limits
  MAX_SUPPLY: 505,
  MAX_BATCH_SIZE: 10,
  MAX_BULK_TRANSFER: 50,
  MAX_BULK_METADATA_UPDATE: 100,
  
  // Pricing
  MINT_PRICE: parseEther('0.00001'),
  MINT_PRICE_FORMATTED: '0.00001',
  MINT_PRICE_DISPLAY: '0.00001 ETH',
  
  // Metadata
  DEFAULT_BASE_URI: 'ipfs://',
  
  // Gas limits (estimated)
  GAS_LIMITS: {
    mint: 150000n,
    mintBatch: 300000n,
    transfer: 65000n,
    bulkTransfer: 500000n,
    approve: 50000n,
    setApprovalForAll: 50000n,
    setBaseURI: 50000n,
    withdraw: 30000n
  }
};

// Function selectors (first 4 bytes of keccak256 hash)
export const FUNCTION_SELECTORS = {
  // ERC721 Standard
  balanceOf: '0x70a08231',
  ownerOf: '0x6352211e',
  approve: '0x095ea7b3',
  getApproved: '0x081812fc',
  setApprovalForAll: '0xa22cb465',
  isApprovedForAll: '0xe985e9c5',
  transferFrom: '0x23b872dd',
  safeTransferFrom: '0x42842e0e',
  safeTransferFromWithData: '0xb88d4fde',
  
  // ERC721Enumerable
  totalSupply: '0x18160ddd',
  tokenByIndex: '0x4f6ccce7',
  tokenOfOwnerByIndex: '0x2f745c59',
  
  // ERC721Metadata
  name: '0x06fdde03',
  symbol: '0x95d89b41',
  tokenURI: '0xc87b56dd',
  
  // MiniNFT Custom
  mint: '0x1249c58b',
  mintBatch: '0x248b71fc',
  bulkTransfer: '0x12345678', // Placeholder
  bulkTransferToRecipient: '0x87654321', // Placeholder
  setBaseURI: '0x55f804b3',
  withdraw: '0x3ccfd60b',
  remainingSupply: '0x0a0d7e4a',
  getAvailableTokenIds: '0x12345679' // Placeholder
};

// Event signatures
export const EVENT_SIGNATURES = {
  Transfer: 'Transfer(address,address,uint256)',
  Approval: 'Approval(address,address,uint256)',
  ApprovalForAll: 'ApprovalForAll(address,address,bool)',
  MetadataUpdate: 'MetadataUpdate(uint256)',
  BatchMetadataUpdate: 'BatchMetadataUpdate(uint256,uint256)'
};

// Event topics (keccak256 of event signature)
export const EVENT_TOPICS = {
  Transfer: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  Approval: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  ApprovalForAll: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
};

// Error messages from contract
export const CONTRACT_ERRORS = {
  'InsufficientPayment()': 'Insufficient payment. Please send the correct amount.',
  'MaxSupplyReached()': 'Maximum supply has been reached.',
  'InvalidBatchSize()': 'Invalid batch size. Must be between 1 and 10.',
  'TransferFailed()': 'Transfer failed. Please try again.',
  'NotTokenOwner()': 'You are not the owner of this token.',
  'ZeroAddress()': 'Cannot transfer to zero address.',
  'EmptyArray()': 'Array cannot be empty.',
  'ArrayLengthMismatch()': 'Array lengths must match.',
  'ExceedsBulkLimit()': 'Exceeds maximum bulk operation limit.',
  'TokenDoesNotExist()': 'Token does not exist.',
  'AlreadyMinted()': 'Token has already been minted.',
  
  // Standard errors
  'OwnableUnauthorizedAccount': 'You are not authorized to perform this action.',
  'OwnableInvalidOwner': 'Invalid owner address.',
  'ERC721InvalidOwner': 'Invalid token owner.',
  'ERC721NonexistentToken': 'Token does not exist.',
  'ERC721IncorrectOwner': 'Incorrect token owner.',
  'ERC721InvalidSender': 'Invalid sender address.',
  'ERC721InvalidReceiver': 'Invalid receiver address.',
  'ERC721InsufficientApproval': 'Insufficient approval for transfer.',
  'ERC721InvalidApprover': 'Invalid approver address.',
  'ERC721InvalidOperator': 'Invalid operator address.'
};

// Parse contract error to user-friendly message
export function parseContractError(error) {
  if (!error) return 'An unknown error occurred.';
  
  const errorString = error.message || error.toString();
  
  // Check for known error signatures
  for (const [signature, message] of Object.entries(CONTRACT_ERRORS)) {
    if (errorString.includes(signature)) {
      return message;
    }
  }
  
  // Check for common patterns
  if (errorString.includes('insufficient funds')) {
    return 'Insufficient funds in your wallet.';
  }
  
  if (errorString.includes('user rejected')) {
    return 'Transaction was rejected by user.';
  }
  
  if (errorString.includes('nonce')) {
    return 'Transaction nonce error. Please reset your wallet.';
  }
  
  if (errorString.includes('gas')) {
    return 'Transaction ran out of gas. Please try again with higher gas limit.';
  }
  
  // Return original message if no match
  return errorString.slice(0, 200);
}

// Contract read functions
export const READ_FUNCTIONS = [
  'name',
  'symbol',
  'totalSupply',
  'MAX_SUPPLY',
  'MINT_PRICE',
  'balanceOf',
  'ownerOf',
  'tokenURI',
  'getApproved',
  'isApprovedForAll',
  'tokenByIndex',
  'tokenOfOwnerByIndex',
  'remainingSupply',
  'getAvailableTokenIds',
  'getBulkLimits',
  'estimateBulkGas'
];

// Contract write functions
export const WRITE_FUNCTIONS = [
  'mint',
  'mintBatch',
  'approve',
  'setApprovalForAll',
  'transferFrom',
  'safeTransferFrom',
  'bulkTransfer',
  'bulkTransferToRecipient',
  'bulkUpdateMetadata',
  'bulkMintWithURIs',
  'bulkSetApprovalForAll',
  'setBaseURI',
  'withdraw'
];

// Owner-only functions
export const OWNER_FUNCTIONS = [
  'setBaseURI',
  'withdraw',
  'bulkMintWithURIs'
];

// Calculate total cost for minting
export function calculateMintCost(quantity) {
  if (quantity <= 0 || quantity > CONTRACT_CONFIG.MAX_BATCH_SIZE) {
    return null;
  }
  
  const total = CONTRACT_CONFIG.MINT_PRICE * BigInt(quantity);
  
  return {
    wei: total,
    eth: Number(total) / 1e18,
    display: `${(Number(total) / 1e18).toFixed(5)} ETH`
  };
}

// Validate mint quantity
export function validateMintQuantity(quantity, remainingSupply) {
  if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
    return { valid: false, error: 'Quantity must be an integer.' };
  }
  
  if (quantity <= 0) {
    return { valid: false, error: 'Quantity must be at least 1.' };
  }
  
  if (quantity > CONTRACT_CONFIG.MAX_BATCH_SIZE) {
    return { valid: false, error: `Maximum batch size is ${CONTRACT_CONFIG.MAX_BATCH_SIZE}.` };
  }
  
  if (remainingSupply !== undefined && quantity > remainingSupply) {
    return { valid: false, error: `Only ${remainingSupply} tokens remaining.` };
  }
  
  return { valid: true, error: null };
}

// Validate token ID
export function validateTokenId(tokenId) {
  const id = Number(tokenId);
  
  if (isNaN(id) || !Number.isInteger(id)) {
    return { valid: false, error: 'Token ID must be an integer.' };
  }
  
  if (id < 1 || id > CONTRACT_CONFIG.MAX_SUPPLY) {
    return { valid: false, error: `Token ID must be between 1 and ${CONTRACT_CONFIG.MAX_SUPPLY}.` };
  }
  
  return { valid: true, error: null };
}

// Format token ID for display
export function formatTokenId(tokenId) {
  const id = Number(tokenId);
  return `#${id.toString().padStart(3, '0')}`;
}

export default {
  CONTRACT_ADDRESSES,
  getContractAddress,
  CONTRACT_CONFIG,
  FUNCTION_SELECTORS,
  EVENT_SIGNATURES,
  EVENT_TOPICS,
  CONTRACT_ERRORS,
  parseContractError,
  READ_FUNCTIONS,
  WRITE_FUNCTIONS,
  OWNER_FUNCTIONS,
  calculateMintCost,
  validateMintQuantity,
  validateTokenId,
  formatTokenId
};
