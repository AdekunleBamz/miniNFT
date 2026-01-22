// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MiniNFT.sol";

/**
 * @title MintNFT
 * @notice Script to mint a single NFT
 * @dev Run: forge script script/Interactions.s.sol:MintNFT --rpc-url $RPC_URL --broadcast
 */
contract MintNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        MiniNFT nft = MiniNFT(contractAddress);
        
        console.log("Minting from:", vm.addr(deployerPrivateKey));
        console.log("Contract:", contractAddress);
        console.log("Remaining supply:", nft.remainingSupply());

        vm.startBroadcast(deployerPrivateKey);

        nft.mint{value: nft.MINT_PRICE()}();

        vm.stopBroadcast();

        console.log("Mint successful!");
        console.log("New balance:", nft.balanceOf(vm.addr(deployerPrivateKey)));
    }
}

/**
 * @title MintBatch
 * @notice Script to mint multiple NFTs in one transaction
 */
contract MintBatch is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        uint256 quantity = vm.envOr("MINT_QUANTITY", uint256(5));
        
        MiniNFT nft = MiniNFT(contractAddress);
        uint256 totalCost = nft.MINT_PRICE() * quantity;
        
        console.log("Batch minting", quantity, "NFTs");
        console.log("Total cost:", totalCost);
        console.log("Remaining supply:", nft.remainingSupply());

        vm.startBroadcast(deployerPrivateKey);

        nft.mintBatch{value: totalCost}(quantity);

        vm.stopBroadcast();

        console.log("Batch mint successful!");
        console.log("New balance:", nft.balanceOf(vm.addr(deployerPrivateKey)));
    }
}

/**
 * @title SetBaseURI
 * @notice Script to update the base URI (owner only)
 */
contract SetBaseURI is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        string memory newBaseURI = vm.envString("NEW_BASE_URI");
        
        MiniNFT nft = MiniNFT(contractAddress);
        
        console.log("Updating base URI to:", newBaseURI);
        console.log("Current base URI:", nft.baseTokenURI());

        vm.startBroadcast(deployerPrivateKey);

        nft.setBaseURI(newBaseURI);

        vm.stopBroadcast();

        console.log("Base URI updated successfully!");
        console.log("New base URI:", nft.baseTokenURI());
    }
}

/**
 * @title WithdrawFunds
 * @notice Script to withdraw contract funds (owner only)
 */
contract WithdrawFunds is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        MiniNFT nft = MiniNFT(contractAddress);
        uint256 balance = contractAddress.balance;
        
        console.log("Contract balance:", balance);

        if (balance == 0) {
            console.log("No funds to withdraw");
            return;
        }

        vm.startBroadcast(deployerPrivateKey);

        nft.withdraw();

        vm.stopBroadcast();

        console.log("Withdrawal successful!");
        console.log("Amount withdrawn:", balance);
    }
}

/**
 * @title CheckContractStatus
 * @notice Read-only script to check contract status
 */
contract CheckContractStatus is Script {
    function run() external view {
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        MiniNFT nft = MiniNFT(contractAddress);
        
        console.log("========================================");
        console.log("MiniNFT Contract Status");
        console.log("========================================");
        console.log("Address:", contractAddress);
        console.log("Owner:", nft.owner());
        console.log("Name:", nft.name());
        console.log("Symbol:", nft.symbol());
        console.log("Base URI:", nft.baseTokenURI());
        console.log("----------------------------------------");
        console.log("Max Supply:", nft.MAX_SUPPLY());
        console.log("Total Minted:", nft.totalSupply());
        console.log("Remaining:", nft.remainingSupply());
        console.log("Mint Price:", nft.MINT_PRICE());
        console.log("Contract Balance:", contractAddress.balance);
        console.log("========================================");
    }
}
