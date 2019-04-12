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
      from: "0x629a11628711b02e350837Ca7F642140300fb1B3"
    });
  }
};
