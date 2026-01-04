// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MiniNFT
 * @dev A simple NFT collection with 505 unique NFTs that can be minted randomly
 * @notice Mint fee is 0.00001 ETH per NFT
 */
contract MiniNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MAX_SUPPLY = 505;
    uint256 public constant MINT_PRICE = 0.00001 ether;
    
    // State variables
    string public baseTokenURI;
    uint256 private _nextTokenId;
    
    // Array to track available token IDs for random minting
    uint256[] private _availableTokenIds;
    
    // Events
    event NFTMinted(address indexed minter, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
        
        // Initialize available token IDs (1 to 505)
        for (uint256 i = 1; i <= MAX_SUPPLY; i++) {
            _availableTokenIds.push(i);
        }
    }
    
    /**
     * @dev Mint a random NFT from the collection
     * @notice Requires payment of 0.00001 ETH
     */
    function mint() external payable nonReentrant {
        require(_availableTokenIds.length > 0, "All NFTs have been minted");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        // Get a random token ID from available tokens
        uint256 randomIndex = _getRandomIndex();
        uint256 tokenId = _availableTokenIds[randomIndex];
        
        // Remove the token ID from available tokens
        _removeTokenIdAtIndex(randomIndex);
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        
        // Refund excess payment
        if (msg.value > MINT_PRICE) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - MINT_PRICE}("");
            require(success, "Refund failed");
        }
        
        emit NFTMinted(msg.sender, tokenId);
    }
    
    /**
     * @dev Mint multiple random NFTs at once
     * @param quantity Number of NFTs to mint
     */
    function mintBatch(uint256 quantity) external payable nonReentrant {
        require(quantity > 0, "Quantity must be greater than 0");
        require(quantity <= 10, "Max 10 NFTs per batch");
        require(_availableTokenIds.length >= quantity, "Not enough NFTs available");
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 randomIndex = _getRandomIndex();
            uint256 tokenId = _availableTokenIds[randomIndex];
            _removeTokenIdAtIndex(randomIndex);
            _safeMint(msg.sender, tokenId);
            emit NFTMinted(msg.sender, tokenId);
        }
        
        // Refund excess payment
        uint256 totalPrice = MINT_PRICE * quantity;
        if (msg.value > totalPrice) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
            require(success, "Refund failed");
        }
    }
    
    /**
     * @dev Generate a pseudo-random index
     */
    function _getRandomIndex() private view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    _availableTokenIds.length
                )
            )
        ) % _availableTokenIds.length;
    }
    
    /**
     * @dev Remove a token ID from the available array by swapping with last element
     */
    function _removeTokenIdAtIndex(uint256 index) private {
        uint256 lastIndex = _availableTokenIds.length - 1;
        if (index != lastIndex) {
            _availableTokenIds[index] = _availableTokenIds[lastIndex];
        }
        _availableTokenIds.pop();
    }
    
    /**
     * @dev Get the number of remaining NFTs available to mint
     */
    function remainingSupply() external view returns (uint256) {
        return _availableTokenIds.length;
    }
    
    /**
     * @dev Update the base URI for token metadata
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseTokenURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }
    
    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Get all available token IDs
     */
    function getAvailableTokenIds() external view returns (uint256[] memory) {
        return _availableTokenIds;
    }
    
    // Required overrides
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override(ERC721, ERC721Enumerable) 
        returns (address) 
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) 
        internal 
        override(ERC721, ERC721Enumerable) 
    {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721Enumerable, ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
