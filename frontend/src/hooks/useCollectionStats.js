/**
 * useCollectionStats Hook
 * 
 * Provides real-time collection statistics including
 * supply, mints, owners, and activity metrics.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
import { getEventStats, getAllMints } from '../utils/events';

// Cache duration in milliseconds
const CACHE_DURATION = 30000; // 30 seconds

// Stats cache
let statsCache = null;
let statsCacheTime = 0;

/**
 * Hook for fetching and tracking collection statistics
 * @param {Object} options - Hook options
 * @returns {Object} Collection stats and utilities
 */
export function useCollectionStats(options = {}) {
  const {
    refreshInterval = 60000, // 1 minute default
    autoRefresh = true
  } = options;

  const publicClient = usePublicClient();

  const [stats, setStats] = useState({
    totalSupply: 0,
    maxSupply: 505,
    remainingSupply: 505,
    totalMints: 0,
    uniqueOwners: 0,
    uniqueMinters: 0,
    mintProgress: 0,
    averageMintsPerOwner: 0,
    latestMintBlock: null,
    contractBalance: '0'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch current supply from contract
   */
  const fetchSupply = useCallback(async () => {
    if (!publicClient) return null;

    try {
      const [totalSupply, maxSupply, remainingSupply] = await Promise.all([
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'totalSupply'
        }),
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'MAX_SUPPLY'
        }),
        publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'remainingSupply'
        })
      ]);

      return {
        totalSupply: Number(totalSupply),
        maxSupply: Number(maxSupply),
        remainingSupply: Number(remainingSupply)
      };
    } catch (err) {
      console.error('Error fetching supply:', err);
      return null;
    }
  }, [publicClient]);

  /**
   * Fetch contract balance
   */
  const fetchBalance = useCallback(async () => {
    if (!publicClient) return '0';

    try {
      const balance = await publicClient.getBalance({
        address: CONTRACT_ADDRESS
      });
      return balance.toString();
    } catch (err) {
      console.error('Error fetching balance:', err);
      return '0';
    }
  }, [publicClient]);

  /**
   * Fetch all collection stats
   */
  const fetchStats = useCallback(async (useCache = true) => {
    if (!publicClient) return;

    // Check cache
    if (useCache && statsCache && Date.now() - statsCacheTime < CACHE_DURATION) {
      setStats(statsCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [supplyData, eventStats, balance] = await Promise.all([
        fetchSupply(),
        getEventStats(publicClient).catch(() => null),
        fetchBalance()
      ]);

      if (!supplyData) {
        throw new Error('Failed to fetch supply data');
      }

      const newStats = {
        totalSupply: supplyData.totalSupply,
        maxSupply: supplyData.maxSupply,
        remainingSupply: supplyData.remainingSupply,
        totalMints: eventStats?.totalMints || supplyData.totalSupply,
        uniqueOwners: eventStats?.uniqueOwners || 0,
        uniqueMinters: eventStats?.uniqueMinters || 0,
        mintProgress: (supplyData.totalSupply / supplyData.maxSupply) * 100,
        averageMintsPerOwner: eventStats?.uniqueOwners 
          ? supplyData.totalSupply / eventStats.uniqueOwners 
          : 0,
        latestMintBlock: eventStats?.latestMint?.blockNumber || null,
        contractBalance: balance
      };

      // Update cache
      statsCache = newStats;
      statsCacheTime = Date.now();

      setStats(newStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching collection stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [publicClient, fetchSupply, fetchBalance]);

  /**
   * Force refresh stats (bypass cache)
   */
  const refresh = useCallback(() => {
    return fetchStats(false);
  }, [fetchStats]);

  /**
   * Clear stats cache
   */
  const clearCache = useCallback(() => {
    statsCache = null;
    statsCacheTime = 0;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats]);

  // Computed values
  const computed = useMemo(() => ({
    isSoldOut: stats.remainingSupply === 0,
    isNearSoldOut: stats.remainingSupply <= 50,
    mintPercentage: stats.mintProgress.toFixed(1),
    formattedBalance: formatBalance(stats.contractBalance),
    avgPerOwner: stats.averageMintsPerOwner.toFixed(2)
  }), [stats]);

  return {
    ...stats,
    ...computed,
    loading,
    error,
    lastUpdated,
    refresh,
    clearCache
  };
}

/**
 * Hook for fetching mint history
 * @param {Object} options - Hook options
 * @returns {Object} Mint history and utilities
 */
export function useMintHistory(options = {}) {
  const {
    limit = 50,
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const publicClient = usePublicClient();

  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMints = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);
    setError(null);

    try {
      const allMints = await getAllMints(publicClient);
      
      // Sort by block number descending and limit
      const sortedMints = allMints
        .sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber))
        .slice(0, limit);

      setMints(sortedMints);
    } catch (err) {
      console.error('Error fetching mint history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [publicClient, limit]);

  useEffect(() => {
    fetchMints();
  }, [fetchMints]);

  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(fetchMints, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchMints]);

  return {
    mints,
    loading,
    error,
    refresh: fetchMints,
    totalCount: mints.length
  };
}

/**
 * Hook for tracking activity metrics
 * @returns {Object} Activity metrics
 */
export function useActivityMetrics() {
  const publicClient = usePublicClient();

  const [metrics, setMetrics] = useState({
    last24hMints: 0,
    last7dMints: 0,
    mintVelocity: 0, // mints per hour
    peakHour: null,
    quietHour: null
  });

  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);

    try {
      const currentBlock = await publicClient.getBlockNumber();
      
      // Approximate blocks per hour on Base (2 second block time)
      const blocksPerHour = 1800;
      const blocksPerDay = blocksPerHour * 24;
      const blocksPerWeek = blocksPerDay * 7;

      // Get mints from different time periods
      const [last24h, last7d] = await Promise.all([
        getAllMints(publicClient, {
          fromBlock: currentBlock - BigInt(blocksPerDay)
        }).catch(() => []),
        getAllMints(publicClient, {
          fromBlock: currentBlock - BigInt(blocksPerWeek)
        }).catch(() => [])
      ]);

      // Calculate velocity (mints per hour over last 24h)
      const velocity = last24h.length / 24;

      setMetrics({
        last24hMints: last24h.length,
        last7dMints: last7d.length,
        mintVelocity: velocity,
        peakHour: null, // Would need timestamp data
        quietHour: null
      });
    } catch (err) {
      console.error('Error fetching activity metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    ...metrics,
    loading,
    refresh: fetchMetrics
  };
}

/**
 * Hook for owner distribution analysis
 * @returns {Object} Owner distribution data
 */
export function useOwnerDistribution() {
  const publicClient = usePublicClient();

  const [distribution, setDistribution] = useState({
    whales: [], // 10+ NFTs
    collectors: [], // 5-9 NFTs
    holders: [], // 2-4 NFTs
    singles: [], // 1 NFT
    topHolders: []
  });

  const [loading, setLoading] = useState(true);

  const fetchDistribution = useCallback(async () => {
    if (!publicClient) return;

    setLoading(true);

    try {
      // Get all transfers to build ownership map
      const mints = await getAllMints(publicClient);
      
      // Count tokens per owner (simplified - doesn't account for transfers)
      const ownerCounts = new Map();
      
      for (const mint of mints) {
        const count = ownerCounts.get(mint.minter) || 0;
        ownerCounts.set(mint.minter, count + 1);
      }

      // Categorize owners
      const whales = [];
      const collectors = [];
      const holders = [];
      const singles = [];

      for (const [owner, count] of ownerCounts) {
        if (count >= 10) {
          whales.push({ address: owner, count });
        } else if (count >= 5) {
          collectors.push({ address: owner, count });
        } else if (count >= 2) {
          holders.push({ address: owner, count });
        } else {
          singles.push({ address: owner, count });
        }
      }

      // Sort by count descending
      const sortByCount = (a, b) => b.count - a.count;

      setDistribution({
        whales: whales.sort(sortByCount),
        collectors: collectors.sort(sortByCount),
        holders: holders.sort(sortByCount),
        singles: singles.sort(sortByCount),
        topHolders: [...whales, ...collectors, ...holders, ...singles]
          .sort(sortByCount)
          .slice(0, 10)
      });
    } catch (err) {
      console.error('Error fetching owner distribution:', err);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  return {
    ...distribution,
    loading,
    refresh: fetchDistribution,
    summary: {
      whaleCount: distribution.whales.length,
      collectorCount: distribution.collectors.length,
      holderCount: distribution.holders.length,
      singleCount: distribution.singles.length,
      totalOwners: distribution.whales.length + 
                   distribution.collectors.length + 
                   distribution.holders.length + 
                   distribution.singles.length
    }
  };
}

/**
 * Format balance for display
 * @param {string} balance - Balance in wei
 * @returns {string}
 */
function formatBalance(balance) {
  try {
    const eth = parseFloat(balance) / 1e18;
    if (eth < 0.0001) return '< 0.0001 ETH';
    return `${eth.toFixed(4)} ETH`;
  } catch {
    return '0 ETH';
  }
}

export default {
  useCollectionStats,
  useMintHistory,
  useActivityMetrics,
  useOwnerDistribution
};
