var CrowdsaleConfigurator = artifacts.require("./Configurator.sol");


//var SafeMathLib = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {

  CrowdsaleConfigurator
  deployer.deploy(CrowdsaleConfigurator);
  // deploy ico contracts
  /*deployer.deploy(SafeMathLib);

  deployer.link(SafeMathLib, FlatPricing);
  deployer.deploy(FlatPricing, 100);

  deployer.link(SafeMathLib, CrowdsaleToken);
  deployer.deploy(CrowdsaleToken, 'Crowdsale Token', 'CST', 18, 1000000000, true);*/
};
