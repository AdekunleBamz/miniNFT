import { useState, useEffect } from 'react';
import { Header, Stats, MintCard, Gallery, Features, Footer, ProgressBar, useToast, ScrollProgress, BackToTop } from './components';
import { useNFTContract, useConfetti } from './hooks';
import { MAX_SUPPLY } from './contract';

function App() {
  const { success, error } = useToast();
  const { fireFromCenter } = useConfetti();
  const {
    address,
    isConnected,
    minted,
    remaining,
    progress,
    userBalance,
    isLoading,
    hash,
    writeContract,
    isPending,
    isConfirming,
    isSuccess,
    writeError,
    refetchAll,
  } = useNFTContract();

  const [recentMints, setRecentMints] = useState([]);

  // Refetch data after successful mint
  useEffect(() => {
    if (isSuccess) {
      refetchAll();
      setRecentMints(prev => [{
        txHash: hash,
        timestamp: new Date().toLocaleTimeString(),
      }, ...prev.slice(0, 4)]);
      success('Mint successful! Your NFT is on the way.', 4000);
      fireFromCenter();
    }
  }, [isSuccess, hash, refetchAll, success, fireFromCenter]);

  useEffect(() => {
    if (writeError) {
      error(writeError.shortMessage || writeError.message || 'Transaction failed', 5000);
    }
  }, [writeError, error]);

  return (
    <div className="app">
      <ScrollProgress />
      
      {/* Background effects */}
      <div className="bg-effects">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <Header />

      <main className="main">
        {/* Hero section */}
        <div className="hero">
          <h1 className="title">
            Mint Your <span className="gradient-text">MiniNFT</span>
          </h1>
          <p className="subtitle">
            A collection of 505 unique NFTs on Base Chain
          </p>
        </div>

        {/* Stats */}
        <Stats 
          minted={minted}
          remaining={remaining}
          userBalance={userBalance}
          isConnected={isConnected}
          isLoading={isLoading}
        />

        {/* Progress bar */}
        <ProgressBar progress={progress} minted={minted} total={MAX_SUPPLY} />

        {/* Mint card */}
        <MintCard
          isConnected={isConnected}
          remaining={remaining}
          writeContract={writeContract}
          isPending={isPending}
          isConfirming={isConfirming}
          isSuccess={isSuccess}
          hash={hash}
          writeError={writeError}
        />

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
                    View TX →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User's Gallery */}
        <Gallery address={address} userBalance={userBalance} />

        {/* Features */}
        <Features />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
