# MiniNFT Makefile
# Common commands for development, testing, and deployment

-include .env

.PHONY: all build test clean deploy verify install update snapshot format lint anvil

# Default target
all: clean build test

# Install dependencies
install:
	forge install

# Update dependencies
update:
	forge update

# Build contracts
build:
	forge build

# Build with sizes
build-sizes:
	forge build --sizes

# Run tests
test:
	forge test

# Run tests with verbosity
test-v:
	forge test -vvv

# Run tests with gas report
test-gas:
	forge test --gas-report

# Run specific test
test-match:
	forge test --match-test $(TEST)

# Run fuzz tests
test-fuzz:
	forge test --match-path test/MiniNFT.fuzz.t.sol

# Run invariant tests
test-invariant:
	forge test --match-contract MiniNFTInvariantTest

# Format code
format:
	forge fmt

# Check formatting
format-check:
	forge fmt --check

# Run linter (if slither is installed)
lint:
	slither . --exclude naming-convention,timestamp --filter-paths "lib/"

# Generate gas snapshot
snapshot:
	forge snapshot

# Clean build artifacts
clean:
	forge clean

# Start local node
anvil:
	anvil -m 'test test test test test test test test test test test junk' --steps-tracing

# Deploy to local network
deploy-local:
	forge script script/Deploy.s.sol:DeployMiniNFT --rpc-url http://localhost:8545 --broadcast

# Deploy to Base Sepolia testnet
deploy-testnet:
	forge script script/Deploy.s.sol:DeployMiniNFTTestnet --rpc-url $(BASE_SEPOLIA_RPC_URL) --broadcast --verify

# Deploy to Base mainnet
deploy-mainnet:
	forge script script/Deploy.s.sol:DeployMiniNFT --rpc-url $(BASE_RPC_URL) --broadcast --verify

# Verify contract on BaseScan
verify:
	forge verify-contract $(CONTRACT_ADDRESS) src/MiniNFT.sol:MiniNFT \
		--chain base \
		--constructor-args $$(cast abi-encode "constructor(string,string,string)" "MiniNFT" "MNFT" "$(BASE_URI)")

# Check contract status
status:
	forge script script/Interactions.s.sol:CheckContractStatus --rpc-url $(BASE_RPC_URL)

# Mint a single NFT
mint:
	forge script script/Interactions.s.sol:MintNFT --rpc-url $(BASE_RPC_URL) --broadcast

# Mint batch
mint-batch:
	forge script script/Interactions.s.sol:MintBatch --rpc-url $(BASE_RPC_URL) --broadcast

# Withdraw funds
withdraw:
	forge script script/Interactions.s.sol:WithdrawFunds --rpc-url $(BASE_RPC_URL) --broadcast

# Frontend commands
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-preview:
	cd frontend && npm run preview

# Coverage (requires lcov)
coverage:
	forge coverage --report lcov

# Coverage summary
coverage-summary:
	forge coverage --report summary

# Generate documentation
docs:
	forge doc

# Flatten contract (for verification)
flatten:
	forge flatten src/MiniNFT.sol -o MiniNFT_Flattened.sol

# Help
help:
	@echo "MiniNFT Makefile Commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make build         - Build contracts"
	@echo "    make test          - Run tests"
	@echo "    make test-v        - Run tests with verbosity"
	@echo "    make test-gas      - Run tests with gas report"
	@echo "    make test-fuzz     - Run fuzz tests"
	@echo "    make format        - Format code"
	@echo "    make lint          - Run Slither linter"
	@echo "    make anvil         - Start local Anvil node"
	@echo ""
	@echo "  Deployment:"
	@echo "    make deploy-local    - Deploy to local Anvil"
	@echo "    make deploy-testnet  - Deploy to Base Sepolia"
	@echo "    make deploy-mainnet  - Deploy to Base mainnet"
	@echo "    make verify          - Verify on BaseScan"
	@echo ""
	@echo "  Interactions:"
	@echo "    make status        - Check contract status"
	@echo "    make mint          - Mint single NFT"
	@echo "    make mint-batch    - Mint batch of NFTs"
	@echo "    make withdraw      - Withdraw contract funds"
	@echo ""
	@echo "  Frontend:"
	@echo "    make frontend-install - Install frontend deps"
	@echo "    make frontend-dev     - Run dev server"
	@echo "    make frontend-build   - Build for production"
