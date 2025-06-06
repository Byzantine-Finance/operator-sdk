export const SymbioticOperatorRegistryABI = [
  { inputs: [], name: "EntityNotExist", type: "error" },
  { inputs: [], name: "OperatorAlreadyRegistered", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "entity",
        type: "address",
      },
    ],
    name: "AddEntity",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "entity",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "entity_", type: "address" }],
    name: "isEntity",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registerOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalEntities",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
