import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { MININFT_ABI, CONTRACT_ADDRESS, MINT_PRICE, MAX_SUPPLY } from './contract';

function App() {
  const { address, isConnected } = useAccount();
  const [mintQuantity, setMintQuantity] = useState(1);
  const [recentMints, setRecentMints] = useState([]);

  // Read contract data
  const { data: remainingSupply, refetch: refetchRemaining } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'remainingSupply',
  });

  const { data: totalSupply, refetch: refetchTotal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'totalSupply',
  });

  const { data: userBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MININFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // Write contract
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Refetch data after successful mint
  useEffect(() => {
    if (isSuccess) {
      refetchRemaining();
      refetchTotal();
      refetchBalance();
      
      // Add to recent mints
      setRecentMints(prev => [{
        txHash: hash,
        timestamp: new Date().toLocaleTimeString(),
      }, ...prev.slice(0, 4)]);
    }
  }, [isSuccess, hash, refetchRemaining, refetchTotal, refetchBalance]);

  const handleMint = () => {
    const value = parseEther(MINT_PRICE) * BigInt(mintQuantity);
    
    if (mintQuantity === 1) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MININFT_ABI,
        functionName: 'mint',
        value,
      });
    } else {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: MININFT_ABI,
        functionName: 'mintBatch',
        args: [mintQuantity],
        value,
      });
    }
  };

  const minted = totalSupply ? Number(totalSupply) : 0;
  const remaining = remainingSupply ? Number(remainingSupply) : MAX_SUPPLY;
  const progress = (minted / MAX_SUPPLY) * 100;

  return (
    <div className="app">
      {/* Background effects */}
      <div className="bg-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">💎</span>
          <span className="logo-text">MiniNFT</span>
        </div>
        <ConnectButton />
      </header>

      {/* Main content */}
      <main className="main">
        <div className="hero">
          <h1 className="title">
            Mint Your <span className="gradient-text">MiniNFT</span>
          </h1>
          <p className="subtitle">
            A collection of 505 unique NFTs on Base Chain
          </p>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{minted}</div>
            <div className="stat-label">Minted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{remaining}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{MINT_PRICE} ETH</div>
            <div className="stat-label">Price</div>
          </div>
          {isConnected && (
            <div className="stat-card">
              <div className="stat-value">{userBalance ? Number(userBalance) : 0}</div>
              <div className="stat-label">You Own</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress.toFixed(1)}% minted</div>
        </div>

        {/* Mint card */}
        <div className="mint-card">
          <h2 className="mint-title">Mint Your NFT</h2>
          
          {!isConnected ? (
            <div className="connect-prompt">
              <p>Connect your wallet to mint</p>
              <ConnectButton />
            </div>
          ) : remaining === 0 ? (
            <div className="sold-out">
              <span className="sold-out-icon">🎉</span>
              <p>Sold Out!</p>
            </div>
          ) : (
            <>
              {/* Quantity selector */}
              <div className="quantity-selector">
                <button 
                  className="quantity-btn"
                  onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
                  disabled={mintQuantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{mintQuantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setMintQuantity(Math.min(10, mintQuantity + 1, remaining))}
                  disabled={mintQuantity >= 10 || mintQuantity >= remaining}
                >
                  +
                </button>
              </div>

              {/* Total price */}
              <div className="total-price">
                Total: {(parseFloat(MINT_PRICE) * mintQuantity).toFixed(5)} ETH
              </div>

              {/* Mint button */}
              <button 
                className="mint-btn"
                onClick={handleMint}
                disabled={isPending || isConfirming}
              >
                {isPending ? 'Confirm in Wallet...' : 
                 isConfirming ? 'Minting...' : 
                 `Mint ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}`}
              </button>

              {/* Status messages */}
              {isSuccess && (
                <div className="success-message">
                  ✅ Successfully minted! 
                  <a 
                    href={`https://basescan.org/tx/${hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on BaseScan
                  </a>
                </div>
              )}

              {writeError && (
                <div className="error-message">
                  ❌ {writeError.shortMessage || writeError.message}
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent mints */}
        {recentMints.length > 0 && (
          <div className="recent-mints">
            <h3>Your Recent Mints</h3>
            <div className="recent-list">
              {recentMints.map((mint, index) => (
                <div key={index} className="recent-item">
                  <span>{mint.timestamp}</span>
                  <a 
                    href={`https://basescan.org/tx/${mint.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View TX
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎲</div>
            <h3>Random Minting</h3>
            <p>Each mint reveals a random NFT from the collection</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Base Chain</h3>
            <p>Low gas fees on Ethereum L2</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Micro Price</h3>
            <p>Only 0.00001 ETH per NFT</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>5 Rarities</h3>
            <p>Common to Legendary traits</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>MiniNFT © 2026 | Built on Base</p>
        <div className="footer-links">
          <a 
            href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contract
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
