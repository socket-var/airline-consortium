import web3Instance from "./initMetamask";
const abi = require("./abi");
const contractAddress = "0x08bFf5F847494eE1A0EA978B56E5062C02337a91";

export default new web3Instance.eth.Contract(abi, contractAddress);
