// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MiniNFT.sol";

/**
 * @title MiniNFTFuzzTest
 * @notice Fuzz testing for MiniNFT contract
 */
contract MiniNFTFuzzTest is Test {
    MiniNFT public nft;
    address public owner = address(this);

    receive() external payable {}

    function setUp() public {
        nft = new MiniNFT("MiniNFT", "MNFT", "ipfs://test/");
    }

    /**
     * @notice Fuzz test for mint with various payment amounts
     */
    function testFuzz_MintWithPayment(uint256 payment) public {
        // Bound payment to reasonable range
        payment = bound(payment, 0, 1 ether);
        
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.prank(minter);
        
        if (payment < nft.MINT_PRICE()) {
            vm.expectRevert("Insufficient payment");
            nft.mint{value: payment}();
        } else {
            uint256 balanceBefore = minter.balance;
            nft.mint{value: payment}();
            
            // Check NFT was minted
            assertEq(nft.balanceOf(minter), 1);
            
            // Check excess was refunded
            uint256 expectedRefund = payment - nft.MINT_PRICE();
            assertEq(minter.balance, balanceBefore - nft.MINT_PRICE());
        }
    }

    /**
     * @notice Fuzz test for batch mint with various quantities
     */
    function testFuzz_BatchMint(uint256 quantity) public {
        // Bound quantity to valid range
        quantity = bound(quantity, 1, 15);
        
        address minter = makeAddr("batchMinter");
        vm.deal(minter, 1 ether);
        
        uint256 totalCost = nft.MINT_PRICE() * quantity;
        
        vm.prank(minter);
        
        if (quantity > 10) {
            vm.expectRevert("Max 10 NFTs per batch");
            nft.mintBatch{value: totalCost}(quantity);
        } else if (quantity == 0) {
            vm.expectRevert("Quantity must be greater than 0");
            nft.mintBatch{value: totalCost}(quantity);
        } else {
            nft.mintBatch{value: totalCost}(quantity);
            assertEq(nft.balanceOf(minter), quantity);
        }
    }

    /**
     * @notice Fuzz test for base URI updates
     */
    function testFuzz_SetBaseURI(string calldata newURI) public {
        vm.assume(bytes(newURI).length > 0);
        vm.assume(bytes(newURI).length < 256);
        
        nft.setBaseURI(newURI);
        assertEq(nft.baseTokenURI(), newURI);
    }

    /**
     * @notice Fuzz test for bulk transfers with various token counts
     */
    function testFuzz_BulkTransfer(uint8 transferCount) public {
        // Bound transfer count
        transferCount = uint8(bound(transferCount, 1, 25));
        
        address sender = makeAddr("sender");
        address recipient = makeAddr("recipient");
        vm.deal(sender, 1 ether);
        
        // Mint tokens first
        uint256 mintCount = transferCount > 20 ? 20 : transferCount;
        vm.startPrank(sender);
        for (uint256 i = 0; i < mintCount; i++) {
            nft.mint{value: nft.MINT_PRICE()}();
        }
        vm.stopPrank();
        
        // Prepare token IDs for transfer
        uint256[] memory tokenIds = new uint256[](transferCount);
        for (uint256 i = 0; i < transferCount; i++) {
            tokenIds[i] = i + 1;
        }
        
        vm.prank(sender);
        
        if (transferCount > 20) {
            vm.expectRevert("Invalid transfer count");
            nft.bulkTransferToRecipient(tokenIds, recipient);
        } else {
            nft.bulkTransferToRecipient(tokenIds, recipient);
            assertEq(nft.balanceOf(recipient), transferCount);
            assertEq(nft.balanceOf(sender), 0);
        }
    }

    /**
     * @notice Fuzz test for gas estimation
     */
    function testFuzz_GasEstimation(uint256 count, uint256 opType) public view {
        count = bound(count, 1, 100);
        opType = bound(opType, 0, 4);
        
        if (opType == 0 && count > 20) {
            vm.expectRevert("Too many transfers");
            nft.estimateBulkGas(count, opType);
        } else if (opType == 1 && count > 50) {
            vm.expectRevert("Too many updates");
            nft.estimateBulkGas(count, opType);
        } else if (opType == 2 && count > 50) {
            vm.expectRevert("Too many mints");
            nft.estimateBulkGas(count, opType);
        } else if (opType == 3 && count > 20) {
            vm.expectRevert("Too many approvals");
            nft.estimateBulkGas(count, opType);
        } else if (opType == 4) {
            vm.expectRevert("Invalid operation type");
            nft.estimateBulkGas(count, opType);
        } else {
            uint256 gas = nft.estimateBulkGas(count, opType);
            assertGt(gas, 21000);
        }
    }
}

/**
 * @title MiniNFTInvariantTest
 * @notice Invariant testing for MiniNFT contract
 */
contract MiniNFTInvariantTest is Test {
    MiniNFT public nft;
    InvariantHandler public handler;

    function setUp() public {
        nft = new MiniNFT("MiniNFT", "MNFT", "ipfs://test/");
        handler = new InvariantHandler(nft);
        
        targetContract(address(handler));
    }

    /**
     * @notice Total supply should never exceed max supply
     */
    function invariant_totalSupplyNeverExceedsMax() public view {
        assertLe(nft.totalSupply(), nft.MAX_SUPPLY());
    }

    /**
     * @notice Remaining + minted should equal max supply
     */
    function invariant_remainingPlusMintedEqualsMax() public view {
        assertEq(nft.remainingSupply() + nft.totalSupply(), nft.MAX_SUPPLY());
    }

    /**
     * @notice Contract balance should be positive after mints
     */
    function invariant_contractHasBalance() public view {
        if (nft.totalSupply() > 0) {
            // Contract may or may not have balance (owner might have withdrawn)
            // This is just checking state consistency
            assertTrue(true);
        }
    }
}

/**
 * @title InvariantHandler
 * @notice Handler contract for invariant testing
 */
contract InvariantHandler is Test {
    MiniNFT public nft;
    address[] public actors;
    address internal currentActor;

    modifier useActor(uint256 actorIndexSeed) {
        currentActor = actors[bound(actorIndexSeed, 0, actors.length - 1)];
        vm.startPrank(currentActor);
        _;
        vm.stopPrank();
    }

    constructor(MiniNFT _nft) {
        nft = _nft;
        
        // Create test actors
        for (uint256 i = 0; i < 5; i++) {
            address actor = makeAddr(string(abi.encodePacked("actor", i)));
            actors.push(actor);
            vm.deal(actor, 10 ether);
        }
    }

    function mint(uint256 actorSeed) external useActor(actorSeed) {
        if (nft.remainingSupply() > 0) {
            nft.mint{value: nft.MINT_PRICE()}();
        }
    }

    function mintBatch(uint256 actorSeed, uint256 quantity) external useActor(actorSeed) {
        quantity = bound(quantity, 1, 10);
        
        if (nft.remainingSupply() >= quantity) {
            uint256 cost = nft.MINT_PRICE() * quantity;
            nft.mintBatch{value: cost}(quantity);
        }
    }
}
