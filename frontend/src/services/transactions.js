/**
 * Transaction Service
 * 
 * Handles blockchain transaction management including
 * sending, tracking, retrying, and history management.
 */

import { formatEther, parseEther } from 'viem';
import { local } from './storage';

// Transaction states
export const TX_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REPLACED: 'replaced',
  CANCELLED: 'cancelled'
};

// Transaction types
export const TX_TYPE = {
  MINT: 'mint',
  BATCH_MINT: 'batch_mint',
  TRANSFER: 'transfer',
  BULK_TRANSFER: 'bulk_transfer',
  APPROVE: 'approve',
  APPROVE_ALL: 'approve_all',
  WITHDRAW: 'withdraw',
  SET_BASE_URI: 'set_base_uri',
  UPDATE_METADATA: 'update_metadata',
  UNKNOWN: 'unknown'
};

// Storage key for transaction history
const TX_HISTORY_KEY = 'transaction_history';
const MAX_HISTORY_SIZE = 100;

/**
 * Transaction record structure
 */
export class Transaction {
  constructor(data = {}) {
    this.id = data.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.hash = data.hash || null;
    this.type = data.type || TX_TYPE.UNKNOWN;
    this.status = data.status || TX_STATUS.PENDING;
    this.from = data.from || null;
    this.to = data.to || null;
    this.value = data.value || '0';
    this.data = data.data || null;
    this.gasUsed = data.gasUsed || null;
    this.gasPrice = data.gasPrice || null;
    this.blockNumber = data.blockNumber || null;
    this.blockHash = data.blockHash || null;
    this.timestamp = data.timestamp || Date.now();
    this.confirmedAt = data.confirmedAt || null;
    this.error = data.error || null;
    this.metadata = data.metadata || {};
  }

  /**
   * Update transaction status
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data to merge
   */
  updateStatus(status, additionalData = {}) {
    this.status = status;
    if (status === TX_STATUS.CONFIRMED) {
      this.confirmedAt = Date.now();
    }
    Object.assign(this, additionalData);
  }

  /**
   * Check if transaction is pending
   * @returns {boolean}
   */
  isPending() {
    return [TX_STATUS.PENDING, TX_STATUS.SUBMITTED, TX_STATUS.CONFIRMING].includes(this.status);
  }

  /**
   * Check if transaction is complete
   * @returns {boolean}
   */
  isComplete() {
    return [TX_STATUS.CONFIRMED, TX_STATUS.FAILED, TX_STATUS.REPLACED, TX_STATUS.CANCELLED].includes(this.status);
  }

  /**
   * Get formatted value in ETH
   * @returns {string}
   */
  getFormattedValue() {
    try {
      return formatEther(BigInt(this.value));
    } catch {
      return '0';
    }
  }

  /**
   * Get transaction age in milliseconds
   * @returns {number}
   */
  getAge() {
    return Date.now() - this.timestamp;
  }

  /**
   * Get confirmation time in milliseconds
   * @returns {number|null}
   */
  getConfirmationTime() {
    if (!this.confirmedAt) return null;
    return this.confirmedAt - this.timestamp;
  }

  /**
   * Serialize for storage
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      hash: this.hash,
      type: this.type,
      status: this.status,
      from: this.from,
      to: this.to,
      value: this.value,
      gasUsed: this.gasUsed,
      gasPrice: this.gasPrice,
      blockNumber: this.blockNumber,
      blockHash: this.blockHash,
      timestamp: this.timestamp,
      confirmedAt: this.confirmedAt,
      error: this.error,
      metadata: this.metadata
    };
  }

  /**
   * Create from stored data
   * @param {Object} data - Stored data
   * @returns {Transaction}
   */
  static fromJSON(data) {
    return new Transaction(data);
  }
}

/**
 * Transaction manager for tracking and managing transactions
 */
class TransactionManager {
  constructor() {
    this.transactions = new Map();
    this.listeners = new Set();
    this.pendingWatchers = new Map();
    this.loadHistory();
  }

  /**
   * Load transaction history from storage
   */
  loadHistory() {
    const history = local.get(TX_HISTORY_KEY, []);
    for (const txData of history) {
      const tx = Transaction.fromJSON(txData);
      this.transactions.set(tx.id, tx);
    }
  }

  /**
   * Save transaction history to storage
   */
  saveHistory() {
    const history = Array.from(this.transactions.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY_SIZE)
      .map(tx => tx.toJSON());
    
    local.set(TX_HISTORY_KEY, history);
  }

  /**
   * Add a transaction listener
   * @param {Function} callback - Callback for transaction updates
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of a transaction update
   * @param {Transaction} tx - Updated transaction
   * @param {string} event - Event type
   */
  notify(tx, event = 'update') {
    for (const listener of this.listeners) {
      try {
        listener(tx, event);
      } catch (error) {
        console.error('Transaction listener error:', error);
      }
    }
  }

