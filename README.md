# Byzantine Operator SDK

A TypeScript/JavaScript SDK for operators to integrate with Byzantine Finance ecosystem.

## About Byzantine Finance

Byzantine Finance is the first native restaking aggregation and abstraction layer. The protocol allows users to deploy various types of vaults for generating staking and restaking revenues, and operators to provide validation services.

This SDK provides a simple interface for operators to register and participate in the Byzantine ecosystem on:

- _Ethereum Mainnet -> Soon_
- **Holesky Testnet**
- _Hoodi Testnet -> Soon_

## Installation

```bash
npm install @byzantine/operator-sdk
```

## Basic Setup

1. Create a `.env` file in your project root with the following variables:

```shell
RPC_URL=https://holesky.infura.io/v3/your_api_key_here

# Choose ONE of the following authentication methods:
MNEMONIC=your_wallet_mnemonic
# OR
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix

DEFAULT_CHAIN_ID=17000  # 17000 for Holesky testnet, 1 for Ethereum Mainnet, 560048 for Hoodi Testnet
```

2. Import and initialize the client:

```typescript
import { ByzOperatorClient } from "@byzantine/operator-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Initialize wallet from either mnemonic or private key
const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC).connect(provider);
// OR const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);

const client = new ByzOperatorClient({
  chainId: 17000, // 17000 for Holesky, 1 for Mainnet, 560048 for Hoodi
  provider: provider,
  signer: wallet,
});
```

## Quick Start Symbiotic

Here's a complete example showing how to register as an operator and opt into vaults and networks:

```js
// 1. Import the necessary dependencies
import { ByzOperatorClient, getNetworkConfig } from "@byzantine/operator-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

// 2. Load environment variables
dotenv.config();

async function main() {
  // 3. Initialize provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC).connect(
    provider
  );
  // OR const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);

  const userAddress = await wallet.getAddress();

  // 4. Initialize client
  const chainId = 17000; // Holesky testnet
  const client = new ByzOperatorClient({
    chainId,
    provider,
    signer: wallet,
  });

  // 5. Get network configuration
  const networkConfig = getNetworkConfig(chainId);

  // 6. Define addresses
  // Replace these with actual addresses for your use case
  const VAULT_ADDRESS = "0x123...";
  const NETWORK_ADDRESS_1 = "0x456...";
  const NETWORK_ADDRESS_2 = "0x789..."; // Another network you want to validate for

  console.log(`Operating as: ${userAddress}`);

  try {
    // STEP 1: Register as an operator if not already done
    const tx1 = await client.registerOperator();
    const receipt1 = await tx1.wait();

    // STEP 2: Opt into networks
    // Network 1
    const tx2 = await client.optInNetwork(NETWORK_ADDRESS_1);
    const receipt2 = await tx2.wait();

    // Network 2
    const tx3 = await client.optInNetwork(NETWORK_ADDRESS_2);
    const receipt3 = await tx3.wait();

    // STEP 3: Opt into vault
    const tx4 = await client.optInVault(VAULT_ADDRESS);
    const receipt4 = await tx4.wait();
  } catch (error) {
    console.error("Error during integration:", error);
  }
}

main();
```

## Quick Start Native

Here's a complete example showing how to register a native operator, update its fee, and unregister it:

```js
import { ByzOperatorClient } from "@byzantine/operator-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC).connect(provider);

const client = new ByzOperatorClient({
  chainId: 17000, // or 560048 for Hoodi
  provider,
  signer: wallet,
});

const operatorName = "your-native-operator-name";
const admin = await wallet.getAddress();
const operatorFee = 1000; // 10%
const managers = [admin];

await tx.wait();
const operatorIndex = await client.getNativeOperatorId(operatorName);

// Update fee
await client.updateNativeOperatorFee(operatorIndex, 500); // 5%
```

## Available Functions

### Symbiotic Protocol

```js
// Registration
await client.registerOperator();
await client.isOperator(operatorAddress);
await client.getTotalOperators();
await client.getOperatorAtIndex(index);

// Network Opt-In
await client.optInNetwork(networkAddress);
await client.optOutNetwork(networkAddress);
await client.isOptedInNetwork(operatorAddress, networkAddress);

// Vault Opt-In
await client.optInVault(vaultAddress);
await client.optOutVault(vaultAddress);
await client.isOptedInVault(operatorAddress, vaultAddress);
```

### Native Staking

```js
// Registration
await client.registerNativeOperator(name, admin, operatorFee, managers); // Only for ByzanTeam
await client.unregisterNativeOperator(operatorIndex); // Only for ByzanTeam
await client.isNativeOperatorRegistered(name);
await client.getNativeOperatorId(name);
await client.getNativeOperatorAdmin(operatorIndex);
await client.getNativeOperatorFee(operatorIndex);

// Management
await client.updateNativeOperatorFee(operatorIndex, newFee);
await client.setNativeOperatorManager(operatorIndex, [address], true);
await client.transferNativeAdminRole(operatorIndex, newAdmin);
```

### EigenLayer Protocol

_Coming soon_

## Testing

The SDK includes tests for operator integration:

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run all tests
npm run test

# Run Native test
npm run test:native

# Run Symbiotic test
npm run test:symbiotic
```

## Supported Networks

- _Ethereum Mainnet (Chain ID: 1) -> Soon_
- **Holesky Testnet (Chain ID: 17000)**
- _Hoodi Testnet (Chain ID: 560048) -> Soon_

By default, the SDK is configured to use Holesky testnet (Chain ID: 17000). To use Ethereum Mainnet, specify `chainId: 1` when initializing the client. Or `chainId: 560048` for Hoodi Testnet.

## NPM Package

This SDK is available on npm as [@byzantine/operator-sdk](https://www.npmjs.com/package/@byzantine/operator-sdk).

## Security

All Byzantine Finance contracts have been thoroughly audited.

## License

MIT
