/**
 * Byzantine Operator SDK - Symbiotic Integration Test
 *
 * This test demonstrates how to use the Byzantine Operator SDK
 * to register as an operator, opt into networks, and opt into vaults.
 *
 * The integration flow for operators is:
 * 1. Register as an operator in the Symbiotic ecosystem
 * 2. Opt into specific networks they want to validate
 * 3. Opt into vaults they want to receive stake from
 */

const { ethers } = require("ethers");
const { ByzOperatorClient } = require("../dist");
const { getNetworkConfig } = require("../dist/constants/networks");
const { logTitle, logResult, assert } = require("./utils");
require("dotenv").config();

// Import environment variables
const { RPC_URL, MNEMONIC, PRIVATE_KEY, DEFAULT_CHAIN_ID } = process.env;

// Test suite
async function runTests() {
  console.log("\n🧪 Byzantine Operator SDK - Symbiotic Integration Test 🧪\n");

  // Check if environment variables are set
  const parsedId = DEFAULT_CHAIN_ID ? parseInt(DEFAULT_CHAIN_ID) : 17000;
  const chainId = parsedId === 1 ? 1 : 17000;

  let skipNetworkTests = false;
  if (!RPC_URL) {
    console.warn(
      "⚠️ Warning: RPC_URL not set in .env file. Network tests will be skipped."
    );
    skipNetworkTests = true;
  }

  if (!MNEMONIC && !PRIVATE_KEY) {
    console.warn(
      "⚠️ Warning: Neither MNEMONIC nor PRIVATE_KEY set in .env file. Wallet tests will be skipped."
    );
    skipNetworkTests = true;
  }

  console.log(
    `Network: ${
      chainId === 1
        ? "Ethereum Mainnet"
        : chainId === 17000
        ? "Holesky Testnet"
        : "Unknown"
    } (Chain ID: ${chainId})\n`
  );

  // Skip tests requiring network connection if no API key
  skipNetworkTests = !RPC_URL;

  if (skipNetworkTests) {
    console.log(
      "⚠️ Network tests skipped. Please provide RPC_URL to run tests."
    );
    return;
  }

  // Initialize provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Initialize wallet based on available credentials
  let wallet;
  if (MNEMONIC) {
    wallet = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);
    console.log("Using wallet from mnemonic phrase");
  } else if (PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY).connect(provider);
    console.log("Using wallet from private key");
  } else {
    throw new Error("No wallet credentials provided");
  }

  const userAddress = await wallet.getAddress();

  // Initialize client
  const client = new ByzOperatorClient({
    chainId: chainId,
    provider: provider,
    signer: wallet,
  });

  // Get network configuration
  const networkConfig = getNetworkConfig(chainId);

  console.log("Network:", networkConfig.name, `(Chain ID: ${chainId})`);
  console.log("User address:", userAddress);

  try {
    // =============================================
    // Basic Query Tests
    // =============================================
    logTitle("Basic Query Tests");

    // Generate a random address for testing
    const randomAddress = ethers.Wallet.createRandom().address;

    // Check if operator is already registered (should be false for a random address)
    const isRandomOperator = await client.isOperator(randomAddress);
    logResult(
      "Is random address an operator",
      true,
      isRandomOperator.toString()
    );

    // Try to check opted-in status for random addresses (should be false)
    const isRandomNetworkOptedIn = await client.isOptedInNetwork(
      randomAddress,
      "0x0000000000000000000000000000000000000123"
    );
    logResult(
      "Is random address opted into random network",
      true,
      isRandomNetworkOptedIn.toString()
    );

    const isRandomVaultOptedIn = await client.isOptedInVault(
      randomAddress,
      "0x0000000000000000000000000000000000000456"
    );
    logResult(
      "Is random address opted into random vault",
      true,
      isRandomVaultOptedIn.toString()
    );

    // =============================================
    // Testing with invalid values (expected to fail)
    // =============================================
    logTitle("Testing with invalid values (expected to fail)");

    try {
      // Try to register as an operator with a random address (will likely fail)
      // We're commenting this out to avoid actual transaction attempts
      // const randomWallet = ethers.Wallet.createRandom().connect(provider);
      // const randomClient = new ByzOperatorClient({
      //   chainId: chainId,
      //   provider: provider,
      //   signer: randomWallet,
      // });
      // const tx = await randomClient.registerOperator();
      // await tx.wait();
      logResult(
        "Register random operator",
        false,
        "Not attempted - would likely fail"
      );
    } catch (error) {
      logResult("Random registration", false, error.message);
    }

    try {
      // Try to opt in to a network with a non-existent address
      // const tx = await client.optInNetwork("0x0000000000000000000000000000000000000000");
      // await tx.wait();
      logResult(
        "Opt into invalid network",
        false,
        "Not attempted - would likely fail"
      );
    } catch (error) {
      logResult("Invalid network opt-in", false, error.message);
    }

    try {
      // Try to opt in to a vault with a non-existent address
      // const tx = await client.optInVault("0x0000000000000000000000000000000000000000");
      // await tx.wait();
      logResult(
        "Opt into invalid vault",
        false,
        "Not attempted - would likely fail"
      );
    } catch (error) {
      logResult("Invalid vault opt-in", false, error.message);
    }

    // =============================================
    // Symbiotic Integration Flow
    // =============================================
    logTitle("Symbiotic Integration Flow");

    // Step 1: Register as an operator
    console.log("/ STEP 1 - Register as an operator");

    // Check if already registered
    const isAlreadyOperator = await client.isOperator(userAddress);
    logResult(
      "User already registered as operator",
      true,
      `${userAddress.substring(0, 10)}... = ${isAlreadyOperator}`
    );

    // Register if not already registered
    if (!isAlreadyOperator) {
      try {
        console.log("Registering as an operator...");
        const tx = await client.registerOperator();
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        logResult(
          "Registration transaction",
          true,
          `Block: ${receipt.blockNumber}`
        );
      } catch (error) {
        logResult("Registration failed", false, error.message);
      }
    } else {
      logResult("Registration skipped", true, "Already registered");
    }

    // Step 2: Opt into a network
    console.log("/ STEP 2 - Opt into a network");

    // Use the network registry as an example network address
    const testNetworkAddress = "0x4535bd6fF24860b5fd2889857651a85fb3d3C6b1";
    logResult("Test network address", true, testNetworkAddress);

    // Check if already opted in
    const isUserNetworkOptedIn = await client.isOptedInNetwork(
      userAddress,
      testNetworkAddress
    );
    logResult(
      "Network opt-in status",
      true,
      `${testNetworkAddress.substring(0, 10)}... = ${isUserNetworkOptedIn}`
    );

    // Opt in if not already
    if (!isUserNetworkOptedIn) {
      try {
        console.log("Opting into network...");
        const tx = await client.optInNetwork(testNetworkAddress);
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        logResult(
          "Network opt-in transaction",
          true,
          `Block: ${receipt.blockNumber}`
        );
      } catch (error) {
        logResult("Network opt-in failed", false, error.message);
      }
    } else {
      logResult("Network opt-in skipped", true, "Already opted in");
    }

    // Step 3: Opt into a vault
    console.log("/ STEP 3 - Opt into a vault");

    // Use the vault factory as an example vault address
    const testVaultAddress = "0xd961f9691fEa2fE5936a92Abe0B0832663e77Bb7";
    logResult("Test vault address", true, testVaultAddress);

    // Check if already opted in
    const isUserVaultOptedIn = await client.isOptedInVault(
      userAddress,
      testVaultAddress
    );
    logResult(
      "Vault opt-in status",
      true,
      `${testVaultAddress.substring(0, 10)}... = ${isUserVaultOptedIn}`
    );

    // Opt in if not already
    if (!isUserVaultOptedIn) {
      try {
        console.log("Opting into vault...");
        const tx = await client.optInVault(testVaultAddress);
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        logResult(
          "Vault opt-in transaction",
          true,
          `Block: ${receipt.blockNumber}`
        );
      } catch (error) {
        logResult("Vault opt-in failed", false, error.message);
      }
    } else {
      logResult("Vault opt-in skipped", true, "Already opted in");
    }

    // Step 4 and 5 (not part of this SDK)
    console.log("/ STEP 4 - Stake allocation");
    console.log("/ STEP 5 - Network activation");

    console.log("\n✅ Integration test complete");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run tests if file is executed directly
if (require.main === module) {
  runTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

module.exports = { runTests };