  /**
   * Create a new transaction
   * @param {Object} data - Transaction data
   * @returns {Transaction}
   */
  create(data) {
    const tx = new Transaction(data);
    this.transactions.set(tx.id, tx);
    this.saveHistory();
    this.notify(tx, 'created');
    return tx;
  }

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Updates to apply
   * @returns {Transaction|null}
   */
  update(id, updates) {
    const tx = this.transactions.get(id);
    if (!tx) return null;

    Object.assign(tx, updates);
    this.saveHistory();
    this.notify(tx, 'updated');
    return tx;
  }

  /**
   * Get a transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Transaction|null}
   */
  get(id) {
    return this.transactions.get(id) || null;
  }

  /**
   * Get a transaction by hash
   * @param {string} hash - Transaction hash
   * @returns {Transaction|null}
   */
  getByHash(hash) {
    for (const tx of this.transactions.values()) {
      if (tx.hash === hash) return tx;
    }
    return null;
  }

  /**
   * Get all transactions
   * @param {Object} filter - Optional filter
   * @returns {Transaction[]}
   */
  getAll(filter = {}) {
    let txs = Array.from(this.transactions.values());

    if (filter.type) {
      txs = txs.filter(tx => tx.type === filter.type);
    }

    if (filter.status) {
      txs = txs.filter(tx => tx.status === filter.status);
    }

    if (filter.from) {
      txs = txs.filter(tx => tx.from?.toLowerCase() === filter.from.toLowerCase());
    }

    if (filter.pending) {
      txs = txs.filter(tx => tx.isPending());
    }

    return txs.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get pending transactions
   * @returns {Transaction[]}
   */
  getPending() {
    return this.getAll({ pending: true });
  }

  /**
   * Get transaction count by status
   * @returns {Object}
   */
  getStatusCounts() {
    const counts = {};
    for (const status of Object.values(TX_STATUS)) {
      counts[status] = 0;
    }
    for (const tx of this.transactions.values()) {
      counts[tx.status]++;
    }
    return counts;
  }

  /**
   * Clear transaction history
   * @param {boolean} keepPending - Whether to keep pending transactions
   */
  clear(keepPending = true) {
    if (keepPending) {
      const pending = this.getPending();
      this.transactions.clear();
      for (const tx of pending) {
        this.transactions.set(tx.id, tx);
      }
    } else {
      this.transactions.clear();
    }
    this.saveHistory();
  }

  /**
   * Watch a transaction for confirmation
   * @param {Object} client - Viem public client
   * @param {string} txId - Transaction ID
   * @param {number} confirmations - Required confirmations
   * @returns {Promise<Transaction>}
   */
  async watchTransaction(client, txId, confirmations = 1) {
    const tx = this.get(txId);
    if (!tx || !tx.hash) {
      throw new Error('Transaction not found or no hash');
    }

    // Update status to confirming
    this.update(txId, { status: TX_STATUS.CONFIRMING });

    try {
      const receipt = await client.waitForTransactionReceipt({
        hash: tx.hash,
        confirmations
      });

      const status = receipt.status === 'success' 
        ? TX_STATUS.CONFIRMED 
        : TX_STATUS.FAILED;

      this.update(txId, {
        status,
        blockNumber: receipt.blockNumber.toString(),
        blockHash: receipt.blockHash,
        gasUsed: receipt.gasUsed.toString()
      });

      return this.get(txId);
    } catch (error) {
      // Check if transaction was replaced
      if (error.message?.includes('replaced')) {
        this.update(txId, { status: TX_STATUS.REPLACED, error: error.message });
      } else {
        this.update(txId, { status: TX_STATUS.FAILED, error: error.message });
      }
      throw error;
    }
  }

  /**
   * Start watching all pending transactions
   * @param {Object} client - Viem public client
   */
  watchAllPending(client) {
    const pending = this.getPending();
    for (const tx of pending) {
      if (tx.hash && !this.pendingWatchers.has(tx.id)) {
        const watcher = this.watchTransaction(client, tx.id)
          .catch(error => console.warn(`Failed to watch tx ${tx.id}:`, error))
          .finally(() => this.pendingWatchers.delete(tx.id));
        
        this.pendingWatchers.set(tx.id, watcher);
      }
    }
  }
}

// Singleton instance
export const transactionManager = new TransactionManager();

/**
 * Helper to send a transaction with tracking
 * @param {Object} options - Transaction options
 * @returns {Promise<Transaction>}
 */
export async function sendTransaction(options) {
  const {
    walletClient,
    publicClient,
    type = TX_TYPE.UNKNOWN,
    to,
    value = '0',
    data,
    metadata = {},
    onSubmit,
    onConfirm,
    onError
  } = options;

  // Create transaction record
  const tx = transactionManager.create({
    type,
    from: walletClient.account.address,
    to,
    value: value.toString(),
    data,
    status: TX_STATUS.PENDING,
    metadata
  });

  try {
    // Send transaction
    const hash = await walletClient.sendTransaction({
      to,
      value: BigInt(value),
      data
    });

    // Update with hash
    transactionManager.update(tx.id, {
      hash,
      status: TX_STATUS.SUBMITTED
    });

    if (onSubmit) {
      onSubmit(tx);
    }

    // Watch for confirmation
    const confirmedTx = await transactionManager.watchTransaction(
      publicClient,
      tx.id
    );

    if (onConfirm && confirmedTx.status === TX_STATUS.CONFIRMED) {
      onConfirm(confirmedTx);
    }

    return confirmedTx;
  } catch (error) {
    transactionManager.update(tx.id, {
      status: TX_STATUS.FAILED,
      error: error.message
    });

    if (onError) {
      onError(error, tx);
    }

    throw error;
  }
}

/**
 * Helper to send a contract transaction with tracking
 * @param {Object} options - Transaction options
 * @returns {Promise<Transaction>}
 */
export async function sendContractTransaction(options) {
  const {
    walletClient,
    publicClient,
    type = TX_TYPE.UNKNOWN,
    address,
    abi,
    functionName,
    args = [],
    value = '0',
    metadata = {},
    onSubmit,
    onConfirm,
    onError
  } = options;

  // Create transaction record
  const tx = transactionManager.create({
    type,
    from: walletClient.account.address,
    to: address,
    value: value.toString(),
    status: TX_STATUS.PENDING,
    metadata: {
      ...metadata,
      functionName,
      args: args.map(a => a.toString())
    }
  });

  try {
    // Send contract write
    const hash = await walletClient.writeContract({
      address,
      abi,
      functionName,
      args,
      value: BigInt(value)
    });

    // Update with hash
    transactionManager.update(tx.id, {
      hash,
      status: TX_STATUS.SUBMITTED
    });

    if (onSubmit) {
      onSubmit(tx);
    }

    // Watch for confirmation
    const confirmedTx = await transactionManager.watchTransaction(
      publicClient,
      tx.id
    );

    if (onConfirm && confirmedTx.status === TX_STATUS.CONFIRMED) {
      onConfirm(confirmedTx);
    }

    return confirmedTx;
  } catch (error) {
    transactionManager.update(tx.id, {
      status: TX_STATUS.FAILED,
      error: error.message
    });

    if (onError) {
      onError(error, tx);
    }

    throw error;
  }
}

/**
 * Format transaction for display
 * @param {Transaction} tx - Transaction
 * @returns {Object}
 */
export function formatTransaction(tx) {
  const typeLabels = {
    [TX_TYPE.MINT]: 'Mint NFT',
    [TX_TYPE.BATCH_MINT]: 'Batch Mint',
    [TX_TYPE.TRANSFER]: 'Transfer',
    [TX_TYPE.BULK_TRANSFER]: 'Bulk Transfer',
    [TX_TYPE.APPROVE]: 'Approve',
    [TX_TYPE.APPROVE_ALL]: 'Approve All',
    [TX_TYPE.WITHDRAW]: 'Withdraw',
    [TX_TYPE.SET_BASE_URI]: 'Set Base URI',
    [TX_TYPE.UPDATE_METADATA]: 'Update Metadata',
    [TX_TYPE.UNKNOWN]: 'Transaction'
  };

  const statusLabels = {
    [TX_STATUS.PENDING]: 'Pending...',
    [TX_STATUS.SUBMITTED]: 'Submitted',
    [TX_STATUS.CONFIRMING]: 'Confirming...',
    [TX_STATUS.CONFIRMED]: 'Confirmed',
    [TX_STATUS.FAILED]: 'Failed',
    [TX_STATUS.REPLACED]: 'Replaced',
    [TX_STATUS.CANCELLED]: 'Cancelled'
  };

  return {
    ...tx,
    typeLabel: typeLabels[tx.type] || tx.type,
    statusLabel: statusLabels[tx.status] || tx.status,
    formattedValue: tx.getFormattedValue(),
    shortHash: tx.hash ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}` : null,
    relativeTime: getRelativeTime(tx.timestamp)
  };
}

/**
 * Get relative time string
 * @param {number} timestamp - Timestamp in ms
 * @returns {string}
 */
function getRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default {
  TX_STATUS,
  TX_TYPE,
  Transaction,
  transactionManager,
  sendTransaction,
  sendContractTransaction,
  formatTransaction
};
