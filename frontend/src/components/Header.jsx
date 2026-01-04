import { ConnectButton } from '@rainbow-me/rainbowkit';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">💎</span>
        <span className="logo-text">MiniNFT</span>
      </div>
      <nav className="nav-links">
        <a href="#mint">Mint</a>
        <a href="#gallery">Gallery</a>
        <a href="#about">About</a>
      </nav>
      <ConnectButton />
    </header>
  );
}

export default Header;
