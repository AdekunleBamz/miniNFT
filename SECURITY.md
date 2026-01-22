# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Report Privately

Send a detailed report to the project maintainers through:
- **Email**: security@mininft.xyz
- **GitHub Security Advisories**: Use the [private vulnerability reporting feature](https://github.com/AdekunleBamz/miniNFT/security/advisories/new)

### 3. Include in Your Report

- Type of vulnerability (reentrancy, overflow, access control, etc.)
- Full paths of source file(s) related to the vulnerability
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Timeline**: Depends on severity

### 5. What to Expect

- Acknowledgment of your report
- Regular updates on our progress
- Credit for your discovery (if desired)
- Notification when the issue is fixed

## Smart Contract Security

### Audits

The MiniNFT smart contract uses:
- OpenZeppelin's audited ERC721 implementation
- ReentrancyGuard for protection against reentrancy attacks
- Standard access control patterns

### Known Considerations

1. **Randomness**: The random minting uses block-based randomness which is suitable for this use case but not cryptographically secure.

2. **Gas Limits**: Batch operations have limits to prevent out-of-gas issues.

3. **Ownership**: The contract owner has privileged functions (setBaseURI, withdraw).

### Best Practices

When interacting with the contract:
- Verify you're on the correct network (Base Mainnet)
- Double-check transaction details before signing
- Use a hardware wallet for large transactions
- Never share your private keys

## Frontend Security

### Dependencies

- Regular dependency updates
- npm audit for vulnerability scanning
- Only verified packages from npm registry

### Web3 Security

- No private key storage in frontend
- Wallet connection through RainbowKit/WalletConnect
- Transaction simulation before execution

## Bug Bounty

Currently, we do not have a formal bug bounty program. However, we appreciate responsible disclosure and may offer:

- Public recognition
- MiniNFT tokens
- Potential monetary rewards for critical vulnerabilities

## Security Updates

Security updates will be:
- Published as GitHub Security Advisories
- Announced in our official channels
- Applied to the contract if possible (or new deployment)

---

Thank you for helping keep MiniNFT secure! 🔒
