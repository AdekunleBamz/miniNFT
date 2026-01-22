import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';

const TransactionHistory = ({ transactions = [], maxItems = 5, showViewAll = true }) => {
  const { address } = useAccount();
  const [expanded, setExpanded] = useState(false);
  
  const displayTransactions = expanded ? transactions : transactions.slice(0, maxItems);
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'mint':
        return '🎨';
      case 'transfer':
        return '📤';
      case 'receive':
        return '📥';
      case 'approve':
        return '✅';
      default:
        return '📝';
    }
  };
  
  const getTransactionLabel = (type) => {
    switch (type) {
      case 'mint':
        return 'Minted NFT';
      case 'transfer':
        return 'Transferred';
      case 'receive':
        return 'Received';
      case 'approve':
        return 'Approved';
      default:
        return 'Transaction';
    }
  };
  
  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  if (!transactions.length) {
    return (
      <div className="transaction-history empty">
        <div className="transaction-empty-icon">📋</div>
        <p className="transaction-empty-text">No transactions yet</p>
      </div>
    );
  }
  
  return (
    <div className="transaction-history">
      <div className="transaction-list">
        {displayTransactions.map((tx, index) => (
          <div key={tx.hash || index} className="transaction-item">
            <div className="transaction-icon">
              {getTransactionIcon(tx.type)}
            </div>
            <div className="transaction-details">
              <div className="transaction-label">
                {getTransactionLabel(tx.type)}
                {tx.tokenId && <span className="transaction-token-id">#{tx.tokenId}</span>}
              </div>
              <div className="transaction-meta">
                <a 
                  href={`https://basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transaction-hash"
                >
                  {truncateHash(tx.hash)}
                </a>
                <span className="transaction-time">{formatTime(tx.timestamp)}</span>
              </div>
            </div>
            <div className={`transaction-status ${tx.status}`}>
              {tx.status === 'confirmed' && '✓'}
              {tx.status === 'pending' && '⏳'}
              {tx.status === 'failed' && '✗'}
            </div>
          </div>
        ))}
      </div>
      
      {showViewAll && transactions.length > maxItems && (
        <button 
          className="transaction-view-all"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : `View All (${transactions.length})`}
        </button>
      )}
    </div>
  );
};

export default TransactionHistory;
