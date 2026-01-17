# 💎 MiniNFT

A collection of 505 unique NFTs on Base Chain with micro-pricing.

![MiniNFT Banner](https://img.shields.io/badge/Base-Chain-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![NFTs](https://img.shields.io/badge/NFTs-505-purple)

## ✨ Features

- **505 Unique NFTs** - Each NFT is uniquely generated
- **Random Minting** - Get a random NFT from the collection
- **Micro Price** - Only 0.00001 ETH per mint
- **Batch Minting** - Mint up to 10 NFTs at once
- **5 Rarity Tiers** - Common, Uncommon, Rare, Epic, Legendary
- **Base Chain** - Low gas fees on Ethereum L2

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Foundry](https://getfoundry.sh/)

### Smart Contract

```bash
# Install dependencies
forge install

# Build
forge build

# Test
forge test

# Deploy (update .env first)
forge script script/DeployMiniNFT.s.sol --rpc-url base --broadcast
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📜 Contract Details

| Property | Value |
|----------|-------|
| Network | Base Mainnet |
| Contract | `0x80203c0838a1cABe0eAbc0aC9e22f6Abd512cAa9` |
| Max Supply | 505 |
| Mint Price | 0.00001 ETH |
| Max per Batch | 10 |

🔍 **[View on BaseScan](https://basescan.org/address/0x80203c0838a1cABe0eAbc0aC9e22f6Abd512cAa9)**

## 🏗️ Architecture

```
miniNFT/
├── src/
│   └── MiniNFT.sol          # Main NFT contract (ERC721)
├── test/
│   └── MiniNFT.t.sol        # Foundry tests
├── frontend/
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js            # Service worker
│   ├── src/
│   │   ├── components/      # 50+ React components
│   │   ├── hooks/           # 20+ custom hooks
│   │   ├── utils/           # Utility functions
│   │   ├── constants/       # App configuration
│   │   ├── App.jsx          # Main app
│   │   └── contract.js      # Contract config
│   └── package.json
└── foundry.toml
```

## 🛠️ Tech Stack

### Smart Contract
- **Solidity** - Smart contract language
- **Foundry** - Development framework
- **OpenZeppelin** - ERC721 implementation

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum
- **RainbowKit** - Wallet connection UI

## 📦 Frontend Features

### Components (50+)
- **Core**: Header, Footer, MintCard, Gallery, Stats
- **UI**: Modal, Toast, Tooltip, Badge, Card, Spinner
- **NFT**: NFTCard, NFTDetailModal, ShareMenu, FavoriteButton
- **Wallet**: ConnectWallet, NetworkBadge, WalletAddress
- **Forms**: SearchInput, SortSelect, FilterBar, Pagination
- **Feedback**: ErrorBoundary, Notification, Alert, Skeleton
- **Advanced**: TransferModal, BatchTransfer, Leaderboard, GasEstimator

### Custom Hooks (20+)
- **Contract**: useNFTContract, useWallet, useTransactionHistory
- **State**: useLocalStorage, useFavorites, useGalleryFilters
- **UI**: useTheme, useSound, useConfetti, useCountdown
- **Utilities**: useClipboard, useDebounce, useMediaQuery, useForm
- **DOM**: useScrollPosition, useIntersectionObserver, useClickOutside

### Utilities
- **format.js** - Number and address formatting
- **validation.js** - Input validation
- **storage.js** - LocalStorage helpers
- **nft.js** - IPFS and metadata utilities
- **animations.js** - Animation functions
- **web3.js** - Blockchain utilities

## 🔧 Contract Functions

### Read Functions
- `remainingSupply()` - Get available NFTs count
- `totalSupply()` - Get minted NFTs count
- `balanceOf(address)` - Get user's NFT count
- `tokenURI(uint256)` - Get NFT metadata URI

### Write Functions
- `mint()` - Mint 1 random NFT (0.00001 ETH)
- `mintBatch(quantity)` - Mint multiple NFTs (max 10)

### Owner Functions
- `setBaseURI(string)` - Update metadata URI
- `withdraw()` - Withdraw contract balance

## 🎨 NFT Rarity Distribution

| Tier | Probability | Count |
|------|-------------|-------|
| Common | 40% | ~202 |
| Uncommon | 30% | ~152 |
| Rare | 18% | ~91 |
| Epic | 9% | ~45 |
| Legendary | 3% | ~15 |

## 🔗 Links

- [Contract on BaseScan](https://basescan.org/address/0x80203c0838a1cABe0eAbc0aC9e22f6Abd512cAa9)
- [OpenSea Collection](https://opensea.io/collection/mininft)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ on Base Chain
