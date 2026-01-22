import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';

const TransferModal = ({ nft, isOpen, onClose, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const { address } = useAccount();
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const validateAddress = (addr) => {
    if (!addr) return 'Recipient address is required';
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) return 'Invalid Ethereum address';
    if (addr.toLowerCase() === address?.toLowerCase()) return 'Cannot transfer to yourself';
    return '';
  };
  
  const handleTransfer = async () => {
    const validationError = validateAddress(recipient);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferFrom',
        args: [address, recipient, BigInt(nft.tokenId)],
      });
    } catch (err) {
      setError(err.message || 'Transfer failed');
    }
  };
  
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
    setRecipient('');
  };
  
  if (!isOpen) return null;
  
  if (isSuccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="transfer-modal success" onClick={(e) => e.stopPropagation()}>
          <div className="transfer-success-icon">✅</div>
          <h3>Transfer Successful!</h3>
          <p>NFT #{nft?.tokenId} has been transferred</p>
          <a 
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transfer-tx-link"
          >
            View Transaction
          </a>
          <button className="transfer-done-btn" onClick={handleSuccess}>
            Done
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="transfer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="transfer-title">Transfer NFT</h2>
        
        <div className="transfer-nft-preview">
          <img 
            src={nft?.image || `https://picsum.photos/seed/${nft?.tokenId}/100/100`} 
            alt={`NFT #${nft?.tokenId}`}
          />
          <span>MiniNFT #{nft?.tokenId}</span>
        </div>
        
        <div className="transfer-form">
          <label className="transfer-label">Recipient Address</label>
          <input
            type="text"
            className="transfer-input"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setError('');
            }}
            disabled={isPending || isConfirming}
          />
          
          {error && <div className="transfer-error">{error}</div>}
          
          <div className="transfer-warning">
            ⚠️ Make sure the recipient address is correct. This action cannot be undone.
          </div>
          
          <button
            className="transfer-submit-btn"
            onClick={handleTransfer}
            disabled={isPending || isConfirming || !recipient}
          >
            {isPending && 'Confirm in Wallet...'}
            {isConfirming && 'Transferring...'}
            {!isPending && !isConfirming && 'Transfer NFT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
