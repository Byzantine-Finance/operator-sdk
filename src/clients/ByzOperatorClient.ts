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

// Import Native clients
import { NativeOperatorRegistry } from "./native";

export class ByzOperatorClient {
  public readonly chainId: ChainsOptions;
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  // Symbiotic clients
  private symOperatorRegistry: OperatorRegistry;
  private symNetworkOptInService: OperatorNetworkOptInService;
  private symVaultOptInService: OperatorVaultOptInService;

  // Native clients
  private nativeOperatorRegistry: NativeOperatorRegistry;

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

    // Initialize Native clients
    this.nativeOperatorRegistry = new NativeOperatorRegistry(
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
  // NATIVE STAKING PROTOCOL FUNCTIONS
  //=========================================================================

  /**
   * Register as an operator in the Native ecosystem
   *
   * @param name - Unique name for the operator
   * @param admin - Address that will administer the operator (default: signer's address)
   * @param operatorFee - Fee percentage as uint16 (default: 1000 = 10%)
   * @param managers - Array of manager addresses (default: empty array)
   * @returns Transaction response with operator index (bytes32)
   */
  public async registerNativeOperator(
    name: string,
    admin?: string,
    operatorFee: number = 1000,
    managers: string[] = []
  ): Promise<TransactionResponse> {
    // Use signer's address as admin if not specified
    if (!admin) {
      admin = await this.signer!.getAddress();
    }

    return this.nativeOperatorRegistry.registerOperator(
      name,
      admin,
      operatorFee,
      managers
    );
  }

  /**
   * Unregister an operator in the Native ecosystem
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Transaction response
   */
  public async unregisterNativeOperator(
    operatorIndex: string
  ): Promise<TransactionResponse> {
    return this.nativeOperatorRegistry.unregisterOperator(operatorIndex);
  }

  /**
   * Check if an operator name is already registered
   *
   * @param name - The name to check
   * @returns Boolean indicating if the operator is registered
   */
  public async isNativeOperatorRegistered(name: string): Promise<boolean> {
    return this.nativeOperatorRegistry.isOperatorRegistered(name);
  }

  /**
   * Get the operator ID from a name
   *
   * @param name - The operator name
   * @returns Bytes32 ID of the operator
   */
  public async getNativeOperatorId(name: string): Promise<string> {
    return this.nativeOperatorRegistry.getOperatorId(name);
  }

  /**
   * Get the admin address of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Admin address
   */
  public async getNativeOperatorAdmin(operatorIndex: string): Promise<string> {
    return this.nativeOperatorRegistry.getOperatorAdmin(operatorIndex);
  }

  /**
   * Get the fee percentage of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Fee percentage as uint16
   */
  public async getNativeOperatorFee(operatorIndex: string): Promise<number> {
    return this.nativeOperatorRegistry.getOperatorFee(operatorIndex);
  }

  /**
   * Check if an address is a manager of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @param address - The address to check
   * @returns Boolean indicating if the address is a manager
   */
  public async isNativeOperatorManager(
    operatorIndex: string,
    address: string
  ): Promise<boolean> {
    return this.nativeOperatorRegistry.isManagerOfOperator(
      operatorIndex,
      address
    );
  }

  /**
   * Set manager status for an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @param managers - Array of manager addresses
   * @param isManager - Boolean indicating if the addresses should be managers
   * @returns Transaction response
   */
  public async setNativeOperatorManager(
    operatorIndex: string,
    managers: string[],
    isManager: boolean
  ): Promise<TransactionResponse> {
    return this.nativeOperatorRegistry.setOperatorManager(
      operatorIndex,
      managers,
      isManager
    );
  }

  /**
   * Transfer the admin role for an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @param newAdmin - Address of the new admin
   * @returns Transaction response
   */
  public async transferNativeAdminRole(
    operatorIndex: string,
    newAdmin: string
  ): Promise<TransactionResponse> {
    return this.nativeOperatorRegistry.transferAdminRole(
      operatorIndex,
      newAdmin
    );
  }

  /**
   * Update an operator's fee
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @param operatorFee - New fee percentage (as uint16)
   * @returns Transaction response
   */
  public async updateNativeOperatorFee(
    operatorIndex: string,
    operatorFee: number
  ): Promise<TransactionResponse> {
    return this.nativeOperatorRegistry.updateOperatorFee(
      operatorIndex,
      operatorFee
    );
  }

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
