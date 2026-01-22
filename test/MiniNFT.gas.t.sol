// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MiniNFT.sol";

/**
 * @title MiniNFTGasTest
 * @notice Gas optimization tests and benchmarks
 */
contract MiniNFTGasTest is Test {
    MiniNFT public nft;
    address public owner = address(this);

    receive() external payable {}

    function setUp() public {
        nft = new MiniNFT("MiniNFT", "MNFT", "ipfs://test/");
    }

    /**
     * @notice Measure gas for single mint
     */
    function testGas_SingleMint() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        vm.prank(minter);
        uint256 gasBefore = gasleft();
        nft.mint{value: 0.00001 ether}();
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("Single mint gas", gasUsed);
        assertLt(gasUsed, 100000, "Single mint should use < 100k gas");
    }

    /**
     * @notice Measure gas for batch mints of various sizes
     */
    function testGas_BatchMint2() public {
        _measureBatchMint(2);
    }

    function testGas_BatchMint5() public {
        _measureBatchMint(5);
    }

    function testGas_BatchMint10() public {
        _measureBatchMint(10);
    }

    function _measureBatchMint(uint256 quantity) internal {
        address minter = makeAddr("batchMinter");
        vm.deal(minter, 1 ether);
        
        uint256 cost = 0.00001 ether * quantity;
        
        vm.prank(minter);
        uint256 gasBefore = gasleft();
        nft.mintBatch{value: cost}(quantity);
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint(string(abi.encodePacked("Batch mint ", vm.toString(quantity), " gas")), gasUsed);
        emit log_named_uint("Gas per NFT", gasUsed / quantity);
    }

    /**
     * @notice Measure gas for transfers
     */
    function testGas_SingleTransfer() public {
        address sender = makeAddr("sender");
        address recipient = makeAddr("recipient");
        vm.deal(sender, 1 ether);
        
        // Mint first
        vm.prank(sender);
        nft.mint{value: 0.00001 ether}();
        
        // Measure transfer
        uint256 tokenId = nft.tokenOfOwnerByIndex(sender, 0);
        
        vm.prank(sender);
        uint256 gasBefore = gasleft();
        nft.transferFrom(sender, recipient, tokenId);
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("Single transfer gas", gasUsed);
    }

    /**
     * @notice Measure gas for bulk transfers
     */
    function testGas_BulkTransfer5() public {
        _measureBulkTransfer(5);
    }

    function testGas_BulkTransfer10() public {
        _measureBulkTransfer(10);
    }

    function testGas_BulkTransfer20() public {
        _measureBulkTransfer(20);
    }

    function _measureBulkTransfer(uint256 count) internal {
        address sender = makeAddr("bulkSender");
        address recipient = makeAddr("bulkRecipient");
        vm.deal(sender, 1 ether);
        
        // Mint tokens
        vm.startPrank(sender);
        for (uint256 i = 0; i < count; i++) {
            nft.mint{value: 0.00001 ether}();
        }
        vm.stopPrank();
        
        // Prepare token IDs
        uint256[] memory tokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = nft.tokenOfOwnerByIndex(sender, i);
        }
        
        // Measure bulk transfer
        vm.prank(sender);
        uint256 gasBefore = gasleft();
        nft.bulkTransferToRecipient(tokenIds, recipient);
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint(string(abi.encodePacked("Bulk transfer ", vm.toString(count), " gas")), gasUsed);
        emit log_named_uint("Gas per transfer", gasUsed / count);
    }

    /**
     * @notice Measure gas for metadata updates
     */
    function testGas_SetBaseURI() public {
        uint256 gasBefore = gasleft();
        nft.setBaseURI("ipfs://newbaseuri/");
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("SetBaseURI gas", gasUsed);
    }

    /**
     * @notice Measure gas for bulk metadata update
     */
    function testGas_BulkMetadataUpdate10() public {
        _measureBulkMetadataUpdate(10);
    }

    function testGas_BulkMetadataUpdate50() public {
        _measureBulkMetadataUpdate(50);
    }

    function _measureBulkMetadataUpdate(uint256 count) internal {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        // Mint tokens first
        vm.startPrank(minter);
        for (uint256 i = 0; i < count; i++) {
            nft.mint{value: 0.00001 ether}();
        }
        vm.stopPrank();
        
        // Prepare updates
        MiniNFT.BulkMetadataUpdate[] memory updates = new MiniNFT.BulkMetadataUpdate[](count);
        for (uint256 i = 0; i < count; i++) {
            updates[i] = MiniNFT.BulkMetadataUpdate({
                tokenId: nft.tokenOfOwnerByIndex(minter, i),
                newURI: string(abi.encodePacked("ipfs://custom/", vm.toString(i)))
            });
        }
        
        // Measure bulk update
        uint256 gasBefore = gasleft();
        nft.bulkUpdateMetadata(updates);
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint(string(abi.encodePacked("Bulk metadata update ", vm.toString(count), " gas")), gasUsed);
        emit log_named_uint("Gas per update", gasUsed / count);
    }

    /**
     * @notice Measure gas for withdraw
     */
    function testGas_Withdraw() public {
        address minter = makeAddr("minter");
        vm.deal(minter, 1 ether);
        
        // Mint to add funds
        vm.prank(minter);
        nft.mint{value: 0.00001 ether}();
        
        // Measure withdraw
        uint256 gasBefore = gasleft();
        nft.withdraw();
        uint256 gasUsed = gasBefore - gasleft();
        
        emit log_named_uint("Withdraw gas", gasUsed);
    }

    /**
     * @notice Compare single mints vs batch mint
     */
    function testGas_CompareMintMethods() public {
        address singleMinter = makeAddr("singleMinter");
        address batchMinter = makeAddr("batchMinter");
        vm.deal(singleMinter, 1 ether);
        vm.deal(batchMinter, 1 ether);
        
        uint256 quantity = 5;
        uint256 cost = 0.00001 ether * quantity;
        
        // Single mints
        uint256 totalSingleGas = 0;
        vm.startPrank(singleMinter);
        for (uint256 i = 0; i < quantity; i++) {
            uint256 gasBefore = gasleft();
            nft.mint{value: 0.00001 ether}();
            totalSingleGas += gasBefore - gasleft();
        }
        vm.stopPrank();
        
        // Batch mint
        vm.prank(batchMinter);
        uint256 gasBefore = gasleft();
        nft.mintBatch{value: cost}(quantity);
        uint256 batchGas = gasBefore - gasleft();
        
        emit log_named_uint("5 single mints total gas", totalSingleGas);
        emit log_named_uint("1 batch mint (5) gas", batchGas);
        emit log_named_uint("Gas saved by batching", totalSingleGas - batchGas);
        emit log_named_uint("Savings percentage", ((totalSingleGas - batchGas) * 100) / totalSingleGas);
        
        // Batch should be more efficient
        assertLt(batchGas, totalSingleGas, "Batch mint should use less gas");
    }
}
