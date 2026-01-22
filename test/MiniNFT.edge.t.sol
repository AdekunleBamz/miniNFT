// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MiniNFT.sol";

/**
 * @title MiniNFTEdgeCaseTest
 * @notice Edge case and boundary condition tests
 */
contract MiniNFTEdgeCaseTest is Test {
    MiniNFT public nft;
    address public owner = address(this);

    receive() external payable {}

    function setUp() public {
        nft = new MiniNFT("MiniNFT", "MNFT", "ipfs://test/");
    }

    /*//////////////////////////////////////////////////////////////
                            PAYMENT EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test exact payment (no refund needed)
     */
    function testExactPayment() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 0.00001 ether);
        
        uint256 balanceBefore = minter.balance;
        
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        assertEq(minter.balance, 0);
        assertEq(balanceBefore - minter.balance, 0.00001 ether);
    }

    /**
     * @notice Test overpayment refund
     */
    function testOverpaymentRefund() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        uint256 balanceBefore = minter.balance;
        
        vm.prank(minter);
        nft.mint{value: 0.5 ether}();
        
        uint256 expectedBalance = balanceBefore - 0.00001 ether;
        assertEq(minter.balance, expectedBalance);
    }

    /**
     * @notice Test batch overpayment refund
     */
    function testBatchOverpaymentRefund() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        uint256 balanceBefore = minter.balance;
        uint256 quantity = 5;
        uint256 expectedCost = 0.00001 ether * quantity;
        
        vm.prank(minter);
        nft.mintBatch{value: 1 ether}(quantity);
        
        assertEq(minter.balance, balanceBefore - expectedCost);
    }

    /*//////////////////////////////////////////////////////////////
                            SUPPLY EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test remaining supply updates correctly
     */
    function testRemainingSupplyUpdates() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        uint256 initialRemaining = nft.remainingSupply();
        assertEq(initialRemaining, 505);
        
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        assertEq(nft.remainingSupply(), 504);
        assertEq(nft.totalSupply(), 1);
    }

    /**
     * @notice Test batch mint updates supply correctly
     */
    function testBatchMintSupplyUpdate() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.prank(minter);
        nft.mintBatch{value: 0.0001 ether}(10);
        
        assertEq(nft.remainingSupply(), 495);
        assertEq(nft.totalSupply(), 10);
        assertEq(nft.balanceOf(minter), 10);
    }

    /*//////////////////////////////////////////////////////////////
                            TOKEN ID EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test that all minted token IDs are valid (1-505)
     */
    function testMintedTokenIdsValid() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.startPrank(minter);
        for (uint256 i = 0; i < 10; i++) {
            nft.mint{value: 0.00001 ether}();
        }
        vm.stopPrank();
        
        for (uint256 i = 0; i < 10; i++) {
            uint256 tokenId = nft.tokenOfOwnerByIndex(minter, i);
            assertGe(tokenId, 1);
            assertLe(tokenId, 505);
        }
    }

    /**
     * @notice Test no duplicate token IDs
     */
    function testNoDuplicateTokenIds() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.startPrank(minter);
        nft.mintBatch{value: 0.0001 ether}(10);
        vm.stopPrank();
        
        uint256[] memory tokenIds = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            tokenIds[i] = nft.tokenOfOwnerByIndex(minter, i);
        }
        
        // Check for duplicates
        for (uint256 i = 0; i < tokenIds.length; i++) {
            for (uint256 j = i + 1; j < tokenIds.length; j++) {
                assertTrue(tokenIds[i] != tokenIds[j], "Duplicate token ID found");
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                            OWNERSHIP EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test ownership transfer
     */
    function testOwnershipTransfer() public {
        address newOwner = makeAddr("newOwner");
        
        assertEq(nft.owner(), owner);
        
        nft.transferOwnership(newOwner);
        
        assertEq(nft.owner(), newOwner);
    }

    /**
     * @notice Test non-owner cannot call owner functions
     */
    function testNonOwnerCannotCallOwnerFunctions() public {
        address nonOwner = makeAddr("nonOwner");
        
        vm.prank(nonOwner);
        vm.expectRevert();
        nft.setBaseURI("ipfs://malicious/");
        
        vm.prank(nonOwner);
        vm.expectRevert();
        nft.withdraw();
    }

    /*//////////////////////////////////////////////////////////////
                            TRANSFER EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test transfer to self
     */
    function testTransferToSelf() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        uint256 tokenId = nft.tokenOfOwnerByIndex(minter, 0);
        
        vm.prank(minter);
        nft.transferFrom(minter, minter, tokenId);
        
        assertEq(nft.ownerOf(tokenId), minter);
        assertEq(nft.balanceOf(minter), 1);
    }

    /**
     * @notice Test transfer to zero address fails
     */
    function testTransferToZeroAddressFails() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        uint256 tokenId = nft.tokenOfOwnerByIndex(minter, 0);
        
        vm.prank(minter);
        vm.expectRevert();
        nft.transferFrom(minter, address(0), tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                            METADATA EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test empty base URI
     */
    function testEmptyBaseURI() public {
        nft.setBaseURI("");
        assertEq(nft.baseTokenURI(), "");
    }

    /**
     * @notice Test tokenURI for unminted token
     */
    function testTokenURIUnmintedToken() public {
        vm.expectRevert();
        nft.tokenURI(999);
    }

    /**
     * @notice Test very long base URI
     */
    function testLongBaseURI() public {
        string memory longURI = "ipfs://QmVeryLongCIDThatIsUnusuallyLongToTestEdgeCasesInTheContractImplementation123456789/";
        nft.setBaseURI(longURI);
        assertEq(nft.baseTokenURI(), longURI);
    }

    /*//////////////////////////////////////////////////////////////
                            BULK OPERATION EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test bulk transfer with single item
     */
    function testBulkTransferSingleItem() public {
        address sender = makeAddr("sender");
        address recipient = makeAddr("recipient");
        vm.deal(sender, 1 ether);
        
        vm.prank(sender);
        nft.mint{value: 0.00001 ether}();
        
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = nft.tokenOfOwnerByIndex(sender, 0);
        
        vm.prank(sender);
        nft.bulkTransferToRecipient(tokenIds, recipient);
        
        assertEq(nft.balanceOf(recipient), 1);
    }

    /**
     * @notice Test bulk transfer empty array fails
     */
    function testBulkTransferEmptyArrayFails() public {
        address sender = makeAddr("sender");
        address recipient = makeAddr("recipient");
        
        uint256[] memory tokenIds = new uint256[](0);
        
        vm.prank(sender);
        vm.expectRevert("Invalid transfer count");
        nft.bulkTransferToRecipient(tokenIds, recipient);
    }

    /*//////////////////////////////////////////////////////////////
                            CONTRACT BALANCE EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test withdraw with zero balance
     */
    function testWithdrawZeroBalance() public {
        vm.expectRevert("No funds to withdraw");
        nft.withdraw();
    }

    /**
     * @notice Test multiple withdraws
     */
    function testMultipleWithdraws() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        // First mint and withdraw
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        uint256 balanceBefore = address(owner).balance;
        nft.withdraw();
        assertEq(address(owner).balance - balanceBefore, 0.00001 ether);
        
        // Second mint and withdraw
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        balanceBefore = address(owner).balance;
        nft.withdraw();
        assertEq(address(owner).balance - balanceBefore, 0.00001 ether);
    }

    /*//////////////////////////////////////////////////////////////
                            REENTRANCY EDGE CASES
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Test reentrancy protection on mint
     */
    function testReentrancyOnMint() public {
        ReentrancyAttacker attacker = new ReentrancyAttacker(address(nft));
        vm.deal(address(attacker), 1 ether);
        
        // The attack should fail due to ReentrancyGuard
        vm.expectRevert();
        attacker.attack();
    }
}

/**
 * @title ReentrancyAttacker
 * @notice Contract to test reentrancy protection
 */
contract ReentrancyAttacker {
    MiniNFT public nft;
    uint256 public attackCount;

    constructor(address _nft) {
        nft = MiniNFT(_nft);
    }

    function attack() external {
        nft.mint{value: 0.00001 ether}();
    }

    receive() external payable {
        if (attackCount < 3 && nft.remainingSupply() > 0) {
            attackCount++;
            nft.mint{value: 0.00001 ether}();
        }
    }
}
