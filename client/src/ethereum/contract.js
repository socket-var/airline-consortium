import web3Instance from "./initMetamask";
const abi = require("./abi");
const contractAddress = "0xd326282EC8bfcAD9b960cB6c71dd7F90e1707050";

export default new web3Instance.eth.Contract(abi, contractAddress);
