# 📖 API Reference

Complete API reference for the MiniNFT smart contract.

## 📑 Table of Contents

- [Constants](#constants)
- [State Variables](#state-variables)
- [Events](#events)
- [Read Functions](#read-functions)
- [Write Functions](#write-functions)
- [Owner Functions](#owner-functions)
- [Bulk Operations](#bulk-operations)

---

## Constants

### MAX_SUPPLY
```solidity
uint256 public constant MAX_SUPPLY = 505;
```
Maximum number of NFTs that can be minted.

### MINT_PRICE
```solidity
uint256 public constant MINT_PRICE = 0.00001 ether;
```
Cost to mint a single NFT (10 Gwei).

---

## State Variables

### baseTokenURI
```solidity
string public baseTokenURI;
```
Base URI for NFT metadata. Each token's metadata is at `{baseTokenURI}/{tokenId}`.

---

## Events

### NFTMinted
```solidity
event NFTMinted(address indexed minter, uint256 indexed tokenId);
```
Emitted when a single NFT is minted.

| Parameter | Type | Description |
|-----------|------|-------------|
| minter | address | Address that minted the NFT |
| tokenId | uint256 | ID of the minted token |

### BaseURIUpdated
```solidity
event BaseURIUpdated(string newBaseURI);
```
Emitted when the base URI is updated.

### FundsWithdrawn
```solidity
event FundsWithdrawn(address indexed owner, uint256 amount);
```
Emitted when funds are withdrawn from the contract.

### BulkMintExecuted
```solidity
event BulkMintExecuted(address indexed minter, uint256 quantity, uint256 totalCost);
```
Emitted when bulk minting is performed.

### BulkTransferExecuted
```solidity
event BulkTransferExecuted(address indexed from, address indexed to, uint256[] tokenIds);
```
Emitted when bulk transfer is performed.

### BulkMetadataUpdated
```solidity
event BulkMetadataUpdated(uint256[] tokenIds, string[] newURIs);
```
Emitted when bulk metadata update is performed.

---

## Read Functions

### remainingSupply
```solidity
function remainingSupply() external view returns (uint256)
```
Returns the number of NFTs still available to mint.

**Returns:**
- `uint256` - Number of unminted NFTs

**Example:**
```javascript
const remaining = await contract.remainingSupply();
console.log(`${remaining} NFTs remaining`);
```

### totalSupply
```solidity
function totalSupply() external view returns (uint256)
```
Returns the total number of NFTs minted.

**Returns:**
- `uint256` - Number of minted NFTs

### balanceOf
```solidity
function balanceOf(address owner) external view returns (uint256)
```
Returns the number of NFTs owned by an address.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| owner | address | Address to query |

**Returns:**
- `uint256` - Number of NFTs owned

### ownerOf
```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```
Returns the owner of a specific NFT.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| tokenId | uint256 | Token ID to query |

**Returns:**
- `address` - Owner's address

### tokenURI
```solidity
function tokenURI(uint256 tokenId) public view returns (string memory)
```
Returns the metadata URI for a specific NFT.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| tokenId | uint256 | Token ID to query |

**Returns:**
- `string` - Full metadata URI

### getAvailableTokenIds
```solidity
function getAvailableTokenIds() external view returns (uint256[] memory)
```
Returns all token IDs that are still available to mint.

**Returns:**
- `uint256[]` - Array of available token IDs

### getBulkLimits
```solidity
function getBulkLimits() external pure returns (
    uint256 maxBulkTransfers,
    uint256 maxBulkUpdates,
    uint256 maxBulkMints
)
```
Returns the maximum limits for bulk operations.

**Returns:**
- `maxBulkTransfers` - Maximum transfers per bulk transaction (20)
- `maxBulkUpdates` - Maximum metadata updates per bulk transaction (50)
- `maxBulkMints` - Maximum mints per bulk transaction (50)

### estimateBulkGas
```solidity
function estimateBulkGas(uint256 operationCount, uint256 operationType) external pure returns (uint256 estimatedGas)
```
Estimates gas cost for bulk operations.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| operationCount | uint256 | Number of operations |
| operationType | uint256 | 0=transfer, 1=metadata, 2=mint, 3=approval |

**Returns:**
- `uint256` - Estimated gas cost

---

## Write Functions

### mint
```solidity
function mint() external payable nonReentrant
```
Mint a single random NFT from the collection.

**Requirements:**
- Payment must be >= MINT_PRICE (0.00001 ETH)
- Collection not sold out

**Gas:** ~85,000

**Example:**
```javascript
const tx = await contract.mint({ value: parseEther("0.00001") });
await tx.wait();
```

### mintBatch
```solidity
function mintBatch(uint256 quantity) external payable nonReentrant
```
Mint multiple random NFTs in a single transaction.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| quantity | uint256 | Number of NFTs to mint (1-10) |

**Requirements:**
- quantity > 0 and <= 10
- Payment >= MINT_PRICE * quantity
- Enough NFTs available

**Gas:** ~50,000 + (35,000 * quantity)

**Example:**
```javascript
const quantity = 5;
const value = parseEther("0.00005"); // 0.00001 * 5
const tx = await contract.mintBatch(quantity, { value });
await tx.wait();
```

---

## Owner Functions

### setBaseURI
```solidity
function setBaseURI(string memory _newBaseURI) external onlyOwner
```
Update the base URI for token metadata.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| _newBaseURI | string | New base URI |

**Requirements:**
- Caller must be owner

### withdraw
```solidity
function withdraw() external onlyOwner
```
Withdraw all ETH from the contract to the owner.

**Requirements:**
- Caller must be owner
- Contract balance > 0

---

## Bulk Operations

### BulkTransfer Struct
```solidity
struct BulkTransfer {
    uint256 tokenId;
    address to;
}
```

### BulkMetadataUpdate Struct
```solidity
struct BulkMetadataUpdate {
    uint256 tokenId;
    string newURI;
}
```

### bulkTransfer
```solidity
function bulkTransfer(BulkTransfer[] calldata transfers) external nonReentrant
```
Transfer multiple NFTs to different recipients.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| transfers | BulkTransfer[] | Array of transfer parameters (max 20) |

### bulkTransferToRecipient
```solidity
function bulkTransferToRecipient(uint256[] calldata tokenIds, address to) external nonReentrant
```
Transfer multiple NFTs to the same recipient.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| tokenIds | uint256[] | Array of token IDs (max 20) |
| to | address | Recipient address |

### bulkUpdateMetadata
```solidity
function bulkUpdateMetadata(BulkMetadataUpdate[] calldata updates) external onlyOwner
```
Update metadata URIs for multiple NFTs.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| updates | BulkMetadataUpdate[] | Array of update parameters (max 50) |

**Requirements:**
- Caller must be owner

### bulkMintWithURIs
```solidity
function bulkMintWithURIs(
    address[] calldata recipients,
    string[] calldata customURIs
) external payable onlyOwner nonReentrant
```
Mint NFTs with custom URIs to specified recipients.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| recipients | address[] | Array of recipient addresses (max 50) |
| customURIs | string[] | Array of custom metadata URIs |

**Requirements:**
- Caller must be owner
- Arrays must have equal length
- Payment >= MINT_PRICE * length

### bulkSetApprovalForAll
```solidity
function bulkSetApprovalForAll(
    address[] calldata operators,
    bool[] calldata approved
) external
```
Set approval for multiple operators at once.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| operators | address[] | Array of operator addresses (max 20) |
| approved | bool[] | Array of approval values |

---

## Error Handling

The contract uses require statements with descriptive messages:

| Error Message | Cause |
|--------------|-------|
| "All NFTs have been minted" | Collection is sold out |
| "Insufficient payment" | Payment < MINT_PRICE |
| "Quantity must be greater than 0" | Invalid batch quantity |
| "Max 10 NFTs per batch" | Exceeded batch limit |
| "Not enough NFTs available" | Not enough remaining for batch |
| "Not token owner" | Trying to transfer unowned NFT |
| "Invalid recipient" | Zero address recipient |
| "Invalid transfer count" | Bulk transfer limit exceeded |
| "Invalid update count" | Bulk update limit exceeded |
| "Invalid mint count" | Bulk mint limit exceeded |
| "Array length mismatch" | Parameter array lengths don't match |
| "No funds to withdraw" | Contract balance is zero |
| "Refund failed" | Failed to refund excess payment |
| "Withdrawal failed" | Failed to withdraw funds |

---

## Gas Estimates

| Function | Approximate Gas |
|----------|----------------|
| mint() | 85,000 |
| mintBatch(1) | 85,000 |
| mintBatch(5) | 225,000 |
| mintBatch(10) | 400,000 |
| bulkTransfer (5 items) | 175,000 |
| bulkTransferToRecipient (5 items) | 175,000 |
| setBaseURI | 35,000 |
| withdraw | 30,000 |

*Gas estimates are approximate and may vary.*
