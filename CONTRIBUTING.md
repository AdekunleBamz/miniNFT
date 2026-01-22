# Contributing to MiniNFT

Thank you for your interest in contributing to MiniNFT! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Foundry** for smart contract development
- **Git** for version control
- **MetaMask** or similar wallet for testing

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/miniNFT.git
   cd miniNFT
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/AdekunleBamz/miniNFT.git
   ```

## 💻 Development Setup

### Smart Contracts

```bash
# Install Foundry dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run tests with gas report
forge test --gas-report
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Required variables:
- `PRIVATE_KEY` - Deployer wallet private key (for deployment only)
- `BASE_URI` - IPFS base URI for metadata
- `BASESCAN_API_KEY` - For contract verification

## ✏️ Making Changes

### Branch Naming

Use descriptive branch names:
- `feat/add-batch-transfer` - New features
- `fix/mint-overflow` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/optimize-gas` - Code refactoring
- `test/add-fuzz-tests` - Adding tests

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, no code change
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

Examples:
```
feat(contract): add batch minting function
fix(frontend): resolve wallet connection issue
docs(readme): add deployment instructions
test(contract): add fuzz tests for mint function
```

## 📤 Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a branch**:
   ```bash
   git checkout -b feat/your-feature
   ```

3. **Make changes** and commit following the guidelines

4. **Push to your fork**:
   ```bash
   git push origin feat/your-feature
   ```

5. **Open a Pull Request** on GitHub

### PR Requirements

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated if needed
- [ ] Follows coding standards
- [ ] Signed commits (GPG)

## 📏 Coding Standards

### Solidity

- Use Solidity version ^0.8.24
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Add NatSpec comments for all public functions
- Use custom errors instead of require strings
- Optimize for gas efficiency

```solidity
/// @notice Mint a new NFT
/// @param quantity Number of NFTs to mint
/// @return tokenIds Array of minted token IDs
function mintBatch(uint256 quantity) external payable returns (uint256[] memory tokenIds) {
    if (quantity == 0) revert InvalidQuantity();
    // ...
}
```

### JavaScript/React

- Use ES6+ syntax
- Use functional components and hooks
- PropTypes or TypeScript for type checking
- Meaningful variable and function names

```javascript
// ✅ Good
const handleMintClick = useCallback(async () => {
  setIsLoading(true);
  try {
    await writeContract({ ... });
  } finally {
    setIsLoading(false);
  }
}, [writeContract]);

// ❌ Bad
const fn = () => {
  loading = true;
  contract.mint();
}
```

### CSS

- Use CSS variables for theming
- Mobile-first approach
- BEM or similar naming convention

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testMint

# Run with verbosity
forge test -vvv

# Run fuzz tests
forge test --match-path test/MiniNFT.fuzz.t.sol

# Generate gas report
forge test --gas-report
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Test Requirements

- All new features must have tests
- Maintain or improve code coverage
- Include edge cases and error scenarios
- Add fuzz tests for numeric inputs

## 📚 Documentation

### Code Comments

- Add NatSpec comments for Solidity
- JSDoc for JavaScript functions
- Explain complex logic

### README Updates

Update README.md when:
- Adding new features
- Changing API/functions
- Modifying deployment process

## 🔒 Security

### Reporting Vulnerabilities

Please report security vulnerabilities privately to the maintainers. Do not open public issues for security concerns.

### Security Considerations

- Never commit private keys
- Use environment variables for secrets
- Test thoroughly before deployment
- Follow smart contract best practices

## 📞 Getting Help

- Open an issue for bugs
- Use discussions for questions
- Join our Discord for real-time help

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- GitHub contributors page
- Special NFTs for significant contributions

---

Thank you for contributing to MiniNFT! 🎉
