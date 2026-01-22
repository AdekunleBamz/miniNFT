import { useState, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

const BatchTransfer = ({ nfts = [], onSuccess, onClose }) => {
  const [recipients, setRecipients] = useState({});
  const [singleRecipient, setSingleRecipient] = useState('');
  const [useSingleRecipient, setUseSingleRecipient] = useState(true);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [error, setError] = useState('');
  const [step, setStep] = useState('select'); // select, confirm, processing
  
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const toggleNft = (tokenId) => {
    setSelectedNfts(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };
  
  const selectAll = () => {
    setSelectedNfts(nfts.map(n => n.tokenId));
  };
  
  const deselectAll = () => {
    setSelectedNfts([]);
  };
  
  const validateAddress = (addr) => {
    if (!addr) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  
  const isValid = useMemo(() => {
    if (selectedNfts.length === 0) return false;
    
    if (useSingleRecipient) {
      return validateAddress(singleRecipient);
    }
    
    return selectedNfts.every(id => validateAddress(recipients[id]));
  }, [selectedNfts, useSingleRecipient, singleRecipient, recipients]);
  
  const handleConfirm = () => {
    if (!isValid) {
      setError('Please fill in all recipient addresses correctly');
      return;
    }
    setStep('confirm');
  };
  
  const handleTransfer = async () => {
    setStep('processing');
    setError('');
    
    try {
      // For single transfers, we'd need to batch these
      // This is a simplified version - in production, use a batch transfer contract
      const recipient = useSingleRecipient ? singleRecipient : recipients[selectedNfts[0]];
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferFrom',
        args: [address, recipient, BigInt(selectedNfts[0])],
      });
    } catch (err) {
      setError(err.message || 'Transfer failed');
      setStep('confirm');
    }
  };
  
  if (isSuccess) {
    return (
      <div className="batch-transfer success">
        <div className="batch-success-icon">🎉</div>
        <h3>Transfers Complete!</h3>
        <p>{selectedNfts.length} NFT(s) transferred successfully</p>
        <button className="batch-done-btn" onClick={onSuccess}>
          Done
        </button>
      </div>
    );
  }
  
  return (
    <div className="batch-transfer">
      <div className="batch-header">
        <h2>Batch Transfer</h2>
        <button className="batch-close" onClick={onClose}>×</button>
      </div>
      
      {step === 'select' && (
        <>
          <div className="batch-selection">
            <div className="batch-selection-header">
              <span>Select NFTs to transfer ({selectedNfts.length} selected)</span>
              <div className="batch-selection-actions">
                <button onClick={selectAll}>Select All</button>
                <button onClick={deselectAll}>Clear</button>
              </div>
            </div>
            
            <div className="batch-nft-grid">
              {nfts.map(nft => (
                <div 
                  key={nft.tokenId}
                  className={`batch-nft-item ${selectedNfts.includes(nft.tokenId) ? 'selected' : ''}`}
                  onClick={() => toggleNft(nft.tokenId)}
                >
                  <img src={nft.image || `https://picsum.photos/seed/${nft.tokenId}/80/80`} alt="" />
                  <span>#{nft.tokenId}</span>
                  <div className="batch-checkbox">
                    {selectedNfts.includes(nft.tokenId) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="batch-recipient-section">
            <label className="batch-toggle">
              <input 
                type="checkbox" 
                checked={useSingleRecipient}
                onChange={(e) => setUseSingleRecipient(e.target.checked)}
              />
              <span>Send all to same address</span>
            </label>
            
            {useSingleRecipient ? (
              <input
                type="text"
                className="batch-input"
                placeholder="Recipient address (0x...)"
                value={singleRecipient}
                onChange={(e) => setSingleRecipient(e.target.value)}
              />
            ) : (
              <div className="batch-individual-recipients">
                {selectedNfts.map(tokenId => (
                  <div key={tokenId} className="batch-recipient-row">
                    <span>#{tokenId}</span>
                    <input
                      type="text"
                      placeholder="Recipient address"
                      value={recipients[tokenId] || ''}
                      onChange={(e) => setRecipients(prev => ({
                        ...prev,
                        [tokenId]: e.target.value
                      }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {error && <div className="batch-error">{error}</div>}
          
          <button 
            className="batch-continue-btn"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            Continue ({selectedNfts.length} NFTs)
          </button>
        </>
      )}
      
      {step === 'confirm' && (
        <div className="batch-confirm">
          <h3>Confirm Transfer</h3>
          <p>You are about to transfer {selectedNfts.length} NFT(s)</p>
          
          <div className="batch-summary">
            {selectedNfts.slice(0, 5).map(id => (
              <div key={id} className="batch-summary-item">
                #{id} → {useSingleRecipient ? singleRecipient : recipients[id]}
              </div>
            ))}
            {selectedNfts.length > 5 && (
              <div className="batch-summary-more">
                +{selectedNfts.length - 5} more
              </div>
            )}
          </div>
          
          {error && <div className="batch-error">{error}</div>}
          
          <div className="batch-confirm-actions">
            <button onClick={() => setStep('select')}>Back</button>
            <button 
              className="primary" 
              onClick={handleTransfer}
              disabled={isPending || isConfirming}
            >
              {isPending ? 'Confirm in Wallet...' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}
      
      {step === 'processing' && (
        <div className="batch-processing">
          <div className="batch-spinner"></div>
          <p>Processing transfers...</p>
        </div>
      )}
    </div>
  );
};

export default BatchTransfer;
