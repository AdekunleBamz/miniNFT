# MiniNFT - NFT Minting Platform on Base

A complete NFT minting platform featuring 505 unique NFTs on Base Chain mainnet.

## 📁 Project Structure

```
miniNFT/
├── src/                    # Solidity contracts
│   └── MiniNFT.sol         # Main NFT contract
├── script/                 # Foundry deployment scripts
│   └── DeployMiniNFT.s.sol # Deployment script
├── scripts/                # Node.js utility scripts
│   ├── generateMetadata.js # Generate 505 NFT metadata files
│   ├── mint.js             # Batch minting script for 15 wallets
│   └── metadata/           # Generated metadata files
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── contract.js     # Contract ABI and address
│   │   ├── main.jsx        # Entry point with Web3 providers
│   │   └── index.css       # Styles
│   └── index.html
├── test/                   # Foundry tests
└── lib/                    # Dependencies (OpenZeppelin, forge-std)
```

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js v18+
- A wallet with ETH on Base mainnet

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with your private key and other settings
```

### 2. Build Contracts

```bash
~/.foundry/bin/forge build
```

### 3. Generate Metadata

```bash
node scripts/generateMetadata.js
```

This creates 505 unique metadata files in `scripts/metadata/`.

**Next steps for metadata:**
1. Create/generate images for each NFT
2. Upload images to IPFS
3. Update `image` field in metadata with IPFS CID
4. Upload metadata folder to IPFS
5. Use metadata CID as `BASE_URI` when deploying

### 4. Deploy Contract

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_URI=ipfs://your_metadata_cid/
export BASE_RPC_URL=https://mainnet.base.org
export BASESCAN_API_KEY=your_basescan_api_key

# Deploy
~/.foundry/bin/forge script script/DeployMiniNFT.s.sol \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify
```

### 5. Update Contract Address

After deployment, update the contract address in:
- `.env` - set `NFT_CONTRACT_ADDRESS`
- `frontend/src/contract.js` - update `CONTRACT_ADDRESS`

### 6. Run Batch Minting Script

```bash
# Add to .env
export NFT_CONTRACT_ADDRESS=0x...your_deployed_address
export MINTS_PER_WALLET=2

# Run minting
node scripts/mint.js
```

### 7. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📜 Smart Contract

### MiniNFT.sol

- **Max Supply:** 505 NFTs
- **Mint Price:** 0.00001 ETH
- **Random Minting:** Each mint reveals a random NFT
- **Batch Minting:** Mint up to 10 NFTs at once

#### Key Functions

```solidity
// Mint single NFT
function mint() external payable;

// Mint multiple NFTs (max 10)
function mintBatch(uint256 quantity) external payable;

// View remaining supply
function remainingSupply() external view returns (uint256);
```

## 🖥️ Frontend Features

- Connect wallet via RainbowKit
- Real-time minting stats
- Quantity selector (1-10 NFTs)
- Transaction tracking
- Mobile responsive design

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Deployer wallet private key |
| `BASE_URI` | IPFS URI for metadata |
| `BASESCAN_API_KEY` | BaseScan API key |
| `BASE_RPC_URL` | RPC endpoint |
| `NFT_CONTRACT_ADDRESS` | Deployed contract address |
| `MINTS_PER_WALLET` | NFTs each wallet mints |

## 📊 NFT Rarity Distribution

| Rarity | Approximate % |
|--------|---------------|
| Common | ~50% |
| Uncommon | ~30% |
| Rare | ~15% |
| Epic | ~5% |
| Legendary | ~1% |

## 📄 License

MIT
