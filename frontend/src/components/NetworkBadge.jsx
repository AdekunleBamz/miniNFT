function NetworkBadge({ chainId, chainName, isConnected }) {
  const getNetworkInfo = () => {
    switch (chainId) {
      case 8453:
        return { name: 'Base', color: '#0052ff', icon: '🔵' };
      case 84532:
        return { name: 'Base Sepolia', color: '#0052ff', icon: '🧪' };
      case 1:
        return { name: 'Ethereum', color: '#627eea', icon: '⟠' };
      case 11155111:
        return { name: 'Sepolia', color: '#627eea', icon: '🧪' };
      case 137:
        return { name: 'Polygon', color: '#8247e5', icon: '🟣' };
      case 42161:
        return { name: 'Arbitrum', color: '#28a0f0', icon: '🔷' };
      case 10:
        return { name: 'Optimism', color: '#ff0420', icon: '🔴' };
      default:
        return { name: chainName || 'Unknown', color: '#666', icon: '🔗' };
    }
  };

  if (!isConnected) {
    return (
      <div className="network-badge network-badge-disconnected">
        <span className="network-icon">🔌</span>
        <span className="network-name">Not Connected</span>
      </div>
    );
  }

  const network = getNetworkInfo();

  return (
    <div 
      className="network-badge"
      style={{ '--network-color': network.color }}
    >
      <span className="network-icon">{network.icon}</span>
      <span className="network-name">{network.name}</span>
      <span className="network-status" />
    </div>
  );
}

export default NetworkBadge;
