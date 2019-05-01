import web3Instance from "./initMetamask";
const abi = require("./abi");
const contractAddress = "0x39227D15Eb236beF7945265b294Fe164794e84f6";

export default new web3Instance.eth.Contract(abi, contractAddress);
