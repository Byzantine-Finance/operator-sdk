/**
 * Native OperatorRegistry
 *
 * Client for interacting with the Native Operator Registry contract
 * This service allows operators to register in the Byzantine native ecosystem
 */

import { ethers, TransactionResponse } from "ethers";
import { getNetworkConfig } from "../../constants/networks";
import { NativeOperatorRegistryABI } from "../../constants/native/operatorRegistryABI";
import { ChainsOptions } from "../../types";
import { executeContractMethod, callContractMethod } from "../../utils";

export class NativeOperatorRegistry {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.Provider,
    private readonly signer: ethers.Signer,
    private readonly chainId: ChainsOptions
  ) {
    const networkConfig = getNetworkConfig(this.chainId);
    // For now, we're using a placeholder address - this should be updated
    // once the native registry is deployed to the respective networks
    const contractAddress = networkConfig.byzOperatorRegistry;

    if (!contractAddress || contractAddress === ethers.ZeroAddress) {
      throw new Error(
        `Native Operator Registry not configured for chain ${this.chainId}`
      );
    }

    // Initialize contract with ABI and address
    this.contract = new ethers.Contract(
      contractAddress,
      NativeOperatorRegistryABI,
      this.signer || this.provider
    );
  }

  /**
   * Validate operator parameters to avoid common errors
   *
   * @param name - Name for the operator
   * @param operatorFee - Fee percentage
   */
  private validateOperatorParams(name: string, operatorFee: number): void {
    if (!name || name.trim() === "") {
      throw new Error("Operator name cannot be empty");
    }

    // Fee range validation, usually contracts limit this to a range
    // Assuming max fee is 1000 (10%)
    if (operatorFee < 0 || operatorFee > 1000) {
      throw new Error("Operator fee must be between 0 and 1000 (0% and 10%)");
    }
  }

  /**
   * Register as an operator in the Native ecosystem
   *
   * @param name - Unique name for the operator
   * @param admin - Address that will administer the operator
   * @param operatorFee - Fee percentage (as uint16)
   * @param managers - Array of manager addresses
   * @returns Transaction response with index (bytes32) of the registered operator
   */
  public async registerOperator(
    name: string,
    admin: string,
    operatorFee: number,
    managers: string[]
  ): Promise<TransactionResponse> {
    // Validate parameters
    this.validateOperatorParams(name, operatorFee);

    return executeContractMethod(
      this.contract,
      "registerOperator",
      name,
      admin,
      operatorFee,
      managers
    );
  }

  /**
   * Unregister an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Transaction response
   */
  public async unregisterOperator(
    operatorIndex: string
  ): Promise<TransactionResponse> {
    return executeContractMethod(
      this.contract,
      "unregisterOperator",
      operatorIndex
    );
  }

  /**
   * Check if an operator name is already registered
   *
   * @param name - The name to check
   * @returns Boolean indicating if the operator is registered
   */
  public async isOperatorRegistered(name: string): Promise<boolean> {
    return callContractMethod<boolean>(
      this.contract,
      "isOperatorRegistered",
      name
    );
  }

  /**
   * Get the operator ID from a name
   *
   * @param name - The operator name
   * @returns Bytes32 ID
   */
  public async getOperatorId(name: string): Promise<string> {
    return callContractMethod<string>(this.contract, "getOperatorId", name);
  }

  /**
   * Get the admin address of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Admin address
   */
  public async getOperatorAdmin(operatorIndex: string): Promise<string> {
    return callContractMethod<string>(
      this.contract,
      "getOperatorAdmin",
      operatorIndex
    );
  }

  /**
   * Get the fee percentage of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @returns Fee percentage as uint16
   */
  public async getOperatorFee(operatorIndex: string): Promise<number> {
    return callContractMethod<number>(
      this.contract,
      "getOperatorFee",
      operatorIndex
    );
  }

  /**
   * Check if an address is a manager of an operator
   *
   * @param operatorIndex - The bytes32 index of the operator
   * @param address - The address to check
   * @returns Boolean indicating if the address is a manager
   */
  public async isManagerOfOperator(
    operatorIndex: string,
    address: string
  ): Promise<boolean> {
    return callContractMethod<boolean>(
      this.contract,
      "isManagerOfOperator",
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
  public async setOperatorManager(
    operatorIndex: string,
    managers: string[],
    isManager: boolean
  ): Promise<TransactionResponse> {
    return executeContractMethod(
      this.contract,
      "setOperatorManager",
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
  public async transferAdminRole(
    operatorIndex: string,
    newAdmin: string
  ): Promise<TransactionResponse> {
    if (!ethers.isAddress(newAdmin)) {
      throw new Error(`Invalid new admin address: ${newAdmin}`);
    }

    return executeContractMethod(
      this.contract,
      "transferAdminRole",
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
  public async updateOperatorFee(
    operatorIndex: string,
    operatorFee: number
  ): Promise<TransactionResponse> {
    // Validate fee
    this.validateOperatorParams("valid-name", operatorFee);

    return executeContractMethod(
      this.contract,
      "updateOperatorFee",
      operatorIndex,
      operatorFee
    );
  }
}
