import { useState, useEffect } from 'react';

const GasEstimator = ({ onEstimateChange }) => {
  const [gasData, setGasData] = useState({
    low: 0,
    average: 0,
    fast: 0,
    instant: 0,
    baseFee: 0
  });
  const [selectedSpeed, setSelectedSpeed] = useState('average');
  const [loading, setLoading] = useState(true);
  
  // Fetch gas estimates
  useEffect(() => {
    const fetchGas = async () => {
      try {
        // Using a simple estimation based on Base network
        // In production, use an actual gas oracle API
        const mockGasData = {
          low: 0.000001,
          average: 0.000002,
          fast: 0.000003,
          instant: 0.000005,
          baseFee: 0.0000005
        };
        
        setGasData(mockGasData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch gas:', error);
        setLoading(false);
      }
    };
    
    fetchGas();
    const interval = setInterval(fetchGas, 15000); // Update every 15s
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (onEstimateChange) {
      onEstimateChange(gasData[selectedSpeed]);
    }
  }, [selectedSpeed, gasData, onEstimateChange]);
  
  const speeds = [
    { key: 'low', label: 'Slow', icon: '🐢', time: '~5 min' },
    { key: 'average', label: 'Normal', icon: '🚗', time: '~1 min' },
    { key: 'fast', label: 'Fast', icon: '🚀', time: '~30 sec' },
    { key: 'instant', label: 'Instant', icon: '⚡', time: '~10 sec' }
  ];
  
  const formatGas = (value) => {
    if (!value) return '---';
    return `${value.toFixed(6)} ETH`;
  };
  
  if (loading) {
    return (
      <div className="gas-estimator loading">
        <div className="gas-loading-text">Fetching gas prices...</div>
      </div>
    );
  }
  
  return (
    <div className="gas-estimator">
      <div className="gas-header">
        <span className="gas-icon">⛽</span>
        <span className="gas-title">Gas Estimate</span>
        <span className="gas-base-fee">Base: {formatGas(gasData.baseFee)}</span>
      </div>
      
      <div className="gas-speeds">
        {speeds.map((speed) => (
          <button
            key={speed.key}
            className={`gas-speed-btn ${selectedSpeed === speed.key ? 'active' : ''}`}
            onClick={() => setSelectedSpeed(speed.key)}
          >
            <span className="gas-speed-icon">{speed.icon}</span>
            <span className="gas-speed-label">{speed.label}</span>
            <span className="gas-speed-price">{formatGas(gasData[speed.key])}</span>
            <span className="gas-speed-time">{speed.time}</span>
          </button>
        ))}
      </div>
      
      <div className="gas-summary">
        <span className="gas-selected-label">Selected:</span>
        <span className="gas-selected-value">{formatGas(gasData[selectedSpeed])}</span>
      </div>
    </div>
  );
};

export default GasEstimator;
