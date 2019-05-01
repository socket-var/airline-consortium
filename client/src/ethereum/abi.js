module.exports = [
  {
    inputs: [],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
    signature: "constructor"
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "requestHash",
        type: "bytes32"
      }
    ],
    name: "RequestSent",
    type: "event",
    signature:
      "0x1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db8"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "requestHash",
        type: "bytes32"
      },
      {
        indexed: false,
        name: "isDone",
        type: "bool"
      }
    ],
    name: "ResponseSent",
    type: "event",
    signature:
      "0x6441ec971ac73e0ce58e7b3955b30ba5d75bc6edd14b30bd47763c88268fa970"
  },
  {
    constant: true,
    inputs: [
      {
        name: "userAddress",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x70a08231"
  },
  {
    constant: false,
    inputs: [],
    name: "register",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    signature: "0x1aa3a008"
  },
  {
    constant: false,
    inputs: [
      {
        name: "userAddress",
        type: "address"
      }
    ],
    name: "unregister",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    signature: "0x2ec2c246"
  },
  {
    constant: false,
    inputs: [
      {
        name: "toAirline",
        type: "address"
      }
    ],
    name: "settlePayment",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    signature: "0x2109dc88"
  },
  {
    constant: false,
    inputs: [
      {
        name: "toAirline",
        type: "address"
      },
      {
        name: "requestHash",
        type: "bytes32"
      }
    ],
    name: "request",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x3e68a932"
  },
  {
    constant: false,
    inputs: [
      {
        name: "toAirline",
        type: "address"
      },
      {
        name: "requestHash",
        type: "bytes32"
      },
      {
        name: "isDone",
        type: "bool"
      }
    ],
    name: "response",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x6a3d7366"
  }
];
