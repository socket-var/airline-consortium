const ASK = artifacts.require("ASK");

module.exports = function(deployer, network) {
  if (network === "rinkeby") {
    /* if deployed on rinkeby */
    deployer.deploy(ASK, {
      from: process.env.ADMIN_ADDRESS
    });
  } else {
    /* if deployed on ganache */
    deployer.deploy(ASK, {
      from: "0xBE4fc737ff90382Cd1AFeD77b29B8D0B22d02052"
    });
  }
};
