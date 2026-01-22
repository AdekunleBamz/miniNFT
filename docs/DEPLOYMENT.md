# 🚀 Deployment Guide

This guide covers deploying the MiniNFT smart contract and frontend application.

## 📋 Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- [Node.js](https://nodejs.org/) v18+ installed
- MetaMask or similar wallet with Base ETH
- BaseScan API key for verification
- IPFS metadata uploaded

## 🔗 Network Configuration

### Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org

### Base Sepolia (Testnet)
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## 📦 Smart Contract Deployment

### 1. Environment Setup

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Metadata base URI (IPFS)
BASE_URI=ipfs://QmYourMetadataCID/

# BaseScan API key
BASESCAN_API_KEY=your_api_key_here

# RPC URLs (optional, defaults provided)
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 2. Build Contract

```bash
forge build
```

### 3. Run Tests

```bash
forge test -vvv
```

### 4. Deploy to Testnet (Recommended First)

```bash
# Using Makefile
make deploy-testnet

# Or directly
forge script script/Deploy.s.sol:DeployMiniNFTTestnet \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

### 5. Deploy to Mainnet

```bash
# Using Makefile
make deploy-mainnet

# Or directly
forge script script/Deploy.s.sol:DeployMiniNFT \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --verify
```

### 6. Verify Contract (if not auto-verified)

```bash
forge verify-contract \
  CONTRACT_ADDRESS \
  src/MiniNFT.sol:MiniNFT \
  --chain base \
  --constructor-args $(cast abi-encode "constructor(string,string,string)" "MiniNFT" "MNFT" "ipfs://YOUR_CID/")
```

### 7. Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on BaseScan
- [ ] Owner address is correct
- [ ] Base URI is set correctly
- [ ] Mint a test NFT
- [ ] Verify metadata loads correctly

## 🎨 NFT Metadata Setup

### Metadata Structure

Each NFT should have a JSON file at `{baseURI}/{tokenId}`:

```json
{
  "name": "MiniNFT #1",
  "description": "A unique MiniNFT from the collection",
  "image": "ipfs://QmImageCID/1.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Rare"
    }
  ]
}
```

### Upload to IPFS

Using Pinata:
```bash
# Install Pinata CLI
npm install -g @pinata/cli

# Upload metadata folder
pinata upload ./metadata
```

Using IPFS CLI:
```bash
# Add directory to IPFS
ipfs add -r ./metadata

# Pin to ensure persistence
ipfs pin add QmYourCID
```

## 🌐 Frontend Deployment

### 1. Update Contract Address

Edit `frontend/src/contract.js`:

```javascript
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 3. Deploy Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### IPFS

```bash
# Build and upload
npm run build
ipfs add -r dist
```

### 4. Environment Variables (Production)

Set these in your hosting platform:

```env
VITE_CONTRACT_ADDRESS=0xYourContract
VITE_CHAIN_ID=8453
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 🔧 Contract Interaction

### Using Cast (Foundry)

```bash
# Check remaining supply
cast call $CONTRACT_ADDRESS "remainingSupply()" --rpc-url $BASE_RPC_URL

# Mint NFT
cast send $CONTRACT_ADDRESS "mint()" \
  --value 0.00001ether \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY

# Check balance
cast call $CONTRACT_ADDRESS "balanceOf(address)" $WALLET_ADDRESS --rpc-url $BASE_RPC_URL
```

### Using Makefile

```bash
# Check status
make status

# Mint
make mint

# Batch mint
MINT_QUANTITY=5 make mint-batch

# Withdraw funds
make withdraw
```

## 🔒 Security Checklist

- [ ] Private key is secure and not committed
- [ ] Contract is verified on block explorer
- [ ] Owner wallet uses hardware wallet for production
- [ ] Environment variables are properly set
- [ ] Frontend uses HTTPS only
- [ ] No sensitive data in client-side code

## 🐛 Troubleshooting

### Contract Deployment Fails

1. Check gas balance
2. Verify RPC URL is correct
3. Check private key format (no 0x prefix)
4. Try increasing gas limit

### Verification Fails

1. Ensure correct Solidity version
2. Match constructor arguments exactly
3. Check API key is valid
4. Try manual verification on BaseScan

### Frontend Issues

1. Clear browser cache
2. Check contract address is correct
3. Verify network configuration
4. Check console for errors

## 📚 Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Base Documentation](https://docs.base.org/)
- [BaseScan API](https://docs.basescan.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

Need help? Open an issue or reach out to the maintainers.
