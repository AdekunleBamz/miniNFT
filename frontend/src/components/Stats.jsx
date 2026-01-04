import { MINT_PRICE, MAX_SUPPLY } from '../contract';

function Stats({ minted, remaining, userBalance, isConnected }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">🔥</div>
        <div className="stat-value">{minted}</div>
        <div className="stat-label">Minted</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✨</div>
        <div className="stat-value">{remaining}</div>
        <div className="stat-label">Remaining</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-value">{MINT_PRICE} ETH</div>
        <div className="stat-label">Price</div>
      </div>
      {isConnected && (
        <div className="stat-card highlight">
          <div className="stat-icon">🎨</div>
          <div className="stat-value">{userBalance || 0}</div>
          <div className="stat-label">You Own</div>
        </div>
      )}
    </div>
  );
}

export default Stats;
