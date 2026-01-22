/**
 * useContractEvents hook for listening to contract events
 */
import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

export function useContractEvents(eventName, options = {}) {
  const [events, setEvents] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const publicClient = usePublicClient();

  const { fromBlock = 'latest', enabled = true } = options;

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName,
    onLogs: (logs) => {
      const newEvents = logs.map(log => ({
        ...log,
        timestamp: Date.now(),
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 100));
    },
    enabled: enabled && isListening,
  });

  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isListening,
    startListening,
    stopListening,
    clearEvents,
  };
}

export function useMintEvents(options = {}) {
  const { enabled = true, onMint } = options;
  const [recentMints, setRecentMints] = useState([]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'Transfer',
    onLogs: (logs) => {
      const mints = logs
        .filter(log => log.args.from === '0x0000000000000000000000000000000000000000')
        .map(log => ({
          tokenId: log.args.tokenId?.toString(),
          to: log.args.to,
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          timestamp: Date.now(),
        }));

      if (mints.length > 0) {
        setRecentMints(prev => [...mints, ...prev].slice(0, 50));
        mints.forEach(mint => onMint?.(mint));
      }
    },
    enabled,
  });

  return {
    recentMints,
    clearMints: () => setRecentMints([]),
  };
}

export function useTransferEvents(tokenId, options = {}) {
  const { enabled = true } = options;
  const [transfers, setTransfers] = useState([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!enabled || !tokenId || !publicClient) return;

    const fetchTransfers = async () => {
      try {
        const logs = await publicClient.getContractEvents({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          eventName: 'Transfer',
          args: {
            tokenId: BigInt(tokenId),
          },
          fromBlock: 0n,
        });

        const transferHistory = logs.map(log => ({
          from: log.args.from,
          to: log.args.to,
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          type: log.args.from === '0x0000000000000000000000000000000000000000' ? 'mint' : 'transfer',
        }));

        setTransfers(transferHistory);
      } catch (error) {
        console.error('Failed to fetch transfer events:', error);
      }
    };

    fetchTransfers();
  }, [tokenId, enabled, publicClient]);

  return { transfers };
}

export function useApprovalEvents(options = {}) {
  const { enabled = true } = options;
  const [approvals, setApprovals] = useState([]);

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'Approval',
    onLogs: (logs) => {
      const newApprovals = logs.map(log => ({
        owner: log.args.owner,
        approved: log.args.approved,
        tokenId: log.args.tokenId?.toString(),
        txHash: log.transactionHash,
        timestamp: Date.now(),
      }));

      setApprovals(prev => [...newApprovals, ...prev].slice(0, 50));
    },
    enabled,
  });

  return { approvals };
}

export default useContractEvents;
