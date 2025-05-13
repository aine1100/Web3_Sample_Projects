const Calculator = artifacts.require("Calculator");

module.exports = function (deployer) {
    // Use deployer to state migration tasks.
    deployer.deploy(Calculator);
    }