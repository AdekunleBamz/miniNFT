function Features() {
  const features = [
    {
      icon: '🎲',
      title: 'Random Minting',
      description: 'Each mint reveals a random NFT from the collection'
    },
    {
      icon: '⚡',
      title: 'Base Chain',
      description: 'Low gas fees on Ethereum L2'
    },
    {
      icon: '💰',
      title: 'Micro Price',
      description: 'Only 0.00001 ETH per NFT'
    },
    {
      icon: '🏆',
      title: '5 Rarities',
      description: 'Common to Legendary traits'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Verified smart contract on Base'
    },
    {
      icon: '🚀',
      title: 'Fast',
      description: '2 second block times'
    }
  ];

  return (
    <div className="features" id="about">
      <h2 className="section-title">Why MiniNFT?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
