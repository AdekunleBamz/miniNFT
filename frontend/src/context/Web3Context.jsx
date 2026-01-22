import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Contract configuration
import { CONTRACT_ADDRESS, ABI } from '../contract';

// Environment check
const isDev = import.meta.env.DEV;

// Wagmi config
const config = getDefaultConfig({
  appName: 'MiniNFT',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [base, baseSepolia],
  ssr: false,
});

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Web3 Context
const Web3Context = createContext(null);

/**
 * Web3 Provider Component
 */
export function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // RainbowKit theme
  const rainbowTheme = useMemo(() => {
    return theme === 'dark' 
      ? darkTheme({
          accentColor: '#6366f1',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          overlayBlur: 'small',
        })
      : lightTheme({
          accentColor: '#6366f1',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          overlayBlur: 'small',
        });
  }, [theme]);

  // Context value
  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    config,
    contractAddress: CONTRACT_ADDRESS,
    abi: ABI,
    isDev,
    chains: [base, baseSepolia],
  }), [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} coolMode>
          <Web3Context.Provider value={contextValue}>
            {children}
          </Web3Context.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/**
 * Hook to use Web3 context
 */
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

/**
 * Hook for contract configuration
 */
export function useContractConfig() {
  const { contractAddress, abi } = useWeb3();
  return useMemo(() => ({
    address: contractAddress,
    abi,
  }), [contractAddress, abi]);
}

export default Web3Context;
