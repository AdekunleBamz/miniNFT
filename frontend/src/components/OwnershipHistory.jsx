/**
 * OwnershipHistory component to display NFT transfer history
 */
import React, { useState, useEffect } from 'react';

export function OwnershipHistory({ tokenId, contractAddress, transfers = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayTransfers = isExpanded ? transfers : transfers.slice(0, 3);

  return (
    <div className="ownership-history">
      <div className="ownership-history__header">
        <h3 className="ownership-history__title">
          <HistoryIcon />
          Ownership History
        </h3>
        <span className="ownership-history__count">
          {transfers.length} transfer{transfers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="ownership-history__timeline">
        {displayTransfers.map((transfer, index) => (
          <div key={index} className="ownership-history__item">
            <div className="ownership-history__connector">
              <div className="ownership-history__dot" />
              {index < displayTransfers.length - 1 && (
                <div className="ownership-history__line" />
              )}
            </div>

            <div className="ownership-history__content">
              <div className="ownership-history__event">
                <span className="ownership-history__type">
                  {transfer.type === 'mint' ? 'Minted' : 'Transferred'}
                </span>
                <a
                  href={`https://basescan.org/tx/${transfer.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ownership-history__tx-link"
                >
                  <ExternalLinkIcon />
                </a>
              </div>

              <div className="ownership-history__addresses">
                {transfer.type !== 'mint' && (
                  <>
                    <AddressDisplay address={transfer.from} label="From" />
                    <ArrowIcon />
                  </>
                )}
                <AddressDisplay address={transfer.to} label="To" />
              </div>

              <div className="ownership-history__meta">
                <span className="ownership-history__date">
                  {formatDate(transfer.timestamp)}
                </span>
                {transfer.price && (
                  <span className="ownership-history__price">
                    {transfer.price} ETH
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {transfers.length > 3 && (
        <button
          className="ownership-history__toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : `Show ${transfers.length - 3} More`}
        </button>
      )}
    </div>
  );
}

function AddressDisplay({ address, label }) {
  if (!address) return null;

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const isZeroAddress = address === '0x0000000000000000000000000000000000000000';

  return (
    <div className="address-display">
      <span className="address-display__label">{label}</span>
      <a
        href={`https://basescan.org/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="address-display__value"
      >
        {isZeroAddress ? 'Null Address' : truncated}
      </a>
    </div>
  );
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
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

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default OwnershipHistory;
