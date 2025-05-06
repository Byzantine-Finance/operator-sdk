/**
 * Network configurations for Byzantine Deposit contract
 */

import { NetworkConfig, ChainsOptions } from "../types";

export const ETH_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const NETWORKS: Record<number, NetworkConfig> = {
  // Ethereum Mainnet
  1: {
    name: "Ethereum",
    factoryContractAddress: "0xe0f5fc7913C4aDC0975bD21d20DF7FC27360a267",
    scanLink: "https://etherscan.io",
    stETHAddress: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    wstETHAddress: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
    osETHAddress: "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38",
    mETHAddress: "0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa",
    ETHxAddress: "0xa35b1b31ce002fbf2058d22f30f95d405200a15b",

    vaultFactory: "0xAEb6bdd95c502390db8f52c8909F703E9Af6a346",
    delegatorFactory: "0x985Ed57AF9D475f1d83c1c1c8826A0E5A34E8C7B",
    slasherFactory: "0x685c2eD7D59814d2a597409058Ee7a92F21e48Fd",
    networkRegistry: "0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA",
    networkMetadataService: "0x0000000000000000000000000000000000000000",
    networkMiddlewareService: "0xD7dC9B366c027743D90761F71858BCa83C6899Ad",
    operatorRegistry: "0xAd817a6Bc954F678451A71363f04150FDD81Af9F",
    operatorMetadataService: "0x0000000000000000000000000000000000000000",
    operatorVaultOptInService: "0xb361894bC06cbBA7Ea8098BF0e32EB1906A5F891",
    operatorNetworkOptInService: "0x7133415b33B438843D581013f98A08704316633c",
    vaultConfigurator: "0x29300b1d3150B4E2b12fE80BE72f365E200441EC",
  },
  // Holesky Testnet
  17000: {
    name: "Holesky",
    factoryContractAddress: "0xe0f5fc7913C4aDC0975bD21d20DF7FC27360a267",
    scanLink: "https://holesky.etherscan.io",
    stETHAddress: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034",
    wstETHAddress: "0x8d09a4502Cc8Cf1547aD300E066060D043f6982D",
    osETHAddress: "0xF603c5A3F774F05d4D848A9bB139809790890864",
    mETHAddress: "0xe3C063B1BEe9de02eb28352b55D49D85514C67FF",
    ETHxAddress: "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859",

    vaultFactory: "0x407A039D94948484D356eFB765b3c74382A050B4",
    delegatorFactory: "0x890CA3f95E0f40a79885B7400926544B2214B03f",
    slasherFactory: "0xbf34bf75bb779c383267736c53a4ae86ac7bB299",
    networkRegistry: "0x7d03b7343BF8d5cEC7C0C27ecE084a20113D15C9",
    networkMetadataService: "0x0F7E58Cc4eA615E8B8BEB080dF8B8FDB63C21496",
    networkMiddlewareService: "0x62a1ddfD86b4c1636759d9286D3A0EC722D086e3",
    operatorRegistry: "0x6F75a4ffF97326A00e52662d82EA4FdE86a2C548",
    operatorMetadataService: "0x0999048aB8eeAfa053bF8581D4Aa451ab45755c9",
    operatorVaultOptInService: "0x95CC0a052ae33941877c9619835A233D21D57351",
    operatorNetworkOptInService: "0x58973d16FFA900D11fC22e5e2B6840d9f7e13401",
    vaultConfigurator: "0xD2191FE92987171691d552C219b8caEf186eb9cA",
  },
};

/**
 * Gets network configuration for the specified chain ID
 * @param chainId - The chain ID to get configuration for
 * @returns Network configuration or undefined if not supported
 */
export function getNetworkConfig(chainId: 1 | 17000): NetworkConfig {
  return NETWORKS[chainId];
}

/**
 * Gets supported chain IDs
 * @returns Array of supported chain IDs
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(NETWORKS).map((id) => parseInt(id));
}

/**
 * Check if a chain ID is supported
 * @param chainId The chain ID to check
 * @returns True if the chain ID is supported, false otherwise
 */
export function isChainSupported(chainId: ChainsOptions): boolean {
  return !!NETWORKS[chainId];
}
