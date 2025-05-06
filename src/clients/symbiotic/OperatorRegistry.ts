/**
 * OperatorRegistry
 *
 * Client for interacting with the Operator Registry contract
 * This service allows operators to register in the Symbiotic ecosystem
 */

import { ethers, TransactionResponse } from "ethers";
import { getNetworkConfig } from "../../constants/networks";
import { OperatorRegistryABI } from "../../constants/symbiotic/OperatorRegistryABI";

export class OperatorRegistry {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.Provider,
    private readonly signer: ethers.Signer,
    private readonly chainId: 1 | 17000
  ) {
    const networkConfig = getNetworkConfig(this.chainId);
    const contractAddress = networkConfig.operatorRegistry;

    // Initialize contract with ABI and address
    this.contract = new ethers.Contract(
      contractAddress,
      OperatorRegistryABI,
      this.signer || this.provider
    );
  }

  /**
   * Register as an operator in the Symbiotic ecosystem
   * This is the first step in the operator integration process
   *
   * @returns Transaction response
   */
  public async registerOperator(): Promise<TransactionResponse> {
    return this.contract.registerOperator();
  }

  /**
   * Check if an address is registered as an operator
   *
   * @param operatorAddress - The address to check
   * @returns Boolean indicating if the address is registered as an operator
   */
  public async isOperator(operatorAddress: string): Promise<boolean> {
    return this.contract.isEntity(operatorAddress);
  }

  /**
   * Get the total number of registered operators
   *
   * @returns The total number of operators
   */
  public async getTotalOperators(): Promise<number> {
    const totalBigInt = await this.contract.totalEntities();
    return Number(totalBigInt);
  }

  /**
   * Get the operator address at a specific index
   *
   * @param index - The index of the operator to retrieve
   * @returns The operator address
   */
  public async getOperatorAtIndex(index: number): Promise<string> {
    return this.contract.entity(index);
  }
}
