import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

const Leaderboard = ({ limit = 10, showChange = true }) => {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration - in production, this would come from an indexer
  const mockHolders = [
    { address: '0x1234...5678', count: 15, change: '+2' },
    { address: '0x2345...6789', count: 12, change: '+1' },
    { address: '0x3456...7890', count: 10, change: '0' },
    { address: '0x4567...8901', count: 8, change: '+3' },
    { address: '0x5678...9012', count: 7, change: '-1' },
    { address: '0x6789...0123', count: 6, change: '+1' },
    { address: '0x7890...1234', count: 5, change: '0' },
    { address: '0x8901...2345', count: 4, change: '+2' },
    { address: '0x9012...3456', count: 3, change: '0' },
    { address: '0x0123...4567', count: 2, change: '+1' },
  ];
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setHolders(mockHolders.slice(0, limit));
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [limit]);
  
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };
  
  const getChangeClass = (change) => {
    if (!change) return '';
    if (change.startsWith('+')) return 'positive';
    if (change.startsWith('-')) return 'negative';
    return '';
  };
  
  if (loading) {
    return (
      <div className="leaderboard loading">
        <div className="leaderboard-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-rank"></div>
              <div className="skeleton-address"></div>
              <div className="skeleton-count"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <span className="leaderboard-title">🏆 Top Holders</span>
      </div>
      
      <div className="leaderboard-list">
        {holders.map((holder, index) => (
          <div key={holder.address} className="leaderboard-item">
            <div className="leaderboard-rank">
              {getRankBadge(index + 1)}
            </div>
            <div className="leaderboard-address">
              <a 
                href={`https://basescan.org/address/${holder.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {holder.address}
              </a>
            </div>
            <div className="leaderboard-count">
              {holder.count} NFTs
            </div>
            {showChange && holder.change && (
              <div className={`leaderboard-change ${getChangeClass(holder.change)}`}>
                {holder.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
