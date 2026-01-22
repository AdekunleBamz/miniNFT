/**
 * Contract Event Utilities
 * 
 * Provides utilities for watching and parsing blockchain events
 * from the MiniNFT contract.
 */

import { parseAbiItem, decodeEventLog } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

// Event signatures for common ERC721 events
export const EVENT_SIGNATURES = {
  Transfer: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  Approval: 'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  ApprovalForAll: 'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  MetadataUpdate: 'event MetadataUpdate(uint256 indexed tokenId)',
  BatchMetadataUpdate: 'event BatchMetadataUpdate(uint256 indexed fromTokenId, uint256 indexed toTokenId)'
};

// Event topics (keccak256 hashes)
export const EVENT_TOPICS = {
  Transfer: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  Approval: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  ApprovalForAll: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
};

/**
 * Parse a Transfer event from logs
 * @param {Object} log - The log object from a transaction receipt
 * @returns {Object|null} Parsed transfer event or null
 */
export function parseTransferEvent(log) {
  try {
    if (log.topics[0] !== EVENT_TOPICS.Transfer) {
      return null;
    }

    return {
      from: `0x${log.topics[1].slice(26)}`.toLowerCase(),
      to: `0x${log.topics[2].slice(26)}`.toLowerCase(),
      tokenId: BigInt(log.topics[3]).toString(),
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex
    };
  } catch (error) {
    console.warn('Failed to parse Transfer event:', error);
    return null;
  }
}

/**
 * Parse an Approval event from logs
 * @param {Object} log - The log object
 * @returns {Object|null} Parsed approval event or null
 */
export function parseApprovalEvent(log) {
  try {
    if (log.topics[0] !== EVENT_TOPICS.Approval) {
      return null;
    }

    return {
      owner: `0x${log.topics[1].slice(26)}`.toLowerCase(),
      approved: `0x${log.topics[2].slice(26)}`.toLowerCase(),
      tokenId: BigInt(log.topics[3]).toString(),
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex
    };
  } catch (error) {
    console.warn('Failed to parse Approval event:', error);
    return null;
  }
}

/**
 * Parse ApprovalForAll event from logs
 * @param {Object} log - The log object
 * @returns {Object|null} Parsed event or null
 */
export function parseApprovalForAllEvent(log) {
  try {
    if (log.topics[0] !== EVENT_TOPICS.ApprovalForAll) {
      return null;
    }

    const decoded = decodeEventLog({
      abi: [parseAbiItem(EVENT_SIGNATURES.ApprovalForAll)],
      data: log.data,
      topics: log.topics
    });

    return {
      owner: decoded.args.owner.toLowerCase(),
      operator: decoded.args.operator.toLowerCase(),
      approved: decoded.args.approved,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex
    };
  } catch (error) {
    console.warn('Failed to parse ApprovalForAll event:', error);
    return null;
  }
}

/**
 * Extract mint events from a transaction receipt
 * @param {Object} receipt - Transaction receipt
 * @returns {Array} Array of minted token IDs
 */
export function extractMintedTokens(receipt) {
  const mints = [];

  for (const log of receipt.logs) {
    const transfer = parseTransferEvent(log);
    if (transfer && transfer.from === '0x0000000000000000000000000000000000000000') {
      mints.push({
        tokenId: transfer.tokenId,
        to: transfer.to,
        transactionHash: transfer.transactionHash
      });
    }
  }

  return mints;
}

/**
 * Extract transfer events (excluding mints) from a transaction receipt
 * @param {Object} receipt - Transaction receipt
 * @returns {Array} Array of transfer events
 */
export function extractTransfers(receipt) {
  const transfers = [];

  for (const log of receipt.logs) {
    const transfer = parseTransferEvent(log);
    if (transfer && transfer.from !== '0x0000000000000000000000000000000000000000') {
      transfers.push(transfer);
    }
  }

  return transfers;
}

/**
 * Create an event filter for watching contract events
 * @param {Object} client - Viem public client
 * @param {string} eventName - Name of the event to watch
 * @param {Object} args - Filter arguments
 * @returns {Object} Event filter
 */
export function createEventFilter(client, eventName, args = {}) {
  const abiItem = CONTRACT_ABI.find(
    item => item.type === 'event' && item.name === eventName
  );

  if (!abiItem) {
    throw new Error(`Event ${eventName} not found in ABI`);
  }

  return {
    address: CONTRACT_ADDRESS,
    event: abiItem,
    args
  };
}

/**
 * Event listener manager for real-time event watching
 */
export class EventListener {
  constructor(publicClient) {
    this.client = publicClient;
    this.watchers = new Map();
    this.callbacks = new Map();
  }

