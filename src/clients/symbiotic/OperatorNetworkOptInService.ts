/**
 * OperatorNetworkOptInService
 *
 * Client for interacting with the Symbiotic Network Opt-In service
 * This service allows operators to opt into specific networks they want to validate
 */

import { ethers, TransactionResponse } from "ethers";
import { getNetworkConfig } from "../../constants/networks";
import { NetworkOptInServiceABI } from "../../constants/symbiotic/NetworkOptInServiceABI";
import { ChainsOptions } from "../../types";
import { executeContractMethod, callContractMethod } from "../../utils";

export class OperatorNetworkOptInService {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.Provider,
    private readonly signer: ethers.Signer,
    private readonly chainId: ChainsOptions
  ) {
    const networkConfig = getNetworkConfig(this.chainId);
    const contractAddress = networkConfig.operatorNetworkOptInService;

    if (!contractAddress || contractAddress === ethers.ZeroAddress) {
      throw new Error(
        `Network Opt-In Service not configured for chain ${this.chainId}`
      );
    }

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
    if (!ethers.isAddress(networkAddress)) {
      throw new Error(`Invalid network address: ${networkAddress}`);
    }
    return executeContractMethod(this.contract, "optIn", networkAddress);
  }

  /**
   * Opt-out from a specific network
   * Allows an operator to stop validating for a network
   *
   * @param networkAddress - The address of the network to opt out from
   * @returns Transaction response
   */
  public async optOut(networkAddress: string): Promise<TransactionResponse> {
    if (!ethers.isAddress(networkAddress)) {
      throw new Error(`Invalid network address: ${networkAddress}`);
    }
    return executeContractMethod(this.contract, "optOut", networkAddress);
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
    if (
      !ethers.isAddress(operatorAddress) ||
      !ethers.isAddress(networkAddress)
    ) {
      throw new Error("Invalid address provided");
    }
    return callContractMethod<boolean>(
      this.contract,
      "isOptedIn",
      operatorAddress,
      networkAddress
    );
  }
}
