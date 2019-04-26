import web3Instance from "./initMetamask";
const abi = require("./abi");
const contractAddress = "0x1E4A6c1450e936d69276938c67E789b7bdc905f5";

export default new web3Instance.eth.Contract(abi, contractAddress);
