import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <span className="logo-icon">💎</span>
        <span className="logo-text">MiniNFT</span>
        <Badge variant="info" size="small">Base Mainnet</Badge>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
      </button>
      
      <nav className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
        <a href="#mint" onClick={() => setIsMenuOpen(false)}>Mint</a>
        <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
        <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
      </nav>
      
      <div className="header-actions">
        <ThemeToggle />
        <ConnectButton />
      </div>
    </header>
  );
}

export default Header;
