// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MiniNFT.sol";

/**
 * @title DeployMiniNFT
 * @notice Deployment script for MiniNFT contract
 * @dev Run with: forge script script/Deploy.s.sol:DeployMiniNFT --rpc-url $RPC_URL --broadcast --verify
 */
contract DeployMiniNFT is Script {
    // Default deployment parameters
    string public constant NAME = "MiniNFT";
    string public constant SYMBOL = "MNFT";

    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get base URI from environment (required)
        string memory baseURI = vm.envString("BASE_URI");
        
        // Log deployment info
        console.log("Deploying MiniNFT...");
        console.log("Name:", NAME);
        console.log("Symbol:", SYMBOL);
        console.log("Base URI:", baseURI);

        // Start broadcast (actual deployment)
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        MiniNFT nft = new MiniNFT(NAME, SYMBOL, baseURI);

        vm.stopBroadcast();

        // Log deployment result
        console.log("----------------------------------------");
        console.log("MiniNFT deployed to:", address(nft));
        console.log("Owner:", nft.owner());
        console.log("Max Supply:", nft.MAX_SUPPLY());
        console.log("Mint Price:", nft.MINT_PRICE());
        console.log("----------------------------------------");
    }
}

/**
 * @title DeployMiniNFTTestnet
 * @notice Testnet deployment with custom parameters
 */
contract DeployMiniNFTTestnet is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory baseURI = vm.envOr("BASE_URI", string("ipfs://testnet-placeholder/"));
        
        console.log("Deploying MiniNFT to testnet...");

        vm.startBroadcast(deployerPrivateKey);

        MiniNFT nft = new MiniNFT("MiniNFT Test", "MNFT-TEST", baseURI);

        vm.stopBroadcast();

        console.log("Testnet deployment complete!");
        console.log("Contract:", address(nft));
    }
}
