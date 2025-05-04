const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  // Deploy the new SK token with initial supply of 1,000,000 tokens
  deployer.deploy(DappToken, 1000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000; // in wei
    return deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
  });
}; 