/**
 * Byzantine Operator SDK - Native Integration Test
 *
 * This test demonstrates how to use the SDK to register a native operator,
 * check its status, and manage its parameters.
 */

const { ethers } = require("ethers");
const { ByzOperatorClient } = require("../dist");
const { logTitle, logResult } = require("./utils");
require("dotenv").config();

const { RPC_URL, MNEMONIC, PRIVATE_KEY, DEFAULT_CHAIN_ID } = process.env;

async function runTests() {
  console.log("\n🧪 Byzantine Operator SDK - Native Integration Test 🧪\n");

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

  logTitle("Native Operator Registration");

  // Example parameters
  const operatorName = "Benoit-" + Math.floor(Math.random() * 10000);
  const admin = userAddress;
  const operatorFee = 800; // 8%
  const managers = [userAddress];

  // 1. Register
  let operatorIndex;
  try {
    const tx = await client.registerNativeOperator(
      operatorName,
      admin,
      operatorFee,
      managers
    );
    logResult("Register native operator", true, tx.hash);
    const receipt = await tx.wait();
    logResult("Registration confirmed", true, `Block: ${receipt.blockNumber}`);
    // Retrieve the operator index
    operatorIndex = await client.getNativeOperatorId(operatorName);
    logResult("Operator index", true, operatorIndex);
  } catch (e) {
    logResult("Register native operator", false, e.message);
    return;
  }

  // 2. Check registration
  const isRegistered = await client.isNativeOperatorRegistered(operatorName);
  logResult("Is operator registered", true, isRegistered.toString());

  // 3. Read admin
  const adminAddr = await client.getNativeOperatorAdmin(operatorIndex);
  logResult("Operator admin", true, adminAddr);

  // 4. Read fee
  const fee = await client.getNativeOperatorFee(operatorIndex);
  logResult("Operator fee", true, fee.toString());

  // 5. Update fee
  try {
    const tx = await client.updateNativeOperatorFee(operatorIndex, 1500);
    logResult("Update operator fee", true, tx.hash);
    await tx.wait();
    const newFee = await client.getNativeOperatorFee(operatorIndex);
    logResult("New operator fee", true, newFee.toString());
  } catch (e) {
    logResult("Update operator fee", false, e.message);
  }

  // 6. Unregister
  try {
    const tx = await client.unregisterNativeOperator(operatorIndex);
    logResult("Unregister operator", true, tx.hash);
    await tx.wait();
    logResult("Operator unregistered", true, "Done");
  } catch (e) {
    logResult("Unregister operator", false, e.message);
  }
}

if (require.main === module) {
  runTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

module.exports = { runTests };
