/**
 * OperatorVaultOptInService
 *
 * Client for interacting with the Symbiotic Vault Opt-In service
 * This service allows operators to opt into specific vaults they want to receive stake from
 */

import { ethers, TransactionResponse } from "ethers";
import { getNetworkConfig } from "../../constants/networks";
import { VaultOptInServiceABI } from "../../constants/symbiotic/VaultOptInServiceABI";

export class OperatorVaultOptInService {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.Provider,
    private readonly signer: ethers.Signer,
    private readonly chainId: 1 | 17000
  ) {
    const networkConfig = getNetworkConfig(this.chainId);
    const contractAddress = networkConfig.operatorVaultOptInService;

    // Initialize contract with ABI and address
    this.contract = new ethers.Contract(
      contractAddress,
      VaultOptInServiceABI,
      this.signer || this.provider
    );
  }

  /**
   * Opt-in to a specific vault
   * Allows an operator to receive stake from a vault
   *
   * @param vaultAddress - The address of the vault to opt into
   * @returns Transaction response
   */
  public async optIn(vaultAddress: string): Promise<TransactionResponse> {
    return this.contract.optIn(vaultAddress);
  }

  /**
   * Opt-out from a specific vault
   * Allows an operator to stop receiving stake from a vault
   *
   * @param vaultAddress - The address of the vault to opt out from
   * @returns Transaction response
   */
  public async optOut(vaultAddress: string): Promise<TransactionResponse> {
    return this.contract.optOut(vaultAddress);
  }

  /**
   * Check if an operator is opted-in to a specific vault
   *
   * @param operatorAddress - The address of the operator to check
   * @param vaultAddress - The address of the vault to check
   * @returns Boolean indicating if the operator is opted in
   */
  public async isOptedIn(
    operatorAddress: string,
    vaultAddress: string
  ): Promise<boolean> {
    return this.contract.isOptedIn(operatorAddress, vaultAddress);
  }
}