  /**
   * Start watching for Transfer events
   * @param {Function} callback - Callback for new events
   * @param {Object} filter - Optional filter (from, to addresses)
   * @returns {string} Watcher ID for unsubscribing
   */
  watchTransfers(callback, filter = {}) {
    const id = `transfer_${Date.now()}`;
    
    const unwatch = this.client.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      eventName: 'Transfer',
      args: filter,
      onLogs: (logs) => {
        for (const log of logs) {
          const parsed = parseTransferEvent(log);
          if (parsed) {
            callback(parsed);
          }
        }
      }
    });

    this.watchers.set(id, unwatch);
    return id;
  }

  /**
   * Watch for mints only (transfers from zero address)
   * @param {Function} callback - Callback for mint events
   * @returns {string} Watcher ID
   */
  watchMints(callback) {
    return this.watchTransfers(
      (transfer) => {
        if (transfer.from === '0x0000000000000000000000000000000000000000') {
          callback({
            tokenId: transfer.tokenId,
            minter: transfer.to,
            blockNumber: transfer.blockNumber,
            transactionHash: transfer.transactionHash
          });
        }
      }
    );
  }

  /**
   * Watch for transfers to/from a specific address
   * @param {string} address - Address to watch
   * @param {Function} callback - Callback for events
   * @returns {string} Watcher ID
   */
  watchAddress(address, callback) {
    const normalizedAddress = address.toLowerCase();
    
    return this.watchTransfers(
      (transfer) => {
        if (transfer.from === normalizedAddress || transfer.to === normalizedAddress) {
          callback(transfer);
        }
      }
    );
  }

  /**
   * Watch for a specific token's transfers
   * @param {string|number} tokenId - Token ID to watch
   * @param {Function} callback - Callback for events
   * @returns {string} Watcher ID
   */
  watchToken(tokenId, callback) {
    const tokenIdStr = tokenId.toString();
    
    return this.watchTransfers(
      (transfer) => {
        if (transfer.tokenId === tokenIdStr) {
          callback(transfer);
        }
      }
    );
  }

  /**
   * Stop a specific watcher
   * @param {string} watcherId - Watcher ID to stop
   */
  unwatch(watcherId) {
    const unwatch = this.watchers.get(watcherId);
    if (unwatch) {
      unwatch();
      this.watchers.delete(watcherId);
    }
  }

  /**
   * Stop all watchers
   */
  unwatchAll() {
    for (const [id, unwatch] of this.watchers) {
      unwatch();
    }
    this.watchers.clear();
  }

  /**
   * Get active watcher count
   * @returns {number}
   */
  get activeWatchers() {
    return this.watchers.size;
  }
}

/**
 * Get historical events for the contract
 * @param {Object} client - Viem public client
 * @param {string} eventName - Event name
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of parsed events
 */
export async function getHistoricalEvents(client, eventName, options = {}) {
  const {
    fromBlock = 'earliest',
    toBlock = 'latest',
    args = {}
  } = options;

  const abiItem = CONTRACT_ABI.find(
    item => item.type === 'event' && item.name === eventName
  );

  if (!abiItem) {
    throw new Error(`Event ${eventName} not found in ABI`);
  }

  const logs = await client.getLogs({
    address: CONTRACT_ADDRESS,
    event: abiItem,
    args,
    fromBlock,
    toBlock
  });

  return logs.map(log => {
    switch (eventName) {
      case 'Transfer':
        return parseTransferEvent(log);
      case 'Approval':
        return parseApprovalEvent(log);
      case 'ApprovalForAll':
        return parseApprovalForAllEvent(log);
      default:
        return log;
    }
  }).filter(Boolean);
}

/**
 * Get all mints for the contract
 * @param {Object} client - Viem public client
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of mint events
 */
export async function getAllMints(client, options = {}) {
  const transfers = await getHistoricalEvents(client, 'Transfer', {
    ...options,
    args: { from: '0x0000000000000000000000000000000000000000' }
  });

  return transfers.map(t => ({
    tokenId: t.tokenId,
    minter: t.to,
    blockNumber: t.blockNumber,
    transactionHash: t.transactionHash
  }));
}

/**
 * Get all tokens owned by an address (from historical events)
 * @param {Object} client - Viem public client
 * @param {string} address - Owner address
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of owned token IDs
 */
export async function getOwnedTokensFromEvents(client, address, options = {}) {
  const normalizedAddress = address.toLowerCase();
  const transfers = await getHistoricalEvents(client, 'Transfer', options);

  // Track ownership changes
  const tokenOwners = new Map();

  for (const transfer of transfers) {
    tokenOwners.set(transfer.tokenId, transfer.to);
  }

  // Return tokens currently owned by the address
  const owned = [];
  for (const [tokenId, owner] of tokenOwners) {
    if (owner === normalizedAddress) {
      owned.push(tokenId);
    }
  }

  return owned.sort((a, b) => parseInt(a) - parseInt(b));
}

/**
 * Aggregate event statistics
 * @param {Object} client - Viem public client
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Event statistics
 */
export async function getEventStats(client, options = {}) {
  const transfers = await getHistoricalEvents(client, 'Transfer', options);

  const mints = transfers.filter(
    t => t.from === '0x0000000000000000000000000000000000000000'
  );

  const uniqueOwners = new Set(
    transfers.map(t => t.to).filter(
      addr => addr !== '0x0000000000000000000000000000000000000000'
    )
  );

  const uniqueMinters = new Set(mints.map(m => m.to));

  return {
    totalMints: mints.length,
    totalTransfers: transfers.length - mints.length,
    uniqueOwners: uniqueOwners.size,
    uniqueMinters: uniqueMinters.size,
    latestMint: mints.length > 0 ? mints[mints.length - 1] : null,
    latestTransfer: transfers.length > 0 ? transfers[transfers.length - 1] : null
  };
}

export default {
  EVENT_SIGNATURES,
  EVENT_TOPICS,
  parseTransferEvent,
  parseApprovalEvent,
  parseApprovalForAllEvent,
  extractMintedTokens,
  extractTransfers,
  createEventFilter,
  EventListener,
  getHistoricalEvents,
  getAllMints,
  getOwnedTokensFromEvents,
  getEventStats
};
