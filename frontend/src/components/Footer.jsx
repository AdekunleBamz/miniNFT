import { CONTRACT_ADDRESS } from '../contract';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-icon">💎</span>
          <span>MiniNFT</span>
        </div>
        <p className="footer-tagline">505 unique NFTs on Base Chain</p>
        <div className="footer-links">
          <a 
            href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 Contract
          </a>
          <a 
            href="https://opensea.io/collection/mininft"
            target="_blank"
            rel="noopener noreferrer"
          >
            🖼️ OpenSea
          </a>
          <a 
            href="https://github.com/phessophissy/miniNFT"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 GitHub
          </a>
        </div>
        <p className="footer-copy">© 2026 MiniNFT | Built on Base</p>
      </div>
    </footer>
  );
}

export default Footer;
