/**
 * OperatorNetworkOptInService
 *
 * Client for interacting with the Symbiotic Network Opt-In service
 * This service allows operators to opt into specific networks they want to validate
 */

import { ethers, TransactionResponse } from "ethers";
import { getNetworkConfig } from "../../constants/networks";
import { NetworkOptInServiceABI } from "../../constants/symbiotic/NetworkOptInServiceABI";

export class OperatorNetworkOptInService {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.Provider,
    private readonly signer: ethers.Signer,
    private readonly chainId: 1 | 17000
  ) {
    const networkConfig = getNetworkConfig(this.chainId);
    const contractAddress = networkConfig.operatorNetworkOptInService;

    // Initialize contract with ABI and address
    this.contract = new ethers.Contract(
      contractAddress,
      NetworkOptInServiceABI,
      this.signer || this.provider
    );
  }

  /**
   * Opt-in to a specific network
   * Allows an operator to indicate intention to validate for a network
   *
   * @param networkAddress - The address of the network to opt into
   * @returns Transaction response
   */
  public async optIn(networkAddress: string): Promise<TransactionResponse> {
    return this.contract.optIn(networkAddress);
  }

  /**
   * Opt-out from a specific network
   * Allows an operator to stop validating for a network
   *
   * @param networkAddress - The address of the network to opt out from
   * @returns Transaction response
   */
  public async optOut(networkAddress: string): Promise<TransactionResponse> {
    return this.contract.optOut(networkAddress);
  }

  /**
   * Check if an operator is opted-in to a specific network
   *
   * @param operatorAddress - The address of the operator to check
   * @param networkAddress - The address of the network to check
   * @returns Boolean indicating if the operator is opted in
   */
  public async isOptedIn(
    operatorAddress: string,
    networkAddress: string
  ): Promise<boolean> {
    return this.contract.isOptedIn(operatorAddress, networkAddress);
  }
}
