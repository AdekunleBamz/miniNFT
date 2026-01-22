/**
 * MintProgress component to display minting transaction status
 */
import React from 'react';
import Spinner from './Spinner';

const MINT_STATES = {
  idle: {
    label: 'Ready to Mint',
    icon: '💎',
    color: 'var(--primary)',
  },
  confirming: {
    label: 'Confirm in Wallet',
    icon: '👛',
    color: 'var(--secondary)',
  },
  pending: {
    label: 'Transaction Pending',
    icon: '⏳',
    color: '#f59e0b',
  },
  success: {
    label: 'Mint Successful!',
    icon: '🎉',
    color: 'var(--success)',
  },
  error: {
    label: 'Mint Failed',
    icon: '❌',
    color: 'var(--error)',
  },
};

export function MintProgress({ 
  state = 'idle', 
  txHash,
  tokenId,
  error,
  onRetry,
  onViewNFT,
  className = '' 
}) {
  const stateConfig = MINT_STATES[state] || MINT_STATES.idle;
  const isPending = state === 'confirming' || state === 'pending';

  return (
    <div className={`mint-progress mint-progress--${state} ${className}`}>
      <div className="mint-progress__status">
        <div className="mint-progress__icon-wrapper">
          {isPending ? (
            <Spinner size="large" />
          ) : (
            <span className="mint-progress__icon">{stateConfig.icon}</span>
          )}
        </div>
        
        <span 
          className="mint-progress__label"
          style={{ color: stateConfig.color }}
        >
          {stateConfig.label}
        </span>
      </div>

      {state === 'pending' && txHash && (
        <div className="mint-progress__tx">
          <span className="mint-progress__tx-label">Transaction:</span>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mint-progress__tx-link"
          >
            {`${txHash.slice(0, 10)}...${txHash.slice(-8)}`}
            <ExternalLinkIcon />
          </a>
        </div>
      )}

      {state === 'success' && tokenId && (
        <div className="mint-progress__success">
          <p className="mint-progress__token">
            You minted <strong>MiniNFT #{tokenId}</strong>
          </p>
          <div className="mint-progress__actions">
            <button
              className="mint-progress__btn mint-progress__btn--primary"
              onClick={onViewNFT}
            >
              View NFT
            </button>
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mint-progress__btn mint-progress__btn--secondary"
              >
                View Transaction
              </a>
            )}
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="mint-progress__error">
          <p className="mint-progress__error-message">
            {error || 'Something went wrong. Please try again.'}
          </p>
          <button
            className="mint-progress__btn mint-progress__btn--primary"
            onClick={onRetry}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="mint-progress__steps">
        <ProgressStep 
          step={1} 
          label="Confirm" 
          completed={['pending', 'success'].includes(state)}
          active={state === 'confirming'}
        />
        <ProgressStep 
          step={2} 
          label="Processing" 
          completed={state === 'success'}
          active={state === 'pending'}
        />
        <ProgressStep 
          step={3} 
          label="Complete" 
          completed={state === 'success'}
          active={false}
        />
      </div>
    </div>
  );
}

function ProgressStep({ step, label, completed, active }) {
  return (
    <div className={`progress-step ${completed ? 'progress-step--completed' : ''} ${active ? 'progress-step--active' : ''}`}>
      <div className="progress-step__indicator">
        {completed ? (
          <CheckIcon />
        ) : (
          <span>{step}</span>
        )}
      </div>
      <span className="progress-step__label">{label}</span>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default MintProgress;
