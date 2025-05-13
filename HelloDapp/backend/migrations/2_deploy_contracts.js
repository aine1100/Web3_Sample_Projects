const exp = require("constants");
const HelloWorld = artifacts.require("HelloWorld");
module.exports = function(deployer) {
    deployer.deploy(HelloWorld, "Hello, Am initial message!!");
}