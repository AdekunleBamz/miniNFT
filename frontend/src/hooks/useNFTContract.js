import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MININFT_ABI, CONTRACT_ADDRESS, MAX_SUPPLY } from '../contract';

export function useNFTContract() {
  const { address, isConnected } = useAccount();

  // Read remaining supply
  const { data: remainingSupply, refetch: refetchRemaining, isFetching: isFetchingRemaining } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'remainingSupply',
  });

  // Read total supply
  const { data: totalSupply, refetch: refetchTotal, isFetching: isFetchingTotal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'totalSupply',
  });

  // Read user balance
  const { data: userBalance, refetch: refetchBalance, isFetching: isFetchingBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // Write contract
  const { data: hash, writeContract, isPending, error: writeError, reset } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Computed values
  const minted = totalSupply ? Number(totalSupply) : 0;
  const remaining = remainingSupply ? Number(remainingSupply) : MAX_SUPPLY;
  const progress = (minted / MAX_SUPPLY) * 100;

  // Refetch all data
  const refetchAll = () => {
    refetchRemaining();
    refetchTotal();
    if (address) refetchBalance();
  };

  return {
    // Account
    address,
    isConnected,
    
    // Contract data
    minted,
    remaining,
    progress,
    userBalance: userBalance ? Number(userBalance) : 0,
    isLoading: isFetchingRemaining || isFetchingTotal || (!!address && isFetchingBalance),
    
    // Transaction
    hash,
    writeContract,
    isPending,
    isConfirming,
    isSuccess,
    writeError,
    reset,
    
    // Refetch
    refetchAll,
  };
}

export default useNFTContract;
