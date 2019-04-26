import Web3 from "web3";
let web3Instance;
if (window.ethereum) {
  web3Instance = new Web3(window.ethereum);
}
// Legacy dapp browsers...
else if (window.web3) {
  web3Instance = new Web3(window.web3.currentProvider);
}
// Non-dapp browsers...
else {
  // TODO: better error handling
  console.log(
    "Non-Ethereum browser detected. You should consider trying MetaMask!"
  );
}

export default web3Instance;
