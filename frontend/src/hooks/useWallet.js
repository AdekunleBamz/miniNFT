import { useState, useCallback } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESS } from '../contract';

/**
 * Comprehensive wallet hook with connection, balance, and network info
 */
export const useWallet = () => {
  const { address, isConnected, isConnecting, isDisconnected, connector } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  
  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance({
    address,
    enabled: !!address
  });
  
  const [error, setError] = useState(null);
  
  const isCorrectNetwork = chainId === 8453; // Base Mainnet
  
  const connect = useCallback(() => {
    if (openConnectModal) {
      openConnectModal();
    }
  }, [openConnectModal]);
  
  const switchNetwork = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // 8453 in hex
      });
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          });
        } catch (addError) {
          setError('Failed to add Base network');
        }
      } else {
        setError('Failed to switch network');
      }
    }
  }, []);
  
  const formatBalance = useCallback(() => {
    if (!balance) return '0.00';
    return parseFloat(balance.formatted).toFixed(4);
  }, [balance]);
  
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';
  
  return {
    // Address
    address,
    truncatedAddress,
    
    // Connection state
    isConnected,
    isConnecting,
    isDisconnected,
    connector,
    
    // Network
    chainId,
    isCorrectNetwork,
    
    // Balance
    balance: balance?.value,
    balanceFormatted: formatBalance(),
    balanceSymbol: balance?.symbol || 'ETH',
    isBalanceLoading,
    refetchBalance,
    
    // Actions
    connect,
    switchNetwork,
    
    // Error
    error,
    clearError: () => setError(null)
  };
};

export default useWallet;
