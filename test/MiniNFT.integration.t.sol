// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {MiniNFT} from "../src/MiniNFT.sol";

/**
 * @title MiniNFT Integration Tests
 * @notice End-to-end integration tests simulating real user scenarios
 */
contract MiniNFTIntegrationTest is Test {
    MiniNFT public nft;
    
    // Test users
    address public owner;
    address public alice;
    address public bob;
    address public charlie;
    address public marketplace;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    function setUp() public {
        owner = makeAddr("owner");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        marketplace = makeAddr("marketplace");
        
        vm.prank(owner);
        nft = new MiniNFT();
        
        // Fund test accounts
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }
    
    /*//////////////////////////////////////////////////////////////
                        USER JOURNEY TESTS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Test: New user discovers collection and mints their first NFT
    function test_NewUserFirstMint() public {
        // Alice discovers the collection and wants to mint
        vm.startPrank(alice);
        
        // Check collection info
        assertEq(nft.name(), "MiniNFT");
        assertEq(nft.symbol(), "MINI");
        assertEq(nft.MAX_SUPPLY(), 505);
        
        // Check mint price
        uint256 price = nft.MINT_PRICE();
        assertEq(price, 0.00001 ether);
        
        // Check remaining supply
        uint256 remaining = nft.remainingSupply();
        assertEq(remaining, 505);
        
        // Mint first NFT
        uint256 tokenId = nft.mint{value: price}();
        
        // Verify ownership
        assertEq(nft.ownerOf(tokenId), alice);
        assertEq(nft.balanceOf(alice), 1);
        
        // Check token URI
        string memory uri = nft.tokenURI(tokenId);
        assertTrue(bytes(uri).length > 0);
        
        vm.stopPrank();
    }
    
    /// @notice Test: User builds a collection through multiple mints
    function test_UserBuildsCollection() public {
        vm.startPrank(alice);
        uint256 price = nft.MINT_PRICE();
        
        // Mint 5 NFTs over time
        uint256[] memory tokens = new uint256[](5);
        
        for (uint256 i = 0; i < 5; i++) {
            tokens[i] = nft.mint{value: price}();
            assertEq(nft.balanceOf(alice), i + 1);
        }
        
        // Verify all tokens are owned
        for (uint256 i = 0; i < 5; i++) {
            assertEq(nft.ownerOf(tokens[i]), alice);
        }
        
        // Verify enumeration works
        for (uint256 i = 0; i < 5; i++) {
            uint256 tokenAtIndex = nft.tokenOfOwnerByIndex(alice, i);
            bool found = false;
            for (uint256 j = 0; j < 5; j++) {
                if (tokenAtIndex == tokens[j]) {
                    found = true;
                    break;
                }
            }
            assertTrue(found);
        }
        
        vm.stopPrank();
    }
    
    /// @notice Test: User uses batch mint for efficiency
    function test_UserBatchMints() public {
        vm.startPrank(alice);
        uint256 price = nft.MINT_PRICE();
        
        // Batch mint 10 NFTs at once
        uint256[] memory tokens = nft.mintBatch{value: price * 10}(10);
        
        assertEq(tokens.length, 10);
        assertEq(nft.balanceOf(alice), 10);
        
        // Verify all unique
        for (uint256 i = 0; i < tokens.length; i++) {
            for (uint256 j = i + 1; j < tokens.length; j++) {
                assertTrue(tokens[i] != tokens[j], "Duplicate token ID");
            }
        }
        
        vm.stopPrank();
    }
    
    /*//////////////////////////////////////////////////////////////
                        TRADING SCENARIO TESTS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Test: Peer-to-peer NFT trade between users
    function test_P2PTrade() public {
        // Alice mints an NFT
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: nft.MINT_PRICE()}();
        
        // Alice transfers to Bob
        vm.prank(alice);
        nft.transferFrom(alice, bob, tokenId);
        
        // Verify ownership changed
        assertEq(nft.ownerOf(tokenId), bob);
        assertEq(nft.balanceOf(alice), 0);
        assertEq(nft.balanceOf(bob), 1);
    }
    
    /// @notice Test: Marketplace listing and sale flow
    function test_MarketplaceSale() public {
        // Alice mints an NFT
        vm.prank(alice);
        uint256 tokenId = nft.mint{value: nft.MINT_PRICE()}();
        
        // Alice approves marketplace to handle her NFT
        vm.prank(alice);
        nft.approve(marketplace, tokenId);
        
        assertEq(nft.getApproved(tokenId), marketplace);
        
        // Marketplace executes sale (transfers to Bob)
        vm.prank(marketplace);
        nft.transferFrom(alice, bob, tokenId);
        
        // Verify Bob now owns the NFT
        assertEq(nft.ownerOf(tokenId), bob);
        
        // Approval should be cleared
        assertEq(nft.getApproved(tokenId), address(0));
    }
    
    /// @notice Test: User grants marketplace operator access for entire collection
    function test_MarketplaceOperatorApproval() public {
        // Alice mints multiple NFTs
        vm.startPrank(alice);
        uint256 price = nft.MINT_PRICE();
        
        uint256[] memory tokens = nft.mintBatch{value: price * 5}(5);
        
        // Approve marketplace as operator
        nft.setApprovalForAll(marketplace, true);
        assertTrue(nft.isApprovedForAll(alice, marketplace));
        
        vm.stopPrank();
        
        // Marketplace can now transfer any of Alice's NFTs
        vm.startPrank(marketplace);
        
        // Transfer first NFT to Bob
        nft.transferFrom(alice, bob, tokens[0]);
        assertEq(nft.ownerOf(tokens[0]), bob);
        
        // Transfer second NFT to Charlie
        nft.transferFrom(alice, charlie, tokens[1]);
        assertEq(nft.ownerOf(tokens[1]), charlie);
        
        vm.stopPrank();
        
        // Alice still owns remaining 3
        assertEq(nft.balanceOf(alice), 3);
    }
    
    /*//////////////////////////////////////////////////////////////
                        BULK OPERATION TESTS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Test: User performs bulk transfer to multiple recipients
    function test_BulkTransferToMultipleRecipients() public {
        // Alice mints 5 NFTs
        vm.startPrank(alice);
        uint256 price = nft.MINT_PRICE();
        uint256[] memory tokens = nft.mintBatch{value: price * 5}(5);
        
        // Prepare bulk transfer
        uint256[] memory tokenIds = new uint256[](3);
        address[] memory recipients = new address[](3);
        
        tokenIds[0] = tokens[0];
        tokenIds[1] = tokens[1];
        tokenIds[2] = tokens[2];
        
        recipients[0] = bob;
        recipients[1] = charlie;
        recipients[2] = bob;
        
        // Execute bulk transfer
        nft.bulkTransfer(tokenIds, recipients);
        
        vm.stopPrank();
        
        // Verify new ownership
        assertEq(nft.ownerOf(tokens[0]), bob);
        assertEq(nft.ownerOf(tokens[1]), charlie);
        assertEq(nft.ownerOf(tokens[2]), bob);
        assertEq(nft.ownerOf(tokens[3]), alice);
        assertEq(nft.ownerOf(tokens[4]), alice);
        
        // Verify balances
        assertEq(nft.balanceOf(alice), 2);
        assertEq(nft.balanceOf(bob), 2);
        assertEq(nft.balanceOf(charlie), 1);
    }
    
    /// @notice Test: User sends multiple NFTs to single recipient
    function test_BulkTransferToSingleRecipient() public {
        // Alice mints 5 NFTs
        vm.startPrank(alice);
        uint256 price = nft.MINT_PRICE();
        uint256[] memory tokens = nft.mintBatch{value: price * 5}(5);
        
        // Send 3 NFTs to Bob
        uint256[] memory tokensToSend = new uint256[](3);
        tokensToSend[0] = tokens[0];
        tokensToSend[1] = tokens[1];
        tokensToSend[2] = tokens[2];
        
        nft.bulkTransferToRecipient(tokensToSend, bob);
        
        vm.stopPrank();
        
        // Verify
        assertEq(nft.balanceOf(bob), 3);
        assertEq(nft.balanceOf(alice), 2);
    }
    
    /*//////////////////////////////////////////////////////////////
                        OWNER OPERATIONS TESTS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Test: Owner updates base URI for metadata reveal
    function test_MetadataReveal() public {
        // Users mint some NFTs
        vm.prank(alice);
        uint256 aliceToken = nft.mint{value: nft.MINT_PRICE()}();
        
        vm.prank(bob);
        uint256 bobToken = nft.mint{value: nft.MINT_PRICE()}();
        
        // Owner reveals metadata by updating base URI
        vm.prank(owner);
        nft.setBaseURI("ipfs://QmXYZ123/");
        
        // Verify URIs are updated
        string memory aliceURI = nft.tokenURI(aliceToken);
        string memory bobURI = nft.tokenURI(bobToken);
        
        assertTrue(bytes(aliceURI).length > 0);
        assertTrue(bytes(bobURI).length > 0);
    }
    
    /// @notice Test: Owner withdraws accumulated funds
    function test_OwnerWithdrawal() public {
        // Multiple users mint
        vm.prank(alice);
        nft.mintBatch{value: nft.MINT_PRICE() * 10}(10);
        
        vm.prank(bob);
        nft.mintBatch{value: nft.MINT_PRICE() * 10}(10);
        
        vm.prank(charlie);
        nft.mintBatch{value: nft.MINT_PRICE() * 5}(5);
        
        // Check contract balance
        uint256 contractBalance = address(nft).balance;
        assertEq(contractBalance, nft.MINT_PRICE() * 25);
        
        // Owner withdraws
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(owner);
        nft.withdraw();
        
        // Verify funds transferred
        assertEq(address(nft).balance, 0);
        assertEq(owner.balance, ownerBalanceBefore + contractBalance);
    }
    
    /*//////////////////////////////////////////////////////////////
                        EDGE CASE SCENARIOS
    //////////////////////////////////////////////////////////////*/
    
    /// @notice Test: High-frequency minting from multiple users
    function test_ConcurrentMinting() public {
        uint256 price = nft.MINT_PRICE();
        address[10] memory users;
        
        // Create 10 users
        for (uint256 i = 0; i < 10; i++) {
            users[i] = makeAddr(string(abi.encodePacked("user", i)));
            vm.deal(users[i], 1 ether);
        }
        
        // Each user mints 3 NFTs
        for (uint256 i = 0; i < 10; i++) {
            vm.prank(users[i]);
            nft.mintBatch{value: price * 3}(3);
        }
        
        // Verify total supply
        assertEq(nft.totalSupply(), 30);
        
        // Verify each user has correct balance
        for (uint256 i = 0; i < 10; i++) {
            assertEq(nft.balanceOf(users[i]), 3);
        }
    }
    
    /// @notice Test: Safe transfer to contract that implements receiver
    function test_SafeTransferToContract() public {
        // Deploy a receiver contract
        MockNFTReceiver receiver = new MockNFTReceiver();
        
        // Alice mints and safe transfers
        vm.startPrank(alice);
        uint256 tokenId = nft.mint{value: nft.MINT_PRICE()}();
        
        nft.safeTransferFrom(alice, address(receiver), tokenId);
        
        vm.stopPrank();
        
        // Verify transfer
        assertEq(nft.ownerOf(tokenId), address(receiver));
        assertTrue(receiver.received());
    }
    
    /// @notice Test: Full collection lifecycle
    function test_FullCollectionLifecycle() public {
        uint256 price = nft.MINT_PRICE();
        
        // Phase 1: Minting
        vm.prank(alice);
        uint256[] memory aliceTokens = nft.mintBatch{value: price * 5}(5);
        
        vm.prank(bob);
        uint256[] memory bobTokens = nft.mintBatch{value: price * 5}(5);
        
        assertEq(nft.totalSupply(), 10);
        
        // Phase 2: Trading
        vm.prank(alice);
        nft.transferFrom(alice, charlie, aliceTokens[0]);
        
        vm.prank(bob);
        nft.approve(marketplace, bobTokens[0]);
        
        vm.prank(marketplace);
        nft.transferFrom(bob, charlie, bobTokens[0]);
        
        assertEq(nft.balanceOf(charlie), 2);
        
        // Phase 3: Metadata reveal
        vm.prank(owner);
        nft.setBaseURI("ipfs://revealed/");
        
        // Phase 4: Withdrawal
        uint256 balance = address(nft).balance;
        vm.prank(owner);
        nft.withdraw();
        
        assertEq(address(nft).balance, 0);
        assertGt(owner.balance, 0);
    }
}

/**
 * @notice Mock NFT receiver for testing safe transfers
 */
contract MockNFTReceiver {
    bool public received;
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        received = true;
        return this.onERC721Received.selector;
    }
}
