// @ts-check

/**
 * ByzOperatorClient
 *
 * @description Client for interacting with Byzantine Operator services.
 * This client provides a unified interface for operators to register,
 * opt-in to networks, and opt-in to vaults.
 *
 * The typical integration flow for operators is:
 * 1. Register as an operator in the Symbiotic ecosystem
 * 2. Opt into specific networks they want to validate
 * 3. Opt into vaults they want to receive stake from
 * 4. Stake allocation (handled by vault administrators)
 * 5. Network activation (handled by network validators)
 */

import { ethers, TransactionResponse } from "ethers";
import { ByzantineClientOptions, ChainsOptions } from "../types";
import { getNetworkConfig, isChainSupported } from "../constants/networks";

// Import Symbiotic clients
import {
  OperatorRegistry,
  OperatorNetworkOptInService,
  OperatorVaultOptInService,
} from "./symbiotic";

export class ByzOperatorClient {
  public readonly chainId: ChainsOptions;
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  // Symbiotic clients
  private symOperatorRegistry: OperatorRegistry;
  private symNetworkOptInService: OperatorNetworkOptInService;
  private symVaultOptInService: OperatorVaultOptInService;

  constructor(options: ByzantineClientOptions) {
    this.chainId = options.chainId;

    if (!isChainSupported(this.chainId)) {
      throw new Error(`Chain ID ${this.chainId} is not supported`);
    }

    this.provider = options.provider;
    this.signer = options.signer;

    if (!this.signer) {
      throw new Error("Signer is required for operator client");
    }

    // Initialize Symbiotic clients
    this.symOperatorRegistry = new OperatorRegistry(
      this.provider,
      this.signer,
      this.chainId
    );

    this.symNetworkOptInService = new OperatorNetworkOptInService(
      this.provider,
      this.signer,
      this.chainId
    );

    this.symVaultOptInService = new OperatorVaultOptInService(
      this.provider,
      this.signer,
      this.chainId
    );
  }

  //=========================================================================
  // SYMBIOTIC PROTOCOL FUNCTIONS
  //=========================================================================

  /**
   * Register as an operator in the Symbiotic ecosystem
   * This is the first step in the operator integration process
   *
   * @returns Transaction response
   */
  public async registerOperator(): Promise<TransactionResponse> {
    return this.symOperatorRegistry.registerOperator();
  }

  /**
   * Check if an address is registered as an operator
   *
   * @param operatorAddress - The address to check
   * @returns Boolean indicating if the address is registered as an operator
   */
  public async isOperator(operatorAddress: string): Promise<boolean> {
    return this.symOperatorRegistry.isOperator(operatorAddress);
  }

  /**
   * Get the total number of registered operators
   *
   * @returns The total number of operators
   */
  public async getTotalOperators(): Promise<number> {
    return this.symOperatorRegistry.getTotalOperators();
  }

  /**
   * Get the operator address at a specific index
   *
   * @param index - The index of the operator to retrieve
   * @returns The operator address
   */
  public async getOperatorAtIndex(index: number): Promise<string> {
    return this.symOperatorRegistry.getOperatorAtIndex(index);
  }

  /**
   * Opt-in to a specific network
   * Allows an operator to indicate intention to validate for a network
   * This should be done after registering as an operator
   *
   * @param networkAddress - The address of the network to opt into
   * @returns Transaction response
   */
  public async optInNetwork(
    networkAddress: string
  ): Promise<TransactionResponse> {
    return this.symNetworkOptInService.optIn(networkAddress);
  }

  /**
   * Opt-out from a specific network
   * Allows an operator to stop validating for a network
   *
   * @param networkAddress - The address of the network to opt out from
   * @returns Transaction response
   */
  public async optOutNetwork(
    networkAddress: string
  ): Promise<TransactionResponse> {
    return this.symNetworkOptInService.optOut(networkAddress);
  }

  /**
   * Check if an operator is opted-in to a specific network
   *
   * @param operatorAddress - The address of the operator to check
   * @param networkAddress - The address of the network to check
   * @returns Boolean indicating if the operator is opted in
   */
  public async isOptedInNetwork(
    operatorAddress: string,
    networkAddress: string
  ): Promise<boolean> {
    return this.symNetworkOptInService.isOptedIn(
      operatorAddress,
      networkAddress
    );
  }

  /**
   * Opt-in to a specific vault
   * Allows an operator to receive stake from a vault
   * This should be done after registering as an operator
   *
   * @param vaultAddress - The address of the vault to opt into
   * @returns Transaction response
   */
  public async optInVault(vaultAddress: string): Promise<TransactionResponse> {
    return this.symVaultOptInService.optIn(vaultAddress);
  }

  /**
   * Opt-out from a specific vault
   * Allows an operator to stop receiving stake from a vault
   *
   * @param vaultAddress - The address of the vault to opt out from
   * @returns Transaction response
   */
  public async optOutVault(vaultAddress: string): Promise<TransactionResponse> {
    return this.symVaultOptInService.optOut(vaultAddress);
  }

  /**
   * Check if an operator is opted-in to a specific vault
   *
   * @param operatorAddress - The address of the operator to check
   * @param vaultAddress - The address of the vault to check
   * @returns Boolean indicating if the operator is opted in
   */
  public async isOptedInVault(
    operatorAddress: string,
    vaultAddress: string
  ): Promise<boolean> {
    return this.symVaultOptInService.isOptedIn(operatorAddress, vaultAddress);
  }

  //=========================================================================
  // EIGENLAYER PROTOCOL FUNCTIONS (Coming soon)
  //=========================================================================

  //=========================================================================
  // NATIVE STAKING PROTOCOL FUNCTIONS (Coming soon)
  //=========================================================================

  //=========================================================================
  // UTILITY FUNCTIONS
  //=========================================================================

  /**
   * Get the network configuration for the current chain
   *
   * @returns Network configuration
   */
  public getNetworkConfig() {
    return getNetworkConfig(this.chainId);
  }
}
