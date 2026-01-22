/**
 * ConnectWallet component with enhanced wallet connection UI
 */
import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet({ 
  showBalance = true, 
  showNetwork = true,
  size = 'medium',
  variant = 'default',
  className = '' 
}) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            className={`connect-wallet connect-wallet--${size} connect-wallet--${variant} ${className}`}
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="connect-wallet__button connect-wallet__button--connect"
                  >
                    <WalletIcon />
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="connect-wallet__button connect-wallet__button--wrong-network"
                  >
                    <WarningIcon />
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <div className="connect-wallet__connected">
                  {showNetwork && (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="connect-wallet__network"
                      title={chain.name}
                    >
                      {chain.hasIcon && (
                        <div
                          className="connect-wallet__chain-icon"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              width={16}
                              height={16}
                            />
                          )}
                        </div>
                      )}
                      <span className="connect-wallet__chain-name">{chain.name}</span>
                    </button>
                  )}

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="connect-wallet__account"
                  >
                    {account.ensAvatar ? (
                      <img
                        src={account.ensAvatar}
                        alt="ENS Avatar"
                        className="connect-wallet__avatar"
                      />
                    ) : (
                      <div
                        className="connect-wallet__avatar connect-wallet__avatar--generated"
                        style={{ background: generateGradient(account.address) }}
                      />
                    )}
                    
                    <div className="connect-wallet__info">
                      <span className="connect-wallet__address">
                        {account.ensName || account.displayName}
                      </span>
                      {showBalance && account.displayBalance && (
                        <span className="connect-wallet__balance">
                          {account.displayBalance}
                        </span>
                      )}
                    </div>
                    
                    <ChevronDownIcon />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

function WalletIcon() {
  return (
    <svg className="connect-wallet__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="connect-wallet__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="connect-wallet__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function generateGradient(address) {
  const seed = parseInt(address.slice(2, 10), 16);
  const hue1 = seed % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
}

export default ConnectWallet;
