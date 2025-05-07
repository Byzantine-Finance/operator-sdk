/**
 * Byzantine Operator SDK - Wallet/Operator Read Test
 *
 * This test reads and prints all relevant information for the current wallet/operator
 * for both Native and Symbiotic protocols. Only read operations, lots of print.
 */

const { ethers } = require("ethers");
const { ByzOperatorClient } = require("../dist");
const { logTitle, logResult } = require("./utils");
require("dotenv").config();

const { RPC_URL, MNEMONIC, PRIVATE_KEY, DEFAULT_CHAIN_ID } = process.env;

async function run() {
  logTitle("Wallet/Operator Read Test");

  const parsedId = DEFAULT_CHAIN_ID ? parseInt(DEFAULT_CHAIN_ID) : 17000;
  const chainId = parsedId === 1 ? 1 : 17000;

  if (!RPC_URL) {
    console.warn("⚠️ RPC_URL not set. Skipping test.");
    return;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  let wallet;
  if (MNEMONIC) {
    wallet = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);
  } else if (PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY).connect(provider);
  } else {
    throw new Error("No wallet credentials provided");
  }

  const userAddress = await wallet.getAddress();
  const client = new ByzOperatorClient({
    chainId,
    provider,
    signer: wallet,
  });

  logResult("Wallet address", true, userAddress);

  // ETH balance
  const ethBalance = await provider.getBalance(userAddress);
  logResult("ETH balance", true, ethers.formatEther(ethBalance));

  // --- Native Operator Info ---
  logTitle("[NATIVE] Operator info");
  const possibleNames = [
    "Benoit",
    "my-native-operator",
    userAddress.slice(2, 10),
  ];
  let foundNative = false;
  for (const name of possibleNames) {
    try {
      const isRegistered = await client.isNativeOperatorRegistered(name);
      if (isRegistered) {
        foundNative = true;
        logResult("Found native operator name", true, name);
        const operatorIndex = await client.getNativeOperatorId(name);
        logResult("Operator index", true, operatorIndex);
        const admin = await client.getNativeOperatorAdmin(operatorIndex);
        logResult("Admin", true, admin);
        const fee = await client.getNativeOperatorFee(operatorIndex);
        logResult("Fee", true, fee.toString());
      }
    } catch (e) {
      // Ignore errors for non-existing names
    }
  }
  if (!foundNative) {
    logResult(
      "Native operator",
      false,
      "No native operator found for this wallet (by common names)"
    );
  }

  // --- Symbiotic Operator Info ---
  logTitle("[SYMBIOTIC] Operator info");
  const isSymOp = await client.isOperator(userAddress);
  logResult("Is symbiotic operator", true, isSymOp.toString());
  if (isSymOp) {
    const total = await client.getTotalOperators();
    logResult("Total symbiotic operators", true, total.toString());
    // for (let i = 0; i < total; i++) {
    //   const opAddr = await client.getOperatorAtIndex(i);
    //   if (opAddr.toLowerCase() === userAddress.toLowerCase()) {
    //     logResult("Operator index", true, i.toString());
    //   }
    // }
  }

  // Print some network/vault opt-in status (example addresses)
  const exampleNetwork = "0x0000000000000000000000000000000000000000";
  const exampleVault = "0x0000000000000000000000000000000000000000";
  if (exampleNetwork) {
    const isOptedNet = await client.isOptedInNetwork(
      userAddress,
      exampleNetwork
    );
    logResult("Opted into example network", true, isOptedNet.toString());
  }
  if (exampleVault) {
    const isOptedVault = await client.isOptedInVault(userAddress, exampleVault);
    logResult("Opted into example vault", true, isOptedVault.toString());
  }

  logTitle("Wallet/operator read test complete");
}

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

module.exports = { run };
