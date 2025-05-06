// @ts-check

export type ChainsOptions = 1 | 17000;

export interface NetworkConfig {
  name: string;
  factoryContractAddress: string;
  scanLink: string;
  stETHAddress: string;
  wstETHAddress: string;
  osETHAddress: string;
  mETHAddress: string;
  ETHxAddress: string;

  vaultFactory: string;
  delegatorFactory: string;
  slasherFactory: string;
  networkRegistry: string;
  networkMetadataService: string;
  networkMiddlewareService: string;
  operatorRegistry: string;
  operatorMetadataService: string;
  operatorVaultOptInService: string;
  operatorNetworkOptInService: string;
  vaultConfigurator: string;
}

/**
 * Client initialization options
 */
export interface ByzantineClientOptions {
  chainId: ChainsOptions;
  provider?: any; // For ethers provider
  signer?: any; // For ethers signer
}
