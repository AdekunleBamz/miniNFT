function RecentMints({ mints }) {
  if (!mints || mints.length === 0) return null;

  return (
    <div className="recent-mints">
      <h3>🎉 Your Recent Mints</h3>
      <div className="recent-list">
        {mints.map((mint, index) => (
          <div key={index} className="recent-item">
            <div className="recent-info">
              <span className="recent-time">{mint.timestamp}</span>
              {mint.quantity && (
                <span className="recent-quantity">{mint.quantity} NFT{mint.quantity > 1 ? 's' : ''}</span>
              )}
            </div>
            <a 
              href={`https://basescan.org/tx/${mint.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="recent-link"
            >
              View TX →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentMints;
