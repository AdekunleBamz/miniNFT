import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing transaction history
 */
export const useTransactionHistory = (address, limit = 10) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load transactions from localStorage
  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }
    
    const stored = localStorage.getItem(`tx_history_${address}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed.slice(0, limit));
      } catch {
        setTransactions([]);
      }
    }
  }, [address, limit]);
  
  // Add a new transaction
  const addTransaction = useCallback((tx) => {
    if (!address) return;
    
    const newTx = {
      hash: tx.hash,
      type: tx.type || 'unknown',
      tokenId: tx.tokenId,
      status: 'pending',
      timestamp: Date.now(),
      ...tx
    };
    
    setTransactions(prev => {
      const updated = [newTx, ...prev].slice(0, limit);
      localStorage.setItem(`tx_history_${address}`, JSON.stringify(updated));
      return updated;
    });
    
    return newTx;
  }, [address, limit]);
  
  // Update transaction status
  const updateTransaction = useCallback((hash, updates) => {
    if (!address) return;
    
    setTransactions(prev => {
      const updated = prev.map(tx => 
        tx.hash === hash ? { ...tx, ...updates } : tx
      );
      localStorage.setItem(`tx_history_${address}`, JSON.stringify(updated));
      return updated;
    });
  }, [address]);
  
  // Mark transaction as confirmed
  const confirmTransaction = useCallback((hash) => {
    updateTransaction(hash, { status: 'confirmed' });
  }, [updateTransaction]);
  
  // Mark transaction as failed
  const failTransaction = useCallback((hash, error) => {
    updateTransaction(hash, { status: 'failed', error });
  }, [updateTransaction]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    if (!address) return;
    localStorage.removeItem(`tx_history_${address}`);
    setTransactions([]);
  }, [address]);
  
  // Get pending transactions
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending');
  const hasPendingTransactions = pendingTransactions.length > 0;
  
  return {
    transactions,
    pendingTransactions,
    hasPendingTransactions,
    isLoading,
    addTransaction,
    updateTransaction,
    confirmTransaction,
    failTransaction,
    clearHistory
  };
};

export default useTransactionHistory;
